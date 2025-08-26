// Unified data management for ETA application

export interface ApplicantData {
  firstName: string;
  secondNames?: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  email: string;
  passportNumber: string;
  jobTitle?: string;
  hasJob?: 'yes' | 'no';
  address?: {
    line1: string;
    line2?: string;
    line3?: string;
    city: string;
    country: string;
    postalCode?: string;
  };
  useSameAddressAsPrimary?: boolean;
  useSameAddressAsPassport?: boolean;
  hasCriminalConvictions?: 'yes' | 'no';
  hasWarCrimesConvictions?: 'yes' | 'no';
  passportPhoto?: string;
  personalPhoto?: string;
}

export interface PaymentData {
  paymentIntentId: string;
  total: number;
  currency: string;
  status: 'created' | 'processing' | 'succeeded' | 'failed';
  createdAt: string;
  numberOfApplicants: number;
  governmentFee: number;
  adminFee: number;
  vat: number;
}

export interface ApplicationReference {
  paymentIntentId: string;
  submissionDate: string;
  status: 'submitted' | 'processing' | 'approved' | 'rejected';
  applicants: ApplicantData[];
}

export interface ApplicationState {
  applicants: ApplicantData[];
  createdAt?: string;
  lastModified?: string;
  applicationRef?: string;
}

const STORAGE_KEY = 'application.applicants';
const LEGACY_KEYS = [
  'application.primaryApplicant',
  'application.secondApplicant',
  'application.mainApplicant'
];

export class DataManager {
  /**
   * Get all applicants from storage
   */
  static getApplicants(): ApplicantData[] {
    try {
      const data = sessionStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
      }
      
      // Try to migrate from legacy structure
      return this.migrateLegacyData();
    } catch (error) {
      console.error('Error loading applicant data:', error);
      return [];
    }
  }
  
  /**
   * Save all applicants to storage
   */
  static saveApplicants(applicants: ApplicantData[]): void {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(applicants));
      sessionStorage.setItem('application.lastModified', new Date().toISOString());
    } catch (error) {
      console.error('Error saving applicant data:', error);
    }
  }
  
  /**
   * Get specific applicant by index (1-based)
   */
  static getApplicant(applicantId: string): ApplicantData | null {
    const applicants = this.getApplicants();
    const index = parseInt(applicantId) - 1;
    return applicants[index] || null;
  }
  
  /**
   * Update specific applicant by index (1-based)
   */
  static updateApplicant(applicantId: string, data: Partial<ApplicantData>): void {
    const applicants = this.getApplicants();
    const index = parseInt(applicantId) - 1;
    
    // Ensure array is large enough
    while (applicants.length <= index) {
      applicants.push({} as ApplicantData);
    }
    
    // Update applicant data
    applicants[index] = { ...applicants[index], ...data };
    this.saveApplicants(applicants);
  }
  
  /**
   * Add new applicant
   */
  static addApplicant(data: Partial<ApplicantData> = {}): number {
    const applicants = this.getApplicants();
    applicants.push(data as ApplicantData);
    this.saveApplicants(applicants);
    return applicants.length; // Return new applicant ID
  }
  
  /**
   * Remove applicant by index (1-based)
   */
  static removeApplicant(applicantId: string): void {
    const applicants = this.getApplicants();
    const index = parseInt(applicantId) - 1;
    
    if (index > 0 && index < applicants.length) { // Cannot remove first applicant (index 0)
      applicants.splice(index, 1);
      this.saveApplicants(applicants);
    }
  }
  
  /**
   * Check if applicant has complete personal info
   */
  static hasCompletePersonalInfo(applicantId: string): boolean {
    const applicant = this.getApplicant(applicantId);
    if (!applicant) return false;
    
    return !!(
      applicant.firstName?.trim() &&
      applicant.lastName?.trim() &&
      applicant.email?.trim() &&
      applicant.passportNumber?.trim() &&
      applicant.dateOfBirth?.trim() &&
      applicant.nationality?.trim()
    );
  }
  
  /**
   * Check if applicant has complete documents
   */
  static hasCompleteDocuments(applicantId: string): boolean {
    const applicant = this.getApplicant(applicantId);
    if (!applicant) return false;
    
    return !!(applicant.passportPhoto && applicant.personalPhoto);
  }
  
  /**
   * Check if all applicants are complete (ready for payment)
   */
  static areAllApplicantsComplete(): boolean {
    const applicants = this.getApplicants();
    if (applicants.length === 0) return false;
    
    return applicants.every((_, index) => {
      const id = (index + 1).toString();
      return this.hasCompletePersonalInfo(id) && this.hasCompleteDocuments(id);
    });
  }
  
  /**
   * Get completion statistics
   */
  static getCompletionStats() {
    const applicants = this.getApplicants();
    const totalApplicants = applicants.length;
    
    let personalInfoComplete = 0;
    let documentsComplete = 0;
    let fullyComplete = 0;
    
    applicants.forEach((_, index) => {
      const id = (index + 1).toString();
      const hasInfo = this.hasCompletePersonalInfo(id);
      const hasDocs = this.hasCompleteDocuments(id);
      
      if (hasInfo) personalInfoComplete++;
      if (hasDocs) documentsComplete++;
      if (hasInfo && hasDocs) fullyComplete++;
    });
    
    return {
      totalApplicants,
      personalInfoComplete,
      documentsComplete,
      fullyComplete,
      percentageComplete: totalApplicants > 0 ? Math.round((fullyComplete / totalApplicants) * 100) : 0
    };
  }
  
  /**
   * Generate application reference
   */
  static generateApplicationRef(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ETA-2024-${random}${timestamp.toString().slice(-3)}`;
  }
  
  /**
   * Save payment intent data
   */
  static savePaymentIntent(paymentIntentId: string, data: PaymentData): void {
    try {
      sessionStorage.setItem(`payment.${paymentIntentId}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving payment intent:', error);
    }
  }
  
  /**
   * Get payment intent data
   */
  static getPaymentIntent(paymentIntentId: string): PaymentData | null {
    try {
      const data = sessionStorage.getItem(`payment.${paymentIntentId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting payment intent:', error);
      return null;
    }
  }
  
  /**
   * Update payment status
   */
  static updatePaymentStatus(paymentIntentId: string, status: PaymentData['status']): void {
    const data = this.getPaymentIntent(paymentIntentId);
    if (data) {
      data.status = status;
      this.savePaymentIntent(paymentIntentId, data);
    }
  }
  
  /**
   * Save application reference
   */
  static saveApplicationReference(referenceNumber: string, data: ApplicationReference): void {
    try {
      sessionStorage.setItem(`application.ref.${referenceNumber}`, JSON.stringify(data));
      sessionStorage.setItem('application.lastReference', referenceNumber);
    } catch (error) {
      console.error('Error saving application reference:', error);
    }
  }
  
  /**
   * Get application by reference
   */
  static getApplicationByReference(referenceNumber: string): ApplicationReference | null {
    try {
      const data = sessionStorage.getItem(`application.ref.${referenceNumber}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting application reference:', error);
      return null;
    }
  }
  
  /**
   * Get last application reference
   */
  static getLastApplicationReference(): string | null {
    try {
      return sessionStorage.getItem('application.lastReference');
    } catch (error) {
      console.error('Error getting last application reference:', error);
      return null;
    }
  }
  
  /**
   * Check if there's a saved application in progress
   */
  static hasSavedApplication(): boolean {
    try {
      const applicants = this.getApplicants();
      return applicants.length > 0;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Get current application progress
   */
  static getApplicationProgress(): { step: number; applicantId: string; description: string } | null {
    try {
      const applicants = this.getApplicants();
      if (applicants.length === 0) return null;
      
      // Find the first incomplete applicant
      for (let i = 0; i < applicants.length; i++) {
        const applicantId = (i + 1).toString();
        const hasInfo = this.hasCompletePersonalInfo(applicantId);
        const hasDocs = this.hasCompleteDocuments(applicantId);
        
        if (!hasInfo) {
          return {
            step: 1,
            applicantId,
            description: `Complete personal information for ${i === 0 ? 'main applicant' : `applicant ${i + 1}`}`
          };
        }
        
        if (!hasDocs) {
          return {
            step: 2, 
            applicantId,
            description: `Upload documents for ${i === 0 ? 'main applicant' : `applicant ${i + 1}`}`
          };
        }
      }
      
      // All applicants complete, ready for review/payment
      return {
        step: 3,
        applicantId: '1',
        description: 'Review and complete payment'
      };
    } catch (error) {
      console.error('Error getting application progress:', error);
      return null;
    }
  }
  
  /**
   * Clear all application data
   */
  static clearAllData(): void {
    sessionStorage.removeItem(STORAGE_KEY);
    LEGACY_KEYS.forEach(key => sessionStorage.removeItem(key));
    sessionStorage.removeItem('application.lastModified');
    sessionStorage.removeItem('application.createdAt');
    sessionStorage.removeItem('application.applicationRef');
    
    // Clear payment and reference data
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith('payment.') || key.startsWith('application.ref.')) {
        sessionStorage.removeItem(key);
      }
    });
    sessionStorage.removeItem('application.lastReference');
  }
  
  /**
   * Migrate legacy data structure to new unified structure
   */
  private static migrateLegacyData(): ApplicantData[] {
    const applicants: ApplicantData[] = [];
    
    try {
      // Try to load main/primary applicant
      const primaryData = sessionStorage.getItem('application.primaryApplicant') || 
                         sessionStorage.getItem('application.mainApplicant');
      if (primaryData) {
        applicants.push(JSON.parse(primaryData));
        sessionStorage.removeItem('application.primaryApplicant');
        sessionStorage.removeItem('application.mainApplicant');
      }
      
      // Try to load second applicant
      const secondData = sessionStorage.getItem('application.secondApplicant');
      if (secondData) {
        applicants.push(JSON.parse(secondData));
        sessionStorage.removeItem('application.secondApplicant');
      }
      
      // Save migrated data to new structure
      if (applicants.length > 0) {
        this.saveApplicants(applicants);
      }
      
    } catch (error) {
      console.error('Error migrating legacy data:', error);
    }
    
    return applicants;
  }
}