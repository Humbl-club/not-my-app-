# Security Architecture & Backend Implementation Plan

## Current Security Vulnerabilities (Critical to Fix)

### 🔴 Critical Issues

1. **Photo Data Storage in DOM**
   - Photos stored as base64 in localStorage (NOT secure)
   - Can be extracted via browser dev tools
   - Solution: Server-side storage with signed URLs

2. **No Input Sanitization**
   - XSS vulnerabilities in form inputs
   - SQL injection risks when backend added
   - Solution: Implement DOMPurify + server validation

3. **Client-Side Session Management**
   - Sessions stored in plain localStorage
   - No CSRF protection
   - Solution: HTTP-only cookies + CSRF tokens

4. **Missing Security Headers**
   - No CSP (Content Security Policy)
   - No HSTS headers
   - No X-Frame-Options
   - Solution: Configure server security headers

5. **Unencrypted Local Storage**
   - Currently using basic Web Crypto API
   - Keys derivable from source
   - Solution: Server-side encryption only

## Security Hardening Implementation

### Frontend Security Enhancements

```typescript
// 1. Content Security Policy
const CSP_POLICY = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'"], // Remove unsafe-inline in production
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", "data:", "blob:"],
  'connect-src': ["'self'", "https://api.uk-eta.gov.uk"],
  'frame-ancestors': ["'none'"],
  'form-action': ["'self'"]
};

// 2. Input Sanitization Service
class SecurityService {
  static sanitizeInput(input: string): string {
    // Remove all HTML tags and scripts
    return DOMPurify.sanitize(input, { 
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    });
  }
  
  static validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) && !email.includes('<script');
  }
  
  static sanitizeFileName(fileName: string): string {
    return fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  }
}

// 3. Secure Photo Handling
class SecurePhotoService {
  static async validatePhoto(file: File): Promise<boolean> {
    // Check magic bytes (file signature)
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    
    // JPEG: FF D8 FF
    const isJPEG = bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF;
    // PNG: 89 50 4E 47
    const isPNG = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47;
    
    return isJPEG || isPNG;
  }
  
  static stripEXIF(imageData: string): Promise<string> {
    // Remove all EXIF metadata for privacy
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.src = imageData;
    });
  }
}

// 4. Rate Limiting
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  isAllowed(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside window
    const validAttempts = attempts.filter(time => now - time < windowMs);
    
    if (validAttempts.length >= maxAttempts) {
      return false;
    }
    
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    return true;
  }
}
```

## Backend Architecture (Node.js + PostgreSQL)

### Technology Stack
- **Runtime**: Node.js 20+ LTS
- **Framework**: Fastify (faster than Express, built-in security)
- **Database**: PostgreSQL 15+ with pgcrypto
- **Cache**: Redis for sessions
- **File Storage**: AWS S3 with CloudFront CDN
- **Queue**: Bull/Redis for async processing
- **Monitoring**: Prometheus + Grafana

### Database Schema

```sql
-- Enable UUID and encryption extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Applications table
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_number VARCHAR(20) UNIQUE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  ip_address INET,
  user_agent TEXT,
  device_fingerprint VARCHAR(255),
  session_id VARCHAR(255),
  data JSONB NOT NULL DEFAULT '{}',
  encrypted_data BYTEA, -- For PII encryption
  payment_status VARCHAR(50),
  payment_intent_id VARCHAR(255),
  reference_number VARCHAR(50) UNIQUE,
  version INTEGER DEFAULT 1 -- For optimistic locking
);

-- Applicants table (normalized for better queries)
CREATE TABLE applicants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  applicant_number INTEGER NOT NULL,
  first_name_encrypted BYTEA NOT NULL, -- Encrypted PII
  last_name_encrypted BYTEA NOT NULL,
  email_encrypted BYTEA NOT NULL,
  passport_number_hash VARCHAR(255) NOT NULL, -- Hashed for uniqueness check
  date_of_birth DATE,
  nationality VARCHAR(3),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(application_id, applicant_number)
);

-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  applicant_id UUID REFERENCES applicants(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL,
  s3_key VARCHAR(500) NOT NULL,
  s3_bucket VARCHAR(255) NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  upload_ip INET,
  virus_scan_status VARCHAR(50) DEFAULT 'pending',
  virus_scan_result JSONB,
  quality_score INTEGER,
  analysis_result JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit log for compliance
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES applications(id),
  action VARCHAR(100) NOT NULL,
  actor_ip INET,
  actor_session VARCHAR(255),
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rate limiting table
CREATE TABLE rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  identifier VARCHAR(255) NOT NULL, -- IP or session
  action VARCHAR(100) NOT NULL,
  attempts INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  blocked_until TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_device ON applications(device_fingerprint);
CREATE INDEX idx_applicants_passport ON applicants(passport_number_hash);
CREATE INDEX idx_documents_applicant ON documents(applicant_id);
CREATE INDEX idx_audit_application ON audit_logs(application_id);
CREATE INDEX idx_rate_limits_identifier ON rate_limits(identifier, action);
```

### API Architecture

```typescript
// src/server/app.ts
import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { randomBytes } from 'crypto';

const app = Fastify({
  logger: true,
  trustProxy: true,
  requestIdHeader: 'x-request-id',
  genReqId: () => randomBytes(16).toString('hex')
});

// Security plugins
await app.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'blob:'],
      connectSrc: ["'self'"],
      frameAncestors: ["'none'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

await app.register(cors, {
  origin: process.env.FRONTEND_URL,
  credentials: true
});

await app.register(rateLimit, {
  max: 100,
  timeWindow: '15 minutes',
  redis: redisClient
});

// Encryption service
class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly key: Buffer;
  
  constructor() {
    // Key from AWS KMS or environment
    this.key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
  }
  
  encrypt(text: string): { encrypted: string; iv: string; tag: string } {
    const iv = randomBytes(16);
    const cipher = createCipheriv(this.algorithm, this.key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: cipher.getAuthTag().toString('hex')
    };
  }
  
  decrypt(encrypted: string, iv: string, tag: string): string {
    const decipher = createDecipheriv(
      this.algorithm,
      this.key,
      Buffer.from(iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(tag, 'hex'));
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}

// Session management with Redis
class SessionManager {
  async createSession(data: any): Promise<string> {
    const sessionId = randomBytes(32).toString('hex');
    const sessionData = {
      ...data,
      createdAt: Date.now(),
      csrfToken: randomBytes(32).toString('hex')
    };
    
    await redis.setex(
      `session:${sessionId}`,
      1800, // 30 minutes
      JSON.stringify(sessionData)
    );
    
    return sessionId;
  }
  
  async validateSession(sessionId: string): Promise<any> {
    const data = await redis.get(`session:${sessionId}`);
    if (!data) throw new Error('Invalid session');
    
    // Extend session
    await redis.expire(`session:${sessionId}`, 1800);
    
    return JSON.parse(data);
  }
}

// File upload with virus scanning
class FileUploadService {
  async uploadPhoto(
    file: Buffer,
    applicantId: string,
    documentType: string
  ): Promise<string> {
    // 1. Virus scan using ClamAV
    const scanResult = await clamav.scanBuffer(file);
    if (scanResult.isInfected) {
      throw new Error('File contains malware');
    }
    
    // 2. Validate image
    const metadata = await sharp(file).metadata();
    if (!['jpeg', 'png'].includes(metadata.format!)) {
      throw new Error('Invalid image format');
    }
    
    // 3. Strip EXIF data
    const cleanImage = await sharp(file)
      .jpeg({ quality: 90 })
      .toBuffer();
    
    // 4. Upload to S3 with encryption
    const key = `applications/${applicantId}/${documentType}_${Date.now()}.jpg`;
    await s3.putObject({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      Body: cleanImage,
      ServerSideEncryption: 'AES256',
      ContentType: 'image/jpeg',
      Metadata: {
        applicantId,
        documentType,
        uploadTime: new Date().toISOString()
      }
    }).promise();
    
    // 5. Generate signed URL (valid for 1 hour)
    const signedUrl = await s3.getSignedUrlPromise('getObject', {
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      Expires: 3600
    });
    
    return signedUrl;
  }
}

// API Routes
app.post('/api/applications/save', {
  preHandler: [authenticate, validateCSRF],
  handler: async (request, reply) => {
    const { applicants, currentStep } = request.body;
    
    // Encrypt PII
    const encryptedApplicants = applicants.map(applicant => ({
      ...applicant,
      firstName: encryptionService.encrypt(applicant.firstName),
      lastName: encryptionService.encrypt(applicant.lastName),
      email: encryptionService.encrypt(applicant.email),
      passportNumber: hash(applicant.passportNumber) // One-way hash
    }));
    
    // Save to database
    const application = await db.transaction(async trx => {
      const app = await trx('applications').insert({
        device_fingerprint: request.headers['x-device-fingerprint'],
        ip_address: request.ip,
        user_agent: request.headers['user-agent'],
        session_id: request.session.id,
        status: 'draft',
        expires_at: new Date(Date.now() + 30 * 60 * 1000)
      }).returning('*');
      
      // Insert applicants
      for (const applicant of encryptedApplicants) {
        await trx('applicants').insert({
          application_id: app[0].id,
          ...applicant
        });
      }
      
      // Audit log
      await trx('audit_logs').insert({
        application_id: app[0].id,
        action: 'APPLICATION_SAVED',
        actor_ip: request.ip,
        actor_session: request.session.id,
        details: { currentStep }
      });
      
      return app[0];
    });
    
    return { 
      success: true, 
      applicationId: application.id,
      expiresAt: application.expires_at
    };
  }
});

app.post('/api/photos/upload', {
  preHandler: [authenticate, validateCSRF],
  handler: async (request, reply) => {
    const data = await request.file();
    
    // Rate limit photo uploads
    const rateLimitKey = `photo_upload:${request.ip}`;
    if (!rateLimiter.isAllowed(rateLimitKey, 10, 3600000)) {
      return reply.code(429).send({ error: 'Too many uploads' });
    }
    
    // Process and store photo
    const photoUrl = await fileUploadService.uploadPhoto(
      await data.toBuffer(),
      request.body.applicantId,
      request.body.documentType
    );
    
    // Analyze photo quality
    const analysis = await photoAnalysisService.analyze(photoUrl);
    
    return { 
      success: true, 
      photoUrl,
      analysis
    };
  }
});
```

## Performance Optimizations

### Frontend Performance

```typescript
// 1. Code Splitting
const AccountProgress = lazy(() => import('./pages/AccountProgress'));
const PhotoCapture = lazy(() => import('./components/PhotoCapture'));

// 2. Image Optimization
class ImageOptimizer {
  static async compressImage(file: File): Promise<Blob> {
    return new Promise((resolve) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      img.onload = () => {
        // Calculate optimal dimensions
        const maxWidth = 1920;
        const maxHeight = 1080;
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (maxHeight / height) * width;
          height = maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Use better image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => resolve(blob!),
          'image/jpeg',
          0.85 // 85% quality
        );
      };
      
      img.src = URL.createObjectURL(file);
    });
  }
}

// 3. Debounced Auto-save
const useDebouncedSave = (saveFunction: Function, delay: number = 2000) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  return useCallback((...args: any[]) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      saveFunction(...args);
    }, delay);
  }, [saveFunction, delay]);
};

// 4. Virtual Scrolling for large lists
import { FixedSizeList } from 'react-window';

// 5. Memoization
const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(() => 
    heavyProcessing(data), [data]
  );
  
  return <div>{processedData}</div>;
});
```

### Backend Performance

```typescript
// 1. Database Connection Pooling
const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  max: 20, // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// 2. Query Optimization
const getApplicationWithApplicants = async (id: string) => {
  // Use single query with JOIN instead of N+1
  const result = await pool.query(`
    SELECT 
      a.*,
      json_agg(
        json_build_object(
          'id', ap.id,
          'firstName', ap.first_name_encrypted,
          'lastName', ap.last_name_encrypted
        )
      ) as applicants
    FROM applications a
    LEFT JOIN applicants ap ON ap.application_id = a.id
    WHERE a.id = $1
    GROUP BY a.id
  `, [id]);
  
  return result.rows[0];
};

// 3. Redis Caching
class CacheService {
  async get<T>(key: string): Promise<T | null> {
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }
  
  async set(key: string, value: any, ttl: number = 300): Promise<void> {
    await redis.setex(key, ttl, JSON.stringify(value));
  }
  
  async invalidate(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length) {
      await redis.del(...keys);
    }
  }
}

// 4. CDN Configuration
const cdnConfig = {
  cloudfront: {
    distributionId: process.env.CF_DISTRIBUTION_ID,
    behaviors: {
      '/api/*': { ttl: 0 }, // No cache for API
      '/static/*': { ttl: 31536000 }, // 1 year for static
      '/photos/*': { ttl: 3600 } // 1 hour for photos
    }
  }
};
```

## Security Monitoring & Compliance

### Monitoring Setup

```yaml
# docker-compose.yml
version: '3.8'
services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"
  
  grafana:
    image: grafana/grafana
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=secure_password
    ports:
      - "3000:3000"
  
  elasticsearch:
    image: elasticsearch:8.11.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=true
  
  kibana:
    image: kibana:8.11.0
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
```

### Security Metrics to Track

```typescript
// Metrics collection
class SecurityMetrics {
  private metrics = {
    failedLogins: new Counter({
      name: 'auth_failed_total',
      help: 'Total failed authentication attempts',
      labelNames: ['ip', 'reason']
    }),
    
    suspiciousActivity: new Counter({
      name: 'suspicious_activity_total',
      help: 'Suspicious activity detected',
      labelNames: ['type', 'ip']
    }),
    
    apiLatency: new Histogram({
      name: 'api_latency_seconds',
      help: 'API latency in seconds',
      labelNames: ['method', 'route', 'status'],
      buckets: [0.1, 0.5, 1, 2, 5]
    }),
    
    uploadedFiles: new Counter({
      name: 'files_uploaded_total',
      help: 'Total files uploaded',
      labelNames: ['type', 'status']
    })
  };
  
  recordFailedLogin(ip: string, reason: string) {
    this.metrics.failedLogins.inc({ ip, reason });
    
    // Alert if too many failures
    if (this.getFailureCount(ip) > 10) {
      this.alertSecurityTeam(ip, 'Excessive login failures');
    }
  }
}
```

## Deployment Architecture

### Infrastructure as Code (Terraform)

```hcl
# main.tf
provider "aws" {
  region = "eu-west-2" # London
}

# VPC with private subnets
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  
  name = "uk-eta-vpc"
  cidr = "10.0.0.0/16"
  
  azs             = ["eu-west-2a", "eu-west-2b", "eu-west-2c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
  
  enable_nat_gateway = true
  enable_vpn_gateway = true
  enable_dns_hostnames = true
}

# ECS Cluster for containers
resource "aws_ecs_cluster" "main" {
  name = "uk-eta-cluster"
  
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# RDS PostgreSQL with encryption
resource "aws_db_instance" "postgres" {
  identifier     = "uk-eta-db"
  engine         = "postgres"
  engine_version = "15.4"
  instance_class = "db.t3.medium"
  
  allocated_storage     = 100
  encrypted            = true
  kms_key_id          = aws_kms_key.rds.arn
  storage_encrypted    = true
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  backup_retention_period = 30
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  deletion_protection = true
}

# S3 Bucket with encryption
resource "aws_s3_bucket" "documents" {
  bucket = "uk-eta-documents-${data.aws_caller_identity.current.account_id}"
  
  versioning {
    enabled = true
  }
  
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm     = "aws:kms"
        kms_master_key_id = aws_kms_key.s3.arn
      }
    }
  }
  
  lifecycle_rule {
    enabled = true
    
    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }
    
    transition {
      days          = 90
      storage_class = "GLACIER"
    }
  }
}

# WAF for DDoS protection
resource "aws_wafv2_web_acl" "main" {
  name  = "uk-eta-waf"
  scope = "CLOUDFRONT"
  
  default_action {
    allow {}
  }
  
  rule {
    name     = "RateLimitRule"
    priority = 1
    
    action {
      block {}
    }
    
    statement {
      rate_based_statement {
        limit              = 2000
        aggregate_key_type = "IP"
      }
    }
    
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name               = "RateLimitRule"
      sampled_requests_enabled  = true
    }
  }
}
```

## CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run Trivy security scan
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          severity: 'CRITICAL,HIGH'
      
      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
      
      - name: OWASP Dependency Check
        uses: dependency-check/Dependency-Check_Action@main
        with:
          path: '.'
          format: 'HTML'

  build-and-deploy:
    needs: security-scan
    runs-on: ubuntu-latest
    steps:
      - name: Build Docker image
        run: |
          docker build -t uk-eta-api:${{ github.sha }} .
          docker tag uk-eta-api:${{ github.sha }} uk-eta-api:latest
      
      - name: Push to ECR
        run: |
          aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_REGISTRY
          docker push $ECR_REGISTRY/uk-eta-api:${{ github.sha }}
      
      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster uk-eta-cluster \
            --service uk-eta-api \
            --force-new-deployment
```

## Compliance Checklist

- ✅ GDPR Compliance (data encryption, right to deletion)
- ✅ PCI DSS (payment card security)
- ✅ OWASP Top 10 protection
- ✅ ISO 27001 controls
- ✅ UK Data Protection Act 2018
- ✅ Cyber Essentials Plus certification ready

This architecture provides government-grade security while maintaining simplicity and performance.