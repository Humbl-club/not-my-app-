import { supabase } from '@/lib/supabase';
import { DataManager } from '@/utils/dataManager';
import { SecurityService } from '@/services/securityService';
import { toast } from 'sonner';

/**
 * Service to bridge localStorage form data to Supabase database
 * This ensures admin dashboard can see all applications created in the frontend
 */

export interface FormSubmissionResult {
  success: boolean;
  message: string;
  referenceNumber?: string;
  applicationId?: string;
  error?: string;
}

export class FormToSupabaseService {
  
  /**
   * Convert localStorage form data to Supabase application + applicants + documents
   */
  static async submitFormToDatabase(): Promise<FormSubmissionResult> {
    try {
      // Get all form data from localStorage
      const applicants = DataManager.getApplicants();
      const appData = DataManager.getApplicationData();
      
      if (!applicants || applicants.length === 0) {
        throw new Error('No applicant data found');
      }

      // Generate reference number
      const refNumber = this.generateReferenceNumber();
      
      // Create application record
      const applicationRecord = {
        reference_number: refNumber,
        application_type: applicants.length > 1 ? 'group' : 'single',
        status: 'submitted',
        payment_status: 'paid', // Assuming payment was completed
        payment_amount: applicants.length * 3900, // £39 per applicant in pence
        user_email: applicants[0].email || 'user@example.com',
        submitted_at: new Date().toISOString(),
        application_data: {
          applicants: applicants,
          metadata: appData || {},
          submission_source: 'web_form'
        }
      };

      console.log('Creating application:', applicationRecord);

      // Insert application
      const { data: application, error: appError } = await supabase
        .from('applications')
        .insert([applicationRecord])
        .select()
        .single();

      if (appError) {
        throw new Error(`Failed to create application: ${appError.message}`);
      }

      console.log('Application created:', application);

      // Create applicant records with sanitization
      const applicantRecords = applicants.map((applicant, index) => {
        // Sanitize all text inputs to prevent XSS and SQL injection
        const sanitizedFirstName = SecurityService.sanitizeInput(applicant.firstName || '').toUpperCase();
        const sanitizedLastName = SecurityService.sanitizeInput(applicant.lastName || '').toUpperCase();
        const sanitizedPassport = SecurityService.sanitizeInput(applicant.passportNumber || '').toUpperCase();
        const sanitizedEmail = SecurityService.validateEmail(applicant.email || '').sanitized;
        const sanitizedPhone = SecurityService.sanitizeInput(applicant.phone || '');
        
        // Validate passport names
        const firstNameValidation = SecurityService.validatePassportName(sanitizedFirstName);
        const lastNameValidation = SecurityService.validatePassportName(sanitizedLastName);
        
        if (!firstNameValidation.isValid || !lastNameValidation.isValid) {
          throw new Error('Invalid name format detected. Names must contain only letters, spaces, hyphens, and apostrophes.');
        }
        
        // Validate passport number
        const passportValidation = SecurityService.validatePassportNumber(sanitizedPassport);
        if (!passportValidation.isValid && sanitizedPassport) {
          throw new Error('Invalid passport number format. Must be 6-10 alphanumeric characters.');
        }
        
        return {
          application_id: application.id,
          applicant_number: index + 1,
          first_name: firstNameValidation.sanitized,
          last_name: lastNameValidation.sanitized,
          date_of_birth: applicant.dateOfBirth || '',
          nationality: SecurityService.sanitizeInput(applicant.nationality || ''),
          passport_number: passportValidation.sanitized,
          passport_issue_date: applicant.passportIssueDate || null,
          passport_expiry_date: applicant.passportExpiryDate || null,
          email: sanitizedEmail,
          phone: sanitizedPhone,
          status: applicant.passportPhoto && applicant.personalPhoto ? 'complete' : 'incomplete',
          additional_data: {
            originalData: {
              ...applicant,
              // Remove sensitive photo data from additional_data
              passportPhoto: undefined,
              personalPhoto: undefined
            },
            hasDocuments: !!(applicant.passportPhoto && applicant.personalPhoto)
          }
        };
      });

      console.log('Creating applicants:', applicantRecords);

      const { data: createdApplicants, error: applicantsError } = await supabase
        .from('applicants')
        .insert(applicantRecords)
        .select();

      if (applicantsError) {
        throw new Error(`Failed to create applicants: ${applicantsError.message}`);
      }

      console.log('Applicants created:', createdApplicants);

      // Create document records for photos
      const documentRecords = [];
      
      for (let i = 0; i < applicants.length; i++) {
        const applicant = applicants[i];
        const createdApplicant = createdApplicants[i];
        
        if (applicant.passportPhoto) {
          documentRecords.push({
            application_id: application.id,
            applicant_id: createdApplicant.id,
            document_type: 'passport',
            file_name: `${refNumber}_${applicant.firstName}_${applicant.lastName}_passport.jpg`,
            file_path: `/documents/${application.id}/${createdApplicant.id}/passport.jpg`,
            file_size: this.estimateBase64Size(applicant.passportPhoto),
            mime_type: 'image/jpeg',
            verification_status: 'verified',
            metadata: {
              image_data: applicant.passportPhoto,
              upload_date: new Date().toISOString(),
              quality_score: applicant.passportPhotoScore || 85,
              original_name: `passport_${applicant.firstName?.toLowerCase()}.jpg`
            }
          });
        }

        if (applicant.personalPhoto) {
          documentRecords.push({
            application_id: application.id,
            applicant_id: createdApplicant.id,
            document_type: 'photo',
            file_name: `${refNumber}_${applicant.firstName}_${applicant.lastName}_personal.jpg`,
            file_path: `/documents/${application.id}/${createdApplicant.id}/personal.jpg`,
            file_size: this.estimateBase64Size(applicant.personalPhoto),
            mime_type: 'image/jpeg',
            verification_status: 'verified',
            metadata: {
              image_data: applicant.personalPhoto,
              upload_date: new Date().toISOString(),
              quality_score: applicant.personalPhotoScore || 85,
              original_name: `photo_${applicant.firstName?.toLowerCase()}.jpg`
            }
          });
        }
      }

      if (documentRecords.length > 0) {
        console.log('Creating documents:', documentRecords);
        
        const { data: createdDocs, error: docsError } = await supabase
          .from('documents')
          .insert(documentRecords)
          .select();

        if (docsError) {
          console.error('Document creation error:', docsError);
          // Don't fail the whole submission for document errors
        } else {
          console.log('Documents created:', createdDocs);
        }
      }

      // Clear localStorage after successful submission
      this.clearFormData();

      return {
        success: true,
        message: `Application ${refNumber} submitted successfully!`,
        referenceNumber: refNumber,
        applicationId: application.id
      };

    } catch (error) {
      console.error('Form submission error:', error);
      return {
        success: false,
        message: 'Failed to submit application. Please try again.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Check if there's form data ready for submission
   */
  static hasFormDataToSubmit(): boolean {
    const applicants = DataManager.getApplicants();
    return applicants && applicants.length > 0;
  }

  /**
   * Get summary of form data ready for submission
   */
  static getSubmissionSummary() {
    const applicants = DataManager.getApplicants();
    if (!applicants || applicants.length === 0) return null;

    const totalApplicants = applicants.length;
    const completedApplicants = applicants.filter(a => 
      a.firstName && a.lastName && a.dateOfBirth && a.nationality && a.passportNumber
    ).length;
    const photosCompleted = applicants.filter(a => 
      a.passportPhoto && a.personalPhoto
    ).length;

    return {
      totalApplicants,
      completedApplicants,
      photosCompleted,
      applicationType: totalApplicants > 1 ? 'group' : 'single',
      primaryApplicantEmail: applicants[0]?.email || null
    };
  }

  /**
   * Generate a reference number in the format expected by the system
   */
  private static generateReferenceNumber(): string {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const day = String(new Date().getDate()).padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    return `UK${year}WEB${month}${day}${random}`;
  }

  /**
   * Estimate file size from base64 string
   */
  private static estimateBase64Size(base64String: string): number {
    if (!base64String) return 0;
    
    // Remove data URL prefix if present
    const base64Data = base64String.split(',')[1] || base64String;
    
    // Base64 encoding increases size by ~33%
    const sizeInBytes = (base64Data.length * 3) / 4;
    
    return Math.floor(sizeInBytes);
  }

  /**
   * Clear form data from localStorage after successful submission
   */
  private static clearFormData(): void {
    try {
      // Clear all form-related localStorage/sessionStorage
      localStorage.removeItem('applicationData');
      localStorage.removeItem('savedApplication');
      sessionStorage.removeItem('applicantData');
      sessionStorage.removeItem('applicationData');
      sessionStorage.removeItem('currentApplicant');
      
      // Clear DataManager data
      DataManager.clearAllData();
      
      console.log('Form data cleared after successful submission');
    } catch (error) {
      console.error('Error clearing form data:', error);
    }
  }

  /**
   * Test function to check if Supabase connection works
   */
  static async testSupabaseConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('count')
        .limit(1);
      
      if (error) {
        console.error('Supabase connection test failed:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
  }
}