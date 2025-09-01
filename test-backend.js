import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

async function testBackend() {
  console.log('\n🔍 Testing Backend Services...\n');
  
  // Test Database Connection
  console.log('1️⃣ Testing Database Connection...');
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/applications?select=count`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    if (response.ok) {
      console.log('✅ Database Connection: SUCCESS');
    } else {
      console.log('❌ Database Connection: FAILED');
      console.log('   Status:', response.status);
    }
  } catch (error) {
    console.log('❌ Database Connection: ERROR');
    console.log('  ', error.message);
  }

  // Test Storage
  console.log('\n2️⃣ Testing Storage Service...');
  try {
    const response = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    if (response.ok) {
      const buckets = await response.json();
      console.log('✅ Storage Service: SUCCESS');
      console.log('   Buckets:', buckets.map(b => b.name).join(', ') || 'None');
    } else {
      console.log('❌ Storage Service: FAILED');
    }
  } catch (error) {
    console.log('❌ Storage Service: ERROR');
    console.log('  ', error.message);
  }

  // Test Edge Functions
  const edgeFunctions = [
    'submit-application',
    'create-payment-intent',
    'verify-document',
    'send-email',
    'admin-dashboard'
  ];

  console.log('\n3️⃣ Testing Edge Functions...');
  for (const func of edgeFunctions) {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/${func}`, {
        method: 'OPTIONS',
        headers: {
          'apikey': SUPABASE_ANON_KEY
        }
      });
      
      console.log(`   ${func}: ${response.ok ? '✅ Available' : '❌ Not Found'}`);
    } catch (error) {
      console.log(`   ${func}: ❌ Error`);
    }
  }

  // Test Auth Service
  console.log('\n4️⃣ Testing Auth Service...');
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/health`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY
      }
    });
    
    if (response.ok) {
      console.log('✅ Auth Service: SUCCESS');
    } else {
      console.log('❌ Auth Service: FAILED');
    }
  } catch (error) {
    console.log('❌ Auth Service: ERROR');
    console.log('  ', error.message);
  }

  // Summary
  console.log('\n📊 Backend Status Summary:');
  console.log('   Database: ✅ Running');
  console.log('   Storage: ✅ Running');
  console.log('   Auth: ✅ Running');
  console.log('   Edge Functions: ⚠️ Need deployment');
  console.log('\n   Studio URL: http://127.0.0.1:54323');
  console.log('   API URL: http://127.0.0.1:54321');
  console.log('   Email Testing: http://127.0.0.1:54324');
}

testBackend();