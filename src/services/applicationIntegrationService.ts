/**
 * Application Integration Service
 * Bridges the frontend with Supabase backend services
 * Maintains backward compatibility while adding real backend functionality
 */

import { applicationService, applicantService, documentService, emailService } from './supabaseService';
import { SimpleSaveService } from './simpleSaveService';
import { ApplicantData, dataManager } from '@/utils/dataManager';
import { supabase } from '@/lib/supabase';

export interface IntegratedApplication {
  id: string;
  reference?: string;
  applicationType: 'single' | 'group';
  applicants: ApplicantData[];
  status: 'draft' | 'submitted' | 'processing' | 'approved' | 'rejected';
  paymentStatus: 'pending' | 'paid' | 'failed';
  currentStep?: string;
  completionPercentage?: number;
  createdAt?: string;
  updatedAt?: string;
  supabaseId?: string; // Link to Supabase record
}

class ApplicationIntegrationService {
  private currentApplication: IntegratedApplication | null = null;
  private syncTimer: NodeJS.Timeout | null = null;
  private readonly SYNC_INTERVAL = 30000; // 30 seconds

  /**
   * Initialize or create a new application
   */
  async initializeApplication(
    applicationType: 'single' | 'group',
    numberOfApplicants: number = 1
  ): Promise<IntegratedApplication> {
    try {
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      const userEmail = user?.email || 'anonymous@example.com';

      // Create application in Supabase
      const supabaseApp = await applicationService.create({
        userEmail,
        applicationType,
        applicationData: {
          numberOfApplicants,
          source: 'web',
          startedAt: new Date().toISOString()
        }
      });

      // Create local application structure
      const applicants: ApplicantData[] = [];
      for (let i = 0; i < numberOfApplicants; i++) {
        const applicantData = dataManager.createEmptyApplicant();
        applicantData.id = `applicant_${i + 1}`;
        
        // Create applicant in Supabase
        if (supabaseApp?.id) {
          const supabaseApplicant = await applicantService.upsert({
            application_id: supabaseApp.id,
            first_name: '',
            last_name: '',
            status: 'incomplete'
          });
          
          if (supabaseApplicant?.id) {
            applicantData.supabaseId = supabaseApplicant.id;
          }
        }
        
        applicants.push(applicantData);
      }

      this.currentApplication = {
        id: dataManager.generateId(),
        applicationType,
        applicants,
        status: 'draft',
        paymentStatus: 'pending',
        currentStep: '/application/manage',
        completionPercentage: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        supabaseId: supabaseApp?.id
      };

      // Save to local cache
      this.saveToCache();

      // Start auto-sync
      this.startAutoSync();

      return this.currentApplication;
    } catch (error) {
      console.error('Error initializing application:', error);
      
      // Fallback to local-only mode
      return this.createLocalOnlyApplication(applicationType, numberOfApplicants);
    }
  }

  /**
   * Create local-only application (offline mode)
   */
  private createLocalOnlyApplication(
    applicationType: 'single' | 'group',
    numberOfApplicants: number
  ): IntegratedApplication {
    const applicants: ApplicantData[] = [];
    for (let i = 0; i < numberOfApplicants; i++) {
      applicants.push({
        ...dataManager.createEmptyApplicant(),
        id: `applicant_${i + 1}`
      });
    }

    this.currentApplication = {
      id: dataManager.generateId(),
      applicationType,
      applicants,
      status: 'draft',
      paymentStatus: 'pending',
      currentStep: '/application/manage',
      completionPercentage: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.saveToCache();
    return this.currentApplication;
  }

  /**
   * Load existing application
   */
  async loadApplication(applicationId: string): Promise<IntegratedApplication | null> {
    try {
      // Try to load from Supabase first
      const supabaseApp = await applicationService.getById(applicationId);
      
      if (supabaseApp) {
        const applicants = await applicantService.getByApplicationId(applicationId);
        
        this.currentApplication = {
          id: applicationId,
          reference: supabaseApp.reference_number,
          applicationType: supabaseApp.application_type,
          applicants: applicants.map(a => this.mapSupabaseToLocal(a)),
          status: supabaseApp.status,
          paymentStatus: supabaseApp.payment_status,
          currentStep: supabaseApp.application_data?.currentStep,
          completionPercentage: this.calculateCompletion(applicants),
          createdAt: supabaseApp.created_at,
          updatedAt: supabaseApp.updated_at,
          supabaseId: supabaseApp.id
        };

        this.startAutoSync();
        return this.currentApplication;
      }
    } catch (error) {
      console.error('Error loading from Supabase:', error);
    }

    // Fallback to cache
    return this.loadFromCache();
  }

  /**
   * Update applicant data
   */
  async updateApplicant(
    applicantId: string,
    updates: Partial<ApplicantData>
  ): Promise<void> {
    if (!this.currentApplication) return;

    // Update local data
    const applicantIndex = this.currentApplication.applicants.findIndex(
      a => a.id === applicantId
    );
    
    if (applicantIndex === -1) return;

    this.currentApplication.applicants[applicantIndex] = {
      ...this.currentApplication.applicants[applicantIndex],
      ...updates,
      lastUpdated: new Date().toISOString()
    };

    // Update completion percentage
    this.currentApplication.completionPercentage = this.calculateCompletion(
      this.currentApplication.applicants
    );

    // Save to cache
    this.saveToCache();

    // Sync to Supabase if connected
    if (this.currentApplication.supabaseId) {
      try {
        const supabaseApplicant = this.currentApplication.applicants[applicantIndex];
        if (supabaseApplicant.supabaseId) {
          await applicantService.upsert({
            id: supabaseApplicant.supabaseId,
            application_id: this.currentApplication.supabaseId,
            ...this.mapLocalToSupabase(supabaseApplicant)
          });
        }
      } catch (error) {
        console.error('Error syncing to Supabase:', error);
        // Continue - don't block user flow
      }
    }
  }

  /**
   * Upload document with Supabase integration
   */
  async uploadDocument(
    applicantId: string,
    file: File,
    documentType: 'passport' | 'photo' | 'supporting',
    validationScore?: number
  ): Promise<{ success: boolean; documentId?: string; error?: string }> {
    if (!this.currentApplication?.supabaseId) {
      return { 
        success: false, 
        error: 'No active application. Please start a new application.' 
      };
    }

    const applicant = this.currentApplication.applicants.find(
      a => a.id === applicantId
    );

    if (!applicant?.supabaseId) {
      return { 
        success: false, 
        error: 'Applicant not found' 
      };
    }

    try {
      const document = await documentService.upload(
        file,
        this.currentApplication.supabaseId,
        applicant.supabaseId,
        documentType
      );

      // Update local data
      if (documentType === 'photo') {
        applicant.photoUploaded = true;
        applicant.photoValidationScore = validationScore;
      } else if (documentType === 'passport') {
        applicant.passportUploaded = true;
      }

      await this.updateApplicant(applicantId, applicant);

      return { 
        success: true, 
        documentId: document.id 
      };
    } catch (error: any) {
      console.error('Document upload error:', error);
      return { 
        success: false, 
        error: error.message || 'Upload failed' 
      };
    }
  }

  /**
   * Submit application for processing
   */
  async submitApplication(paymentIntentId?: string): Promise<{
    success: boolean;
    reference?: string;
    error?: string;
  }> {
    if (!this.currentApplication?.supabaseId) {
      return { 
        success: false, 
        error: 'No active application' 
      };
    }

    try {
      // Submit via Supabase
      const result = await applicationService.submit(
        this.currentApplication.supabaseId,
        paymentIntentId
      );

      // Update local state
      this.currentApplication.status = 'submitted';
      this.currentApplication.reference = result.reference_number;
      
      if (paymentIntentId) {
        this.currentApplication.paymentStatus = 'paid';
      }

      this.saveToCache();

      // Send confirmation email
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        await emailService.send(user.email, 'confirmation', {
          applicantName: this.currentApplication.applicants[0]?.firstName || 'Applicant',
          reference: result.reference_number,
          totalAmount: this.calculateTotalFee(),
          applicantCount: this.currentApplication.applicants.length,
          submittedDate: new Date().toLocaleDateString()
        });
      }

      return { 
        success: true, 
        reference: result.reference_number 
      };
    } catch (error: any) {
      console.error('Submission error:', error);
      return { 
        success: false, 
        error: error.message || 'Submission failed' 
      };
    }
  }

  /**
   * Calculate total fee
   */
  private calculateTotalFee(): string {
    const feePerApplicant = 12.50;
    const total = this.currentApplication
      ? this.currentApplication.applicants.length * feePerApplicant
      : 0;
    return total.toFixed(2);
  }

  /**
   * Map Supabase applicant to local format
   */
  private mapSupabaseToLocal(supabaseApplicant: any): ApplicantData {
    return {
      id: `applicant_${supabaseApplicant.id}`,
      supabaseId: supabaseApplicant.id,
      firstName: supabaseApplicant.first_name || '',
      lastName: supabaseApplicant.last_name || '',
      dateOfBirth: supabaseApplicant.date_of_birth || '',
      gender: supabaseApplicant.gender || 'male',
      nationality: supabaseApplicant.nationality || '',
      passportNumber: supabaseApplicant.passport_number || '',
      passportExpiryDate: supabaseApplicant.passport_expiry_date || '',
      email: supabaseApplicant.email || '',
      phone: supabaseApplicant.phone_number || '',
      address: supabaseApplicant.address_line_1 || '',
      city: supabaseApplicant.city || '',
      country: supabaseApplicant.country || '',
      photoUploaded: supabaseApplicant.photo_uploaded || false,
      passportUploaded: supabaseApplicant.passport_uploaded || false,
      lastUpdated: supabaseApplicant.updated_at
    };
  }

  /**
   * Map local applicant to Supabase format
   */
  private mapLocalToSupabase(localApplicant: ApplicantData): any {
    return {
      first_name: localApplicant.firstName,
      last_name: localApplicant.lastName,
      date_of_birth: localApplicant.dateOfBirth,
      gender: localApplicant.gender,
      nationality: localApplicant.nationality,
      passport_number: localApplicant.passportNumber,
      passport_expiry_date: localApplicant.passportExpiryDate,
      email: localApplicant.email,
      phone_number: localApplicant.phone,
      address_line_1: localApplicant.address,
      city: localApplicant.city,
      country: localApplicant.country,
      photo_uploaded: localApplicant.photoUploaded,
      passport_uploaded: localApplicant.passportUploaded,
      status: this.calculateApplicantStatus(localApplicant)
    };
  }

  /**
   * Calculate applicant completion status
   */
  private calculateApplicantStatus(applicant: ApplicantData): string {
    const requiredFields = [
      applicant.firstName,
      applicant.lastName,
      applicant.dateOfBirth,
      applicant.nationality,
      applicant.passportNumber,
      applicant.email
    ];

    const allFieldsComplete = requiredFields.every(field => field && field.trim() !== '');
    const documentsComplete = applicant.photoUploaded && applicant.passportUploaded;

    if (allFieldsComplete && documentsComplete) return 'complete';
    if (allFieldsComplete || documentsComplete) return 'partial';
    return 'incomplete';
  }

  /**
   * Calculate overall completion percentage
   */
  private calculateCompletion(applicants: any[]): number {
    if (!applicants || applicants.length === 0) return 0;

    const totalFields = applicants.length * 15; // Approximate fields per applicant
    let completedFields = 0;

    applicants.forEach(applicant => {
      // Count completed personal fields
      if (applicant.first_name || applicant.firstName) completedFields++;
      if (applicant.last_name || applicant.lastName) completedFields++;
      if (applicant.date_of_birth || applicant.dateOfBirth) completedFields++;
      if (applicant.nationality) completedFields++;
      if (applicant.passport_number || applicant.passportNumber) completedFields++;
      if (applicant.email) completedFields++;
      if (applicant.phone_number || applicant.phone) completedFields++;
      
      // Documents
      if (applicant.photo_uploaded || applicant.photoUploaded) completedFields += 4;
      if (applicant.passport_uploaded || applicant.passportUploaded) completedFields += 4;
    });

    return Math.min(100, Math.round((completedFields / totalFields) * 100));
  }

  /**
   * Save to local cache
   */
  private saveToCache(): void {
    if (this.currentApplication) {
      SimpleSaveService.saveApplication(
        this.currentApplication.applicants,
        this.currentApplication.currentStep || '/application/manage'
      );
    }
  }

  /**
   * Load from local cache
   */
  private loadFromCache(): IntegratedApplication | null {
    const cached = SimpleSaveService.getCachedApplication();
    if (!cached) return null;

    this.currentApplication = {
      id: cached.id,
      applicationType: cached.applicantData.length > 1 ? 'group' : 'single',
      applicants: cached.applicantData,
      status: 'draft',
      paymentStatus: 'pending',
      currentStep: cached.currentStep,
      completionPercentage: cached.completionPercentage,
      createdAt: cached.savedAt,
      updatedAt: cached.savedAt
    };

    return this.currentApplication;
  }

  /**
   * Start auto-sync timer
   */
  private startAutoSync(): void {
    this.stopAutoSync();
    
    this.syncTimer = setInterval(() => {
      this.syncToSupabase();
    }, this.SYNC_INTERVAL);
  }

  /**
   * Stop auto-sync timer
   */
  private stopAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }

  /**
   * Sync current application to Supabase
   */
  private async syncToSupabase(): Promise<void> {
    if (!this.currentApplication?.supabaseId) return;

    try {
      await applicationService.update(this.currentApplication.supabaseId, {
        application_data: {
          currentStep: this.currentApplication.currentStep,
          completionPercentage: this.currentApplication.completionPercentage,
          lastSynced: new Date().toISOString()
        }
      } as any);
    } catch (error) {
      console.error('Auto-sync failed:', error);
    }
  }

  /**
   * Get current application
   */
  getCurrentApplication(): IntegratedApplication | null {
    return this.currentApplication;
  }

  /**
   * Clear current application
   */
  clearApplication(): void {
    this.stopAutoSync();
    this.currentApplication = null;
    SimpleSaveService.clearCache();
  }
}

// Export singleton instance
export const applicationIntegration = new ApplicationIntegrationService();
export default applicationIntegration;