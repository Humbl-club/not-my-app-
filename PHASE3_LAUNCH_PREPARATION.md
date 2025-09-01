# 🚀 PHASE 3: FINAL LAUNCH PREPARATION
## Production Deployment & Go-Live Strategy

**Duration:** 3-4 days  
**Priority:** MEDIUM-HIGH  
**Prerequisites:** Phases 1 & 2 complete with all quality gates passed  

---

## 📋 OVERVIEW

Phase 3 focuses on final production preparation, operational readiness, and successful go-live execution. This phase includes monitoring setup, documentation completion, support infrastructure, and staged deployment approach.

---

## 🎯 DAY 12-13: OPERATIONAL INFRASTRUCTURE

### **Task 1: Comprehensive Monitoring & Alerting**

#### **Production Monitoring Stack**
```bash
# Install monitoring dependencies
npm install @sentry/react @sentry/vite-plugin
npm install posthog-js

# Create monitoring configuration
cat > src/lib/monitoring.ts << 'EOF'
import * as Sentry from '@sentry/react';
import posthog from 'posthog-js';

// Sentry for error tracking
Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.VITE_ENVIRONMENT,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay()
  ],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

// PostHog for analytics
if (process.env.VITE_ENVIRONMENT === 'production') {
  posthog.init(process.env.VITE_POSTHOG_KEY!, {
    api_host: 'https://app.posthog.com',
    capture_pageview: true,
    capture_pageleave: true
  });
}

export { Sentry, posthog };
EOF
```

#### **System Health Dashboard**
Create `src/components/admin/SystemHealthDashboard.tsx`:
```typescript
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle, Activity, Database, Server, Users } from 'lucide-react';

interface SystemMetrics {
  uptime: number;
  responseTime: number;
  errorRate: number;
  activeUsers: number;
  databaseConnections: number;
  queueLength: number;
}

export const SystemHealthDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [status, setStatus] = useState<'healthy' | 'warning' | 'critical'>('healthy');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/admin/system-health');
        const data = await response.json();
        setMetrics(data);
        
        // Determine system status
        if (data.errorRate > 5 || data.responseTime > 1000) {
          setStatus('critical');
        } else if (data.errorRate > 1 || data.responseTime > 500) {
          setStatus('warning');
        } else {
          setStatus('healthy');
        }
      } catch (error) {
        setStatus('critical');
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'critical': return <XCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'healthy': return <Badge variant="default" className="bg-green-100 text-green-800">Healthy</Badge>;
      case 'warning': return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'critical': return <Badge variant="destructive">Critical</Badge>;
    }
  };

  if (!metrics) {
    return <div className="p-6">Loading system metrics...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <h1 className="text-2xl font-bold">System Health</h1>
          {getStatusBadge()}
        </div>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(metrics.uptime * 100).toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.responseTime}ms</div>
            <p className="text-xs text-muted-foreground">95th percentile</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.errorRate.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Current sessions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Database Performance</CardTitle>
            <CardDescription>Connection pool and query performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Active Connections</span>
                <span className="text-sm font-medium">{metrics.databaseConnections}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(metrics.databaseConnections / 100) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Processing Queue</CardTitle>
            <CardDescription>Background job processing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Pending Jobs</span>
                <span className="text-sm font-medium">{metrics.queueLength}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Average processing time: 1.2s
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
```

#### **Alerting Configuration**
Create `scripts/setup-alerts.js`:
```javascript
// Alert configuration for various monitoring services
const alertConfig = {
  // Sentry alerts
  sentry: {
    errorThreshold: {
      rate: 10, // errors per minute
      window: 300 // 5 minutes
    },
    performanceThreshold: {
      p95ResponseTime: 1000, // milliseconds
      window: 600 // 10 minutes
    }
  },

  // Uptime monitoring
  uptime: {
    checkInterval: 60, // seconds
    alertAfter: 2, // failed checks
    locations: ['US', 'EU', 'Asia']
  },

  // Custom business metrics
  business: {
    applicationCompletionRate: {
      minimum: 0.85, // 85%
      window: 3600 // 1 hour
    },
    paymentSuccessRate: {
      minimum: 0.95, // 95%
      window: 1800 // 30 minutes
    }
  }
};

// Webhook for Slack notifications
const sendSlackAlert = async (message, severity = 'warning') => {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) return;

  const colors = {
    info: '#36a64f',
    warning: '#ff9500',
    critical: '#ff0000'
  };

  await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      attachments: [{
        color: colors[severity],
        title: `UK ETA Gateway Alert - ${severity.toUpperCase()}`,
        text: message,
        ts: Math.floor(Date.now() / 1000)
      }]
    })
  });
};

module.exports = { alertConfig, sendSlackAlert };
```

### **Task 2: Enhanced Admin Tools**

#### **Bulk Operations Interface**
Create `src/components/admin/BulkOperations.tsx`:
```typescript
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Download, Upload, FileText, Mail, UserCheck } from 'lucide-react';

export const BulkOperations: React.FC = () => {
  const [operation, setOperation] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);

  const handleBulkOperation = async (operationType: string) => {
    setProcessing(true);
    setProgress(0);

    try {
      switch (operationType) {
        case 'approve-batch':
          await processBulkApproval();
          break;
        case 'export-data':
          await exportApplicationData();
          break;
        case 'send-notifications':
          await sendBulkNotifications();
          break;
      }
      
      toast.success('Bulk operation completed successfully');
    } catch (error) {
      toast.error('Bulk operation failed');
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  };

  const processBulkApproval = async () => {
    const applications = await fetch('/api/admin/pending-applications').then(r => r.json());
    const total = applications.length;

    for (let i = 0; i < total; i++) {
      await fetch(`/api/admin/applications/${applications[i].id}/approve`, {
        method: 'POST'
      });
      setProgress(((i + 1) / total) * 100);
      await new Promise(resolve => setTimeout(resolve, 100)); // Rate limiting
    }
  };

  const exportApplicationData = async () => {
    const response = await fetch('/api/admin/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        format: 'csv',
        dateRange: '30days',
        includePersonalData: false
      })
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applications-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const sendBulkNotifications = async () => {
    // Implementation for bulk email notifications
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Bulk Operations</h1>
        <p className="text-muted-foreground">Perform administrative actions on multiple applications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" 
              onClick={() => handleBulkOperation('approve-batch')}>
          <CardHeader>
            <UserCheck className="h-8 w-8 text-green-600" />
            <CardTitle>Batch Approval</CardTitle>
            <CardDescription>Approve multiple pending applications</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled={processing}>
              {processing && operation === 'approve-batch' ? 'Processing...' : 'Start Approval'}
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" 
              onClick={() => handleBulkOperation('export-data')}>
          <CardHeader>
            <Download className="h-8 w-8 text-blue-600" />
            <CardTitle>Data Export</CardTitle>
            <CardDescription>Export application data to CSV/Excel</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled={processing}>
              {processing && operation === 'export-data' ? 'Exporting...' : 'Export Data'}
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" 
              onClick={() => handleBulkOperation('send-notifications')}>
          <CardHeader>
            <Mail className="h-8 w-8 text-purple-600" />
            <CardTitle>Bulk Notifications</CardTitle>
            <CardDescription>Send emails to multiple applicants</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled={processing}>
              {processing && operation === 'send-notifications' ? 'Sending...' : 'Send Emails'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {processing && (
        <Card>
          <CardHeader>
            <CardTitle>Processing Operation</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">
              {Math.round(progress)}% complete
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
```

---

## 📚 DAY 14: DOCUMENTATION & TRAINING

### **Task 3: Comprehensive Documentation**

#### **API Documentation**
Create `docs/api-reference.md`:
```markdown
# UK ETA Gateway API Reference

## Authentication
All API endpoints require authentication using JWT tokens.

```bash
Authorization: Bearer <jwt-token>
```

## Core Endpoints

### Applications

#### GET /api/applications
Retrieve applications with pagination and filtering.

**Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `status` (string): Filter by status
- `search` (string): Search by reference or name

**Response:**
```json
{
  "applications": [
    {
      "id": "uuid",
      "reference": "UK-2025-ABCD-EFGH-12",
      "status": "pending",
      "applicants": [...],
      "created_at": "2025-08-27T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "total_pages": 5,
    "total_count": 100
  }
}
```

#### POST /api/applications
Create a new application.

**Request Body:**
```json
{
  "type": "single",
  "applicants": [
    {
      "given_names": "John",
      "family_name": "Smith",
      "nationality": "US",
      "date_of_birth": "1990-01-15"
    }
  ]
}
```

### Document Processing

#### POST /api/applications/{id}/documents
Upload documents for an application.

**Form Data:**
- `photo` (file): Passport photo (JPEG/PNG, max 5MB)
- `passport` (file): Passport scan (optional)

### Payment Processing

#### POST /api/payments/create-intent
Create a Stripe payment intent.

**Request Body:**
```json
{
  "application_id": "uuid",
  "amount": 3900,
  "currency": "gbp"
}
```
```

#### **Admin User Guide**
Create `docs/admin-guide.md`:
```markdown
# Admin User Guide

## Getting Started

### Accessing the Admin Panel
1. Navigate to `/admin` 
2. Enter your admin credentials
3. You'll be redirected to the admin dashboard

### Dashboard Overview
The admin dashboard provides:
- Application statistics
- Pending approval queue
- System health metrics
- Recent activity feed

## Managing Applications

### Reviewing Applications
1. Click on "Pending Applications" from the sidebar
2. Use filters to find specific applications
3. Click on an application to view details
4. Review all documents and information

### Approving Applications
1. In the application detail view, click "Approve"
2. The system will automatically:
   - Generate the ETA document
   - Send it to the client's dashboard
   - Send email notification
   - Update application status

### Rejecting Applications
1. Click "Reject" in the application detail view
2. Select a rejection reason from the dropdown
3. Add optional comments
4. The applicant will be notified via email

### Bulk Operations
Use the Bulk Operations panel to:
- Approve multiple applications at once
- Export data to CSV/Excel
- Send notifications to multiple applicants

## System Monitoring

### Health Dashboard
Monitor key metrics:
- System uptime and performance
- Error rates and response times
- Active user sessions
- Database performance

### Setting Up Alerts
1. Go to Settings > Alerts
2. Configure thresholds for key metrics
3. Add Slack webhook URL for notifications
4. Test alert delivery

## Troubleshooting

### Common Issues

**Photo Upload Failures**
- Check file size (max 5MB)
- Verify file format (JPEG/PNG only)
- Ensure face is clearly visible
- Good lighting and plain background

**Payment Processing Issues**
- Verify Stripe webhook configuration
- Check payment intent creation logs
- Validate webhook signatures
- Monitor Stripe dashboard for errors

**Email Delivery Problems**
- Check SMTP configuration
- Verify sender domain authentication
- Monitor bounce/complaint rates
- Test email templates
```

#### **Deployment Guide**
Create `docs/deployment.md`:
```markdown
# Production Deployment Guide

## Prerequisites

### Infrastructure Requirements
- Node.js 20+ server
- PostgreSQL 15+ database
- Redis 7+ cache
- SSL certificate
- Domain with DNS access

### Third-Party Services
- Supabase Pro account ($25/month)
- Stripe live account
- Email service (SendGrid/AWS SES)
- CDN (Cloudflare)
- Monitoring (Sentry)

## Step-by-Step Deployment

### 1. Environment Setup
```bash
# Clone repository
git clone https://github.com/your-org/uk-eta-gateway
cd uk-eta-gateway

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.production
```

### 2. Database Setup
```bash
# Run Supabase migrations
npx supabase db push

# Verify tables created
npx supabase db diff

# Set up RLS policies
npx supabase db reset
```

### 3. Build and Deploy
```bash
# Build application
npm run build

# Deploy to production server
rsync -avz dist/ user@server:/var/www/uketa/

# Start services
sudo systemctl restart nginx
sudo systemctl restart uketa-backend
```

### 4. SSL Configuration
```bash
# Install Let's Encrypt certificate
sudo certbot --nginx -d uketa.gov.uk
sudo certbot --nginx -d www.uketa.gov.uk

# Verify SSL installation
curl -I https://uketa.gov.uk
```

### 5. Monitoring Setup
```bash
# Install monitoring agent
sudo apt install datadog-agent

# Configure alerts
cp monitoring/datadog.yaml /etc/datadog-agent/
sudo systemctl restart datadog-agent
```

## Production Checklist

### Pre-Launch
- [ ] SSL certificates installed and valid
- [ ] All environment variables set
- [ ] Database migrations applied
- [ ] Storage buckets created
- [ ] Payment processing tested
- [ ] Email delivery working
- [ ] Monitoring configured
- [ ] Backups scheduled

### Post-Launch
- [ ] Monitor error rates < 1%
- [ ] Verify response times < 500ms
- [ ] Check payment success rate > 95%
- [ ] Confirm email delivery > 98%
- [ ] Test application flow end-to-end
- [ ] Verify admin functions working
```

### **Task 4: Support Infrastructure**

#### **Knowledge Base Articles**
Create `docs/support/troubleshooting.md`:
```markdown
# Troubleshooting Guide

## User Issues

### Photo Upload Problems

**Issue:** "Photo rejected - poor quality"
**Solutions:**
1. Ensure good lighting (natural light preferred)
2. Use plain white/light colored background
3. Face should be clearly visible, looking straight at camera
4. Remove glasses if they cause reflections
5. File should be JPEG or PNG format, under 5MB

**Issue:** "No face detected"
**Solutions:**
1. Make sure face fills 50-70% of the image height
2. Look directly at the camera
3. Remove hair covering the face
4. Ensure image is not rotated or upside down

### Application Access Problems

**Issue:** "Reference number not found"
**Solutions:**
1. Check email for correct reference format (UK-YYYY-XXXX-XXXX-XX)
2. Verify security code from email (6 digits)
3. Try additional verification (email or date of birth)
4. Contact support if reference is older than 30 days

### Payment Issues

**Issue:** "Payment failed"
**Solutions:**
1. Check card details are entered correctly
2. Ensure sufficient funds available
3. Try different payment method
4. Contact bank if international card
5. Use alternative card if first fails

## System Issues

### High Error Rates
1. Check database connections
2. Verify Redis cache is running
3. Monitor memory usage
4. Check Supabase Edge Function logs
5. Review Sentry error reports

### Slow Response Times
1. Check CDN cache hit rates
2. Monitor database query performance
3. Review server resource usage
4. Optimize images and assets
5. Scale server resources if needed

### Email Delivery Problems
1. Check SMTP configuration
2. Verify domain authentication (SPF, DKIM)
3. Monitor bounce rates
4. Review email templates
5. Check spam folder recommendations
```

#### **Support Ticket System Integration**
Create `src/components/support/SupportWidget.tsx`:
```typescript
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle, X } from 'lucide-react';
import { toast } from 'sonner';

export const SupportWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    priority: 'medium',
    message: '',
    reference: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      toast.success('Support ticket created successfully');
      setIsOpen(false);
      setFormData({ name: '', email: '', subject: '', priority: 'medium', message: '', reference: '' });
    } catch (error) {
      toast.error('Failed to create support ticket');
    }
  };

  return (
    <>
      {/* Support button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-12 w-12 bg-blue-600 hover:bg-blue-700 shadow-lg"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      </div>

      {/* Support modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Contact Support</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="reference">Reference Number (if applicable)</Label>
                  <Input
                    id="reference"
                    placeholder="UK-2025-XXXX-XXXX-XX"
                    value={formData.reference}
                    onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Create Ticket
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};
```

---

## 🚀 DAY 15: SOFT LAUNCH EXECUTION

### **Task 5: Staged Deployment Strategy**

#### **Pre-Launch Checklist**
Create `scripts/pre-launch-checklist.sh`:
```bash
#!/bin/bash

echo "🚀 Pre-Launch Checklist"
echo "======================="

# Test all critical systems
echo "1. Testing system health..."
curl -f https://uketa.gov.uk/api/health || exit 1

echo "2. Testing database connectivity..."
curl -f https://uketa.gov.uk/api/db-health || exit 1

echo "3. Testing payment processing..."
curl -X POST https://uketa.gov.uk/api/payments/test || exit 1

echo "4. Testing email delivery..."
curl -X POST https://uketa.gov.uk/api/email/test || exit 1

echo "5. Testing document generation..."
curl -X POST https://uketa.gov.uk/api/documents/test || exit 1

echo "6. Verifying SSL certificate..."
openssl s_client -connect uketa.gov.uk:443 -servername uketa.gov.uk < /dev/null 2>/dev/null | openssl x509 -checkend 864000 || exit 1

echo "7. Testing monitoring systems..."
curl -f https://uketa.gov.uk/api/monitoring/health || exit 1

echo "✅ All systems check passed!"
echo "Ready for soft launch"
```

#### **Soft Launch Monitoring**
Create `scripts/launch-monitor.js`:
```javascript
const axios = require('axios');
const { sendSlackAlert } = require('./setup-alerts');

class LaunchMonitor {
  constructor() {
    this.baseUrl = process.env.APP_URL;
    this.checkInterval = 30000; // 30 seconds
    this.metrics = {
      uptime: 0,
      responseTime: 0,
      errorRate: 0,
      successfulApplications: 0,
      failedApplications: 0
    };
  }

  async start() {
    console.log('🔍 Starting launch monitoring...');
    
    setInterval(async () => {
      await this.checkSystemHealth();
      await this.checkApplicationFlow();
      await this.checkPaymentProcessing();
      
      if (this.shouldAlert()) {
        await this.sendAlert();
      }
      
      console.log(`📊 Metrics: ${JSON.stringify(this.metrics)}`);
    }, this.checkInterval);
  }

  async checkSystemHealth() {
    try {
      const start = Date.now();
      const response = await axios.get(`${this.baseUrl}/api/health`);
      const responseTime = Date.now() - start;
      
      this.metrics.responseTime = responseTime;
      
      if (response.status === 200) {
        this.metrics.uptime += 1;
      }
    } catch (error) {
      this.metrics.errorRate += 1;
      console.error('Health check failed:', error.message);
    }
  }

  async checkApplicationFlow() {
    try {
      // Test creating an application
      const response = await axios.post(`${this.baseUrl}/api/applications`, {
        type: 'test',
        applicant: { name: 'Test User' }
      });
      
      if (response.status === 200) {
        this.metrics.successfulApplications += 1;
      }
    } catch (error) {
      this.metrics.failedApplications += 1;
      console.error('Application flow test failed:', error.message);
    }
  }

  async checkPaymentProcessing() {
    try {
      const response = await axios.post(`${this.baseUrl}/api/payments/test`, {
        amount: 100,
        currency: 'gbp'
      });
      
      if (response.status !== 200) {
        console.error('Payment processing test failed');
      }
    } catch (error) {
      console.error('Payment test failed:', error.message);
    }
  }

  shouldAlert() {
    const errorRate = this.metrics.errorRate / (this.metrics.uptime + this.metrics.errorRate);
    const failureRate = this.metrics.failedApplications / 
                       (this.metrics.successfulApplications + this.metrics.failedApplications || 1);
    
    return errorRate > 0.05 || // 5% error rate
           this.metrics.responseTime > 1000 || // 1 second response time
           failureRate > 0.1; // 10% application failure rate
  }

  async sendAlert() {
    const message = `🚨 Launch Monitor Alert:
- Error Rate: ${((this.metrics.errorRate / (this.metrics.uptime + this.metrics.errorRate)) * 100).toFixed(2)}%
- Response Time: ${this.metrics.responseTime}ms
- Application Failures: ${this.metrics.failedApplications}
- Current Time: ${new Date().toISOString()}`;

    await sendSlackAlert(message, 'critical');
  }
}

// Start monitoring if run directly
if (require.main === module) {
  const monitor = new LaunchMonitor();
  monitor.start();
}

module.exports = LaunchMonitor;
```

#### **Rollback Plan**
Create `scripts/rollback.sh`:
```bash
#!/bin/bash

echo "🔄 Initiating rollback procedure..."

# 1. Switch DNS to maintenance page
echo "Switching to maintenance mode..."
curl -X POST "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/dns_records/${MAINTENANCE_RECORD_ID}" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{"type":"A","name":"uketa.gov.uk","content":"maintenance-server-ip"}'

# 2. Restore previous version
echo "Restoring previous application version..."
cd /var/www/uketa
git checkout HEAD~1
npm run build
sudo systemctl restart nginx

# 3. Restore database if needed
echo "Database rollback (if required)..."
# npx supabase db reset --linked

# 4. Clear CDN cache
echo "Clearing CDN cache..."
curl -X POST "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'

# 5. Notify team
echo "Notifying team of rollback..."
curl -X POST ${SLACK_WEBHOOK_URL} \
  -H 'Content-Type: application/json' \
  -d '{"text":"🔄 UK ETA Gateway rollback completed"}'

echo "✅ Rollback completed"
```

---

## 📋 PHASE 3 DELIVERABLES

### **Operational Infrastructure**
1. **Comprehensive monitoring** with real-time dashboards
2. **Automated alerting** for critical issues
3. **Admin tools** for bulk operations and management
4. **System health monitoring** with performance metrics

### **Documentation Suite**
1. **API documentation** with complete endpoint reference
2. **Admin user guide** with step-by-step procedures
3. **Deployment guide** with infrastructure requirements
4. **Troubleshooting guide** with common issue resolution

### **Support Infrastructure**
1. **Knowledge base** articles for self-service
2. **Support ticket system** integration
3. **Escalation procedures** for critical issues
4. **Training materials** for support staff

### **Launch Readiness**
1. **Pre-launch checklist** automated verification
2. **Soft launch monitoring** with real-time metrics
3. **Rollback procedures** tested and ready
4. **Success criteria** defined and measurable

---

## 🎯 SUCCESS METRICS

### **Launch Readiness Criteria**
- [ ] System uptime >99.5% for 48 hours
- [ ] Error rate <0.5% under normal load
- [ ] Response time <500ms (95th percentile)
- [ ] Payment success rate >98%
- [ ] Email delivery rate >99%
- [ ] All admin functions tested and working
- [ ] Support processes validated

### **Post-Launch Monitoring (First 7 Days)**
- Application completion rate >90%
- Photo validation accuracy >95%
- Customer support tickets <5 per day
- System stability with no critical issues
- Performance metrics within acceptable ranges

---

## 🔄 CONTINUOUS IMPROVEMENT

### **Week 1 Post-Launch**
- Daily monitoring reports
- User feedback collection
- Performance optimization
- Bug fixes and patches

### **Month 1 Review**
- Comprehensive usage analytics
- Security audit review
- Performance benchmarking
- Feature enhancement planning

---

**Timeline:** 3-4 days  
**Prerequisites:** Phases 1 & 2 complete  
**Outcome:** Production-ready UK ETA Gateway with full operational support

*This final phase ensures smooth launch execution with comprehensive monitoring, documentation, and support infrastructure for ongoing operations.*