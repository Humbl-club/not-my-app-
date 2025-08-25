// File validation utilities for document uploads

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export interface FileValidationOptions {
  maxSizeBytes?: number;
  allowedTypes?: string[];
  allowedExtensions?: string[];
}

// Default validation options
const DEFAULT_OPTIONS: Required<FileValidationOptions> = {
  maxSizeBytes: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png'],
  allowedExtensions: ['.jpg', '.jpeg', '.png'],
};

// Validate file type and size
export const validateFile = (
  file: File,
  options: FileValidationOptions = {}
): FileValidationResult => {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Check file size
  if (file.size > opts.maxSizeBytes) {
    const maxMB = Math.round(opts.maxSizeBytes / (1024 * 1024));
    return {
      valid: false,
      error: `File size must be less than ${maxMB}MB`,
    };
  }

  // Check file type
  if (!opts.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'File must be a JPG or PNG image',
    };
  }

  // Check file extension
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!opts.allowedExtensions.includes(fileExtension || '')) {
    return {
      valid: false,
      error: 'File must have a .jpg or .png extension',
    };
  }

  // Basic security check - ensure it's actually an image
  if (!file.type.startsWith('image/')) {
    return {
      valid: false,
      error: 'File must be a valid image',
    };
  }

  return { valid: true };
};

// Create file preview URL
export const createFilePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

// Clean up file preview URL
export const revokeFilePreview = (url: string): void => {
  URL.revokeObjectURL(url);
};

// Validate passport photo specific requirements
export const validatePassportPhoto = (file: File): FileValidationResult => {
  const basicValidation = validateFile(file);
  if (!basicValidation.valid) {
    return basicValidation;
  }

  // Additional passport photo specific validations could go here
  // For example: aspect ratio, face detection, etc.
  
  return { valid: true };
};

// Validate personal photo specific requirements
export const validatePersonalPhoto = (file: File): FileValidationResult => {
  const basicValidation = validateFile(file);
  if (!basicValidation.valid) {
    return basicValidation;
  }

  // Additional personal photo specific validations could go here
  
  return { valid: true };
};

// Mock file upload service
export const uploadFile = async (file: File, type: 'passport' | 'personal'): Promise<string> => {
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real implementation, this would upload to a secure server
  // and return the secure URL
  return `https://secure-storage.example.com/${type}_${Date.now()}_${file.name}`;
};