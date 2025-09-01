/**
 * Email Notification Service (Mock)
 * Simulates email notifications for the UK ETA application
 */

import { toast } from 'sonner';

export interface EmailTemplate {
  subject: string;
  body: string;
  type: 'confirmation' | 'approval' | 'rejection' | 'reminder' | 'update';
}

export interface EmailNotification {
  id: string;
  to: string;
  from: string;
  subject: string;
  body: string;
  type: EmailTemplate['type'];
  sentAt: Date;
  status: 'pending' | 'sent' | 'failed';
  attachments?: string[];
}

export class EmailNotificationService {
  private static emailQueue: EmailNotification[] = [];
  private static sentEmails: EmailNotification[] = [];

  /**
   * Send application confirmation email
   */
  static async sendApplicationConfirmation(
    email: string,
    applicantName: string,
    referenceNumber: string
  ): Promise<boolean> {
    const template: EmailTemplate = {
      type: 'confirmation',
      subject: `UK ETA Application Received - Reference: ${referenceNumber}`,
      body: `
Dear ${applicantName},

Thank you for submitting your UK Electronic Travel Authorization (ETA) application.

Your application has been successfully received and is now being processed.

Application Reference: ${referenceNumber}
Submitted: ${new Date().toLocaleDateString('en-GB')}
Processing Time: 48-72 hours

What happens next:
1. Your application will be reviewed by UK immigration officials
2. Background checks will be conducted
3. You will receive an email with the decision
4. If approved, your ETA will be electronically linked to your passport

You can track your application status at any time using your reference number at:
https://uketa.gov.uk/track

Important Reminders:
- Do not book non-refundable travel until your ETA is approved
- Ensure your passport remains valid for at least 6 months
- Keep your reference number safe for tracking

If you have any questions, please contact our support team:
Email: support@uketa.gov.uk
Phone: +44 20 1234 5678

Best regards,
UK ETA Processing Team
Home Office, United Kingdom
      `.trim()
    };

    return this.sendEmail(email, template);
  }

  /**
   * Send ETA approval email
   */
  static async sendETAApproval(
    email: string,
    applicantName: string,
    referenceNumber: string,
    etaNumber: string
  ): Promise<boolean> {
    const template: EmailTemplate = {
      type: 'approval',
      subject: `✅ UK ETA Approved - ${etaNumber}`,
      body: `
Dear ${applicantName},

Congratulations! Your UK Electronic Travel Authorization has been APPROVED.

ETA Number: ${etaNumber}
Reference: ${referenceNumber}
Valid From: ${new Date().toLocaleDateString('en-GB')}
Valid Until: ${new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB')}

Your ETA Details:
- Multiple entries allowed
- Maximum stay: 6 months per visit
- Electronically linked to your passport
- No physical document required

Important Information:
1. Your ETA is electronically linked to the passport you used in your application
2. Print this email and carry it with you when traveling (optional but recommended)
3. Airlines will verify your ETA electronically at check-in
4. UK Border Force will have access to your ETA upon arrival

Travel Checklist:
☐ Valid passport (same as application)
☐ Return/onward travel ticket
☐ Proof of accommodation
☐ Sufficient funds for your stay
☐ This approval email (printed)

Please note:
- ETA approval does not guarantee entry to the UK
- Border officials make the final decision at the port of entry
- You must comply with UK immigration laws during your stay

Safe travels!

UK ETA Processing Team
Home Office, United Kingdom
      `.trim()
    };

    return this.sendEmail(email, template, [`UK_ETA_${etaNumber}.pdf`]);
  }

  /**
   * Send ETA rejection email
   */
  static async sendETARejection(
    email: string,
    applicantName: string,
    referenceNumber: string,
    reason?: string
  ): Promise<boolean> {
    const template: EmailTemplate = {
      type: 'rejection',
      subject: `UK ETA Application Update - ${referenceNumber}`,
      body: `
Dear ${applicantName},

We regret to inform you that your UK Electronic Travel Authorization application has not been approved.

Reference Number: ${referenceNumber}
Decision Date: ${new Date().toLocaleDateString('en-GB')}

${reason ? `Reason for Decision:\n${reason}\n` : ''}

What you can do next:
1. Review the reason for rejection
2. If eligible, submit a new application with corrected information
3. Consider applying for a different type of UK visa
4. Contact our support team for guidance

Alternative Options:
- Standard Visitor Visa
- Business Visitor Visa
- Transit Visa

For more information:
Website: https://www.gov.uk/browse/visas-immigration
Email: support@uketa.gov.uk
Phone: +44 20 1234 5678

We understand this may be disappointing and encourage you to explore alternative visa options if you still wish to travel to the UK.

Sincerely,
UK ETA Processing Team
Home Office, United Kingdom
      `.trim()
    };

    return this.sendEmail(email, template);
  }

  /**
   * Send document reminder email
   */
  static async sendDocumentReminder(
    email: string,
    applicantName: string,
    referenceNumber: string,
    missingDocuments: string[]
  ): Promise<boolean> {
    const template: EmailTemplate = {
      type: 'reminder',
      subject: `Action Required: Missing Documents - ${referenceNumber}`,
      body: `
Dear ${applicantName},

Your UK ETA application requires additional documentation to proceed.

Reference Number: ${referenceNumber}
Status: Awaiting Documents

Missing Documents:
${missingDocuments.map(doc => `• ${doc}`).join('\n')}

How to Submit:
1. Log in to your application at https://uketa.gov.uk/track
2. Navigate to the Documents section
3. Upload the required documents
4. Submit for processing

Deadline: Please submit within 7 days to avoid application cancellation.

Document Requirements:
- Clear, color scans or photos
- PDF or JPEG format
- File size under 5MB each
- All text must be legible

Need Help?
Email: support@uketa.gov.uk
Phone: +44 20 1234 5678

Best regards,
UK ETA Processing Team
      `.trim()
    };

    return this.sendEmail(email, template);
  }

  /**
   * Send status update email
   */
  static async sendStatusUpdate(
    email: string,
    applicantName: string,
    referenceNumber: string,
    newStatus: string,
    message: string
  ): Promise<boolean> {
    const template: EmailTemplate = {
      type: 'update',
      subject: `Application Status Update - ${referenceNumber}`,
      body: `
Dear ${applicantName},

There has been an update to your UK ETA application.

Reference Number: ${referenceNumber}
New Status: ${newStatus}
Updated: ${new Date().toLocaleDateString('en-GB')} at ${new Date().toLocaleTimeString('en-GB')}

Update Details:
${message}

Track your application:
https://uketa.gov.uk/track

If you have questions about this update:
Email: support@uketa.gov.uk
Phone: +44 20 1234 5678

Thank you for your patience.

UK ETA Processing Team
      `.trim()
    };

    return this.sendEmail(email, template);
  }

  /**
   * Core email sending function (mock)
   */
  private static async sendEmail(
    to: string,
    template: EmailTemplate,
    attachments?: string[]
  ): Promise<boolean> {
    const email: EmailNotification = {
      id: `EMAIL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      to,
      from: 'noreply@uketa.gov.uk',
      subject: template.subject,
      body: template.body,
      type: template.type,
      sentAt: new Date(),
      status: 'pending',
      attachments
    };

    // Add to queue
    this.emailQueue.push(email);

    // Simulate sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock success rate (95% success)
    const success = Math.random() > 0.05;

    if (success) {
      email.status = 'sent';
      this.sentEmails.push(email);
      
      // Store in session for demo purposes
      const emails = JSON.parse(sessionStorage.getItem('sentEmails') || '[]');
      emails.push({
        to: email.to,
        subject: email.subject,
        sentAt: email.sentAt,
        type: email.type
      });
      sessionStorage.setItem('sentEmails', JSON.stringify(emails));
      
      // Show success toast
      toast.success('Email sent successfully', {
        description: `Notification sent to ${to}`
      });
      
      return true;
    } else {
      email.status = 'failed';
      
      toast.error('Email failed to send', {
        description: 'Will retry automatically'
      });
      
      // Retry logic would go here
      return false;
    }
  }

  /**
   * Get email queue
   */
  static getEmailQueue(): EmailNotification[] {
    return this.emailQueue;
  }

  /**
   * Get sent emails
   */
  static getSentEmails(): EmailNotification[] {
    return this.sentEmails;
  }

  /**
   * Get emails from session storage
   */
  static getStoredEmails(): any[] {
    return JSON.parse(sessionStorage.getItem('sentEmails') || '[]');
  }

  /**
   * Clear email history
   */
  static clearEmailHistory(): void {
    this.emailQueue = [];
    this.sentEmails = [];
    sessionStorage.removeItem('sentEmails');
  }

  /**
   * Retry failed emails
   */
  static async retryFailedEmails(): Promise<number> {
    const failedEmails = this.emailQueue.filter(e => e.status === 'failed');
    let retryCount = 0;

    for (const email of failedEmails) {
      const success = await this.sendEmail(email.to, {
        subject: email.subject,
        body: email.body,
        type: email.type
      }, email.attachments);
      
      if (success) {
        retryCount++;
      }
    }

    return retryCount;
  }

  /**
   * Preview email template
   */
  static previewEmail(type: EmailTemplate['type']): string {
    switch (type) {
      case 'confirmation':
        return this.sendApplicationConfirmation('preview@example.com', 'John Doe', 'REF123456').toString();
      case 'approval':
        return this.sendETAApproval('preview@example.com', 'John Doe', 'REF123456', 'ETA789012').toString();
      case 'rejection':
        return this.sendETARejection('preview@example.com', 'John Doe', 'REF123456', 'Additional documentation required').toString();
      case 'reminder':
        return this.sendDocumentReminder('preview@example.com', 'John Doe', 'REF123456', ['Passport photo page', 'Bank statement']).toString();
      case 'update':
        return this.sendStatusUpdate('preview@example.com', 'John Doe', 'REF123456', 'Under Review', 'Your application is being reviewed by an immigration officer').toString();
      default:
        return '';
    }
  }
}