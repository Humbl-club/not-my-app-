import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

console.log('🔧 Testing Supabase Connection...')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'Not found')

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    // Test database connection with a simple query
    console.log('\n📊 Testing database connection...')
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(5)
    
    if (error) {
      console.error('❌ Database query failed:', error.message)
      return false
    }

    console.log('✅ Database connection successful!')
    console.log('Found tables:', data?.map(t => t.table_name) || [])
    
    // Test authentication service
    console.log('\n🔐 Testing authentication service...')
    const { data: authData, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.error('❌ Auth service failed:', authError.message)
      return false
    }
    
    console.log('✅ Authentication service working!')
    
    // Test storage service
    console.log('\n📁 Testing storage service...')
    const { data: buckets, error: storageError } = await supabase
      .storage
      .listBuckets()
    
    if (storageError) {
      console.error('❌ Storage service failed:', storageError.message)
      return false
    }
    
    console.log('✅ Storage service working!')
    console.log('Available buckets:', buckets?.map(b => b.name) || [])
    
    return true
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
    return false
  }
}

// Run the test
testConnection().then(success => {
  if (success) {
    console.log('\n🎉 All Supabase services are working correctly!')
    console.log('\n📋 Connection Details:')
    console.log('  • API URL:', supabaseUrl)
    console.log('  • Studio URL: http://127.0.0.1:54323')
    console.log('  • Database URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres')
    console.log('\n💡 You can now use Supabase in your application!')
  } else {
    console.log('\n❌ Some services failed. Check the errors above.')
    process.exit(1)
  }
})
