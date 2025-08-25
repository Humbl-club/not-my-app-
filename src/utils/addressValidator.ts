// Address validation utilities

export interface AddressValidationRules {
  line1: (value: string) => string | null;
  line2: (value: string) => string | null;
  line3: (value: string) => string | null;
  city: (value: string) => string | null;
  country: (value: string) => string | null;
  postalCode: (value: string) => string | null;
}

// Validation functions
const validateAddressLine = (value: string, required: boolean = false): string | null => {
  if (!value && required) {
    return 'This field is required';
  }
  
  if (!value) return null;

  // Allow alphanumeric + standard punctuation
  if (!/^[A-Za-z0-9\s,.-]+$/.test(value)) {
    return 'Address can only contain letters, numbers, spaces, commas, periods, and hyphens';
  }

  if (value.length > 100) {
    return 'Address line must be less than 100 characters';
  }

  return null;
};

const validateCityCountry = (value: string, fieldName: string, required: boolean = false): string | null => {
  if (!value && required) {
    return `${fieldName} is required`;
  }
  
  if (!value) return null;

  // No numbers allowed in city/country fields
  if (/\d/.test(value)) {
    return `${fieldName} cannot contain numbers`;
  }

  // Only letters, spaces, hyphens, apostrophes
  if (!/^[A-Za-z\s'-]+$/.test(value)) {
    return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
  }

  if (value.length > 50) {
    return `${fieldName} must be less than 50 characters`;
  }

  return null;
};

const validatePostalCode = (value: string): string | null => {
  if (!value) return null; // Optional field

  // Flexible format: letters + numbers, max 10 characters
  if (!/^[A-Za-z0-9\s-]{1,10}$/.test(value)) {
    return 'Postal code can contain letters, numbers, spaces, and hyphens (max 10 characters)';
  }

  return null;
};

// Address validation rules
export const addressValidationRules: AddressValidationRules = {
  line1: (value: string) => validateAddressLine(value, true),
  line2: (value: string) => validateAddressLine(value, false),
  line3: (value: string) => validateAddressLine(value, false),
  city: (value: string) => validateCityCountry(value, 'City', true),
  country: (value: string) => validateCityCountry(value, 'Country', true),
  postalCode: validatePostalCode,
};

// Extract address data from passport (placeholder implementation)
export const extractAddressFromPassport = (passportData: any): any => {
  // This would use OCR/ML services in a real implementation
  // For now, return placeholder extracted data
  return {
    line1: 'Extracted Address Line 1',
    line2: 'Extracted Address Line 2',
    line3: '',
    city: 'Extracted City',
    country: 'Extracted Country',
    postalCode: 'EX1 2CD',
  };
};