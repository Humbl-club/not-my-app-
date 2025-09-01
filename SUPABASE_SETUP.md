# Supabase Setup Guide for UK ETA Gateway

## Quick Start

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Enter project details:
   - **Name**: UK ETA Gateway
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your users (e.g., London for UK)
   - **Pricing Plan**: Free tier works for development

### 2. Get Your API Keys

Once your project is created:

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://[your-project-id].supabase.co`
   - **Anon/Public Key**: Safe to use in browser
   - **Service Role Key**: Keep secure, server-side only

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=https://[your-project-id].supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Set Up Database Schema

#### Option A: Using Supabase Dashboard (Easiest)

1. Go to **SQL Editor** in your Supabase dashboard
2. Click **New Query**
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste and click **Run**

#### Option B: Using Supabase CLI

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Link your project:
```bash
supabase link --project-ref [your-project-id]
```

3. Run migrations:
```bash
supabase db push
```

### 5. Configure Storage

1. Go to **Storage** in Supabase dashboard
2. The `documents` bucket should be created automatically from the migration
3. If not, create it manually:
   - Click **New Bucket**
   - Name: `documents`
   - Public: No (keep private for security)
   - File size limit: 5MB
   - Allowed MIME types: `image/jpeg`, `image/png`, `application/pdf`

### 6. Set Up Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider (enabled by default)
3. Configure email templates:
   - Go to **Email Templates**
   - Customize confirmation, password reset emails
   - Add your branding

### 7. Configure Security

1. Go to **Authentication** → **URL Configuration**
2. Add your site URL to **Site URL**: `http://localhost:8080` (for development)
3. Add redirect URLs:
   - `http://localhost:8080/account`
   - `http://localhost:8080/reset-password`

## Development Usage

### Start the Application

```bash
npm run dev
```

The application will now use Supabase for:
- **Authentication**: User sign up/sign in
- **Database**: Store applications and applicants
- **Storage**: Upload documents and photos
- **Real-time**: Live updates for application status

### Test the Integration

1. Visit `http://localhost:8080`
2. Start a new application
3. The save/resume functionality now uses Supabase
4. Documents are stored in Supabase Storage
5. Application data persists in PostgreSQL

## Production Deployment

### 1. Update Environment Variables

For production, update your `.env`:
```env
VITE_APP_URL=https://your-domain.com
VITE_SUPABASE_URL=https://[your-project-id].supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Configure Supabase for Production

1. **Add production URLs**:
   - Go to **Authentication** → **URL Configuration**
   - Add your production domain to allowed URLs

2. **Enable Row Level Security**:
   - Already configured in the migration
   - Ensures users can only access their own data

3. **Set up email**:
   - Go to **Settings** → **SMTP**
   - Configure custom SMTP for production emails

4. **Enable Captcha** (optional but recommended):
   - Go to **Authentication** → **Security**
   - Enable hCaptcha for sign-ups

## Features Enabled by Supabase

### 1. User Authentication
- Email/password authentication
- Password reset functionality
- Session management
- Secure JWT tokens

### 2. Database Operations
- PostgreSQL database with full SQL support
- Row Level Security (RLS) for data protection
- Real-time subscriptions
- Automatic timestamps and triggers

### 3. File Storage
- Secure document uploads
- Image transformation (coming soon)
- Direct file URLs with authentication
- Automatic virus scanning (enterprise feature)

### 4. Real-time Updates
- Live application status updates
- Multi-user collaboration support
- WebSocket connections

### 5. Admin Dashboard
- Role-based access control
- Application management
- Statistics and reporting

## API Usage Examples

### Create an Application
```javascript
import { db } from '@/lib/supabase';

const { data, error } = await db.applications.create({
  application_type: 'single',
  user_email: 'user@example.com'
});
```

### Upload a Photo
```javascript
import { storage } from '@/lib/supabase';

const { data, error } = await storage.uploadPhoto(
  applicantId,
  photoFile
);
```

### Get Saved Application
```javascript
import { db } from '@/lib/supabase';

const { data, error } = await db.savedApplications.get(
  browserFingerprint
);
```

## Monitoring & Maintenance

### Database Backups
- Automatic daily backups (Pro plan)
- Point-in-time recovery (Pro plan)
- Manual backup via dashboard

### Performance Monitoring
1. Go to **Database** → **Performance**
2. Monitor slow queries
3. Check index usage
4. Review connection pool

### Storage Management
1. Go to **Storage** → **Policies**
2. Review storage usage
3. Clean up old files periodically

## Cost Estimation

### Free Tier Includes
- 500MB database
- 1GB storage
- 2GB bandwidth
- 50,000 monthly active users
- Unlimited API requests

### Pro Plan ($25/month)
- 8GB database
- 100GB storage
- 250GB bandwidth
- Automatic backups
- No user limits

## Security Best Practices

1. **Never expose service role key** in client code
2. **Use Row Level Security** (already configured)
3. **Enable 2FA** for your Supabase account
4. **Regular security audits** via dashboard
5. **Monitor authentication logs**

## Troubleshooting

### Common Issues

**CORS Errors**
- Check Site URL in Authentication settings
- Ensure redirect URLs are configured

**Authentication Not Working**
- Verify anon key is correct
- Check email templates are configured
- Ensure user confirmation is disabled for testing

**Storage Upload Fails**
- Check file size (max 5MB)
- Verify MIME type is allowed
- Ensure bucket policies are correct

**Database Connection Issues**
- Verify project URL is correct
- Check if project is paused (free tier pauses after 1 week of inactivity)
- Review connection pool settings

## Support

- **Documentation**: [supabase.com/docs](https://supabase.com/docs)
- **Discord**: [discord.supabase.com](https://discord.supabase.com)
- **GitHub**: [github.com/supabase](https://github.com/supabase)

## Next Steps

1. ✅ Install Supabase client
2. ✅ Create database schema
3. ✅ Configure authentication
4. ✅ Set up storage
5. 🔄 Update application services to use Supabase
6. 🔄 Test end-to-end functionality
7. 🔄 Deploy to production

Your UK ETA Gateway is now powered by Supabase! 🚀