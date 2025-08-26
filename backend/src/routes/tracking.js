import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const router = express.Router();

/**
 * Track application by tracking code
 */
router.get('/:trackingCode', async (req, res) => {
  try {
    const { trackingCode } = req.params;
    
    // Validate tracking code format
    if (!/^ETA-\d{4}-\d{4}$/.test(trackingCode)) {
      return res.status(400).json({
        error: 'Invalid tracking code format'
      });
    }
    
    // Query application
    const result = await pool.query(`
      SELECT 
        tracking_code,
        status,
        status_message,
        payment_status,
        submitted_at,
        updated_at
      FROM applications 
      WHERE tracking_code = $1
    `, [trackingCode]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Application not found'
      });
    }
    
    const application = result.rows[0];
    
    // Get status history
    const historyResult = await pool.query(`
      SELECT 
        new_status,
        change_reason,
        changed_at
      FROM status_history 
      WHERE application_id = (
        SELECT id FROM applications WHERE tracking_code = $1
      )
      ORDER BY changed_at DESC
    `, [trackingCode]);
    
    res.json({
      trackingCode: application.tracking_code,
      currentStatus: application.status,
      statusMessage: application.status_message,
      paymentStatus: application.payment_status,
      submittedAt: application.submitted_at,
      lastUpdated: application.updated_at,
      statusHistory: historyResult.rows
    });
    
  } catch (error) {
    console.error('Tracking error:', error);
    res.status(500).json({
      error: 'Failed to track application'
    });
  }
});

/**
 * Verify tracking code with email
 */
router.post('/:trackingCode/verify', async (req, res) => {
  try {
    const { trackingCode } = req.params;
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        error: 'Email is required for verification'
      });
    }
    
    // This would normally decrypt and compare emails
    // For now, we'll just check if the application exists
    const result = await pool.query(
      'SELECT id FROM applications WHERE tracking_code = $1',
      [trackingCode]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Application not found'
      });
    }
    
    res.json({
      verified: true,
      message: 'Verification successful'
    });
    
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      error: 'Verification failed'
    });
  }
});

export { router as trackingRouter };