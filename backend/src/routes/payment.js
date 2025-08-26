import express from 'express';
import Stripe from 'stripe';
import pg from 'pg';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const router = express.Router();

/**
 * Create payment session
 */
router.post('/create-session', async (req, res) => {
  try {
    const { applicationId, applicantCount = 1 } = req.body;
    
    if (!applicationId) {
      return res.status(400).json({
        error: 'Application ID is required'
      });
    }
    
    // Verify application exists
    const appResult = await pool.query(
      'SELECT id, tracking_code FROM applications WHERE id = $1',
      [applicationId]
    );
    
    if (appResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Application not found'
      });
    }
    
    const application = appResult.rows[0];
    const visaFee = parseFloat(process.env.VISA_FEE_GBP) || 42.00;
    const totalAmount = Math.round(visaFee * applicantCount * 100); // Convert to pence
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'UK ETA Visa Application Fee',
              description: `Processing fee for ${applicantCount} applicant(s) - ${application.tracking_code}`,
            },
            unit_amount: Math.round(visaFee * 100),
          },
          quantity: applicantCount,
        },
      ],
      metadata: {
        applicationId: applicationId,
        trackingCode: application.tracking_code,
        applicantCount: applicantCount.toString()
      },
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancelled`,
    });
    
    // Update application with payment intent
    await pool.query(`
      UPDATE applications 
      SET payment_status = 'processing', payment_intent_id = $1 
      WHERE id = $2
    `, [session.id, applicationId]);
    
    res.json({
      sessionId: session.id,
      url: session.url,
      amount: totalAmount
    });
    
  } catch (error) {
    console.error('Payment session creation error:', error);
    res.status(500).json({
      error: 'Failed to create payment session'
    });
  }
});

/**
 * Stripe webhook handler
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      try {
        const client = await pool.connect();
        
        try {
          await client.query('BEGIN');
          
          // Update application payment status
          await client.query(`
            UPDATE applications 
            SET 
              payment_status = 'completed',
              amount_paid = $1,
              updated_at = CURRENT_TIMESTAMP
            WHERE payment_intent_id = $2
          `, [
            session.amount_total / 100, // Convert from pence to pounds
            session.id
          ]);
          
          // Log payment completion
          await client.query(`
            INSERT INTO audit_log (id, action, entity_type, entity_id, performed_by, details)
            VALUES ($1, $2, $3, $4, $5, $6)
          `, [
            uuidv4(),
            'payment_completed',
            'application',
            session.metadata.applicationId,
            'stripe_webhook',
            JSON.stringify({
              sessionId: session.id,
              amount: session.amount_total / 100,
              trackingCode: session.metadata.trackingCode
            })
          ]);
          
          await client.query('COMMIT');
          
          console.log(`Payment completed for application: ${session.metadata.trackingCode}`);
          
        } catch (error) {
          await client.query('ROLLBACK');
          throw error;
        } finally {
          client.release();
        }
        
      } catch (error) {
        console.error('Error processing payment webhook:', error);
      }
      
      break;
      
    case 'checkout.session.expired':
    case 'payment_intent.payment_failed':
      // Handle failed payments
      const failedSession = event.data.object;
      
      try {
        await pool.query(`
          UPDATE applications 
          SET payment_status = 'failed', updated_at = CURRENT_TIMESTAMP
          WHERE payment_intent_id = $1
        `, [failedSession.id]);
        
        console.log(`Payment failed for session: ${failedSession.id}`);
        
      } catch (error) {
        console.error('Error handling failed payment:', error);
      }
      
      break;
      
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
  
  res.json({ received: true });
});

/**
 * Get payment status
 */
router.get('/status/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Get session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    // Get application from database
    const result = await pool.query(
      'SELECT tracking_code, payment_status, amount_paid FROM applications WHERE payment_intent_id = $1',
      [sessionId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Payment session not found'
      });
    }
    
    const application = result.rows[0];
    
    res.json({
      sessionId,
      status: session.payment_status,
      trackingCode: application.tracking_code,
      paymentStatus: application.payment_status,
      amountPaid: application.amount_paid,
      customerEmail: session.customer_details?.email
    });
    
  } catch (error) {
    console.error('Error fetching payment status:', error);
    res.status(500).json({
      error: 'Failed to fetch payment status'
    });
  }
});

export { router as paymentRouter };