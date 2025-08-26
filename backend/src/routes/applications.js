import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import pg from 'pg';
import dotenv from 'dotenv';
import { secureStorage } from '../services/secureStorage.js';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

/**
 * Generate tracking code
 */
function generateTrackingCode() {
  const prefix = 'ETA';
  const random1 = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const random2 = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${random1}-${random2}`;
}

/**
 * Submit new application
 */
router.post('/submit', upload.array('documents', 10), async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Parse application data
    const applicationData = JSON.parse(req.body.applicationData);
    const applicationId = uuidv4();
    const trackingCode = generateTrackingCode();
    
    // Encrypt sensitive data
    const encryptedData = secureStorage.encryptData(applicationData);
    const encryptedEmail = secureStorage.encryptData(applicationData.applicants[0].email);
    const encryptedPhone = applicationData.applicants[0].phoneNumber 
      ? secureStorage.encryptData(applicationData.applicants[0].phoneNumber)
      : null;
    
    // Insert application
    await client.query(`
      INSERT INTO applications (
        id, tracking_code, email_encrypted, phone_encrypted, 
        application_data, status, payment_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      applicationId,
      trackingCode,
      JSON.stringify(encryptedEmail),
      encryptedPhone ? JSON.stringify(encryptedPhone) : null,
      JSON.stringify(encryptedData),
      'submitted',
      'pending'
    ]);
    
    // Store documents securely
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const documentData = await secureStorage.storeFile(
          file, 
          applicationId, 
          'passport_photo'
        );
        
        await client.query(`
          INSERT INTO documents (
            id, application_id, file_name_encrypted, 
            file_path_encrypted, encryption_key_encrypted,
            file_type, file_size, checksum
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
          uuidv4(),
          applicationId,
          JSON.stringify(documentData.encryptedMetadata.fileName),
          JSON.stringify(documentData.encryptedMetadata.filePath),
          JSON.stringify(documentData.encryptedMetadata.fileKey),
          documentData.mimeType,
          documentData.fileSize,
          documentData.checksum
        ]);
      }
    }
    
    // Log to audit trail
    await client.query(`
      INSERT INTO audit_log (id, action, entity_type, entity_id, performed_by, ip_address)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [
      uuidv4(),
      'application_submitted',
      'application',
      applicationId,
      applicationData.applicants[0].email,
      req.ip
    ]);
    
    await client.query('COMMIT');
    
    res.json({
      success: true,
      applicationId,
      trackingCode,
      message: 'Application submitted successfully'
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Application submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application'
    });
  } finally {
    client.release();
  }
});

/**
 * Get application status by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, tracking_code, status, status_message, payment_status, submitted_at FROM applications WHERE id = $1',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ error: 'Failed to fetch application' });
  }
});

export { router as applicationRouter };