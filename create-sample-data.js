// Create sample data for UK ETA Gateway admin dashboard
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
const supabase = createClient(supabaseUrl, supabaseKey);

const sampleApplications = [
  {
    reference_number: 'UK2025DEMO0001A7',
    application_type: 'single',
    status: 'submitted',
    payment_status: 'paid',
    payment_amount: 39.00,
    user_email: 'john.smith@email.com',
    submitted_at: '2025-08-25T10:30:00Z',
    created_at: '2025-08-25T09:15:00Z',
    updated_at: '2025-08-25T10:30:00Z'
  },
  {
    reference_number: 'UK2025DEMO0002B3',
    application_type: 'group',
    status: 'processing',
    payment_status: 'paid',
    payment_amount: 117.00, // 3 applicants × £39
    user_email: 'family.jones@email.com',
    submitted_at: '2025-08-26T14:20:00Z',
    created_at: '2025-08-26T13:45:00Z',
    updated_at: '2025-08-26T16:30:00Z'
  },
  {
    reference_number: 'UK2025DEMO0003C9',
    application_type: 'single',
    status: 'approved',
    payment_status: 'paid',
    payment_amount: 39.00,
    user_email: 'sarah.wilson@email.com',
    submitted_at: '2025-08-24T11:45:00Z',
    created_at: '2025-08-24T11:20:00Z',
    updated_at: '2025-08-27T09:15:00Z'
  },
  {
    reference_number: 'UK2025DEMO0004D1',
    application_type: 'single',
    status: 'rejected',
    payment_status: 'paid',
    payment_amount: 39.00,
    user_email: 'invalid.photo@email.com',
    submitted_at: '2025-08-23T16:30:00Z',
    created_at: '2025-08-23T15:45:00Z',
    updated_at: '2025-08-27T08:20:00Z'
  },
  {
    reference_number: 'UK2025DEMO0005E5',
    application_type: 'single',
    status: 'draft',
    payment_status: 'pending',
    payment_amount: 0,
    user_email: 'incomplete.app@email.com',
    submitted_at: null,
    created_at: '2025-08-27T20:30:00Z',
    updated_at: '2025-08-27T20:45:00Z'
  }
];

// Sample base64 image data (tiny 1x1 pixel images for demo)
const samplePassportPhoto = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';
const samplePersonalPhoto = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';

const sampleApplicants = [
  // Application 1 - John Smith (single)
  {
    application_id: null, // Will be set after application creation
    applicant_number: 1,
    first_name: 'John',
    last_name: 'Smith',
    date_of_birth: '1985-03-15',
    nationality: 'US',
    passport_number: 'US123456789',
    passport_issue_date: '2020-01-15',
    passport_expiry_date: '2030-01-15',
    email: 'john.smith@email.com',
    phone: '+1234567890',
    status: 'complete'
  },
  // Application 2 - Jones Family (group)
  {
    application_id: null,
    applicant_number: 1,
    first_name: 'Robert',
    last_name: 'Jones',
    date_of_birth: '1978-07-22',
    nationality: 'CA',
    passport_number: 'CA987654321',
    passport_issue_date: '2019-05-10',
    passport_expiry_date: '2029-05-10',
    email: 'robert.jones@email.com',
    phone: '+1987654321',
    status: 'complete'
  },
  {
    application_id: null,
    applicant_number: 2,
    first_name: 'Lisa',
    last_name: 'Jones',
    date_of_birth: '1982-11-08',
    nationality: 'CA',
    passport_number: 'CA876543210',
    passport_issue_date: '2019-05-12',
    passport_expiry_date: '2029-05-12',
    email: 'lisa.jones@email.com',
    phone: '+1987654322',
    status: 'complete'
  },
  {
    application_id: null,
    applicant_number: 3,
    first_name: 'Emma',
    last_name: 'Jones',
    date_of_birth: '2010-02-14',
    nationality: 'CA',
    passport_number: 'CA765432109',
    passport_issue_date: '2020-03-01',
    passport_expiry_date: '2025-03-01',
    email: 'family.jones@email.com',
    phone: '+1987654321',
    status: 'complete'
  },
  // Application 3 - Sarah Wilson (approved)
  {
    application_id: null,
    applicant_number: 1,
    first_name: 'Sarah',
    last_name: 'Wilson',
    date_of_birth: '1992-09-03',
    nationality: 'AU',
    passport_number: 'AU345678901',
    passport_issue_date: '2021-08-20',
    passport_expiry_date: '2031-08-20',
    email: 'sarah.wilson@email.com',
    phone: '+61123456789',
    status: 'complete'
  },
  // Application 4 - Rejected (photo issues)
  {
    application_id: null,
    applicant_number: 1,
    first_name: 'Michael',
    last_name: 'Brown',
    date_of_birth: '1988-12-25',
    nationality: 'NZ',
    passport_number: 'NZ456789012',
    passport_issue_date: '2018-06-15',
    passport_expiry_date: '2028-06-15',
    email: 'invalid.photo@email.com',
    phone: '+64987654321',
    status: 'complete'
  },
  // Application 5 - Draft (incomplete) - no photos yet
  {
    application_id: null,
    applicant_number: 1,
    first_name: 'David',
    last_name: 'Garcia',
    date_of_birth: '1990-04-18',
    nationality: 'US',
    passport_number: 'US567890123',
    passport_issue_date: '2022-01-10',
    passport_expiry_date: '2032-01-10',
    email: 'incomplete.app@email.com',
    phone: '+1555123456',
    status: 'incomplete'
  }
];

async function createSampleData() {
  console.log('🗄️ Creating sample data for UK ETA Gateway...\n');

  try {
    // First, clear existing data
    console.log('Clearing existing sample data...');
    await supabase.from('applicants').delete().ilike('email', '%@email.com');
    await supabase.from('applications').delete().ilike('user_email', '%@email.com');
    
    console.log('✅ Cleared existing sample data\n');

    // Create applications
    console.log('Creating sample applications...');
    const { data: createdApps, error: appsError } = await supabase
      .from('applications')
      .insert(sampleApplications)
      .select();

    if (appsError) {
      throw new Error(`Failed to create applications: ${appsError.message}`);
    }

    console.log(`✅ Created ${createdApps.length} applications`);

    // Create applicants with correct application IDs
    console.log('Creating sample applicants...');
    let applicantIndex = 0;
    
    for (let i = 0; i < createdApps.length; i++) {
      const app = createdApps[i];
      const isGroup = app.application_type === 'group';
      const applicantCount = isGroup ? 3 : 1; // Jones family has 3, others have 1
      
      for (let j = 0; j < applicantCount; j++) {
        const applicant = sampleApplicants[applicantIndex];
        applicant.application_id = app.id;
        applicantIndex++;
      }
    }

    const { data: createdApplicants, error: applicantsError } = await supabase
      .from('applicants')
      .insert(sampleApplicants.slice(0, applicantIndex))
      .select();

    if (applicantsError) {
      throw new Error(`Failed to create applicants: ${applicantsError.message}`);
    }

    console.log(`✅ Created ${createdApplicants.length} applicants`);

    // Create some ETA documents for approved applications
    console.log('Creating sample ETA documents...');
    const approvedApp = createdApps.find(app => app.status === 'approved');
    
    if (approvedApp) {
      const { error: etaError } = await supabase
        .from('eta_documents')
        .insert({
          application_id: approvedApp.id,
          reference_number: approvedApp.reference_number,
          eta_number: 'ETA-2025-001-UK',
          status: 'active',
          valid_from: '2025-08-27',
          valid_until: '2027-08-27',
          document_url: '/etas/sample-eta-document.pdf',
          generated_at: '2025-08-27T09:15:00Z',
          delivered_at: '2025-08-27T09:16:00Z'
        });

      if (etaError) {
        console.warn('Warning: Could not create ETA document:', etaError.message);
      } else {
        console.log('✅ Created sample ETA document');
      }
    }

    // Create admin user record
    console.log('Creating admin user...');
    const { error: adminError } = await supabase
      .from('admin_users')
      .upsert({
        email: 'admin@uketa.local',
        role: 'super_admin',
        is_active: true,
        preferences: {
          notifications: true,
          theme: 'light',
          items_per_page: 10
        }
      }, { onConflict: 'email' });

    if (adminError) {
      console.warn('Warning: Could not create admin user:', adminError.message);
    } else {
      console.log('✅ Created admin user record');
    }

    console.log('\n🎉 Sample data creation completed successfully!');
    console.log('\nCreated:');
    console.log(`• ${createdApps.length} applications`);
    console.log(`• ${createdApplicants.length} applicants`);
    console.log('• 1 ETA document');
    console.log('• 1 admin user');
    console.log('\nYou can now access the admin dashboard with:');
    console.log('📧 Email: admin@uketa.local');
    console.log('🔐 Password: AdminPass123');
    console.log('🔗 URL: http://localhost:8080/admin/dashboard');

  } catch (error) {
    console.error('❌ Error creating sample data:', error.message);
    process.exit(1);
  }
}

// Run the script
createSampleData().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});