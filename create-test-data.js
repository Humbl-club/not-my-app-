import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createTestData() {
  console.log('🔧 Creating test data for Admin Dashboard...\n');

  try {
    // Create test applications
    const testApplications = [
      {
        reference_number: 'UK24TEST001',
        status: 'submitted',
        payment_status: 'paid',
        payment_amount: 42.00,
        user_email: 'john.doe@example.com',
        application_type: 'single',
        submitted_at: new Date().toISOString()
      },
      {
        reference_number: 'UK24TEST002',
        status: 'processing',
        payment_status: 'paid',
        payment_amount: 84.00,
        user_email: 'jane.smith@example.com',
        application_type: 'group',
        submitted_at: new Date(Date.now() - 86400000).toISOString() // Yesterday
      },
      {
        reference_number: 'UK24TEST003',
        status: 'approved',
        payment_status: 'paid',
        payment_amount: 42.00,
        user_email: 'robert.jones@example.com',
        application_type: 'single',
        submitted_at: new Date(Date.now() - 172800000).toISOString() // 2 days ago
      },
      {
        reference_number: 'UK24TEST004',
        status: 'draft',
        payment_status: 'pending',
        payment_amount: 42.00,
        user_email: 'sarah.wilson@example.com',
        application_type: 'single'
      },
      {
        reference_number: 'UK24TEST005',
        status: 'rejected',
        payment_status: 'paid',
        payment_amount: 42.00,
        user_email: 'mike.brown@example.com',
        application_type: 'single',
        submitted_at: new Date(Date.now() - 259200000).toISOString() // 3 days ago
      }
    ];

    console.log('📝 Creating applications...');
    
    for (const appData of testApplications) {
      // Create application
      const { data: application, error: appError } = await supabase
        .from('applications')
        .insert(appData)
        .select()
        .single();

      if (appError) {
        console.log(`❌ Failed to create application ${appData.reference_number}:`, appError.message);
        continue;
      }

      console.log(`✅ Created application: ${appData.reference_number}`);

      // Create applicants for each application
      const applicantData = {
        application_id: application.id,
        first_name: appData.user_email.split('@')[0].split('.')[0],
        last_name: appData.user_email.split('@')[0].split('.')[1] || 'User',
        passport_number: 'P' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        date_of_birth: '1990-01-01',
        gender: 'male',
        nationality: 'United States',
        email: appData.user_email,
        phone: '+1234567890',
        address_line_1: '123 Test Street',
        city: 'Test City',
        country: 'United States',
        passport_issue_date: '2020-01-01',
        passport_expiry_date: '2030-01-01',
        passport_issuing_country: 'United States',
        place_of_birth: 'New York',
        applicant_number: 1,
        status: appData.status === 'draft' ? 'incomplete' : 'complete'
      };

      const { data: applicant, error: applicantError } = await supabase
        .from('applicants')
        .insert(applicantData)
        .select()
        .single();

      if (applicantError) {
        console.log(`❌ Failed to create applicant for ${appData.reference_number}:`, applicantError.message);
      } else {
        console.log(`✅ Created applicant: ${applicantData.first_name} ${applicantData.last_name}`);

        // Create a document record
        const documentData = {
          applicant_id: applicant.id,
          document_type: 'photo',
          file_name: 'photo.jpg',
          file_size: 1024000,
          file_type: 'image/jpeg',
          storage_path: `${applicant.id}/photo.jpg`,
          verification_status: appData.status === 'approved' ? 'verified' : 'pending',
          validation_score: appData.status === 'approved' ? 95 : 75
        };

        const { error: docError } = await supabase
          .from('documents')
          .insert(documentData);

        if (!docError) {
          console.log(`✅ Created document for applicant`);
        }
      }

      // Add second applicant for group application
      if (appData.application_type === 'group') {
        const secondApplicant = {
          ...applicantData,
          first_name: 'Second',
          last_name: 'Applicant',
          passport_number: 'P' + Math.random().toString(36).substring(2, 10).toUpperCase(),
          email: 'second.applicant@example.com',
          applicant_number: 2
        };

        const { error } = await supabase
          .from('applicants')
          .insert(secondApplicant);

        if (!error) {
          console.log(`✅ Created second applicant for group application`);
        }
      }
    }

    // Get statistics
    console.log('\n📊 Checking database statistics...');
    
    const { count: totalApps } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true });
    
    const { count: totalApplicants } = await supabase
      .from('applicants')
      .select('*', { count: 'exact', head: true });
    
    const { count: totalDocs } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true });

    console.log(`\n✅ Test data created successfully!`);
    console.log(`   - Applications: ${totalApps}`);
    console.log(`   - Applicants: ${totalApplicants}`);
    console.log(`   - Documents: ${totalDocs}`);
    
    console.log('\n🎉 Admin Dashboard is ready!');
    console.log('   1. Navigate to: http://localhost:8080/admin');
    console.log('   2. Login with:');
    console.log('      Username: admin@uketa.gov');
    console.log('      Password: SecureAdmin2024!');
    console.log('\n   Or use Supabase Auth with any registered user');

  } catch (error) {
    console.error('❌ Error creating test data:', error);
  }
}

createTestData();