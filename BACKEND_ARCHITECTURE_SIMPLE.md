# Simple & Secure UK ETA Backend Architecture

## Overview
A practical, secure backend that balances simplicity with government-grade security for handling sensitive visa applications.

## Core Components

### 1. Database (PostgreSQL)
```sql
-- Simple schema with encryption
applications (
  id UUID PRIMARY KEY,
  tracking_code VARCHAR(12) UNIQUE, -- ETA-XXXX-XXXX
  email_encrypted TEXT,
  phone_encrypted TEXT,
  application_data JSONB, -- Encrypted JSON
  status VARCHAR(50), -- submitted, in_review, approved, denied, need_info
  status_message TEXT,
  payment_status VARCHAR(50),
  payment_intent_id VARCHAR(255),
  amount_paid DECIMAL(10,2),
  submitted_at TIMESTAMP,
  updated_at TIMESTAMP,
  admin_notes TEXT
)

documents (
  id UUID PRIMARY KEY,
  application_id UUID REFERENCES applications(id),
  file_name VARCHAR(255),
  file_path TEXT, -- Encrypted path
  file_type VARCHAR(50),
  uploaded_at TIMESTAMP
)

admin_users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password_hash TEXT,
  created_at TIMESTAMP
)

status_history (
  id UUID PRIMARY KEY,
  application_id UUID REFERENCES applications(id),
  old_status VARCHAR(50),
  new_status VARCHAR(50),
  changed_by VARCHAR(255),
  changed_at TIMESTAMP,
  notes TEXT
)
```

### 2. Security Measures

#### Data Encryption
- **At Rest**: PostgreSQL transparent data encryption
- **Application Layer**: AES-256-GCM for sensitive fields
- **File Storage**: Each file encrypted with unique key
- **Keys**: Stored in environment variables, rotated monthly

#### Access Control
- **Admin**: JWT authentication with refresh tokens
- **Users**: Tracking code + email verification
- **Rate Limiting**: 10 requests/minute per IP
- **CORS**: Whitelist only your domain

### 3. File Storage Security
```javascript
// Encrypted file storage approach
1. User uploads photo
2. Generate unique encryption key for file
3. Encrypt file using AES-256-GCM
4. Store encrypted file with UUID name
5. Save encryption key in database (also encrypted)
6. Original filename never exposed
7. Files served only through authenticated endpoints
```

### 4. Simple Status Flow
```
SUBMITTED → IN_REVIEW → APPROVED/DENIED/NEED_INFO
    ↓           ↓              ↓
  Email      Email          Email
  Sent       Update        Result
```

## Tech Stack (Simple & Proven)

### Backend
- **Node.js + Express** - Simple, well-documented
- **PostgreSQL** - Secure, reliable database
- **Bcrypt** - Password hashing for admin
- **JSON Web Tokens** - Admin authentication
- **Multer** - File uploads with validation
- **Node-Cron** - Scheduled tasks (cleanup, backups)
- **Stripe** - Payment processing

### Security Libraries
- **Helmet** - Security headers
- **Express-Rate-Limit** - DDoS protection
- **Express-Validator** - Input validation
- **DOMPurify** - XSS prevention
- **Crypto** - Built-in Node encryption

## Features Implementation

### 1. User Tracking Portal
```
/track/{tracking-code}
- Enter tracking code
- Verify with email
- See current status
- Download receipt
- No personal data shown publicly
```

### 2. Admin Dashboard
```
/admin
- Login with 2FA
- View all applications (paginated)
- Search/filter capabilities
- Click to view full details
- Update status with one click
- Add notes
- Export to CSV
- Statistics overview
```

### 3. Payment Flow
```
1. User fills application
2. Calculate fee (£42 per person)
3. Redirect to Stripe Checkout
4. Stripe handles payment securely
5. Webhook confirms payment
6. Application marked as paid
7. Generate tracking code
```

### 4. Document Security
```javascript
// How documents are secured:
class SecureDocumentService {
  async storeDocument(file, applicationId) {
    // 1. Validate file (type, size, content)
    await this.validateFile(file);
    
    // 2. Generate unique encryption key
    const encryptionKey = crypto.randomBytes(32);
    
    // 3. Encrypt file
    const encryptedData = await this.encryptFile(file.buffer, encryptionKey);
    
    // 4. Store with UUID name (no original filename)
    const storagePath = `/secure-storage/${uuid()}.enc`;
    await fs.writeFile(storagePath, encryptedData);
    
    // 5. Save metadata (encrypted)
    await db.saveDocument({
      applicationId,
      encryptedPath: this.encrypt(storagePath),
      encryptedKey: this.encrypt(encryptionKey),
      checksum: this.generateChecksum(file.buffer)
    });
  }
  
  async retrieveDocument(documentId, adminAuth) {
    // Only admins can retrieve
    if (!adminAuth.isValid) throw new Error('Unauthorized');
    
    // Get encrypted document
    const doc = await db.getDocument(documentId);
    
    // Decrypt path and key
    const path = this.decrypt(doc.encryptedPath);
    const key = this.decrypt(doc.encryptedKey);
    
    // Read and decrypt file
    const encryptedData = await fs.readFile(path);
    const decryptedData = await this.decryptFile(encryptedData, key);
    
    // Verify checksum
    if (!this.verifyChecksum(decryptedData, doc.checksum)) {
      throw new Error('File integrity check failed');
    }
    
    return decryptedData;
  }
}
```

## Deployment (Simple & Secure)

### Option 1: DigitalOcean (Recommended for Simplicity)
- $48/month for Droplet + Managed Database
- One-click PostgreSQL setup
- Automatic backups
- Built-in firewall
- SSL included

### Option 2: Railway.app (Even Simpler)
- $20/month estimated
- Deploy with `railway up`
- PostgreSQL included
- Automatic SSL
- Zero configuration

### Option 3: VPS with Docker
```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: .
    environment:
      - DATABASE_URL=postgresql://...
      - ENCRYPTION_KEY=${ENCRYPTION_KEY}
      - STRIPE_SECRET=${STRIPE_SECRET}
    ports:
      - "3001:3001"
  
  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=uk_eta
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./backup:/backup
  
  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
```

## Security Checklist

### Data Protection
✅ All PII encrypted with AES-256-GCM
✅ Database encryption at rest
✅ Unique encryption keys per document
✅ Keys stored separately from data
✅ Automatic key rotation (monthly)

### Access Control
✅ Admin requires strong password + 2FA
✅ Users only access via tracking code + email
✅ Session timeout after 30 minutes
✅ Rate limiting on all endpoints
✅ IP-based blocking for suspicious activity

### Infrastructure
✅ HTTPS only (no HTTP)
✅ Security headers (HSTS, CSP, etc.)
✅ Regular security updates
✅ Daily encrypted backups
✅ Firewall with whitelist

### Compliance
✅ GDPR compliant data handling
✅ Data retention policies
✅ Audit logging for all actions
✅ Terms of Service and Privacy Policy
✅ Cookie consent (minimal cookies)

## Cost Breakdown

### Monthly Costs (Estimated)
- **Hosting**: $20-50 (DigitalOcean/Railway)
- **Database**: Included or $15 for managed
- **Stripe**: 2.9% + 30¢ per transaction
- **Backups**: $5 (S3 or similar)
- **SSL**: Free (Let's Encrypt)
- **Domain**: $1/month

**Total: ~$40-70/month**

## Why This Architecture?

### Simple
- Standard Node.js/Express (not exotic frameworks)
- One database, one backend
- Clear file structure
- Minimal dependencies

### Secure
- Military-grade encryption for files
- No direct file access
- Encrypted database fields
- Secure key management
- Regular security updates

### Practical
- Can be deployed in 1 day
- Managed services reduce maintenance
- Automatic backups
- Easy to scale if needed
- Cost-effective

This gives you everything you need without unnecessary complexity!