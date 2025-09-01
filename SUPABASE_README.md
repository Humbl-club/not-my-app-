# 🗄️ Supabase Integration Guide

This guide covers the Supabase integration for the UK ETA Gateway application, providing a complete backend solution with PostgreSQL database, authentication, real-time subscriptions, and file storage.

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
# Already installed during setup
npm install @supabase/supabase-js
npm install -D supabase
```

### 2. Run Setup Script
```bash
./setup-supabase.sh
```

Choose option 1 for local development or option 2 to link an existing project.

### 3. Configure Environment
Update your `.env` file:
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 📊 Database Schema

### Core Tables

#### `applications`
Main application records with status tracking and payment information.

```sql
- id (UUID, PK)
- reference_number (VARCHAR, UNIQUE)
- user_email (VARCHAR)
- status (ENUM: draft, submitted, processing, approved, rejected)
- payment_status (ENUM: pending, paid, failed, refunded)
- application_data (JSONB)
- created_at, updated_at, submitted_at
```

#### `applicants`
Individual applicant details for each application.

```sql
- id (UUID, PK)
- application_id (UUID, FK)
- first_name, last_name, date_of_birth
- nationality, passport_number, passport_expiry_date
- address, contact information
- travel details, emergency contact
```

#### `documents`
File uploads with verification status.

```sql
- id (UUID, PK)
- application_id (UUID, FK)
- document_type (ENUM: passport, photo, supporting)
- file_path, file_name, file_size, mime_type
- verification_status (ENUM: pending, verified, rejected)
```

#### `admin_users`
Administrative access control.

```sql
- id (UUID, PK)
- email (VARCHAR, UNIQUE)
- role (ENUM: admin, super_admin)
- is_active (BOOLEAN)
```

#### `application_logs`
Audit trail for all application activities.

```sql
- id (UUID, PK)
- application_id (UUID, FK)
- action (VARCHAR)
- details (JSONB)
- actor_type, actor_email
```

## 🔐 Security & Row Level Security (RLS)

### Authentication
- Email-based authentication through Supabase Auth
- Admin users managed separately in `admin_users` table
- JWT tokens for secure API access

### Row Level Security Policies

#### User Access
```sql
-- Users can only access their own applications
CREATE POLICY "Users can view their own applications" ON applications
    FOR SELECT USING (user_email = auth.email());

-- Users can only update draft applications
CREATE POLICY "Users can update their own draft applications" ON applications
    FOR UPDATE USING (user_email = auth.email() AND status = 'draft');
```

#### Admin Access
```sql
-- Admins can view all applications
CREATE POLICY "Admins can view all applications" ON applications
    FOR ALL USING (
        EXISTS (SELECT 1 FROM admin_users WHERE email = auth.email() AND is_active = true)
    );
```

## 🛠️ Services & API

### Application Service
Located in `src/services/supabaseApplicationService.ts`

#### Key Methods

```typescript
// Create new application
await applicationService.createApplication({
  userEmail: 'user@example.com',
  applicationType: 'individual',
  applicationData: formData
})

// Get application by reference
await applicationService.getApplicationByReference('UKE20240826001')

// Submit application
await applicationService.submitApplication(applicationId)

// Update payment status
await applicationService.updatePaymentStatus(applicationId, 'paid', paymentIntentId)
```

### Document Management

```typescript
// Upload document
await applicationService.uploadDocument(file, applicationId, 'passport')

// Get signed URL for download
const url = await applicationService.getDocumentUrl(filePath)
```

### Real-time Updates

```typescript
// Subscribe to application changes
supabase
  .channel('applications')
  .on('postgres_changes', 
    { event: 'UPDATE', schema: 'public', table: 'applications' },
    (payload) => {
      console.log('Application updated:', payload)
    }
  )
  .subscribe()
```

## 📁 File Storage

### Configuration
Files are stored in Supabase Storage with the following structure:
```
documents/
├── {application_id}/
│   ├── passport/
│   ├── photo/
│   └── supporting/
```

### Security
- Files are private by default
- Access controlled through RLS policies
- Signed URLs for temporary access (1 hour expiry)

### Upload Example
```typescript
const file = event.target.files[0]
const document = await applicationService.uploadDocument(
  file, 
  applicationId, 
  'passport'
)
```

## 🔄 Development Workflow

### Local Development
```bash
# Start local Supabase
npx supabase start

# Apply migrations
npx supabase db push

# Generate TypeScript types
npx supabase gen types typescript --local > src/types/supabase.ts
```

### Database Migrations
```bash
# Create new migration
npx supabase migration new migration_name

# Apply migrations
npx supabase db push

# Reset database
npx supabase db reset
```

### Testing
```bash
# Run with local database
npm run dev

# Test with real data
npm run test:integration
```

## 📊 Admin Dashboard Integration

### Application Management
- View all applications with filtering and search
- Update application status
- Download documents
- Export data

### Statistics
```typescript
const stats = await applicationService.getApplicationStats()
// Returns: { total, submitted, approved, today }
```

### Search & Filtering
```typescript
const applications = await applicationService.searchApplications({
  status: 'submitted',
  dateFrom: '2024-01-01',
  searchTerm: 'john@example.com'
})
```

## 🚀 Deployment

### Environment Variables
Required for production:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (backend only)
```

### Production Setup
1. Create Supabase project
2. Apply migrations: `npx supabase db push`
3. Configure RLS policies
4. Set up storage buckets
5. Configure authentication providers

### Monitoring
- Enable Supabase logging
- Set up database performance monitoring
- Configure alerts for critical operations

## 🔧 Configuration Files

### `supabase/config.toml`
Project configuration and local development settings.

### `supabase/migrations/`
All database schema changes and data modifications.

### `src/lib/supabase.ts`
Client configuration and type definitions.

## 📚 Best Practices

### Performance
- Use select only required columns
- Implement pagination for large datasets
- Index frequently queried columns
- Use database functions for complex operations

### Security
- Always use RLS policies
- Validate data on both client and server
- Use service role key only for admin operations
- Regular security audits

### Data Management
- Regular database backups
- Implement soft deletes for important data
- Archive old applications
- Monitor storage usage

## 🆘 Troubleshooting

### Common Issues

**Connection Failed**
```bash
# Check environment variables
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Verify project status
npx supabase status
```

**Migration Errors**
```bash
# Reset local database
npx supabase db reset

# Check migration syntax
npx supabase db diff
```

**RLS Policy Issues**
```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Test policies
SELECT * FROM applications; -- Should only return user's data
```

### Performance Issues
- Check slow query log
- Analyze query execution plans
- Review index usage
- Monitor connection pool

## 📖 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)

---

*Supabase integration provides a robust, scalable backend for the UK ETA Gateway with enterprise-grade security and performance.*
