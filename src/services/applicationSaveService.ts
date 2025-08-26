// PROPER "Save & Continue Later" Implementation
// Note: This requires a backend API - current implementation is frontend-only

import { ApplicantData } from '@/utils/dataManager';

interface SavedApplication {
  id: string;
  resumeToken: string;
  email: string;
  applicantData: ApplicantData[];
  savedAt: string;
  expiresAt: string; // Applications expire after 30 days
  lastStep: string;
  completionPercentage: number;
}

export class ApplicationSaveService {
  
  /**
   * Save application and send resume email
   * This would make an API call to backend in production
   */
  static async saveAndEmailResumeLink(
    applicants: ApplicantData[], 
    email: string,
    currentStep: string
  ): Promise<{ success: boolean; resumeToken?: string; error?: string }> {
    
    try {
      // Generate unique resume token
      const resumeToken = crypto.randomUUID();
      
      // In production, this would be an API call:
      // const response = await fetch('/api/applications/save', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     resumeToken,
      //     email,
      //     applicantData: applicants,
      //     currentStep,
      //     expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      //   })
      // });
      
      // Mock API response for development
      const mockSavedApplication: SavedApplication = {
        id: crypto.randomUUID(),
        resumeToken,
        email,
        applicantData: applicants,
        savedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastStep: currentStep,
        completionPercentage: this.calculateCompletionPercentage(applicants)
      };
      
      // Store in localStorage as mock (in production, this would be server-side)
      localStorage.setItem(`saved_app_${resumeToken}`, JSON.stringify(mockSavedApplication));
      
      // Mock email sending (in production, backend would send email)
      console.log(`📧 EMAIL SENT TO: ${email}`);
      console.log(`📋 Resume Link: ${window.location.origin}/resume/${resumeToken}`);
      console.log(`📝 Application has ${applicants.length} applicant(s), ${this.calculateCompletionPercentage(applicants)}% complete`);
      
      return { success: true, resumeToken };
      
    } catch (error) {
      console.error('Error saving application:', error);
      return { success: false, error: 'Failed to save application' };
    }
  }
  
  /**
   * Resume application from token
   */
  static async resumeApplication(resumeToken: string): Promise<{
    success: boolean;
    application?: SavedApplication;
    error?: string;
  }> {
    try {
      // In production, this would be an API call:
      // const response = await fetch(`/api/applications/resume/${resumeToken}`);
      // const application = await response.json();
      
      // Mock: Get from localStorage
      const saved = localStorage.getItem(`saved_app_${resumeToken}`);
      if (!saved) {
        return { success: false, error: 'Application not found or expired' };
      }
      
      const application: SavedApplication = JSON.parse(saved);
      
      // Check if expired
      if (new Date(application.expiresAt) < new Date()) {
        // Clean up expired application
        localStorage.removeItem(`saved_app_${resumeToken}`);
        return { success: false, error: 'Application link has expired' };
      }
      
      return { success: true, application };
      
    } catch (error) {
      console.error('Error resuming application:', error);
      return { success: false, error: 'Failed to load saved application' };
    }
  }
  
  /**
   * Send resume email (for when user requests it again)
   */
  static async sendResumeEmail(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      // In production, this would search for saved applications by email
      // and send a new resume email
      
      // Mock implementation
      console.log(`📧 Resume email would be sent to: ${email}`);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to send resume email' };
    }
  }
  
  /**
   * Calculate completion percentage
   */
  private static calculateCompletionPercentage(applicants: ApplicantData[]): number {
    if (!applicants.length) return 0;
    
    const totalFields = applicants.length * 10; // Assume 10 required fields per applicant
    let completedFields = 0;
    
    applicants.forEach(applicant => {
      if (applicant.firstName) completedFields++;
      if (applicant.lastName) completedFields++;
      if (applicant.email) completedFields++;
      if (applicant.passportNumber) completedFields++;
      if (applicant.dateOfBirth) completedFields++;
      if (applicant.nationality) completedFields++;
      if (applicant.hasJob !== undefined) completedFields++;
      if (applicant.hasCriminalConvictions !== undefined) completedFields++;
      if (applicant.hasWarCrimesConvictions !== undefined) completedFields++;
      if (applicant.passportPhoto && applicant.personalPhoto) completedFields++;
    });
    
    return Math.round((completedFields / totalFields) * 100);
  }
  
  /**
   * Clean up expired applications (would be a cron job on backend)
   */
  static cleanupExpiredApplications(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('saved_app_')) {
        try {
          const app: SavedApplication = JSON.parse(localStorage.getItem(key)!);
          if (new Date(app.expiresAt) < new Date()) {
            localStorage.removeItem(key);
            console.log(`🗑️ Cleaned up expired application: ${app.id}`);
          }
        } catch (error) {
          // Invalid data, remove it
          localStorage.removeItem(key);
        }
      }
    });
  }
}

// Email template that would be sent
export const RESUME_EMAIL_TEMPLATE = (resumeToken: string, applicantCount: number, completionPercentage: number) => `
Subject: Continue Your UK ETA Application

Dear Applicant,

Your UK ETA application has been saved and is waiting for you to complete it.

Application Status:
• ${applicantCount} applicant(s)
• ${completionPercentage}% complete
• Saved on: ${new Date().toLocaleDateString()}
• Expires: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}

Continue your application:
${window.location.origin}/resume/${resumeToken}

This link will expire in 30 days. If you need assistance, please contact our support team at support@uketaservice.com

Best regards,
UK ETA Application Service
`;