import bcrypt from 'bcrypt';
import pg from 'pg';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function createAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@uketa.local';
    const password = process.env.ADMIN_PASSWORD || 'AdminPass123!';
    
    if (password.length < 8) {
      console.error('❌ Admin password must be at least 8 characters');
      process.exit(1);
    }
    
    console.log('🔐 Creating admin user...');
    console.log(`📧 Email: ${email}`);
    
    const passwordHash = await bcrypt.hash(password, 12);
    
    await pool.query(`
      INSERT INTO admin_users (id, email, password_hash, role, is_active)
      VALUES ($1, $2, $3, 'admin', true)
      ON CONFLICT (email) DO UPDATE
      SET password_hash = $3, updated_at = CURRENT_TIMESTAMP
    `, [uuidv4(), email, passwordHash]);
    
    console.log('✅ Admin user created successfully');
    console.log('');
    console.log('🔑 Admin Login Credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log('');
    console.log('🌐 Access admin panel at: http://localhost:8080/admin');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create admin:', error.message);
    process.exit(1);
  }
}

createAdmin();