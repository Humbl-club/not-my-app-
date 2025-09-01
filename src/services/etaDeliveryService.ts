/**
 * ETA Delivery Service
 * Handles automatic delivery of approved ETAs to client dashboards
 */

import { supabase } from '@/lib/supabase';
import { applicationService, emailService } from './supabaseService';

export interface ETADocument {
  id: string;
  applicationId: string;
  referenceNumber: string;
  etaNumber: string;
  status: 'pending' | 'generated' | 'delivered' | 'downloaded';
  validFrom: string;
  validUntil: string;
  documentUrl?: string;
  generatedAt?: string;
  deliveredAt?: string;
  downloadedAt?: string;
  applicants: Array<{
    id: string;
    name: string;
    passportNumber: string;
    etaStatus: 'approved' | 'rejected' | 'pending';
  }>;
}

export interface ClientDashboard {
  email: string;
  applications: Array<{
    referenceNumber: string;
    status: string;
    etaDocuments: ETADocument[];
    submittedDate: string;
  }>;
}

class ETADeliveryService {
  /**
   * Process approved application and generate ETA documents
   */
  async processApprovedApplication(
    applicationId: string,
    adminUserId: string
  ): Promise<{ success: boolean; etaDocuments?: ETADocument[]; error?: string }> {
    try {
      // Get application details
      const application = await applicationService.getById(applicationId);
      if (!application) {
        return { success: false, error: 'Application not found' };
      }

      // Generate ETA for each approved applicant
      const etaDocuments: ETADocument[] = [];
      
      for (const applicant of application.applicants) {
        if (applicant.status === 'approved') {
          const etaDoc = await this.generateETADocument(
            application,
            applicant,
            adminUserId
          );
          
          if (etaDoc) {
            etaDocuments.push(etaDoc);
          }
        }
      }

      // Store ETA documents in database
      for (const doc of etaDocuments) {
        await this.storeETADocument(doc);
      }

      // Automatically add to client dashboard
      await this.addToClientDashboard(
        application.user_email,
        application.reference_number,
        etaDocuments
      );

      // Send notification email
      await this.sendETANotification(
        application.user_email,
        application.reference_number,
        etaDocuments
      );

      return { success: true, etaDocuments };
    } catch (error: any) {
      console.error('ETA processing error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate ETA document for an applicant
   */
  private async generateETADocument(
    application: any,
    applicant: any,
    adminUserId: string
  ): Promise<ETADocument> {
    const etaNumber = this.generateETANumber();
    const validFrom = new Date();
    const validUntil = new Date();
    validUntil.setFullYear(validUntil.getFullYear() + 2); // 2 years validity

    const etaDoc: ETADocument = {
      id: crypto.randomUUID(),
      applicationId: application.id,
      referenceNumber: application.reference_number,
      etaNumber,
      status: 'generated',
      validFrom: validFrom.toISOString(),
      validUntil: validUntil.toISOString(),
      generatedAt: new Date().toISOString(),
      applicants: [{
        id: applicant.id,
        name: `${applicant.first_name} ${applicant.last_name}`,
        passportNumber: applicant.passport_number,
        etaStatus: 'approved'
      }]
    };

    // Generate PDF document (would integrate with PDF service)
    const pdfUrl = await this.generatePDF(etaDoc, applicant);
    etaDoc.documentUrl = pdfUrl;

    return etaDoc;
  }

  /**
   * Generate unique ETA number
   */
  private generateETANumber(): string {
    const prefix = 'ETA';
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `${prefix}${year}${random}`;
  }

  /**
   * Generate PDF document (placeholder - would use real PDF service)
   */
  private async generatePDF(etaDoc: ETADocument, applicant: any): Promise<string> {
    // In production, this would:
    // 1. Generate official PDF with government template
    // 2. Add QR code for verification
    // 3. Upload to secure storage
    // 4. Return signed URL
    
    // For now, store the data and return a placeholder
    const { data, error } = await supabase.storage
      .from('eta-documents')
      .upload(
        `${etaDoc.applicationId}/${etaDoc.etaNumber}.json`,
        JSON.stringify({
          ...etaDoc,
          applicant,
          generatedAt: new Date().toISOString()
        }),
        {
          contentType: 'application/json',
          upsert: false
        }
      );

    if (error) throw error;

    const { data: urlData } = await supabase.storage
      .from('eta-documents')
      .createSignedUrl(data.path, 60 * 60 * 24 * 30); // 30 days

    return urlData?.signedUrl || '';
  }

  /**
   * Store ETA document in database
   */
  private async storeETADocument(etaDoc: ETADocument): Promise<void> {
    const { error } = await supabase
      .from('eta_documents')
      .insert({
        id: etaDoc.id,
        application_id: etaDoc.applicationId,
        reference_number: etaDoc.referenceNumber,
        eta_number: etaDoc.etaNumber,
        status: etaDoc.status,
        valid_from: etaDoc.validFrom,
        valid_until: etaDoc.validUntil,
        document_url: etaDoc.documentUrl,
        generated_at: etaDoc.generatedAt,
        metadata: {
          applicants: etaDoc.applicants
        }
      });

    if (error) throw error;
  }

  /**
   * Add ETA documents to client's dashboard automatically
   */
  private async addToClientDashboard(
    clientEmail: string,
    referenceNumber: string,
    etaDocuments: ETADocument[]
  ): Promise<void> {
    try {
      // Update application status
      await supabase
        .from('applications')
        .update({
          status: 'approved',
          eta_issued: true,
          eta_issued_at: new Date().toISOString(),
          eta_documents: etaDocuments.map(d => ({
            eta_number: d.etaNumber,
            valid_from: d.validFrom,
            valid_until: d.validUntil,
            document_id: d.id
          }))
        })
        .eq('reference_number', referenceNumber);

      // Add to client's document collection
      for (const doc of etaDocuments) {
        await supabase
          .from('client_documents')
          .insert({
            client_email: clientEmail,
            document_type: 'eta',
            document_id: doc.id,
            reference_number: referenceNumber,
            eta_number: doc.etaNumber,
            status: 'available',
            created_at: new Date().toISOString()
          });
      }

      // Mark as delivered
      for (const doc of etaDocuments) {
        await supabase
          .from('eta_documents')
          .update({
            status: 'delivered',
            delivered_at: new Date().toISOString()
          })
          .eq('id', doc.id);
      }
    } catch (error) {
      console.error('Failed to add to client dashboard:', error);
      throw error;
    }
  }

  /**
   * Send email notification about ETA availability
   */
  private async sendETANotification(
    clientEmail: string,
    referenceNumber: string,
    etaDocuments: ETADocument[]
  ): Promise<void> {
    await emailService.send(clientEmail, 'eta_ready', {
      referenceNumber,
      etaCount: etaDocuments.length,
      etaNumbers: etaDocuments.map(d => d.etaNumber),
      loginUrl: `${process.env.VITE_APP_URL}/dashboard`,
      validUntil: etaDocuments[0]?.validUntil
    });
  }

  /**
   * Get client's dashboard with all ETAs
   */
  async getClientDashboard(
    clientEmail: string
  ): Promise<{ success: boolean; dashboard?: ClientDashboard; error?: string }> {
    try {
      // Get all applications for this client
      const { data: applications, error } = await supabase
        .from('applications')
        .select(`
          reference_number,
          status,
          created_at,
          eta_documents
        `)
        .eq('user_email', clientEmail)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get all ETA documents for this client
      const { data: clientDocs } = await supabase
        .from('client_documents')
        .select(`
          *,
          eta_documents (*)
        `)
        .eq('client_email', clientEmail)
        .eq('document_type', 'eta');

      const dashboard: ClientDashboard = {
        email: clientEmail,
        applications: applications?.map(app => ({
          referenceNumber: app.reference_number,
          status: app.status,
          submittedDate: app.created_at,
          etaDocuments: app.eta_documents || []
        })) || []
      };

      return { success: true, dashboard };
    } catch (error: any) {
      console.error('Dashboard fetch error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Mark ETA as downloaded
   */
  async markAsDownloaded(
    etaDocumentId: string,
    clientEmail: string
  ): Promise<void> {
    await supabase
      .from('eta_documents')
      .update({
        status: 'downloaded',
        downloaded_at: new Date().toISOString()
      })
      .eq('id', etaDocumentId);

    // Log the download
    await supabase
      .from('document_downloads')
      .insert({
        document_id: etaDocumentId,
        client_email: clientEmail,
        downloaded_at: new Date().toISOString()
      });
  }

  /**
   * Get download URL for ETA document
   */
  async getDownloadUrl(
    etaDocumentId: string,
    clientEmail: string
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      // Verify client owns this document
      const { data: doc } = await supabase
        .from('client_documents')
        .select('*')
        .eq('document_id', etaDocumentId)
        .eq('client_email', clientEmail)
        .single();

      if (!doc) {
        return { success: false, error: 'Document not found or access denied' };
      }

      // Get the ETA document
      const { data: etaDoc } = await supabase
        .from('eta_documents')
        .select('document_url')
        .eq('id', etaDocumentId)
        .single();

      if (!etaDoc?.document_url) {
        return { success: false, error: 'Document URL not found' };
      }

      // Mark as downloaded
      await this.markAsDownloaded(etaDocumentId, clientEmail);

      return { success: true, url: etaDoc.document_url };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

// Export singleton
export const etaDeliveryService = new ETADeliveryService();
export default etaDeliveryService;