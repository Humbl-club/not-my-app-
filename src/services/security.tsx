import React, { createContext, useContext, ReactNode } from 'react';

// Web Crypto API wrapper for data encryption
class EncryptionService {
  private algorithm = 'AES-GCM';
  private keyLength = 256;
  private ivLength = 12;

  // Generate encryption key from a password
  private async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: this.algorithm, length: this.keyLength },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // Encrypt data
  async encrypt(data: string, password: string = 'default-key'): Promise<string> {
    try {
      const encoder = new TextEncoder();
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(this.ivLength));
      const key = await this.deriveKey(password, salt);

      const encrypted = await crypto.subtle.encrypt(
        { name: this.algorithm, iv: iv },
        key,
        encoder.encode(data)
      );

      // Combine salt + iv + encrypted data
      const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
      combined.set(salt, 0);
      combined.set(iv, salt.length);
      combined.set(new Uint8Array(encrypted), salt.length + iv.length);

      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Encryption failed:', error);
      return data; // Fallback to unencrypted data
    }
  }

  // Decrypt data
  async decrypt(encryptedData: string, password: string = 'default-key'): Promise<string> {
    try {
      const combined = new Uint8Array(
        atob(encryptedData)
          .split('')
          .map(char => char.charCodeAt(0))
      );

      const salt = combined.slice(0, 16);
      const iv = combined.slice(16, 16 + this.ivLength);
      const encrypted = combined.slice(16 + this.ivLength);

      const key = await this.deriveKey(password, salt);

      const decrypted = await crypto.subtle.decrypt(
        { name: this.algorithm, iv: iv },
        key,
        encrypted
      );

      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error('Decryption failed:', error);
      return encryptedData; // Fallback to original data
    }
  }
}

// Secure storage wrapper
class SecureStorage {
  private encryption = new EncryptionService();
  private sensitiveFields = [
    'passportNumber', 'firstName', 'lastName', 'secondNames',
    'dateOfBirth', 'email', 'address', 'nationality'
  ];

  private isSensitiveData(key: string): boolean {
    return this.sensitiveFields.some(field => key.includes(field));
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (this.isSensitiveData(key)) {
        const encrypted = await this.encryption.encrypt(value);
        sessionStorage.setItem(`enc_${key}`, encrypted);
      } else {
        sessionStorage.setItem(key, value);
      }
    } catch (error) {
      console.error('Secure storage setItem failed:', error);
      sessionStorage.setItem(key, value); // Fallback
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      if (this.isSensitiveData(key)) {
        const encrypted = sessionStorage.getItem(`enc_${key}`);
        if (encrypted) {
          return await this.encryption.decrypt(encrypted);
        }
        // Fallback to unencrypted data (for migration)
        return sessionStorage.getItem(key);
      } else {
        return sessionStorage.getItem(key);
      }
    } catch (error) {
      console.error('Secure storage getItem failed:', error);
      return sessionStorage.getItem(key); // Fallback
    }
  }

  removeItem(key: string): void {
    sessionStorage.removeItem(key);
    sessionStorage.removeItem(`enc_${key}`);
  }
}

// Input sanitization utility
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>'"&]/g, '') // Remove potential XSS characters
    .trim()
    .slice(0, 1000); // Limit length
};

// CSRF token management (basic implementation)
export const generateCSRFToken = (): string => {
  return crypto.getRandomValues(new Uint32Array(4)).join('');
};

// Security context
interface SecurityContextType {
  secureStorage: SecureStorage;
  sanitizeInput: (input: string) => string;
  generateCSRFToken: () => string;
}

const SecurityContext = createContext<SecurityContextType | null>(null);

export const SecurityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const secureStorage = new SecureStorage();

  const contextValue: SecurityContextType = {
    secureStorage,
    sanitizeInput,
    generateCSRFToken,
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = (): SecurityContextType => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};