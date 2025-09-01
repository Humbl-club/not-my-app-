// Supabase Database Types
// This file will be auto-generated when you run: npm run supabase:types

export interface Database {
  public: {
    Tables: {
      applications: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          submitted_at: string | null
          reference_number: string
          user_email: string
          user_id: string | null
          status: 'draft' | 'submitted' | 'processing' | 'approved' | 'rejected'
          application_type: string
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_intent_id: string | null
          payment_amount: number | null
          application_data: any
          metadata: any
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          submitted_at?: string | null
          reference_number: string
          user_email: string
          user_id?: string | null
          status?: 'draft' | 'submitted' | 'processing' | 'approved' | 'rejected'
          application_type?: string
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_intent_id?: string | null
          payment_amount?: number | null
          application_data?: any
          metadata?: any
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          submitted_at?: string | null
          reference_number?: string
          user_email?: string
          user_id?: string | null
          status?: 'draft' | 'submitted' | 'processing' | 'approved' | 'rejected'
          application_type?: string
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_intent_id?: string | null
          payment_amount?: number | null
          application_data?: any
          metadata?: any
          ip_address?: string | null
          user_agent?: string | null
        }
      }
      applicants: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          application_id: string
          applicant_number: number
          title: string | null
          first_name: string
          middle_name: string | null
          last_name: string
          date_of_birth: string
          gender: string | null
          nationality: string
          email: string | null
          phone: string | null
          address_line_1: string | null
          address_line_2: string | null
          city: string | null
          state_province: string | null
          postal_code: string | null
          country: string | null
          passport_number: string | null
          passport_issue_date: string | null
          passport_expiry_date: string | null
          passport_issuing_country: string | null
          arrival_date: string | null
          departure_date: string | null
          purpose_of_visit: string | null
          accommodation_address: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          additional_data: any
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          application_id: string
          applicant_number?: number
          title?: string | null
          first_name: string
          middle_name?: string | null
          last_name: string
          date_of_birth: string
          gender?: string | null
          nationality: string
          email?: string | null
          phone?: string | null
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          state_province?: string | null
          postal_code?: string | null
          country?: string | null
          passport_number?: string | null
          passport_issue_date?: string | null
          passport_expiry_date?: string | null
          passport_issuing_country?: string | null
          arrival_date?: string | null
          departure_date?: string | null
          purpose_of_visit?: string | null
          accommodation_address?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          additional_data?: any
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          application_id?: string
          applicant_number?: number
          title?: string | null
          first_name?: string
          middle_name?: string | null
          last_name?: string
          date_of_birth?: string
          gender?: string | null
          nationality?: string
          email?: string | null
          phone?: string | null
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          state_province?: string | null
          postal_code?: string | null
          country?: string | null
          passport_number?: string | null
          passport_issue_date?: string | null
          passport_expiry_date?: string | null
          passport_issuing_country?: string | null
          arrival_date?: string | null
          departure_date?: string | null
          purpose_of_visit?: string | null
          accommodation_address?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          additional_data?: any
        }
      }
      documents: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          application_id: string
          applicant_id: string | null
          document_type: 'passport' | 'photo' | 'supporting'
          file_name: string
          file_path: string
          file_size: number
          mime_type: string
          verification_status: 'pending' | 'verified' | 'rejected'
          verification_notes: string | null
          verified_by: string | null
          verified_at: string | null
          upload_ip: string | null
          metadata: any
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          application_id: string
          applicant_id?: string | null
          document_type: 'passport' | 'photo' | 'supporting'
          file_name: string
          file_path: string
          file_size: number
          mime_type: string
          verification_status?: 'pending' | 'verified' | 'rejected'
          verification_notes?: string | null
          verified_by?: string | null
          verified_at?: string | null
          upload_ip?: string | null
          metadata?: any
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          application_id?: string
          applicant_id?: string | null
          document_type?: 'passport' | 'photo' | 'supporting'
          file_name?: string
          file_path?: string
          file_size?: number
          mime_type?: string
          verification_status?: 'pending' | 'verified' | 'rejected'
          verification_notes?: string | null
          verified_by?: string | null
          verified_at?: string | null
          upload_ip?: string | null
          metadata?: any
        }
      }
      admin_users: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          role: 'admin' | 'super_admin'
          last_login: string | null
          login_count: number
          preferences: any
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          email: string
          role?: 'admin' | 'super_admin'
          last_login?: string | null
          login_count?: number
          preferences?: any
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          role?: 'admin' | 'super_admin'
          last_login?: string | null
          login_count?: number
          preferences?: any
          is_active?: boolean
        }
      }
      application_logs: {
        Row: {
          id: string
          created_at: string
          application_id: string
          action: string
          details: any
          actor_type: string
          actor_id: string | null
          actor_email: string | null
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          application_id: string
          action: string
          details?: any
          actor_type?: string
          actor_id?: string | null
          actor_email?: string | null
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          application_id?: string
          action?: string
          details?: any
          actor_type?: string
          actor_id?: string | null
          actor_email?: string | null
          ip_address?: string | null
          user_agent?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_reference_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      application_status: 'draft' | 'submitted' | 'processing' | 'approved' | 'rejected'
      payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
      document_type: 'passport' | 'photo' | 'supporting'
      verification_status: 'pending' | 'verified' | 'rejected'
      admin_role: 'admin' | 'super_admin'
    }
  }
}

// Helper types
export type Application = Database['public']['Tables']['applications']['Row']
export type ApplicationInsert = Database['public']['Tables']['applications']['Insert']
export type ApplicationUpdate = Database['public']['Tables']['applications']['Update']

export type Applicant = Database['public']['Tables']['applicants']['Row']
export type ApplicantInsert = Database['public']['Tables']['applicants']['Insert']
export type ApplicantUpdate = Database['public']['Tables']['applicants']['Update']

export type Document = Database['public']['Tables']['documents']['Row']
export type DocumentInsert = Database['public']['Tables']['documents']['Insert']
export type DocumentUpdate = Database['public']['Tables']['documents']['Update']

export type AdminUser = Database['public']['Tables']['admin_users']['Row']
export type ApplicationLog = Database['public']['Tables']['application_logs']['Row']
