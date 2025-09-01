import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface ApplicationSubmission {
  applicationId: string
  applicants: any[]
  paymentIntentId?: string
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role
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
    const { applicationId, applicants, paymentIntentId }: ApplicationSubmission = await req.json()

    // Validate application exists and is in draft status
    const { data: application, error: appError } = await supabaseClient
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .single()

    if (appError || !application) {
      throw new Error('Application not found')
    }

    if (application.status !== 'draft') {
      throw new Error('Application has already been submitted')
    }

    // Validate all applicants have required documents
    for (const applicant of applicants) {
      const { data: documents, error: docError } = await supabaseClient
        .from('documents')
        .select('document_type, verification_status')
        .eq('applicant_id', applicant.id)

      if (docError) {
        throw new Error(`Error checking documents for applicant ${applicant.id}`)
      }

      const hasPassport = documents?.some(d => d.document_type === 'passport')
      const hasPhoto = documents?.some(d => 
        d.document_type === 'photo' && 
        d.verification_status === 'verified'
      )

      if (!hasPassport || !hasPhoto) {
        throw new Error(`Applicant ${applicant.first_name} ${applicant.last_name} is missing required documents`)
      }
    }

    // Generate unique reference number if not exists
    let referenceNumber = application.reference_number
    if (!referenceNumber) {
      referenceNumber = generateReferenceNumber()
      
      // Check uniqueness
      const { data: existing } = await supabaseClient
        .from('applications')
        .select('id')
        .eq('reference_number', referenceNumber)
        .single()
      
      if (existing) {
        // Regenerate if exists
        referenceNumber = generateReferenceNumber()
      }
    }

    // Calculate total fee
    const feePerApplicant = 10.00 // £10 per applicant
    const processingFee = 2.50 // £2.50 processing fee
    const totalAmount = (applicants.length * feePerApplicant) + processingFee

    // Update application status
    const { error: updateError } = await supabaseClient
      .from('applications')
      .update({
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        reference_number: referenceNumber,
        payment_amount: Math.round(totalAmount * 100), // Store in pence
        payment_intent_id: paymentIntentId,
        payment_status: paymentIntentId ? 'paid' : 'pending',
        metadata: {
          ...application.metadata,
          submitted_from: req.headers.get('user-agent'),
          submitted_ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
        }
      })
      .eq('id', applicationId)

    if (updateError) {
      throw updateError
    }

    // Update all applicants to submitted status
    for (const applicant of applicants) {
      await supabaseClient
        .from('applicants')
        .update({ 
          status: 'submitted',
          updated_at: new Date().toISOString()
        })
        .eq('id', applicant.id)
    }

    // Create audit log entry
    await supabaseClient
      .from('audit_logs')
      .insert({
        application_id: applicationId,
        action: 'APPLICATION_SUBMITTED',
        details: {
          reference_number: referenceNumber,
          applicant_count: applicants.length,
          total_amount: totalAmount,
          payment_status: paymentIntentId ? 'paid' : 'pending'
        },
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        user_agent: req.headers.get('user-agent')
      })

    // Send confirmation email (would integrate with email service)
    // await sendConfirmationEmail(application.user_email, referenceNumber)

    return new Response(
      JSON.stringify({
        success: true,
        referenceNumber,
        totalAmount,
        message: 'Application submitted successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})

function generateReferenceNumber(): string {
  const prefix = 'UK'
  const year = new Date().getFullYear().toString().slice(-2)
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${prefix}${year}${random}`
}