import { db, storage, type Application, type Applicant, type Document } from '@/lib/supabase';

/**
 * Supabase-powered Application Service
 * Handles all application-related operations using Supabase backend
 */

export interface CreateApplicationData {
  applicationType: 'single' | 'group';
  userEmail?: string;
  numberOfApplicants?: number;
}

export interface UpdateApplicantData extends Partial<Omit<Applicant, 'id' | 'application_id' | 'created_at' | 'updated_at'>> {}

export interface UploadDocumentData {
  applicantId: string;
  file: File;
  documentType: 'passport' | 'photo' | 'supporting';
  validationScore?: number;
  validationDetails?: any;
}

class SupabaseApplicationService {
  /**
   * Create a new application
   */
  async createApplication(data: CreateApplicationData): Promise<{ application: Application | null; error: any }> {
    try {
      const { data: application, error } = await db.applications.create({
        application_type: data.applicationType,
        user_email: data.userEmail,
        status: 'draft',
        metadata: {
          numberOfApplicants: data.numberOfApplicants || 1,
          createdFrom: 'web',
          userAgent: navigator.userAgent,
        },
      });

      if (error) throw error;

      // Create initial applicant(s)
      if (application) {
        const numberOfApplicants = data.applicationType === 'single' ? 1 : (data.numberOfApplicants || 1);
        
        for (let i = 0; i < numberOfApplicants; i++) {
          await db.applicants.create({
            application_id: application.id,
            applicant_number: i + 1,
            status: 'incomplete',
            // Initialize with empty required fields
            first_name: '',
            last_name: '',
            date_of_birth: '',
            gender: 'male',
            nationality: '',
            passport_number: '',
            passport_issue_date: '',
            passport_expiry_date: '',
            passport_issuing_country: '',
            email: '',
            phone_number: '',
            address_line_1: '',
            city: '',
            country: '',
          });
        }
      }

      return { application, error: null };
    } catch (error) {
      console.error('Error creating application:', error);
      return { application: null, error };
    }
  }

  /**
   * Get application by ID with all applicants
   */
  async getApplication(applicationId: string): Promise<{ application: any | null; error: any }> {
    try {
      const { data: application, error } = await db.applications.get(applicationId);
      if (error) throw error;
      return { application, error: null };
    } catch (error) {
      console.error('Error fetching application:', error);
      return { application: null, error };
    }
  }

  /**
   * Get application by reference number
   */
  async getApplicationByReference(reference: string): Promise<{ application: any | null; error: any }> {
    try {
      const { data: application, error } = await db.applications.getByReference(reference);
      if (error) throw error;
      return { application, error: null };
    } catch (error) {
      console.error('Error fetching application by reference:', error);
      return { application: null, error };
    }
  }

  /**
   * Update application status
   */
  async updateApplicationStatus(
    applicationId: string,
    status: Application['status']
  ): Promise<{ success: boolean; error: any }> {
    try {
      const updates: Partial<Application> = { status };
      
      if (status === 'submitted') {
        updates.submitted_at = new Date().toISOString();
      }

      const { error } = await db.applications.update(applicationId, updates);
      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Error updating application status:', error);
      return { success: false, error };
    }
  }

  /**
   * Update applicant information
   */
  async updateApplicant(
    applicantId: string,
    data: UpdateApplicantData
  ): Promise<{ applicant: Applicant | null; error: any }> {
    try {
      // Validate required fields if status is being set to complete
      if (data.status === 'complete') {
        const requiredFields = [
          'first_name', 'last_name', 'date_of_birth', 'gender',
          'nationality', 'passport_number', 'passport_issue_date',
          'passport_expiry_date', 'passport_issuing_country',
          'email', 'phone_number', 'address_line_1', 'city', 'country'
        ];

        // Get current applicant data
        const { data: currentApplicant, error: fetchError } = await db.applicants.get(applicantId);
        if (fetchError) throw fetchError;

        const mergedData = { ...currentApplicant, ...data };
        const missingFields = requiredFields.filter(field => !mergedData[field]);

        if (missingFields.length > 0) {
          throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }
      }

      const { data: applicant, error } = await db.applicants.update(applicantId, data);
      if (error) throw error;

      return { applicant, error: null };
    } catch (error) {
      console.error('Error updating applicant:', error);
      return { applicant: null, error };
    }
  }

  /**
   * Upload document (passport, photo, or supporting document)
   */
  async uploadDocument(data: UploadDocumentData): Promise<{ document: Document | null; error: any }> {
    try {
      // Upload file to Supabase Storage
      let uploadResult;
      
      if (data.documentType === 'passport') {
        uploadResult = await storage.uploadPassport(data.applicantId, data.file);
      } else if (data.documentType === 'photo') {
        uploadResult = await storage.uploadPhoto(data.applicantId, data.file);
      } else {
        uploadResult = await storage.uploadDocument(
          data.applicantId,
          data.file,
          data.documentType
        );
      }

      if (uploadResult.error) throw uploadResult.error;

      // Create document record in database
      const { data: document, error } = await db.documents.create({
        applicant_id: data.applicantId,
        document_type: data.documentType,
        file_name: data.file.name,
        file_size: data.file.size,
        file_type: data.file.type,
        storage_path: uploadResult.data.path,
        public_url: uploadResult.data.publicUrl,
        validation_score: data.validationScore,
        validation_details: data.validationDetails,
        validation_status: data.validationScore 
          ? data.validationScore >= 75 ? 'approved' : 'rejected'
          : 'pending',
      });

      if (error) throw error;

      return { document, error: null };
    } catch (error) {
      console.error('Error uploading document:', error);
      return { document: null, error };
    }
  }

  /**
   * Get all documents for an applicant
   */
  async getApplicantDocuments(applicantId: string): Promise<{ documents: Document[] | null; error: any }> {
    try {
      const { data: documents, error } = await db.documents.listByApplicant(applicantId);
      if (error) throw error;
      return { documents, error: null };
    } catch (error) {
      console.error('Error fetching applicant documents:', error);
      return { documents: null, error };
    }
  }

  /**
   * Submit application for processing
   */
  async submitApplication(applicationId: string): Promise<{ success: boolean; error: any }> {
    try {
      // Get application with all applicants
      const { data: application, error: fetchError } = await db.applications.get(applicationId);
      if (fetchError) throw fetchError;

      // Validate all applicants are complete
      const incompleteApplicants = application.applicants.filter(
        (a: Applicant) => a.status !== 'complete'
      );

      if (incompleteApplicants.length > 0) {
        throw new Error(`${incompleteApplicants.length} applicant(s) have incomplete information`);
      }

      // Check all applicants have required documents
      for (const applicant of application.applicants) {
        const { data: documents, error: docError } = await db.documents.listByApplicant(applicant.id);
        if (docError) throw docError;

        const hasPassport = documents?.some((d: Document) => d.document_type === 'passport');
        const hasPhoto = documents?.some((d: Document) => d.document_type === 'photo');

        if (!hasPassport || !hasPhoto) {
          throw new Error(`Applicant ${applicant.first_name} ${applicant.last_name} is missing required documents`);
        }
      }

      // Update application status to submitted
      const { error: updateError } = await db.applications.update(applicationId, {
        status: 'submitted',
        submitted_at: new Date().toISOString(),
      });

      if (updateError) throw updateError;

      // Update all applicants status to submitted
      for (const applicant of application.applicants) {
        await db.applicants.update(applicant.id, { status: 'submitted' });
      }

      return { success: true, error: null };
    } catch (error) {
      console.error('Error submitting application:', error);
      return { success: false, error };
    }
  }

  /**
   * Calculate application fee
   */
  calculateApplicationFee(numberOfApplicants: number): number {
    const feePerApplicant = 10; // £10 per applicant
    const processingFee = 2.5; // £2.50 processing fee
    return (numberOfApplicants * feePerApplicant) + processingFee;
  }

  /**
   * Save application progress (for resume later)
   */
  async saveApplicationProgress(
    fingerprint: string,
    applicationData: any,
    currentStep: string
  ): Promise<{ success: boolean; error: any }> {
    try {
      const { error } = await db.savedApplications.save(
        fingerprint,
        applicationData,
        currentStep
      );
      
      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error('Error saving application progress:', error);
      return { success: false, error };
    }
  }

  /**
   * Resume saved application
   */
  async resumeApplication(fingerprint: string): Promise<{ application: any | null; error: any }> {
    try {
      const { data: savedApp, error } = await db.savedApplications.get(fingerprint);
      if (error) throw error;
      return { application: savedApp, error: null };
    } catch (error) {
      console.error('Error resuming application:', error);
      return { application: null, error };
    }
  }

  /**
   * Delete saved application
   */
  async deleteSavedApplication(fingerprint: string): Promise<{ success: boolean; error: any }> {
    try {
      const { error } = await db.savedApplications.delete(fingerprint);
      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error('Error deleting saved application:', error);
      return { success: false, error };
    }
  }

  /**
   * Generate unique reference number
   */
  generateReferenceNumber(): string {
    const prefix = 'UK';
    const year = new Date().getFullYear().toString().substr(-2);
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `${prefix}${year}${random}`;
  }
}

// Export singleton instance
export const supabaseApplicationService = new SupabaseApplicationService();

// Export types for use in components
export type { Application, Applicant, Document } from '@/lib/supabase';