import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pg from 'pg';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const router = express.Router();

/**
 * Admin authentication middleware
 */
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await pool.query(
      'SELECT id, email FROM admin_users WHERE id = $1 AND is_active = true',
      [decoded.adminId]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.admin = result.rows[0];
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token verification failed' });
  }
};

/**
 * Admin login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }
    
    // Find admin user
    const result = await pool.query(
      'SELECT id, email, password_hash FROM admin_users WHERE email = $1 AND is_active = true',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }
    
    const admin = result.rows[0];
    
    // Verify password
    const passwordValid = await bcrypt.compare(password, admin.password_hash);
    
    if (!passwordValid) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { adminId: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    
    // Update last login
    await pool.query(
      'UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [admin.id]
    );
    
    // Log login
    await pool.query(`
      INSERT INTO audit_log (id, action, entity_type, performed_by, ip_address)
      VALUES ($1, $2, $3, $4, $5)
    `, [
      uuidv4(),
      'admin_login',
      'admin_session',
      admin.email,
      req.ip
    ]);
    
    res.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed'
    });
  }
});

/**
 * List all applications (with pagination)
 */
router.get('/applications', authenticateAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const search = req.query.search;
    
    let query = `
      SELECT 
        id, tracking_code, status, status_message, 
        payment_status, amount_paid, submitted_at, updated_at
      FROM applications 
    `;
    
    const conditions = [];
    const params = [];
    
    if (status && status !== 'all') {
      conditions.push(`status = $${params.length + 1}`);
      params.push(status);
    }
    
    if (search) {
      conditions.push(`tracking_code ILIKE $${params.length + 1}`);
      params.push(`%${search}%`);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ` ORDER BY submitted_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, (page - 1) * limit);
    
    const result = await pool.query(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM applications';
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }
    const countResult = await pool.query(countQuery, params.slice(0, -2));
    
    res.json({
      applications: result.rows,
      pagination: {
        page,
        limit,
        total: parseInt(countResult.rows[0].count),
        pages: Math.ceil(countResult.rows[0].count / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      error: 'Failed to fetch applications'
    });
  }
});

/**
 * Get single application details
 */
router.get('/applications/:id', authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, tracking_code, email_encrypted, phone_encrypted,
        application_data, status, status_message, payment_status,
        amount_paid, admin_notes, submitted_at, updated_at
      FROM applications 
      WHERE id = $1
    `, [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    const application = result.rows[0];
    
    // Get documents
    const docsResult = await pool.query(
      'SELECT id, file_type, file_size, uploaded_at FROM documents WHERE application_id = $1',
      [req.params.id]
    );
    
    // Get status history
    const historyResult = await pool.query(`
      SELECT old_status, new_status, changed_by, change_reason, changed_at
      FROM status_history 
      WHERE application_id = $1 
      ORDER BY changed_at DESC
    `, [req.params.id]);
    
    res.json({
      ...application,
      documents: docsResult.rows,
      statusHistory: historyResult.rows
    });
    
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({
      error: 'Failed to fetch application'
    });
  }
});

/**
 * Update application status
 */
router.put('/applications/:id', authenticateAdmin, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { status, statusMessage, adminNotes } = req.body;
    const applicationId = req.params.id;
    
    // Get current status
    const currentResult = await client.query(
      'SELECT status FROM applications WHERE id = $1',
      [applicationId]
    );
    
    if (currentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    const oldStatus = currentResult.rows[0].status;
    
    // Update application
    await client.query(`
      UPDATE applications 
      SET status = $1, status_message = $2, admin_notes = $3, 
          reviewed_by = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
    `, [status, statusMessage, adminNotes, req.admin.email, applicationId]);
    
    // Log status change
    await client.query(`
      INSERT INTO status_history (id, application_id, old_status, new_status, changed_by, change_reason)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [
      uuidv4(),
      applicationId,
      oldStatus,
      status,
      req.admin.email,
      statusMessage
    ]);
    
    // Audit log
    await client.query(`
      INSERT INTO audit_log (id, action, entity_type, entity_id, performed_by, ip_address)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [
      uuidv4(),
      'application_status_updated',
      'application',
      applicationId,
      req.admin.email,
      req.ip
    ]);
    
    await client.query('COMMIT');
    
    res.json({
      success: true,
      message: 'Application updated successfully'
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating application:', error);
    res.status(500).json({
      error: 'Failed to update application'
    });
  } finally {
    client.release();
  }
});

/**
 * Dashboard statistics
 */
router.get('/dashboard/stats', authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'submitted') as pending,
        COUNT(*) FILTER (WHERE status = 'in_review') as in_review,
        COUNT(*) FILTER (WHERE status = 'approved') as approved,
        COUNT(*) FILTER (WHERE status = 'denied') as denied,
        COUNT(*) FILTER (WHERE status = 'need_info') as need_info,
        COUNT(*) FILTER (WHERE submitted_at >= CURRENT_DATE) as today,
        COUNT(*) as total,
        COALESCE(SUM(amount_paid), 0) as total_revenue
      FROM applications
    `);
    
    res.json(result.rows[0]);
    
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      error: 'Failed to fetch statistics'
    });
  }
});

export { router as adminRouter };