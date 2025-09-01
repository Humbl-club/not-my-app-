#!/usr/bin/env node

/**
 * Setup Supabase Storage Buckets
 * Creates the required storage buckets for document uploads
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'http://127.0.0.1:54321';
const SUPABASE_SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

console.log('🗄️  Setting up Supabase Storage Buckets...\n');

async function createBucket(name, options = {}) {
  console.log(`Creating bucket: ${name}...`);
  
  const defaultOptions = {
    public: false,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
  };
  
  const bucketOptions = { ...defaultOptions, ...options };
  
  try {
    // First check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const exists = buckets?.some(b => b.name === name);
    
    if (exists) {
      console.log(`  ✓ Bucket '${name}' already exists`);
      return true;
    }
    
    // Create the bucket
    const { data, error } = await supabase.storage.createBucket(name, bucketOptions);
    
    if (error) {
      if (error.message.includes('already exists')) {
        console.log(`  ✓ Bucket '${name}' already exists`);
        return true;
      }
      throw error;
    }
    
    console.log(`  ✅ Bucket '${name}' created successfully`);
    return true;
  } catch (error) {
    console.log(`  ❌ Failed to create bucket '${name}': ${error.message}`);
    return false;
  }
}

async function setupBuckets() {
  const results = [];
  
  // Create main documents bucket
  results.push(await createBucket('documents', {
    public: false,
    fileSizeLimit: 10485760, // 10MB for documents
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
  }));
  
  // Create photos bucket for passport photos
  results.push(await createBucket('photos', {
    public: false,
    fileSizeLimit: 5242880, // 5MB for photos
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg']
  }));
  
  // Create passports bucket for passport scans
  results.push(await createBucket('passports', {
    public: false,
    fileSizeLimit: 10485760, // 10MB for passport scans
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
  }));
  
  // Create temporary uploads bucket
  results.push(await createBucket('temp-uploads', {
    public: false,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg']
  }));
  
  console.log('\n' + '='.repeat(50));
  const success = results.every(r => r);
  
  if (success) {
    console.log('✅ All storage buckets created successfully!');
  } else {
    console.log('⚠️  Some buckets failed to create. Check the errors above.');
  }
  
  // List all buckets
  console.log('\n📦 Current Storage Buckets:');
  const { data: buckets } = await supabase.storage.listBuckets();
  buckets?.forEach(bucket => {
    console.log(`  • ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
  });
}

setupBuckets().catch(console.error);