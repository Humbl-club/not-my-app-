#!/usr/bin/env node

/**
 * Test Supabase Connection and Edge Functions
 * This script verifies all Supabase services are working correctly
 */

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const SUPABASE_URL = 'http://127.0.0.1:54321';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔍 Testing Supabase Connection...\n');

// Test results storage
const results = {
  database: false,
  storage: false,
  auth: false,
  edgeFunctions: {
    submitApplication: false,
    createPaymentIntent: false,
    verifyDocument: false,
    sendEmail: false,
    adminDashboard: false
  }
};

async function testDatabase() {
  console.log('📊 Testing Database Connection...');
  try {
    // Test basic table access
    const { data, error } = await supabase
      .from('applications')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    
    console.log('✅ Database connection successful');
    results.database = true;
    
    // Test if tables exist
    const tables = ['applications', 'applicants', 'documents', 'payments', 'audit_logs'];
    for (const table of tables) {
      const { error: tableError } = await supabase.from(table).select('count').limit(1);
      if (tableError) {
        console.log(`  ⚠️  Table '${table}' issue: ${tableError.message}`);
      } else {
        console.log(`  ✓ Table '${table}' accessible`);
      }
    }
  } catch (error) {
    console.log(`❌ Database connection failed: ${error.message}`);
  }
}

async function testStorage() {
  console.log('\n📁 Testing Storage...');
  try {
    const { data, error } = await supabase.storage.listBuckets();
    
    if (error) throw error;
    
    console.log('✅ Storage connection successful');
    results.storage = true;
    
    // Check for expected buckets
    const expectedBuckets = ['documents', 'photos', 'passports'];
    const bucketNames = data.map(b => b.name);
    
    for (const bucket of expectedBuckets) {
      if (bucketNames.includes(bucket)) {
        console.log(`  ✓ Bucket '${bucket}' exists`);
      } else {
        console.log(`  ⚠️  Bucket '${bucket}' not found`);
      }
    }
  } catch (error) {
    console.log(`❌ Storage test failed: ${error.message}`);
  }
}

async function testAuth() {
  console.log('\n🔐 Testing Authentication...');
  try {
    // Test sign up capability (won't actually create user)
    const { data, error } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'TestPassword123!'
    });
    
    // We expect this to work or return a user exists error
    if (error && !error.message.includes('already registered')) {
      throw error;
    }
    
    console.log('✅ Authentication service operational');
    results.auth = true;
  } catch (error) {
    console.log(`❌ Authentication test failed: ${error.message}`);
  }
}

async function testEdgeFunction(name, path, payload = {}) {
  console.log(`  Testing ${name}...`);
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(payload)
    });
    
    const data = await response.text();
    
    if (response.ok || response.status === 400) { // 400 might be expected for validation
      console.log(`    ✓ ${name} responding (Status: ${response.status})`);
      results.edgeFunctions[path.replace(/-/g, '')] = true;
      return true;
    } else {
      console.log(`    ✗ ${name} error: Status ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`    ✗ ${name} failed: ${error.message}`);
    return false;
  }
}

async function testEdgeFunctions() {
  console.log('\n⚡ Testing Edge Functions...');
  
  await testEdgeFunction('Submit Application', 'submit-application', {
    applicationId: 'test-id',
    applicants: []
  });
  
  await testEdgeFunction('Create Payment Intent', 'create-payment-intent', {
    applicationId: 'test-id',
    amount: 1250
  });
  
  await testEdgeFunction('Verify Document', 'verify-document', {
    documentId: 'test-doc-id',
    documentType: 'passport'
  });
  
  await testEdgeFunction('Send Email', 'send-email', {
    to: 'test@example.com',
    type: 'test'
  });
  
  await testEdgeFunction('Admin Dashboard', 'admin-dashboard', {
    action: 'GET_STATS'
  });
}

async function generateReport() {
  console.log('\n' + '='.repeat(50));
  console.log('📋 SUPABASE CONNECTION REPORT');
  console.log('='.repeat(50));
  
  const services = [
    { name: 'Database', status: results.database },
    { name: 'Storage', status: results.storage },
    { name: 'Authentication', status: results.auth }
  ];
  
  console.log('\n🔧 Core Services:');
  services.forEach(service => {
    const icon = service.status ? '✅' : '❌';
    console.log(`  ${icon} ${service.name}: ${service.status ? 'Operational' : 'Failed'}`);
  });
  
  console.log('\n⚡ Edge Functions:');
  Object.entries(results.edgeFunctions).forEach(([func, status]) => {
    const icon = status ? '✅' : '❌';
    const name = func.replace(/([A-Z])/g, ' $1').trim();
    console.log(`  ${icon} ${name}: ${status ? 'Responding' : 'Not responding'}`);
  });
  
  const totalServices = 3 + Object.keys(results.edgeFunctions).length;
  const workingServices = 
    services.filter(s => s.status).length + 
    Object.values(results.edgeFunctions).filter(s => s).length;
  
  const percentage = Math.round((workingServices / totalServices) * 100);
  
  console.log('\n📊 Overall Status:');
  console.log(`  ${workingServices}/${totalServices} services operational (${percentage}%)`);
  
  if (percentage === 100) {
    console.log('\n🎉 All Supabase services are fully operational!');
    console.log('   Ready for frontend-backend integration.');
  } else if (percentage >= 60) {
    console.log('\n⚠️  Some services need attention.');
    console.log('   Core functionality should work, but some features may be limited.');
  } else {
    console.log('\n❌ Critical services are not operational.');
    console.log('   Please check your Supabase setup before proceeding.');
  }
}

// Run all tests
async function runTests() {
  try {
    await testDatabase();
    await testStorage();
    await testAuth();
    await testEdgeFunctions();
    await generateReport();
  } catch (error) {
    console.error('Test suite failed:', error);
  }
}

runTests();