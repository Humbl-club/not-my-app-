import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// You'll need to replace these with your actual Supabase project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-application-name': 'uk-eta-gateway',
    },
  },
});

// Database types for UK ETA application
export interface Application {
  id: string;
  reference_number: string;
  application_type: 'single' | 'group';
  status: 'draft' | 'submitted' | 'processing' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  submitted_at?: string;
  payment_status?: 'pending' | 'completed' | 'failed';
  payment_intent_id?: string;
  total_fee?: number;
  user_email?: string;
  metadata?: Record<string, any>;
}

export interface Applicant {
  id: string;
  application_id: string;
  applicant_number: number;
  // Personal Information
  title?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  date_of_birth: string;
  place_of_birth: string;
  gender: 'male' | 'female' | 'other';
  // Nationality
  nationality: string;
  dual_nationality?: string;
  national_id_number?: string;
  // Passport Information
  passport_number: string;
  passport_issue_date: string;
  passport_expiry_date: string;
  passport_issuing_country: string;
  // Contact Information
  email: string;
  phone_number: string;
  // Address
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state_province?: string;
  postal_code?: string;
  country: string;
  // Travel Information
  arrival_date?: string;
  departure_date?: string;
  purpose_of_visit?: string;
  uk_address?: string;
  uk_contact_number?: string;
  // Employment
  occupation?: string;
  employer_name?: string;
  employer_address?: string;
  // Additional Information
  previous_uk_visits?: boolean;
  criminal_record?: boolean;
  visa_refusals?: boolean;
  health_conditions?: boolean;
  // Status
  status: 'incomplete' | 'complete' | 'submitted';
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  applicant_id: string;
  document_type: 'passport' | 'photo' | 'supporting';
  file_name: string;
  file_size: number;
  file_type: string;
  storage_path: string;
  validation_status?: 'pending' | 'approved' | 'rejected';
  validation_score?: number;
  validation_details?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SavedApplication {
  id: string;
  browser_fingerprint: string;
  application_data: Record<string, any>;
  current_step: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

// Authentication helpers
export const auth = {
  // Sign up with email
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/account`,
        data: {
          application_type: 'uk-eta',
        },
      },
    });
    return { data, error };
  },

  // Sign in with email
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current session
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    return { data, error };
  },

  // Get current user
  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Send password reset email
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { data, error };
  },

  // Update password
  updatePassword: async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { data, error };
  },
};

// Database operations
export const db = {
  // Applications
  applications: {
    create: async (application: Partial<Application>) => {
      const { data, error } = await supabase
        .from('applications')
        .insert(application)
        .select()
        .single();
      return { data, error };
    },

    update: async (id: string, updates: Partial<Application>) => {
      const { data, error } = await supabase
        .from('applications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    },

    get: async (id: string) => {
      const { data, error } = await supabase
        .from('applications')
        .select('*, applicants(*)')
        .eq('id', id)
        .single();
      return { data, error };
    },

    getByReference: async (reference: string) => {
      const { data, error } = await supabase
        .from('applications')
        .select('*, applicants(*)')
        .eq('reference_number', reference)
        .single();
      return { data, error };
    },

    list: async (userId?: string) => {
      let query = supabase.from('applications').select('*');
      if (userId) {
        query = query.eq('user_id', userId);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      return { data, error };
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id);
      return { error };
    },
  },

  // Applicants
  applicants: {
    create: async (applicant: Partial<Applicant>) => {
      const { data, error } = await supabase
        .from('applicants')
        .insert(applicant)
        .select()
        .single();
      return { data, error };
    },

    update: async (id: string, updates: Partial<Applicant>) => {
      const { data, error } = await supabase
        .from('applicants')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    },

    get: async (id: string) => {
      const { data, error } = await supabase
        .from('applicants')
        .select('*, documents(*)')
        .eq('id', id)
        .single();
      return { data, error };
    },

    listByApplication: async (applicationId: string) => {
      const { data, error } = await supabase
        .from('applicants')
        .select('*')
        .eq('application_id', applicationId)
        .order('applicant_number', { ascending: true });
      return { data, error };
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('applicants')
        .delete()
        .eq('id', id);
      return { error };
    },
  },

  // Documents
  documents: {
    create: async (document: Partial<Document>) => {
      const { data, error } = await supabase
        .from('documents')
        .insert(document)
        .select()
        .single();
      return { data, error };
    },

    update: async (id: string, updates: Partial<Document>) => {
      const { data, error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    },

    get: async (id: string) => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();
      return { data, error };
    },

    listByApplicant: async (applicantId: string) => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('applicant_id', applicantId)
        .order('created_at', { ascending: false });
      return { data, error };
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);
      return { error };
    },
  },

  // Saved Applications (for resume functionality)
  savedApplications: {
    save: async (fingerprint: string, applicationData: any, currentStep: string) => {
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 30); // 30-minute expiry

      const { data, error } = await supabase
        .from('saved_applications')
        .upsert({
          browser_fingerprint: fingerprint,
          application_data: applicationData,
          current_step: currentStep,
          expires_at: expiresAt.toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'browser_fingerprint',
        })
        .select()
        .single();
      return { data, error };
    },

    get: async (fingerprint: string) => {
      const { data, error } = await supabase
        .from('saved_applications')
        .select('*')
        .eq('browser_fingerprint', fingerprint)
        .gt('expires_at', new Date().toISOString())
        .single();
      return { data, error };
    },

    delete: async (fingerprint: string) => {
      const { error } = await supabase
        .from('saved_applications')
        .delete()
        .eq('browser_fingerprint', fingerprint);
      return { error };
    },

    // Clean up expired saved applications
    cleanupExpired: async () => {
      const { error } = await supabase
        .from('saved_applications')
        .delete()
        .lt('expires_at', new Date().toISOString());
      return { error };
    },
  },
};

// Storage operations for file uploads
export const storage = {
  // Upload passport image
  uploadPassport: async (applicantId: string, file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${applicantId}/passport-${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });
    
    if (data) {
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);
      
      return { data: { ...data, publicUrl }, error };
    }
    
    return { data, error };
  },

  // Upload photo
  uploadPhoto: async (applicantId: string, file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${applicantId}/photo-${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });
    
    if (data) {
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);
      
      return { data: { ...data, publicUrl }, error };
    }
    
    return { data, error };
  },

  // Upload supporting document
  uploadDocument: async (applicantId: string, file: File, documentType: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${applicantId}/${documentType}-${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });
    
    if (data) {
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);
      
      return { data: { ...data, publicUrl }, error };
    }
    
    return { data, error };
  },

  // Delete file
  deleteFile: async (path: string) => {
    const { error } = await supabase.storage
      .from('documents')
      .remove([path]);
    return { error };
  },

  // Get file URL
  getUrl: (path: string) => {
    const { data } = supabase.storage
      .from('documents')
      .getPublicUrl(path);
    return data.publicUrl;
  },
};

// Real-time subscriptions
export const realtime = {
  // Subscribe to application changes
  subscribeToApplication: (applicationId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`application:${applicationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
          filter: `id=eq.${applicationId}`,
        },
        callback
      )
      .subscribe();
  },

  // Subscribe to applicant changes
  subscribeToApplicant: (applicantId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`applicant:${applicantId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applicants',
          filter: `id=eq.${applicantId}`,
        },
        callback
      )
      .subscribe();
  },

  // Unsubscribe from channel
  unsubscribe: async (channel: any) => {
    await supabase.removeChannel(channel);
  },
};

// Admin operations (requires admin role)
export const admin = {
  // Get all applications with pagination
  getAllApplications: async (page: number = 1, limit: number = 10) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('applications')
      .select('*, applicants(*)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    return { data, error, count };
  },

  // Update application status
  updateApplicationStatus: async (id: string, status: Application['status']) => {
    const { data, error } = await supabase
      .from('applications')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // Get application statistics
  getStatistics: async () => {
    const { data: applications, error: appsError } = await supabase
      .from('applications')
      .select('status', { count: 'exact' });

    const { data: revenue, error: revError } = await supabase
      .from('applications')
      .select('total_fee')
      .eq('payment_status', 'completed');

    const totalRevenue = revenue?.reduce((sum, app) => sum + (app.total_fee || 0), 0) || 0;

    const stats = {
      total: applications?.length || 0,
      draft: applications?.filter(a => a.status === 'draft').length || 0,
      submitted: applications?.filter(a => a.status === 'submitted').length || 0,
      processing: applications?.filter(a => a.status === 'processing').length || 0,
      approved: applications?.filter(a => a.status === 'approved').length || 0,
      rejected: applications?.filter(a => a.status === 'rejected').length || 0,
      revenue: totalRevenue,
    };

    return { data: stats, error: appsError || revError };
  },
};

export default supabase;