import { supabase } from '@/lib/supabase';

export interface TrackingResult {
  success: boolean;
  application?: any;
  applicants?: any[];
  documents?: any[];
  error?: string;
}

export class TrackingService {
  /**
   * Track application by reference number with optional security verification
   */
  static async trackApplication(
    referenceNumber: string,
    securityCode?: string,
    email?: string,
    dateOfBirth?: string
  ): Promise<TrackingResult> {
    try {
      // Clean and validate reference number
      const cleanRef = referenceNumber.trim().toUpperCase();
      
      // Query the database for the application
      const { data: app, error: appError } = await supabase
        .from('applications')
        .select(`
          *,
          applicants(
            *
          )
        `)
        .eq('reference_number', cleanRef)
        .single();

      let application = app as any;
      if (appError || !application) {
        // Try alternative format (without UK- prefix)
        const altRef = cleanRef.replace('UK-', '');
        const { data: altApp, error: altError } = await supabase
          .from('applications')
          .select(`
            *,
            applicants(*)
          `)
          .eq('reference_number', altRef)
          .single();

        if (altError || !altApp) {
          return {
            success: false,
            error: 'Application not found. Please check your reference number.'
          };
        }
        
        // Use alternative result
        application = altApp;
      }

      // Verify security code if provided
      if (securityCode) {
        const appData = application.application_data as any;
        const storedCode = appData?.securityCode || application.security_code;
        
        if (storedCode && storedCode !== securityCode) {
          return {
            success: false,
            error: 'Invalid security code. Please try again.'
          };
        }
      }

      // Additional verification with email if provided
      if (email) {
        const primaryEmail = application.user_email || 
          application.applicants?.[0]?.email;
        
        if (primaryEmail?.toLowerCase() !== email.toLowerCase()) {
          return {
            success: false,
            error: 'Email verification failed.'
          };
        }
      }

      // Get documents for this application
      const { data: documents } = await supabase
        .from('documents')
        .select('*')
        .eq('application_id', application.id);

      return {
        success: true,
        application,
        applicants: application.applicants || [],
        documents: documents || []
      };

    } catch (error) {
      console.error('Tracking error:', error);
      return {
        success: false,
        error: 'An error occurred while tracking your application. Please try again later.'
      };
    }
  }

  /**
   * Get application status history
   */
  static async getStatusHistory(applicationId: string) {
    try {
      const { data, error } = await supabase
        .from('status_history')
        .select('*')
        .eq('application_id', applicationId)
        .order('changed_at', { ascending: false });

      return data || [];
    } catch (error) {
      console.error('Error fetching status history:', error);
      return [];
    }
  }

  /**
   * Mock tracking for development/demo purposes
   */
  static getMockApplication(referenceNumber: string) {
    return {
      id: 'mock-123',
      reference_number: referenceNumber,
      status: 'in_review',
      payment_status: 'paid',
      submitted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      application_data: {
        applicationType: 'single'
      },
      applicants: [
        {
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          nationality: 'United States',
          status: 'complete'
        }
      ]
    };
  }
}
