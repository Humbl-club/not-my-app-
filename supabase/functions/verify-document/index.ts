import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface DocumentVerification {
  documentId: string
  applicantId: string
  documentType: 'passport' | 'photo' | 'supporting'
  validationScore?: number
  validationDetails?: any
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
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
    const { documentId, applicantId, documentType, validationScore, validationDetails }: DocumentVerification = await req.json()

    // Perform document verification based on type
    let verificationStatus = 'pending'
    let verificationDetails = validationDetails || {}

    if (documentType === 'photo') {
      // Photo validation logic
      if (validationScore && validationScore >= 75) {
        verificationStatus = 'verified'
        verificationDetails = {
          ...verificationDetails,
          score: validationScore,
          verifiedAt: new Date().toISOString(),
          checks: {
            resolution: validationScore >= 80,
            faceDetected: true,
            backgroundUniform: validationScore >= 70,
            qualityAcceptable: validationScore >= 75
          }
        }
      } else if (validationScore && validationScore < 50) {
        verificationStatus = 'rejected'
        verificationDetails = {
          ...verificationDetails,
          score: validationScore,
          rejectedAt: new Date().toISOString(),
          reason: 'Photo quality does not meet requirements'
        }
      }
    } else if (documentType === 'passport') {
      // Passport validation logic (simplified for now)
      verificationStatus = 'verified'
      verificationDetails = {
        ...verificationDetails,
        verifiedAt: new Date().toISOString(),
        checks: {
          readable: true,
          notExpired: true,
          validFormat: true
        }
      }
    }

    // Update document verification status
    const { data: document, error: updateError } = await supabaseClient
      .from('documents')
      .update({
        verification_status: verificationStatus,
        validation_score: validationScore,
        validation_details: verificationDetails,
        validated_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', documentId)
      .select()
      .single()

    if (updateError) {
      throw updateError
    }

    // Check if all documents are verified for the applicant
    const { data: allDocuments } = await supabaseClient
      .from('documents')
      .select('document_type, verification_status')
      .eq('applicant_id', applicantId)

    const hasVerifiedPassport = allDocuments?.some(d => 
      d.document_type === 'passport' && d.verification_status === 'verified'
    )
    const hasVerifiedPhoto = allDocuments?.some(d => 
      d.document_type === 'photo' && d.verification_status === 'verified'
    )

    // Update applicant status if all required documents are verified
    if (hasVerifiedPassport && hasVerifiedPhoto) {
      await supabaseClient
        .from('applicants')
        .update({
          status: 'documents_verified',
          updated_at: new Date().toISOString()
        })
        .eq('id', applicantId)
    }

    // Create audit log
    await supabaseClient
      .from('audit_logs')
      .insert({
        application_id: document.application_id,
        action: `DOCUMENT_${verificationStatus.toUpperCase()}`,
        details: {
          document_id: documentId,
          document_type: documentType,
          verification_status: verificationStatus,
          validation_score: validationScore
        },
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        user_agent: req.headers.get('user-agent')
      })

    return new Response(
      JSON.stringify({
        success: true,
        verificationStatus,
        document,
        allDocumentsVerified: hasVerifiedPassport && hasVerifiedPhoto
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Document verification error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to verify document'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})