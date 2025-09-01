import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

async function createBuckets() {
  console.log('🪣 Creating Storage Buckets...\n');

  const buckets = [
    {
      id: 'documents',
      name: 'documents',
      public: false,
      file_size_limit: 5242880,
      allowed_mime_types: ['image/jpeg', 'image/png', 'application/pdf']
    },
    {
      id: 'photos',
      name: 'photos', 
      public: false,
      file_size_limit: 5242880,
      allowed_mime_types: ['image/jpeg', 'image/png']
    },
    {
      id: 'passports',
      name: 'passports',
      public: false,
      file_size_limit: 5242880,
      allowed_mime_types: ['image/jpeg', 'image/png', 'application/pdf']
    }
  ];

  for (const bucket of buckets) {
    try {
      // First check if bucket exists
      const checkResponse = await fetch(`${SUPABASE_URL}/storage/v1/bucket/${bucket.id}`, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': SUPABASE_SERVICE_ROLE_KEY
        }
      });

      if (checkResponse.status === 404) {
        // Create bucket
        const response = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bucket)
        });

        if (response.ok) {
          console.log(`✅ Created bucket: ${bucket.name}`);
        } else {
          const error = await response.text();
          console.log(`❌ Failed to create bucket ${bucket.name}: ${error}`);
        }
      } else if (checkResponse.ok) {
        console.log(`ℹ️  Bucket already exists: ${bucket.name}`);
        
        // Update bucket settings
        const updateResponse = await fetch(`${SUPABASE_URL}/storage/v1/bucket/${bucket.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            public: bucket.public,
            file_size_limit: bucket.file_size_limit,
            allowed_mime_types: bucket.allowed_mime_types
          })
        });
        
        if (updateResponse.ok) {
          console.log(`✅ Updated bucket settings: ${bucket.name}`);
        }
      }
    } catch (error) {
      console.log(`❌ Error with bucket ${bucket.name}:`, error.message);
    }
  }

  // List all buckets
  console.log('\n📋 Verifying Buckets...');
  try {
    const response = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY
      }
    });
    
    if (response.ok) {
      const buckets = await response.json();
      console.log('✅ Storage buckets available:', buckets.map(b => b.name).join(', '));
    }
  } catch (error) {
    console.log('❌ Failed to list buckets:', error.message);
  }
}

createBuckets();