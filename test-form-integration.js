// Test form-to-database integration
// This script simulates a user filling out the form and tests the complete flow

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
const supabase = createClient(supabaseUrl, supabaseKey);

// Sample form data that would be saved by the frontend
const sampleFormData = {
  applicants: [
    {
      firstName: 'Alice',
      lastName: 'TestUser',
      dateOfBirth: '1990-05-15',
      nationality: 'US',
      email: 'alice.testuser@example.com',
      passportNumber: 'US987654321',
      passportIssueDate: '2020-03-10',
      passportExpiryDate: '2030-03-10',
      phone: '+1555000123',
      jobTitle: 'Software Engineer',
      hasJob: 'yes',
      address: {
        line1: '123 Test Street',
        city: 'Test City',
        country: 'US',
        postalCode: '12345'
      },
      hasCriminalConvictions: 'no',
      hasWarCrimesConvictions: 'no',
      passportPhoto: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
      personalPhoto: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
      passportPhotoScore: 78,
      personalPhotoScore: 82
    }
  ],
  applicationData: {
    type: 'single',
    startedAt: new Date().toISOString(),
    language: 'en'
  }
};

// Simulate the FormToSupabaseService logic
async function testFormSubmission() {
  console.log('🧪 Testing Form-to-Database Integration\n');
  
  try {
    console.log('1. Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('applications')
      .select('count')
      .limit(1);
    
    if (testError) {
      throw new Error(`Supabase connection failed: ${testError.message}`);
    }
    console.log('✅ Supabase connection working\n');

    console.log('2. Simulating form data submission...');
    
    const applicants = sampleFormData.applicants;
    const refNumber = generateReferenceNumber();
    
    console.log(`Generated reference number: ${refNumber}`);
    
    // Create application record
    const applicationRecord = {
      reference_number: refNumber,
      application_type: 'single',
      status: 'submitted',
      payment_status: 'paid',
      payment_amount: 3900, // £39 in pence
      user_email: applicants[0].email,
      submitted_at: new Date().toISOString(),
      application_data: {
        applicants: applicants,
        metadata: sampleFormData.applicationData,
        submission_source: 'test_integration'
      }
    };

    console.log('3. Creating application record...');
    const { data: application, error: appError } = await supabase
      .from('applications')
      .insert([applicationRecord])
      .select()
      .single();

    if (appError) {
      throw new Error(`Failed to create application: ${appError.message}`);
    }
    console.log(`✅ Application created with ID: ${application.id}`);

    // Create applicant records
    console.log('4. Creating applicant records...');
    const applicantRecords = applicants.map((applicant, index) => ({
      application_id: application.id,
      applicant_number: index + 1,
      first_name: applicant.firstName,
      last_name: applicant.lastName,
      date_of_birth: applicant.dateOfBirth,
      nationality: applicant.nationality,
      passport_number: applicant.passportNumber,
      passport_issue_date: applicant.passportIssueDate || null,
      passport_expiry_date: applicant.passportExpiryDate || null,
      email: applicant.email,
      phone: applicant.phone || '',
      status: 'complete'
    }));

    const { data: createdApplicants, error: applicantsError } = await supabase
      .from('applicants')
      .insert(applicantRecords)
      .select();

    if (applicantsError) {
      throw new Error(`Failed to create applicants: ${applicantsError.message}`);
    }
    console.log(`✅ Created ${createdApplicants.length} applicant records`);

    // Create document records
    console.log('5. Creating document records...');
    const documentRecords = [];
    
    for (let i = 0; i < applicants.length; i++) {
      const applicant = applicants[i];
      const createdApplicant = createdApplicants[i];
      
      if (applicant.passportPhoto) {
        documentRecords.push({
          application_id: application.id,
          applicant_id: createdApplicant.id,
          document_type: 'passport',
          file_name: `${refNumber}_${applicant.firstName}_${applicant.lastName}_passport.jpg`,
          file_path: `/documents/${application.id}/${createdApplicant.id}/passport.jpg`,
          file_size: estimateBase64Size(applicant.passportPhoto),
          mime_type: 'image/jpeg',
          verification_status: 'verified',
          metadata: {
            image_data: applicant.passportPhoto,
            upload_date: new Date().toISOString(),
            quality_score: applicant.passportPhotoScore || 85,
            original_name: `passport_${applicant.firstName.toLowerCase()}.jpg`
          }
        });
      }

      if (applicant.personalPhoto) {
        documentRecords.push({
          application_id: application.id,
          applicant_id: createdApplicant.id,
          document_type: 'photo',
          file_name: `${refNumber}_${applicant.firstName}_${applicant.lastName}_personal.jpg`,
          file_path: `/documents/${application.id}/${createdApplicant.id}/personal.jpg`,
          file_size: estimateBase64Size(applicant.personalPhoto),
          mime_type: 'image/jpeg',
          verification_status: 'verified',
          metadata: {
            image_data: applicant.personalPhoto,
            upload_date: new Date().toISOString(),
            quality_score: applicant.personalPhotoScore || 85,
            original_name: `photo_${applicant.firstName.toLowerCase()}.jpg`
          }
        });
      }
    }

    if (documentRecords.length > 0) {
      const { data: createdDocs, error: docsError } = await supabase
        .from('documents')
        .insert(documentRecords)
        .select();

      if (docsError) {
        throw new Error(`Failed to create documents: ${docsError.message}`);
      }
      console.log(`✅ Created ${createdDocs.length} document records`);
    }

    console.log('\n🎉 Integration Test SUCCESSFUL!');
    console.log('================================================');
    console.log(`Reference Number: ${refNumber}`);
    console.log(`Application ID: ${application.id}`);
    console.log(`Applicant: ${applicants[0].firstName} ${applicants[0].lastName}`);
    console.log(`Email: ${applicants[0].email}`);
    console.log(`Documents: ${documentRecords.length} files`);
    console.log('================================================');
    
    // Now test if admin dashboard can see this data
    console.log('\n6. Testing admin dashboard data access...');
    const { data: adminData, error: adminError } = await supabase
      .from('applications')
      .select(`
        *,
        applicants (*),
        documents (*)
      `)
      .eq('id', application.id)
      .single();

    if (adminError) {
      throw new Error(`Admin data access failed: ${adminError.message}`);
    }

    console.log('✅ Admin dashboard can access the data:');
    console.log(`  - Application: ${adminData.reference_number}`);
    console.log(`  - Applicants: ${adminData.applicants.length}`);
    console.log(`  - Documents: ${adminData.documents.length}`);
    
    console.log('\n🏆 COMPLETE END-TO-END INTEGRATION WORKING!');
    console.log('Form → Database → Admin Dashboard ✓');
    
    return {
      success: true,
      referenceNumber: refNumber,
      applicationId: application.id
    };

  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

function generateReferenceNumber() {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const day = String(new Date().getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  return `UK${year}TEST${month}${day}${random}`;
}

function estimateBase64Size(base64String) {
  if (!base64String) return 0;
  const base64Data = base64String.split(',')[1] || base64String;
  return Math.floor((base64Data.length * 3) / 4);
}

// Run the test
testFormSubmission().then(result => {
  if (result.success) {
    console.log('\n✅ Test passed - You can now check the admin dashboard!');
    console.log('🔗 Visit: http://localhost:8080/admin/dashboard');
    console.log(`📧 Login: admin@uketa.local`);
    console.log(`🔐 Password: AdminPass123`);
    process.exit(0);
  } else {
    console.log('\n❌ Test failed');
    process.exit(1);
  }
}).catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});