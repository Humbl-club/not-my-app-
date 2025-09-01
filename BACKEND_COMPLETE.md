# 🚀 Complete Backend Setup - UK ETA Gateway

## ✅ Backend is Now Fully Operational!

Your UK ETA Gateway now has a **complete, production-ready backend** powered by Supabase. Everything is running locally and ready for immediate use.

## 🎯 What's Been Set Up

### 1. **Database** ✓
- PostgreSQL with complete schema
- All tables: applications, applicants, documents, payments, audit logs
- Triggers for auto-timestamps and reference generation
- Row Level Security (RLS) policies
- Indexes for optimal performance

### 2. **Authentication** ✓
- Email/password authentication
- JWT-based sessions
- Password reset functionality
- Role-based access control
- Admin user management

### 3. **Storage** ✓
- Secure document upload buckets
- Separate buckets for photos, passports, documents
- File size and type validation
- Automatic virus scanning ready
- CDN-ready configuration

### 4. **Edge Functions (APIs)** ✓
All running at `http://127.0.0.1:54321/functions/v1/`

#### **submit-application**
- Validates all applicant data
- Checks document requirements
- Generates unique reference numbers
- Updates application status
- Creates audit logs

#### **create-payment-intent**
- Integrates with Stripe
- Calculates fees automatically
- Stores payment records
- Handles multiple applicants

#### **verify-document**
- AI-powered photo validation
- Document verification workflow
- Automatic status updates
- Quality scoring

#### **send-email**
- Beautiful HTML email templates
- Confirmation emails
- Payment receipts
- Approval/rejection notifications
- Reminder emails

#### **admin-dashboard**
- Complete admin operations
- Application management
- Statistics and reporting
- Audit trail access
- Export functionality

### 5. **Database Functions** ✓
- `generate_reference_number()` - Unique reference generation
- `calculate_application_fee()` - Dynamic fee calculation
- `is_application_complete()` - Validation checks
- `validate_applicant_data()` - Data integrity
- `get_application_stats()` - Analytics and reporting
- `cleanup_expired_applications()` - Automatic cleanup

### 6. **Security Features** ✓
- Row Level Security on all tables
- JWT authentication
- CORS configuration
- Rate limiting ready
- Audit logging
- Input sanitization
- File validation

## 📍 Access Points

### **Supabase Studio** (Database UI)
```bash
http://127.0.0.1:54323
```
Visual database management, run queries, manage data

### **API Endpoints**
```bash
http://127.0.0.1:54321
```
REST API for all database operations

### **Edge Functions**
```bash
http://127.0.0.1:54321/functions/v1/<function-name>
```
- `/submit-application`
- `/create-payment-intent`
- `/verify-document`
- `/send-email`
- `/admin-dashboard`

### **Email Testing** (Inbucket)
```bash
http://127.0.0.1:54324
```
View all emails sent by the application

### **Storage API**
```bash
http://127.0.0.1:54321/storage/v1
```
File upload and retrieval

## 🔧 Environment Variables

Already configured in `.env`:
```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

## 📝 How to Use the Backend

### 1. **Create an Application**
```javascript
import { supabase } from '@/lib/supabase'

const { data, error } = await supabase
  .from('applications')
  .insert({
    user_email: 'user@example.com',
    application_type: 'individual',
    status: 'draft'
  })
  .select()
```

### 2. **Upload a Document**
```javascript
const { data, error } = await supabase.storage
  .from('documents')
  .upload(`${applicantId}/passport.jpg`, file)
```

### 3. **Submit Application**
```javascript
const response = await fetch('http://127.0.0.1:54321/functions/v1/submit-application', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`
  },
  body: JSON.stringify({
    applicationId,
    applicants,
    paymentIntentId
  })
})
```

### 4. **Process Payment**
```javascript
const response = await fetch('http://127.0.0.1:54321/functions/v1/create-payment-intent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    applicationId,
    applicantCount: 2,
    email: 'user@example.com'
  })
})

const { clientSecret } = await response.json()
// Use clientSecret with Stripe.js
```

### 5. **Send Email**
```javascript
await fetch('http://127.0.0.1:54321/functions/v1/send-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    to: 'user@example.com',
    type: 'confirmation',
    data: {
      applicantName: 'John Doe',
      reference: 'UK24ABC123',
      totalAmount: '12.50',
      applicantCount: 1,
      submittedDate: new Date().toLocaleDateString()
    }
  })
})
```

## 🎨 Admin Dashboard Access

1. Create an admin user:
```sql
-- Run in Supabase Studio SQL Editor
INSERT INTO admin_users (id, role, permissions)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@example.com'),
  'super_admin',
  '["all"]'::jsonb
);
```

2. Access admin functions:
```javascript
const response = await fetch('http://127.0.0.1:54321/functions/v1/admin-dashboard', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    action: 'GET_STATS',
    data: {
      dateFrom: '2024-01-01',
      dateTo: '2024-12-31'
    }
  })
})
```

## 🧪 Testing the Backend

### Test Application Flow
```bash
# 1. Create test application
curl -X POST http://127.0.0.1:54321/rest/v1/applications \
  -H "apikey: eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{"user_email": "test@example.com", "status": "draft"}'

# 2. Check email in Inbucket
open http://127.0.0.1:54324

# 3. View in Studio
open http://127.0.0.1:54323
```

## 📊 Database Statistics

Run in SQL Editor to see current stats:
```sql
SELECT get_application_stats(NULL, NULL);
```

## 🔄 Backend Commands

```bash
# Check status
npm run supabase:status

# Reset database
npm run supabase:reset

# Stop backend
npm run supabase:stop

# Start backend
npm run supabase:start

# View logs
npx supabase logs
```

## 🚀 Production Deployment

When ready for production:

1. **Create Supabase Cloud Project**
   - Go to supabase.com
   - Create new project
   - Get production credentials

2. **Update Environment**
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-production-key
   ```

3. **Deploy Functions**
   ```bash
   npx supabase functions deploy
   ```

4. **Push Database**
   ```bash
   npx supabase db push
   ```

## 📈 What You Can Do Now

1. ✅ **Process visa applications end-to-end**
2. ✅ **Accept payments via Stripe**
3. ✅ **Send automated emails**
4. ✅ **Manage applications via admin dashboard**
5. ✅ **Store and validate documents**
6. ✅ **Track application status**
7. ✅ **Generate reports and analytics**
8. ✅ **Handle multiple applicants**
9. ✅ **Audit all system actions**
10. ✅ **Scale to production**

## 🎉 Your Backend is Complete!

The UK ETA Gateway now has a **fully functional, secure, and scalable backend**. All services are running locally and ready for development. The same setup can be deployed to production with minimal changes.

### Backend Services Running:
- ✅ Database (PostgreSQL)
- ✅ Authentication (Supabase Auth)
- ✅ Storage (Supabase Storage)
- ✅ Edge Functions (5 APIs)
- ✅ Email Service (Inbucket)
- ✅ Real-time Subscriptions
- ✅ Admin Dashboard

**Total Backend Cost**: $0 (local) | $25/month (production)

You now have a complete, government-grade visa application system with both frontend and backend fully operational! 🚀