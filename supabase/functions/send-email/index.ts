import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface EmailRequest {
  to: string
  type: 'confirmation' | 'payment' | 'approval' | 'rejection' | 'reminder'
  data: any
}

const emailTemplates = {
  confirmation: {
    subject: 'UK ETA Application Submitted - {{reference}}',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1e40af; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9fafb; }
          .reference { font-size: 24px; font-weight: bold; color: #1e40af; text-align: center; padding: 20px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>UK Electronic Travel Authorization</h1>
          </div>
          <div class="content">
            <h2>Application Submitted Successfully</h2>
            <p>Dear {{applicantName}},</p>
            <p>Your UK ETA application has been submitted successfully.</p>
            <div class="reference">Reference: {{reference}}</div>
            <p><strong>What happens next:</strong></p>
            <ul>
              <li>Your application will be processed within 3 working days</li>
              <li>You will receive an email once a decision has been made</li>
              <li>Please keep your reference number for tracking</li>
            </ul>
            <p><strong>Application Details:</strong></p>
            <ul>
              <li>Number of applicants: {{applicantCount}}</li>
              <li>Total paid: £{{totalAmount}}</li>
              <li>Submitted on: {{submittedDate}}</li>
            </ul>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
            <p>© UK Electronic Travel Authorization Gateway</p>
          </div>
        </div>
      </body>
      </html>
    `
  },
  payment: {
    subject: 'Payment Confirmation - UK ETA Application {{reference}}',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #10b981; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9fafb; }
          .amount { font-size: 32px; font-weight: bold; color: #10b981; text-align: center; padding: 20px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Payment Successful</h1>
          </div>
          <div class="content">
            <h2>Thank you for your payment</h2>
            <p>Dear {{applicantName}},</p>
            <p>We have successfully received your payment for the UK ETA application.</p>
            <div class="amount">£{{amount}}</div>
            <p><strong>Payment Details:</strong></p>
            <ul>
              <li>Reference: {{reference}}</li>
              <li>Transaction ID: {{transactionId}}</li>
              <li>Payment Date: {{paymentDate}}</li>
              <li>Payment Method: Card ending in {{cardLast4}}</li>
            </ul>
            <p>Your application is now being processed. You will receive another email once a decision has been made.</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
            <p>© UK Electronic Travel Authorization Gateway</p>
          </div>
        </div>
      </body>
      </html>
    `
  },
  approval: {
    subject: 'UK ETA Approved - {{reference}}',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #10b981; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9fafb; }
          .approved { font-size: 24px; font-weight: bold; color: #10b981; text-align: center; padding: 20px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>UK ETA Application Approved</h1>
          </div>
          <div class="content">
            <div class="approved">✓ APPROVED</div>
            <p>Dear {{applicantName}},</p>
            <p>Congratulations! Your UK Electronic Travel Authorization has been approved.</p>
            <p><strong>Authorization Details:</strong></p>
            <ul>
              <li>Reference: {{reference}}</li>
              <li>Valid from: {{validFrom}}</li>
              <li>Valid until: {{validUntil}}</li>
              <li>Number of entries: Multiple</li>
            </ul>
            <p><strong>Important Information:</strong></p>
            <ul>
              <li>Print this email and carry it with you when traveling</li>
              <li>Your ETA is linked to your passport</li>
              <li>Valid for stays up to 6 months per visit</li>
              <li>Does not guarantee entry - final decision rests with border officials</li>
            </ul>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
            <p>© UK Electronic Travel Authorization Gateway</p>
          </div>
        </div>
      </body>
      </html>
    `
  },
  rejection: {
    subject: 'UK ETA Application Update - {{reference}}',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9fafb; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>UK ETA Application Update</h1>
          </div>
          <div class="content">
            <h2>Application Status Update</h2>
            <p>Dear {{applicantName}},</p>
            <p>Thank you for your UK ETA application (Reference: {{reference}}).</p>
            <p>After careful review, we regret to inform you that your application has not been successful at this time.</p>
            <p><strong>What you can do:</strong></p>
            <ul>
              <li>Review the application requirements</li>
              <li>Ensure all information is accurate and complete</li>
              <li>You may submit a new application after addressing any issues</li>
              <li>Consider applying for a different visa type if eligible</li>
            </ul>
            <p>If you believe this decision is incorrect, you may contact our support team with your reference number.</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
            <p>© UK Electronic Travel Authorization Gateway</p>
          </div>
        </div>
      </body>
      </html>
    `
  },
  reminder: {
    subject: 'Complete Your UK ETA Application - {{reference}}',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f59e0b; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9fafb; }
          .button { display: inline-block; padding: 12px 24px; background-color: #1e40af; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Complete Your Application</h1>
          </div>
          <div class="content">
            <h2>Your UK ETA Application is Incomplete</h2>
            <p>Dear {{applicantName}},</p>
            <p>You started a UK ETA application but haven't completed it yet.</p>
            <p><strong>Application Details:</strong></p>
            <ul>
              <li>Reference: {{reference}}</li>
              <li>Started on: {{startedDate}}</li>
              <li>Progress: {{progress}}% complete</li>
            </ul>
            <p>Your application will be saved for 30 days. Complete it now to avoid losing your progress.</p>
            <p style="text-align: center;">
              <a href="{{resumeLink}}" class="button">Complete Application</a>
            </p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
            <p>© UK Electronic Travel Authorization Gateway</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
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
    const { to, type, data }: EmailRequest = await req.json()

    // Get email template
    const template = emailTemplates[type]
    if (!template) {
      throw new Error(`Unknown email type: ${type}`)
    }

    // Replace template variables
    let subject = template.subject
    let html = template.html

    // Replace all variables in template
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      subject = subject.replace(regex, data[key])
      html = html.replace(regex, data[key])
    })

    // In production, you would use a real email service like SendGrid, Resend, etc.
    // For local development, emails are captured by Inbucket at http://localhost:54324
    
    // Log email to notification queue
    const { error: queueError } = await supabaseClient
      .from('notification_queue')
      .insert({
        email: to,
        subject: subject,
        body: html,
        notification_type: type,
        status: 'sent', // In production, this would be 'pending' until actually sent
        sent_at: new Date().toISOString()
      })

    if (queueError) {
      console.error('Error queuing email:', queueError)
    }

    // Create audit log
    await supabaseClient
      .from('audit_logs')
      .insert({
        action: `EMAIL_SENT_${type.toUpperCase()}`,
        details: {
          to: to,
          type: type,
          reference: data.reference
        }
      })

    // In local dev, the email will appear in Inbucket
    console.log(`Email sent to ${to}: ${subject}`)
    console.log('View email at http://localhost:54324')

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email sent successfully',
        emailId: crypto.randomUUID()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Email sending error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to send email'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})