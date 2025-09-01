// Create sample documents for UK ETA Gateway admin dashboard
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
const supabase = createClient(supabaseUrl, supabaseKey);

// Sample base64 image data (tiny 1x1 pixel JPEG for demo)
const sampleImageData = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';

async function createSampleDocuments() {
  console.log('📁 Creating sample document files...\n');

  try {
    // Get applications and their applicants
    const { data: applications, error: appsError } = await supabase
      .from('applications')
      .select(`
        id,
        reference_number,
        applicants (id, first_name, last_name)
      `)
      .in('user_email', ['john.smith@email.com', 'family.jones@email.com', 'sarah.wilson@email.com', 'invalid.photo@email.com']);

    if (appsError) {
      throw new Error(`Failed to fetch applications: ${appsError.message}`);
    }

    console.log(`Found ${applications.length} applications to add documents for`);

    const documentsToCreate = [];

    // Create documents for each applicant
    for (const app of applications) {
      if (app.applicants && app.applicants.length > 0) {
        for (const applicant of app.applicants) {
          // Create passport photo document
          documentsToCreate.push({
            application_id: app.id,
            applicant_id: applicant.id,
            document_type: 'passport',
            file_name: `${app.reference_number}_${applicant.first_name}_${applicant.last_name}_passport.jpg`,
            file_path: `/documents/${app.id}/${applicant.id}/passport.jpg`,
            file_size: Math.floor(Math.random() * 500000) + 100000, // Random size between 100KB-600KB
            mime_type: 'image/jpeg',
            verification_status: 'verified',
            metadata: {
              original_name: `passport_${applicant.first_name.toLowerCase()}.jpg`,
              upload_date: new Date().toISOString(),
              image_data: sampleImageData,
              quality_score: Math.floor(Math.random() * 30) + 70, // 70-100 quality
              analysis: {
                face_detected: true,
                resolution: '800x600',
                background_check: 'passed'
              }
            }
          });

          // Create personal photo document  
          documentsToCreate.push({
            application_id: app.id,
            applicant_id: applicant.id,
            document_type: 'photo',
            file_name: `${app.reference_number}_${applicant.first_name}_${applicant.last_name}_personal.jpg`,
            file_path: `/documents/${app.id}/${applicant.id}/personal.jpg`,
            file_size: Math.floor(Math.random() * 500000) + 100000, // Random size between 100KB-600KB
            mime_type: 'image/jpeg',
            verification_status: 'verified',
            metadata: {
              original_name: `photo_${applicant.first_name.toLowerCase()}.jpg`,
              upload_date: new Date().toISOString(),
              image_data: sampleImageData,
              quality_score: Math.floor(Math.random() * 30) + 70, // 70-100 quality
              analysis: {
                face_detected: true,
                resolution: '800x600',
                background_check: 'passed'
              }
            }
          });
        }
      }
    }

    console.log(`Creating ${documentsToCreate.length} document records...`);

    // First, clear existing sample documents
    await supabase
      .from('documents')
      .delete()
      .like('file_name', '%@email.com%');

    // Create the documents
    const { data: createdDocs, error: docsError } = await supabase
      .from('documents')
      .insert(documentsToCreate)
      .select();

    if (docsError) {
      throw new Error(`Failed to create documents: ${docsError.message}`);
    }

    console.log(`✅ Created ${createdDocs.length} document records`);

    console.log('\n🎉 Sample documents creation completed!');
    console.log('\nDocument Summary:');
    const groupedDocs = {};
    createdDocs.forEach(doc => {
      const key = doc.application_id;
      if (!groupedDocs[key]) groupedDocs[key] = 0;
      groupedDocs[key]++;
    });

    Object.entries(groupedDocs).forEach(([appId, count]) => {
      const app = applications.find(a => a.id === appId);
      console.log(`• ${app?.reference_number}: ${count} documents`);
    });

    console.log('\nDocuments are now ready for admin viewing and export!');

  } catch (error) {
    console.error('❌ Error creating sample documents:', error.message);
    process.exit(1);
  }
}

// Run the script
createSampleDocuments().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});