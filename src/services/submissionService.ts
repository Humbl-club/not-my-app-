/**
 * Simple submission service for sending applications to backend
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export interface SubmissionResult {
  success: boolean;
  message: string;
  applicationId?: string;
  error?: string;
}

export class SubmissionService {
  /**
   * Submit complete application with all documents
   */
  static async submitApplication(
    applicationData: any,
    documents: Map<string, File[]>
  ): Promise<SubmissionResult> {
    try {
      const formData = new FormData();
      const applicationId = `ETA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Add application data
      formData.append('formData', JSON.stringify({
        ...applicationData,
        applicationId,
        submittedAt: new Date().toISOString()
      }));
      formData.append('applicationId', applicationId);
      
      // Add all documents
      documents.forEach((files, applicantId) => {
        files.forEach(file => {
          formData.append('documents', file, `${applicantId}-${file.name}`);
        });
      });
      
      // Send to backend
      const response = await fetch(`${BACKEND_URL}/api/submit-application`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Submission failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Clear local storage after successful submission
        sessionStorage.removeItem('applicantData');
        sessionStorage.removeItem('applicationData');
        localStorage.removeItem('savedApplication');
      }
      
      return result;
    } catch (error) {
      console.error('Submission error:', error);
      return {
        success: false,
        message: 'Failed to submit application. Please try again.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  /**
   * Check if backend is available
   */
  static async checkBackendHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/health`);
      const data = await response.json();
      return data.status === 'ok';
    } catch (error) {
      console.warn('Backend not available, running in offline mode');
      return false;
    }
  }
  
  /**
   * Save application locally (fallback when backend is not available)
   */
  static saveApplicationOffline(applicationData: any): string {
    const applicationId = `OFFLINE-${Date.now()}`;
    const savedApplications = JSON.parse(
      localStorage.getItem('offlineApplications') || '[]'
    );
    
    savedApplications.push({
      id: applicationId,
      data: applicationData,
      savedAt: new Date().toISOString()
    });
    
    localStorage.setItem('offlineApplications', JSON.stringify(savedApplications));
    
    return applicationId;
  }
  
  /**
   * Get all offline applications (for later submission)
   */
  static getOfflineApplications(): any[] {
    return JSON.parse(localStorage.getItem('offlineApplications') || '[]');
  }
  
  /**
   * Submit offline applications when backend becomes available
   */
  static async submitOfflineApplications(): Promise<number> {
    const offline = this.getOfflineApplications();
    let submitted = 0;
    
    for (const app of offline) {
      const result = await this.submitApplication(app.data, new Map());
      if (result.success) {
        submitted++;
      }
    }
    
    if (submitted > 0) {
      // Clear successfully submitted applications
      const remaining = offline.slice(submitted);
      localStorage.setItem('offlineApplications', JSON.stringify(remaining));
    }
    
    return submitted;
  }
}