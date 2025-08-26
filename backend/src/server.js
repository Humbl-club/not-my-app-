import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import { applicationRouter } from './routes/applications.js';
import { adminRouter } from './routes/admin.js';
import { trackingRouter } from './routes/tracking.js';
import { paymentRouter } from './routes/payment.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { securityMiddleware } from './middleware/security.js';

// Load environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// Security Headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const strictLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5, // 5 requests per minute for sensitive operations
  message: 'Too many attempts, please try again later.',
});

app.use('/api/', limiter);
app.use('/api/admin/login', strictLimiter);
app.use('/api/applications/submit', strictLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security middleware for all routes
app.use(securityMiddleware);

// API Routes
app.use('/api/applications', applicationRouter);
app.use('/api/admin', adminRouter);
app.use('/api/track', trackingRouter);
app.use('/api/payment', paymentRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
    🚀 UK ETA Backend Server Started
    ================================
    🔒 Security: Enabled
    📍 Port: ${PORT}
    🌐 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:8080'}
    💾 Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}
    💳 Stripe: ${process.env.STRIPE_SECRET_KEY ? 'Configured' : 'Not configured'}
    📧 Email: ${process.env.EMAIL_FROM ? 'Configured' : 'Not configured'}
    
    Endpoints:
    - POST   /api/applications/submit     - Submit new application
    - GET    /api/track/:code             - Track application status
    - POST   /api/payment/create-session  - Create payment session
    - POST   /api/payment/webhook         - Stripe webhook
    - POST   /api/admin/login            - Admin login
    - GET    /api/admin/applications     - List applications (auth required)
    - PUT    /api/admin/applications/:id - Update application (auth required)
  `);
});