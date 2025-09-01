import { supabase, db } from '@/lib/supabase';
import { DataManager } from '@/utils/dataManager';

interface ApplicantData {
  firstName: string;
  secondNames?: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  hasAdditionalNationalities?: boolean;
  additionalNationalities?: string[];
  email: string;
  passportNumber: string;
  address?: {
    line1?: string;
    line2?: string;
    line3?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  hasJob?: string;
  jobTitle?: any;
  hasCriminalConvictions?: string;
  hasWarCrimesConvictions?: string;
}

interface ApplicationData {
  type: 'single' | 'group';
  applicantCount: number;
  primaryEmail?: string;
  applicants?: Record<string, ApplicantData>;
}

export class ApplicationService {
  private static instance: ApplicationService;
  
  static getInstance(): ApplicationService {
    if (!this.instance) {
      this.instance = new ApplicationService();
    }
    return this.instance;
  }

  /**
   * Create or update an application in the database
   */
  async saveApplication(data: ApplicationData): Promise<{ id: string; reference: string } | null> {
    try {
      // Get existing application from localStorage first
      const localData = DataManager.getApplication();
      let applicationId = localData?.applicationId;
      let reference = localData?.referenceNumber;

      if (!applicationId) {
        // Create new application
        const { data: application, error } = await db.applications.create({
          application_type: data.type,
          status: 'draft',
          user_email: data.primaryEmail || '',
          payment_status: 'pending',
          payment_amount: data.applicantCount * 42.00
        });

        if (error) {
          console.error('Error creating application:', error);
          return null;
        }

        applicationId = application.id;
        reference = application.reference_number;

        // Save to localStorage for continuity
        DataManager.saveApplicationStep('application', {
          ...localData,
          applicationId,
          referenceNumber: reference,
        });
      } else {
        // Update existing application
        await db.applications.update(applicationId, {
          application_type: data.type,
          payment_amount: data.applicantCount * 42.00,
          updated_at: new Date().toISOString()
        });
      }

      return { id: applicationId, reference };
    } catch (error) {
      console.error('Error saving application:', error);
      return null;
    }
  }

  /**
   * Save applicant data to database
   */
  async saveApplicant(applicationId: string, applicantNumber: number, data: ApplicantData): Promise<string | null> {
    try {
      // Check if applicant already exists
      const { data: existingApplicants } = await supabase
        .from('applicants')
        .select('id')
        .eq('application_id', applicationId)
        .eq('applicant_number', applicantNumber);

      let applicantId: string;

      const applicantRecord = {
        application_id: applicationId,
        applicant_number: applicantNumber,
        first_name: data.firstName,
        middle_name: data.secondNames || '',
        last_name: data.lastName,
        date_of_birth: data.dateOfBirth,
        nationality: data.nationality,
        email: data.email,
        passport_number: data.passportNumber,
        gender: 'not_specified',
        passport_issue_date: new Date().toISOString().split('T')[0],
        passport_expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 5).toISOString().split('T')[0],
        passport_issuing_country: data.nationality,
        phone: '+1234567890', // Placeholder
        address_line_1: data.address?.line1 || '',
        address_line_2: data.address?.line2 || '',
        city: data.address?.city || '',
        state_province: data.address?.state || '',
        postal_code: data.address?.postalCode || '',
        country: data.address?.country || '',
        occupation: data.jobTitle?.titleEnglish || 'Not specified',
        employer_name: data.hasJob === 'yes' ? 'Employer' : '',
        criminal_record: data.hasCriminalConvictions === 'yes',
        visa_refusals: false,
        health_conditions: false,
        status: 'incomplete'
      };

      if (existingApplicants && existingApplicants.length > 0) {
        // Update existing applicant
        applicantId = existingApplicants[0].id;
        const { error } = await supabase
          .from('applicants')
          .update(applicantRecord)
          .eq('id', applicantId);

        if (error) {
          console.error('Error updating applicant:', error);
          return null;
        }
      } else {
        // Create new applicant
        const { data: newApplicant, error } = await supabase
          .from('applicants')
          .insert(applicantRecord)
          .select()
          .single();

        if (error) {
          console.error('Error creating applicant:', error);
          return null;
        }

        applicantId = newApplicant.id;
      }

      // Also save to localStorage for backup
      const localData = DataManager.getApplication();
      DataManager.saveApplicationStep(`applicant_${applicantNumber}`, {
        ...data,
        applicantId,
        completed: true
      });

      return applicantId;
    } catch (error) {
      console.error('Error saving applicant:', error);
      return null;
    }
  }

  /**
   * Upload document to storage
   */
  async uploadDocument(applicantId: string, file: File, documentType: 'photo' | 'passport'): Promise<string | null> {
    try {
      // Look up application_id for the applicant
      const { data: applicantRow, error: applicantErr } = await supabase
        .from('applicants')
        .select('application_id')
        .eq('id', applicantId)
        .single();

      if (applicantErr || !applicantRow?.application_id) {
        console.error('Cannot resolve application for applicant:', applicantErr);
        return null;
      }

      const applicationId = applicantRow.application_id as string;

      const fileExt = file.name.split('.').pop();
      const bucketName = documentType === 'photo' ? 'photos' : 'passports';
      const fileName = `${applicationId}/${applicantId}/${documentType}-${Date.now()}.${fileExt}`;

      // Upload to storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading document:', error);
        return null;
      }

      // Save document record in database
      const { error: insertErr } = await supabase
        .from('documents')
        .insert({
          application_id: applicationId,
          applicant_id: applicantId,
          document_type: documentType,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
          file_path: fileName,
          verification_status: 'pending'
        });
      if (insertErr) {
        console.error('Error inserting document row:', insertErr);
        // Best-effort cleanup
        await supabase.storage.from(bucketName).remove([fileName]);
        return null;
      }

      // Buckets are private; return the storage path (caller can request a signed URL when needed)
      return fileName;
    } catch (error) {
      console.error('Error uploading document:', error);
      return null;
    }
  }

  /**
   * Submit application for processing
   */
  async submitApplication(applicationId: string): Promise<boolean> {
    try {
      // Call the submit-application edge function
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-application`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session ? `Bearer ${session.access_token}` : `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          applicationId
        })
      });

      if (!response.ok) {
        console.error('Failed to submit application');
        return false;
      }

      // Update local storage
      const localData = DataManager.getApplication();
      DataManager.saveApplicationStep('application', {
        ...localData,
        status: 'submitted',
        submittedAt: new Date().toISOString()
      });

      return true;
    } catch (error) {
      console.error('Error submitting application:', error);
      return false;
    }
  }

  /**
   * Get application by reference number
   */
  async getApplicationByReference(reference: string): Promise<any> {
    try {
      const { data, error } = await db.applications.getByReference(reference);
      
      if (error) {
        console.error('Error fetching application:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching application:', error);
      return null;
    }
  }

  /**
   * Track application status
   */
  async trackApplication(reference: string, email: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*, applicants(*)')
        .eq('reference_number', reference)
        .eq('user_email', email)
        .single();

      if (error) {
        console.error('Error tracking application:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error tracking application:', error);
      return null;
    }
  }
}
