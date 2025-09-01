import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@13.10.0?target=deno'
import { corsHeaders } from '../_shared/cors.ts'

interface PaymentRequest {
  applicationId: string
  applicantCount: number
  email: string
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get request body
    const { applicationId, applicantCount, email }: PaymentRequest = await req.json()

    // Calculate fees
    const feePerApplicant = 1000 // £10 in pence
    const processingFee = 250 // £2.50 in pence
    const totalAmount = (applicantCount * feePerApplicant) + processingFee

    // Get application details
    const { data: application, error: appError } = await supabaseClient
      .from('applications')
      .select('reference_number')
      .eq('id', applicationId)
      .single()

    if (appError || !application) {
      throw new Error('Application not found')
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'gbp',
      payment_method_types: ['card'],
      metadata: {
        application_id: applicationId,
        reference_number: application.reference_number,
        applicant_count: applicantCount.toString(),
      },
      receipt_email: email,
      description: `UK ETA Application - ${application.reference_number}`,
    })

    // Store payment intent in database
    const { error: paymentError } = await supabaseClient
      .from('payment_transactions')
      .insert({
        application_id: applicationId,
        stripe_payment_intent_id: paymentIntent.id,
        amount: totalAmount / 100, // Store as decimal pounds
        currency: 'GBP',
        status: 'pending',
        metadata: {
          applicant_count: applicantCount,
          email: email,
        }
      })

    if (paymentError) {
      console.error('Error storing payment transaction:', paymentError)
    }

    // Update application with payment intent
    await supabaseClient
      .from('applications')
      .update({
        payment_intent_id: paymentIntent.id,
        payment_amount: totalAmount,
        updated_at: new Date().toISOString()
      })
      .eq('id', applicationId)

    // Create audit log
    await supabaseClient
      .from('audit_logs')
      .insert({
        application_id: applicationId,
        action: 'PAYMENT_INTENT_CREATED',
        details: {
          payment_intent_id: paymentIntent.id,
          amount: totalAmount,
          currency: 'GBP'
        },
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        user_agent: req.headers.get('user-agent')
      })

    return new Response(
      JSON.stringify({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: totalAmount,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Payment intent creation error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to create payment intent'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})