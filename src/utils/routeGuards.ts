// Route protection utilities for ETA application flow

interface ApplicantData {
  firstName?: string;
  lastName?: string;
  email?: string;
  passportNumber?: string;
  passportPhoto?: string;
  personalPhoto?: string;
}

// Import DataManager for consistent data access
import { DataManager } from './dataManager';

export const getApplicationData = (): ApplicantData[] => {
  return DataManager.getApplicants();
};

export const hasApplicantData = (applicantId: string): boolean => {
  const applicants = getApplicationData();
  const applicantIndex = parseInt(applicantId) - 1;
  const applicant = applicants[applicantIndex];
  
  if (!applicant) return false;
  
  // Check required personal info fields
  return !!(
    applicant.firstName?.trim() &&
    applicant.lastName?.trim() &&
    applicant.email?.trim() &&
    applicant.passportNumber?.trim()
  );
};

export const hasApplicantDocuments = (applicantId: string): boolean => {
  const applicants = getApplicationData();
  const applicantIndex = parseInt(applicantId) - 1;
  const applicant = applicants[applicantIndex];
  
  if (!applicant) return false;
  
  // Check required documents
  return !!(applicant.passportPhoto && applicant.personalPhoto);
};

export const hasAllApplicantsComplete = (): boolean => {
  const applicants = getApplicationData();
  if (applicants.length === 0) return false;
  
  return applicants.every(applicant =>
    // Personal info complete
    applicant.firstName?.trim() &&
    applicant.lastName?.trim() &&
    applicant.email?.trim() &&
    applicant.passportNumber?.trim() &&
    // Documents complete
    applicant.passportPhoto &&
    applicant.personalPhoto
  );
};

export const getRedirectPath = (requestedPath: string): string | null => {
  const applicants = getApplicationData();
  
  // If no applicants exist, redirect to application start
  if (applicants.length === 0) {
    return '/application';
  }
  
  // Check specific route protection rules
  if (requestedPath.includes('/documents')) {
    const applicantId = requestedPath.match(/\/applicant\/(\d+)\/documents/)?.[1];
    if (applicantId && !hasApplicantData(applicantId)) {
      return `/application/applicant/${applicantId}`;
    }
  }
  
  if (requestedPath === '/application/payment') {
    if (!hasAllApplicantsComplete()) {
      return '/application/manage';
    }
  }
  
  if (requestedPath === '/application/review') {
    if (!hasAllApplicantsComplete()) {
      return '/application/manage';
    }
  }
  
  if (requestedPath === '/application/confirmation') {
    // This should only be accessible after payment
    // For now, we'll check if all applicants are complete
    if (!hasAllApplicantsComplete()) {
      return '/application/manage';
    }
  }
  
  return null; // No redirect needed
};