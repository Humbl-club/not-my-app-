// SIMPLE Cache-Based Save & Continue Later
// Much simpler than email-based system!

import { ApplicantData } from '@/utils/dataManager';

interface CachedApplication {
  id: string;
  fingerprint: string;
  applicantData: ApplicantData[];
  savedAt: string;
  expiresAt: string;
  currentStep: string;
  completionPercentage: number;
}

export class SimpleSaveService {
  
  private static readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
  private static readonly STORAGE_KEY = 'cached_applications';
  
  /**
   * Generate a simple browser/device fingerprint
   * Not for security - just to identify returning users
   */
  private static generateFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx!.textBaseline = 'top';
    ctx!.font = '14px Arial';
    ctx!.fillText('Browser fingerprint', 2, 2);
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL(),
      navigator.hardwareConcurrency || 'unknown',
      navigator.deviceMemory || 'unknown'
    ].join('|');
    
    // Create a simple hash
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36);
  }
  
  /**
   * Save application to cache (localStorage + server cache if available)
   */
  static saveToCache(applicants: ApplicantData[], currentStep: string): string {
    try {
      const fingerprint = this.generateFingerprint();
      const cacheId = crypto.randomUUID();
      
      const cachedApp: CachedApplication = {
        id: cacheId,
        fingerprint,
        applicantData: applicants,
        savedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + this.CACHE_DURATION).toISOString(),
        currentStep,
        completionPercentage: this.calculateCompletion(applicants)
      };
      
      // Store in localStorage as backup
      const existing = this.getCachedApplications();
      existing.push(cachedApp);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existing));
      
      // In production, also cache server-side by IP + fingerprint
      this.cacheOnServer(cachedApp);
      
      console.log(`💾 Application cached for 30 minutes`);
      console.log(`🔍 Fingerprint: ${fingerprint}`);
      console.log(`⏰ Expires: ${new Date(cachedApp.expiresAt).toLocaleString()}`);
      
      return cacheId;
      
    } catch (error) {
      console.error('Error caching application:', error);
      throw error;
    }
  }
  
  /**
   * Check if current user has a cached application
   */
  static hasCachedApplication(): boolean {
    try {
      const currentFingerprint = this.generateFingerprint();
      const cached = this.getCachedApplications();
      
      // Clean up expired entries first
      this.cleanupExpired();
      
      return cached.some(app => 
        app.fingerprint === currentFingerprint && 
        new Date(app.expiresAt) > new Date()
      );
      
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Get cached application for current user
   */
  static getCachedApplication(): CachedApplication | null {
    try {
      const currentFingerprint = this.generateFingerprint();
      const cached = this.getCachedApplications();
      
      const userApp = cached.find(app => 
        app.fingerprint === currentFingerprint && 
        new Date(app.expiresAt) > new Date()
      );
      
      return userApp || null;
      
    } catch (error) {
      console.error('Error getting cached application:', error);
      return null;
    }
  }
  
  /**
   * Restore cached application to current session
   */
  static restoreCachedApplication(): boolean {
    try {
      const cached = this.getCachedApplication();
      if (!cached) return false;
      
      // Import DataManager here to avoid circular dependency
      const { DataManager } = require('@/utils/dataManager');
      
      // Clear current data
      DataManager.clearAllData();
      
      // Restore each applicant
      cached.applicantData.forEach((applicant, index) => {
        DataManager.updateApplicant((index + 1).toString(), applicant);
      });
      
      console.log(`✅ Restored cached application with ${cached.applicantData.length} applicant(s)`);
      return true;
      
    } catch (error) {
      console.error('Error restoring cached application:', error);
      return false;
    }
  }
  
  /**
   * Clear cached application for current user
   */
  static clearCachedApplication(): void {
    try {
      const currentFingerprint = this.generateFingerprint();
      const cached = this.getCachedApplications();
      
      const updated = cached.filter(app => app.fingerprint !== currentFingerprint);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
      
      // Also clear from server cache
      this.clearFromServer(currentFingerprint);
      
    } catch (error) {
      console.error('Error clearing cached application:', error);
    }
  }
  
  /**
   * Get time remaining before cache expires
   */
  static getTimeRemaining(): string | null {
    const cached = this.getCachedApplication();
    if (!cached) return null;
    
    const now = Date.now();
    const expires = new Date(cached.expiresAt).getTime();
    const remaining = expires - now;
    
    if (remaining <= 0) return null;
    
    const minutes = Math.floor(remaining / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    
    if (minutes > 0) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else {
      return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }
  }
  
  // Private helper methods
  private static getCachedApplications(): CachedApplication[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
  
  private static cleanupExpired(): void {
    try {
      const cached = this.getCachedApplications();
      const now = new Date();
      
      const active = cached.filter(app => new Date(app.expiresAt) > now);
      
      if (active.length !== cached.length) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(active));
        console.log(`🗑️ Cleaned up ${cached.length - active.length} expired cached applications`);
      }
    } catch (error) {
      console.error('Error cleaning up expired applications:', error);
    }
  }
  
  private static calculateCompletion(applicants: ApplicantData[]): number {
    // Simple completion calculation
    if (!applicants.length) return 0;
    
    const totalFields = applicants.length * 8; // Assume 8 key fields per applicant
    let completed = 0;
    
    applicants.forEach(applicant => {
      if (applicant.firstName) completed++;
      if (applicant.lastName) completed++;
      if (applicant.email) completed++;
      if (applicant.passportNumber) completed++;
      if (applicant.dateOfBirth) completed++;
      if (applicant.nationality) completed++;
      if (applicant.hasJob !== undefined) completed++;
      if (applicant.hasCriminalConvictions !== undefined) completed++;
    });
    
    return Math.round((completed / totalFields) * 100);
  }
  
  /**
   * Cache on server (production implementation would make API call)
   */
  private static async cacheOnServer(app: CachedApplication): Promise<void> {
    try {
      // In production, this would be:
      // await fetch('/api/cache/save', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     fingerprint: app.fingerprint,
      //     data: app.applicantData,
      //     expiresAt: app.expiresAt
      //   })
      // });
      
      console.log('📡 Would cache on server (not implemented in demo)');
    } catch (error) {
      console.log('Server cache failed, using localStorage only');
    }
  }
  
  private static async clearFromServer(fingerprint: string): Promise<void> {
    try {
      // await fetch(`/api/cache/clear/${fingerprint}`, { method: 'DELETE' });
      console.log('📡 Would clear from server cache');
    } catch (error) {
      console.log('Server clear failed');
    }
  }
}