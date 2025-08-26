/**
 * SIMPLE BACKEND FOR UK ETA FORM COLLECTION
 * 
 * This backend does exactly what you need:
 * 1. Receives form submissions
 * 2. Stores photos locally
 * 3. Emails you the complete application
 * 4. Sends confirmation to applicant
 */

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Configuration - CHANGE THESE
const CONFIG = {
  YOUR_EMAIL: 'your-email@gmail.com', // Where to send applications
  EMAIL_PASSWORD: 'your-app-password', // Gmail app password
  PORT: 3001
};

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// File upload setup
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'applications', req.body.applicationId || Date.now().toString());
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Email setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: CONFIG.YOUR_EMAIL,
    pass: CONFIG.EMAIL_PASSWORD
  }
});

// Main endpoint - receives complete application
app.post('/api/submit-application', upload.array('documents', 10), async (req, res) => {
  try {
    const { formData, applicationId } = req.body;
    const parsedData = JSON.parse(formData);
    
    // Save application data as JSON
    const appDir = path.join(__dirname, 'applications', applicationId);
    await fs.writeFile(
      path.join(appDir, 'application.json'),
      JSON.stringify(parsedData, null, 2)
    );
    
    // Format email content
    const emailHtml = formatApplicationEmail(parsedData, req.files);
    
    // Send email to you with all the data
    await transporter.sendMail({
      from: CONFIG.YOUR_EMAIL,
      to: CONFIG.YOUR_EMAIL,
      subject: `New UK ETA Application - ${parsedData.applicants[0].firstName} ${parsedData.applicants[0].lastName}`,
      html: emailHtml,
      attachments: req.files?.map(file => ({
        filename: file.originalname,
        path: file.path
      })) || []
    });
    
    // Send confirmation to applicant
    if (parsedData.applicants[0].email) {
      await transporter.sendMail({
        from: CONFIG.YOUR_EMAIL,
        to: parsedData.applicants[0].email,
        subject: 'UK ETA Application Received',
        html: `
          <h2>Application Received</h2>
          <p>Dear ${parsedData.applicants[0].firstName},</p>
          <p>Your UK ETA application has been received and will be processed manually.</p>
          <p>Application ID: ${applicationId}</p>
          <p>You will receive your visa decision via email within 3-5 business days.</p>
          <p>Thank you for your application.</p>
        `
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Application submitted successfully',
      applicationId 
    });
    
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit application' 
    });
  }
});

// Simple endpoint to check if backend is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Format application for email
function formatApplicationEmail(data, files) {
  let html = `
    <h2>New UK ETA Application</h2>
    <p><strong>Application ID:</strong> ${data.applicationId}</p>
    <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
    <hr>
  `;
  
  // Format each applicant
  data.applicants?.forEach((applicant, index) => {
    html += `
      <h3>Applicant ${index + 1}</h3>
      <table border="1" cellpadding="5" style="border-collapse: collapse;">
        <tr><td><strong>Name:</strong></td><td>${applicant.firstName} ${applicant.secondNames || ''} ${applicant.lastName}</td></tr>
        <tr><td><strong>Date of Birth:</strong></td><td>${applicant.dateOfBirth}</td></tr>
        <tr><td><strong>Nationality:</strong></td><td>${applicant.nationality}</td></tr>
        <tr><td><strong>Passport Number:</strong></td><td>${applicant.passportNumber}</td></tr>
        <tr><td><strong>Email:</strong></td><td>${applicant.email}</td></tr>
        <tr><td><strong>Phone:</strong></td><td>${applicant.phoneNumber || 'Not provided'}</td></tr>
        <tr><td><strong>Address:</strong></td><td>
          ${applicant.address?.line1}<br>
          ${applicant.address?.line2 ? applicant.address.line2 + '<br>' : ''}
          ${applicant.address?.city}, ${applicant.address?.state}<br>
          ${applicant.address?.postalCode}<br>
          ${applicant.address?.country}
        </td></tr>
        <tr><td><strong>Job Title:</strong></td><td>${applicant.jobTitle?.label || 'Not provided'}</td></tr>
        <tr><td><strong>Criminal Convictions:</strong></td><td>${applicant.hasCriminalConvictions}</td></tr>
        <tr><td><strong>War Crimes:</strong></td><td>${applicant.hasWarCrimesConvictions}</td></tr>
      </table>
      <br>
    `;
  });
  
  // List attached files
  if (files && files.length > 0) {
    html += `
      <h3>Attached Documents</h3>
      <ul>
        ${files.map(f => `<li>${f.originalname} (${(f.size / 1024).toFixed(2)} KB)</li>`).join('')}
      </ul>
    `;
  }
  
  return html;
}

// Start server
app.listen(CONFIG.PORT, () => {
  console.log(`✅ Simple backend running on http://localhost:${CONFIG.PORT}`);
  console.log(`📧 Applications will be emailed to: ${CONFIG.YOUR_EMAIL}`);
  console.log(`📁 Applications stored in: ${path.join(__dirname, 'applications')}`);
});