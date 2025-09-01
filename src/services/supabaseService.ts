/**
 * Comprehensive Supabase Service Layer
 * Handles all backend operations with error handling, retry logic, and offline support
 */

import { supabase } from '@/lib/supabase';
import type { 
  Application, 
  Applicant, 
  Document,
  Database 
} from '@/types/supabase';

// Service configuration
const CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  CONNECTION_TIMEOUT: 30000,
  OFFLINE_QUEUE_KEY: 'uk_eta_offline_queue',
  CACHE_DURATION: 1800000 // 30 minutes
};

// Connection status tracking
let connectionStatus: 'online' | 'offline' | 'connecting' = 'online';
const connectionListeners = new Set<(status: typeof connectionStatus) => void>();

// Offline queue for requests made while offline
const offlineQueue: Array<() => Promise<any>> = [];

/**
 * Connection Health Check
 */
export async function checkConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('applications').select('count').limit(1);
    updateConnectionStatus(error ? 'offline' : 'online');
    return !error;
  } catch {
    updateConnectionStatus('offline');
    return false;
  }
}

/**
 * Update and broadcast connection status
 */
function updateConnectionStatus(status: typeof connectionStatus) {
  if (connectionStatus !== status) {
    connectionStatus = status;
    connectionListeners.forEach(listener => listener(status));
    
    // Process offline queue when coming back online
    if (status === 'online' && offlineQueue.length > 0) {
      processOfflineQueue();
    }
  }
}

/**
 * Subscribe to connection status changes
 */
export function onConnectionChange(callback: (status: typeof connectionStatus) => void) {
  connectionListeners.add(callback);
  return () => connectionListeners.delete(callback);
}

/**
 * Process queued offline requests
 */
async function processOfflineQueue() {
  console.log(`Processing ${offlineQueue.length} offline requests...`);
  
  while (offlineQueue.length > 0) {
    const request = offlineQueue.shift();
    if (request) {
      try {
        await request();
      } catch (error) {
        console.error('Failed to process offline request:', error);
      }
    }
  }
}

/**
 * Retry logic wrapper
 */
async function withRetry<T>(
  operation: () => Promise<T>,
  retries = CONFIG.MAX_RETRIES
): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    if (retries > 0 && !error?.message?.includes('duplicate')) {
      await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY));
      return withRetry(operation, retries - 1);
    }
    throw error;
  }
}

/**
 * Queue operation for offline execution
 */
function queueOffline<T>(operation: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    offlineQueue.push(async () => {
      try {
        const result = await operation();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
    
    // Save queue to localStorage for persistence
    localStorage.setItem(CONFIG.OFFLINE_QUEUE_KEY, JSON.stringify(offlineQueue.length));
  });
}

// ============================================================================
// APPLICATION MANAGEMENT
// ============================================================================

export const applicationService = {
  /**
   * Create a new application
   */
  async create(data: {
    userEmail: string;
    applicationType: 'single' | 'group';
    applicationData?: any;
  }) {
    if (connectionStatus === 'offline') {
      return queueOffline(() => this.create(data));
    }

    return withRetry(async () => {
      const { data: application, error } = await supabase
        .from('applications')
        .insert({
          user_email: data.userEmail,
          application_type: data.applicationType,
          status: 'draft',
          payment_status: 'pending',
          application_data: data.applicationData || {},
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return application;
    });
  },

  /**
   * Get application by ID
   */
  async getById(id: string) {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        applicants (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get application by reference number
   */
  async getByReference(reference: string) {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        applicants (*),
        documents (*)
      `)
      .eq('reference_number', reference)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update application
   */
  async update(id: string, updates: Partial<Application>) {
    if (connectionStatus === 'offline') {
      return queueOffline(() => this.update(id, updates));
    }

    return withRetry(async () => {
      const { data, error } = await supabase
        .from('applications')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    });
  },

  /**
   * Submit application for processing
   */
  async submit(applicationId: string, paymentIntentId?: string) {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-application`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        applicationId,
        paymentIntentId
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit application');
    }

    return response.json();
  },

  /**
   * Get user's saved applications
   */
  async getUserApplications(email: string) {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('user_email', email)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Delete draft application
   */
  async delete(id: string) {
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id)
      .eq('status', 'draft'); // Only allow deleting drafts

    if (error) throw error;
  }
};

// ============================================================================
// APPLICANT MANAGEMENT
// ============================================================================

export const applicantService = {
  /**
   * Create or update applicant
   */
  async upsert(applicant: Partial<Applicant>) {
    if (connectionStatus === 'offline') {
      return queueOffline(() => this.upsert(applicant));
    }

    return withRetry(async () => {
      const { data, error } = await supabase
        .from('applicants')
        .upsert({
          ...applicant,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    });
  },

  /**
   * Get applicants for an application
   */
  async getByApplicationId(applicationId: string) {
    const { data, error } = await supabase
      .from('applicants')
      .select('*')
      .eq('application_id', applicationId)
      .order('created_at');

    if (error) throw error;
    return data || [];
  },

  /**
   * Delete applicant
   */
  async delete(id: string) {
    const { error } = await supabase
      .from('applicants')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// ============================================================================
// DOCUMENT MANAGEMENT
// ============================================================================

export const documentService = {
  /**
   * Upload document to storage
   */
  async upload(
    file: File,
    applicationId: string,
    applicantId: string,
    documentType: 'passport' | 'photo' | 'supporting'
  ) {
    if (connectionStatus === 'offline') {
      throw new Error('Cannot upload documents while offline');
    }

    // Validate file
    const maxSize = documentType === 'photo' ? 5242880 : 10485760; // 5MB for photos, 10MB for documents
    if (file.size > maxSize) {
      throw new Error(`File too large. Maximum size is ${maxSize / 1048576}MB`);
    }

    const allowedTypes = documentType === 'photo' 
      ? ['image/jpeg', 'image/png', 'image/jpg']
      : ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type');
    }

    return withRetry(async () => {
      // Generate unique file path
      const timestamp = Date.now();
      const fileName = `${applicationId}/${applicantId}/${documentType}_${timestamp}_${file.name}`;
      const bucket = documentType === 'passport' ? 'passports' : documentType === 'photo' ? 'photos' : 'documents';

      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Save document record (schema uses file_path + mime_type; no bucket_name column)
      const { data: document, error: dbError } = await supabase
        .from('documents')
        .insert({
          application_id: applicationId,
          applicant_id: applicantId,
          document_type: documentType,
          file_path: uploadData.path,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
          verification_status: 'pending',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (dbError) {
        // Clean up uploaded file on database error
        await supabase.storage.from(bucket).remove([fileName]);
        throw dbError;
      }

      return document;
    });
  },

  /**
   * Get signed URL for document viewing
   */
  async getSignedUrl(bucketName: string, filePath: string) {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, 3600); // 1 hour expiry

    if (error) throw error;
    return data.signedUrl;
  },

  /**
   * Get documents for an application
   */
  async getByApplicationId(applicationId: string) {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('application_id', applicationId)
      .order('created_at');

    if (error) throw error;
    return data || [];
  },

  /**
   * Delete document
   */
  async delete(document: Document) {
    // Determine bucket from document type
    const bucket = document.document_type === 'passport'
      ? 'passports'
      : document.document_type === 'photo'
        ? 'photos'
        : 'documents';

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(bucket)
      .remove([document.file_path]);

    if (storageError) throw storageError;

    // Delete from database
    const { error: dbError } = await supabase
      .from('documents')
      .delete()
      .eq('id', document.id);

    if (dbError) throw dbError;
  },

  /**
   * Verify document with AI
   */
  async verify(documentId: string) {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-document`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ documentId })
    });

    if (!response.ok) {
      throw new Error('Document verification failed');
    }

    return response.json();
  }
};

// ============================================================================
// PAYMENT MANAGEMENT
// ============================================================================

export const paymentService = {
  /**
   * Create payment intent
   */
  async createIntent(applicationId: string, applicantCount: number, email: string) {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        applicationId,
        applicantCount,
        email
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    return response.json();
  },

  /**
   * Update payment status
   */
  async updateStatus(applicationId: string, status: string, paymentIntentId?: string) {
    return applicationService.update(applicationId, {
      payment_status: status,
      payment_intent_id: paymentIntentId
    } as any);
  }
};

// ============================================================================
// EMAIL SERVICE
// ============================================================================

export const emailService = {
  /**
   * Send email notification
   */
  async send(to: string, type: string, data: any) {
    if (connectionStatus === 'offline') {
      return queueOffline(() => this.send(to, type, data));
    }

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ to, type, data })
    });

    if (!response.ok) {
      console.error('Email send failed:', await response.text());
      // Don't throw - email failures shouldn't block the flow
    }

    return response.ok;
  }
};

// ============================================================================
// REALTIME SUBSCRIPTIONS
// ============================================================================

export const realtimeService = {
  /**
   * Subscribe to application updates
   */
  subscribeToApplication(applicationId: string, callback: (payload: any) => void) {
    const channel = supabase
      .channel(`application-${applicationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
          filter: `id=eq.${applicationId}`
        },
        callback
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * Subscribe to all user applications
   */
  subscribeToUserApplications(email: string, callback: (payload: any) => void) {
    const channel = supabase
      .channel(`user-applications-${email}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
          filter: `user_email=eq.${email}`
        },
        callback
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};

// ============================================================================
// INITIALIZATION
// ============================================================================

// Check connection on startup
checkConnection();

// Monitor connection status
setInterval(checkConnection, 30000); // Check every 30 seconds

// Handle browser online/offline events
window.addEventListener('online', () => checkConnection());
window.addEventListener('offline', () => updateConnectionStatus('offline'));

// Export everything as default for convenience
export default {
  applicationService,
  applicantService,
  documentService,
  paymentService,
  emailService,
  realtimeService,
  checkConnection,
  onConnectionChange,
  get connectionStatus() { return connectionStatus; }
};
