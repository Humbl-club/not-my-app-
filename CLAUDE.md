# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start the Vite development server with hot reload on port 8080
- `npm run build` - Build the production bundle using Vite with optimizations
- `npm run build:dev` - Build in development mode with source maps
- `npm run lint` - Run ESLint for code quality checks (TypeScript ESLint config)
- `npm run preview` - Preview the built application locally
- `./backend-setup.sh` - Initialize backend infrastructure (PostgreSQL, Redis, Docker)

## Project Overview

This is a comprehensive **UK Electronic Travel Authorization (ETA) Gateway** application - a government-grade visa application system built with modern web technologies. The application handles sensitive personal data collection, advanced photo validation with AI, secure payment processing, and implements government-standard security measures for UK travel authorization applications.

## Core Technologies Stack

### Frontend Framework
- **Framework**: React 18.3+ with TypeScript 5.8+ (strict mode with ESLint)
- **Build Tool**: Vite 5.4+ with React SWC plugin and Terser minification
- **UI Framework**: shadcn/ui component library built on Radix UI primitives
- **CSS Framework**: Tailwind CSS 3.4+ with extensive custom design system

### Form & Validation
- **Form Management**: React Hook Form 7.61+ with @hookform/resolvers
- **Validation**: Zod 3.25+ schemas with comprehensive custom validation rules
- **Security**: DOMPurify 3.2+ for XSS prevention

### Photo Processing & AI
- **Face Detection**: face-api.js 0.22+ (CNN-based facial recognition)
- **Image Compression**: browser-image-compression 2.0+ 
- **OCR Ready**: Tesseract.js 6.0+ (for future passport reading)
- **Image Analysis**: Custom Canvas API implementation with Laplacian edge detection

### State & Data Management
- **Routing**: React Router DOM 6.30+ with protected routes
- **State Management**: 
  - TanStack Query 5.83+ for server state
  - sessionStorage with Web Crypto API encryption
  - 30-minute auto-save cache system
- **Internationalization**: i18next 25.3+ supporting 9 languages

### Payment & Security
- **Payment**: Stripe React 3.9+ (ready for backend integration)
- **Security Headers**: CSP, HSTS, X-Frame-Options configured
- **Rate Limiting**: Client-side and server-ready
- **File Security**: Magic byte validation, EXIF stripping

## Application Architecture

### Multi-Step Wizard Flow

1. **Landing Page** (`/`) - `src/pages/Index.tsx`
   - Hero section with trust indicators
   - Cached application detection banner
   - Multi-language support (9 languages)
   - Save & Resume functionality

2. **Application Type Selection** (`/application`) - `src/pages/Application.tsx`
   - Single vs group application choice
   - Progress tracking initialization

3. **Application Manager** (`/application/manage`) - `src/pages/ApplicationManager.tsx`
   - Multi-applicant management (up to 8 applicants)
   - Individual progress tracking
   - Auto-save every 30 seconds

4. **Applicant Forms** (`/application/applicant/:id`) - `src/pages/ApplicantForm.tsx`
   - Comprehensive personal information collection
   - Real-time validation with visual indicators
   - SecureInput components with XSS protection
   - Conditional field display logic

5. **Document Upload** (`/application/applicant/:id/documents`) - `src/pages/ApplicantDocuments.tsx`
   - **EnhancedPhotoCapture** with three input methods:
     - File upload (drag & drop)
     - Webcam capture
     - Mobile camera integration
   - AI-powered photo validation
   - Government-standard quality checks

6. **Payment Processing** (`/application/payment`) - `src/pages/Payment.tsx`
   - Stripe integration ready
   - Fee calculation service
   - Mock payment for development

7. **Review & Confirmation** (`/application/review`, `/application/confirmation`)
   - Comprehensive application review
   - PDF generation ready
   - Reference number generation

8. **Account/Progress Page** (`/account`) - `src/pages/AccountProgress.tsx`
   - View all saved applications
   - 30-minute cache management
   - Resume from exact step

### Component Architecture

#### Core Form Components
- **`NameFieldsSection.tsx`** - Passport-compliant name validation
- **`AddressFieldsSection.tsx`** - International address formats
- **`NationalityRadioSection.tsx`** - Dual citizenship support
- **`FormValidationStatus.tsx`** - Real-time completion tracking
- **`FieldStatusIndicator.tsx`** - Visual validation feedback

#### Photo Capture System
- **`EnhancedPhotoCapture.tsx`** - Advanced photo capture with:
  - Face detection using neural networks
  - Quality scoring (0-100)
  - Three input methods (upload/webcam/mobile)
  - Real-time analysis feedback
- **`PhotoCapture.tsx`** - Basic capture component (legacy)

#### Security Components
- **`SecureInput.tsx`** - XSS-protected input fields
- **`SecurityService.tsx`** - Comprehensive security utilities
- **`ImageAnalysisService.tsx`** - AI-powered photo validation

#### Save & Resume System
- **`SimpleSaveButton.tsx`** - One-click save functionality
- **`CachedApplicationBanner.tsx`** - Resume notification
- **`SimpleSaveService.ts`** - Browser fingerprint caching
- **`ApplicationSaveService.ts`** - Email-based save (backend ready)

## Photo Validation System

### Real Implementation Details

The application uses **actual computer vision** and **AI** for photo validation:

#### Technologies Used
1. **face-api.js** - Pre-trained CNN for face detection
2. **Canvas API** - Pixel-level image analysis
3. **Laplacian Operator** - Blur/sharpness detection
4. **Magic Bytes** - File authenticity verification

#### What We Measure
- **Resolution**: Minimum 600x600px (UK standard)
- **Face Detection**: Exactly 1 face, properly positioned
- **Face Size**: 50-70% of image height
- **Background**: Plain, light-colored (uniformity check)
- **Image Quality**:
  - Brightness: 100-200 (0-255 scale)
  - Contrast: Minimum 40
  - Sharpness: Laplacian score > 50
- **File Security**: JPEG/PNG signature verification

#### Scoring Algorithm
- 75-100: Excellent (green) - Meets all requirements
- 50-74: Acceptable (yellow) - Minor issues
- 0-49: Poor (red) - Must retake

## Security Implementation

### Frontend Security

#### Input Protection
- **XSS Prevention**: DOMPurify sanitization on all inputs
- **SQL Injection Prevention**: Pattern detection and blocking
- **CSRF Protection**: Token generation and validation
- **Rate Limiting**: 5 requests per minute per action

#### File Security
- **Magic Byte Validation**: Actual file signature checking
- **EXIF Stripping**: Privacy protection
- **Size Limits**: 5MB maximum
- **Type Validation**: JPEG/PNG only

#### Security Headers (configured in Vite)
```javascript
Content-Security-Policy: default-src 'self'
Strict-Transport-Security: max-age=31536000
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
```

### Data Protection
- **Encryption**: Web Crypto API (AES-GCM)
- **Session Storage**: Encrypted sensitive fields
- **Auto-cleanup**: 30-minute expiry
- **No PII in URLs**: All sensitive data in POST bodies

## Performance Optimizations

### Build Optimizations
- **Code Splitting**: Vendor chunks (react, forms, UI, i18n)
- **Minification**: Terser with console removal in production
- **Tree Shaking**: Removes unused code
- **Compression**: gzip/brotli ready

### Runtime Performance
- **Lazy Loading**: Heavy components loaded on demand
- **Image Compression**: Automatic resizing > 1MB
- **Debouncing**: Form auto-save throttled
- **Memoization**: Expensive computations cached

### Bundle Management
```javascript
// Vite config chunks
'react-vendor': React ecosystem
'form-vendor': Form libraries
'ui-vendor': UI components
'i18n': Translations
'utils': Utilities
```

## Backend Architecture (Ready for Implementation)

### Technology Stack
- **Runtime**: Node.js 20+ with TypeScript
- **Framework**: Fastify (faster than Express)
- **Database**: PostgreSQL 15+ with pgcrypto
- **Cache**: Redis for sessions
- **File Storage**: AWS S3 with CloudFront
- **Queue**: Bull/Redis for async jobs
- **Payment**: Stripe API integration

### Database Schema
- **applications**: Main application data
- **applicants**: Individual applicant records
- **documents**: S3 references with metadata
- **audit_logs**: Complete audit trail
- **rate_limits**: API throttling

### Security Features
- **Encryption**: AES-256-GCM for PII
- **Sessions**: Redis with 30-minute TTL
- **Rate Limiting**: Per-IP and per-session
- **Virus Scanning**: ClamAV integration ready
- **CORS**: Strict origin validation

## Save & Resume Functionality

### How It Works
1. **Browser Fingerprinting**: Device-specific identification
2. **30-Minute Cache**: Auto-expires for security
3. **No Login Required**: Instant save/resume
4. **Multiple Applications**: Support for concurrent saves
5. **Progress Tracking**: Resume from exact step

### Implementation
- Uses `SimpleSaveService` for caching
- Stores in localStorage with encryption
- Shows banner when cached application exists
- Account page (`/account`) for management

## Internationalization

### Supported Languages
- English (en)
- French (fr)
- German (de)
- Spanish (es)
- Italian (it)
- Arabic (ar) - RTL support
- Chinese (zh)
- Korean (ko)
- Japanese (ja)

### Implementation
- Auto-detection from browser
- Manual language switcher
- Persistent selection in localStorage
- Complete UI translation

## Development Guidelines

### Code Organization
- **Single Responsibility**: Each component has one purpose
- **Type Safety**: Full TypeScript coverage
- **Security First**: All inputs sanitized
- **Mobile First**: Responsive by default

### Testing Approach
- Manual testing for photo capture
- Browser compatibility checks
- Security vulnerability scanning
- Performance profiling

### Git Workflow
```bash
# Feature branch
git checkout -b feature/new-feature

# Commit with clear message
git commit -m "feat: Add new validation rule"

# Push and create PR
git push origin feature/new-feature
```

## Production Deployment

### Prerequisites
1. SSL certificates configured
2. Environment variables set
3. Database migrations run
4. S3 bucket created
5. Redis instance running

### Deployment Steps
```bash
# Build frontend
npm run build

# Start backend
cd backend && npm run start

# Run migrations
npm run migrate

# Start monitoring
npm run monitor
```

## Security Compliance

- ✅ GDPR compliant (data encryption, right to deletion)
- ✅ PCI DSS ready (Stripe integration)
- ✅ OWASP Top 10 protected
- ✅ UK Data Protection Act 2018
- ✅ Cyber Essentials Plus ready
- ✅ WCAG 2.1 AA accessible

## Monitoring & Analytics

### Metrics Tracked
- Application completion rate
- Photo validation success rate
- Error frequency by type
- Performance metrics (Core Web Vitals)
- Security events

### Error Handling
- Graceful fallbacks for all features
- User-friendly error messages
- Automatic error reporting ready
- Audit trail for debugging

## Current Status

### ✅ Completed Features
- Multi-step application flow
- Advanced photo validation with AI
- Multi-language support (9 languages)
- Save & resume functionality
- Security hardening
- Performance optimizations
- Form validation system
- Payment UI (needs backend)

### 🚧 Backend Required For
- Payment processing (Stripe)
- Email notifications
- Database persistence
- File upload to S3
- PDF generation
- Admin panel

### 📝 Notes
- All frontend features are production-ready
- Backend setup script provided (`backend-setup.sh`)
- Security and performance optimized
- Government-standard compliance achieved
- Mobile-first responsive design

This application represents a complete, secure, and user-friendly UK ETA visa application system ready for backend integration and deployment.