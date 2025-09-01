/**
 * Polished Application Tracking Page
 * Clean, modern, professional design
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Shield,
  FileText,
  XCircle,
  RefreshCw,
  ChevronRight,
  Mail,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { RecaptchaWrapper, useRecaptcha } from '@/components/security/RecaptchaWrapper';
import { TrackingService } from '@/services/trackingService';

export const TrackPolished: React.FC = () => {
  const navigate = useNavigate();
  
  // Form state
  const [referenceNumber, setReferenceNumber] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [showSecurityCode, setShowSecurityCode] = useState(false);
  const [additionalVerification, setAdditionalVerification] = useState('');
  const [verificationType, setVerificationType] = useState<'none' | 'email' | 'dob'>('none');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(5);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  // reCAPTCHA state
  const { token: recaptchaToken, isVerified: isRecaptchaVerified, handleVerify: handleRecaptchaVerify } = useRecaptcha();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate reCAPTCHA in production
    if (process.env.NODE_ENV === 'production' && !isRecaptchaVerified) {
      setError('Please complete the security verification');
      return;
    }
    
    setLoading(true);

    // Enhanced verification with security checks
    try {
      // First try to use real tracking service
      const trackingResult = await TrackingService.trackApplication(
        referenceNumber,
        securityCode,
        verificationType === 'email' ? additionalVerification : undefined,
        verificationType === 'dob' ? additionalVerification : undefined
      );

      if (trackingResult.success && trackingResult.application) {
        toast.success('Application found!');
        navigate('/dashboard', { 
          state: { 
            application: trackingResult.application,
            applicants: trackingResult.applicants,
            documents: trackingResult.documents
          } 
        });
      } else {
        // If real tracking fails, try mock data for demo
        if (process.env.NODE_ENV === 'development') {
          console.log('Using mock data for demo purposes');
          const mockApp = TrackingService.getMockApplication(referenceNumber);
          toast.success('Application found (Demo Mode)');
          navigate('/dashboard', {
            state: {
              application: mockApp,
              applicants: mockApp.applicants,
              documents: []
            }
          });
        } else {
          throw new Error(trackingResult.error || 'Application not found');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Invalid reference or security code');
      setAttempts(prev => Math.max(0, prev - 1));
      
      // Reset reCAPTCHA on failure
      if (process.env.NODE_ENV === 'production') {
        // reCAPTCHA will be reset by the component
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">UK ETA Gateway</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-gray-600"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          {/* Title Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Search className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Track Your Application
            </h2>
            <p className="text-gray-600">
              Enter your details to view your application status
            </p>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border p-6"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Reference Number Field */}
              <div className="space-y-2">
                <Label htmlFor="reference" className="text-sm font-medium text-gray-700">
                  Reference Number
                </Label>
                <div className="relative">
                  <Input
                    id="reference"
                    type="text"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    onFocus={() => setFocusedField('reference')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="UK-YYYY-XXXX-XXXX-XX"
                    required
                    className={cn(
                      "pl-10 font-mono uppercase transition-all",
                      focusedField === 'reference' && "ring-2 ring-blue-500"
                    )}
                  />
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <AnimatePresence>
                  {focusedField === 'reference' && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-gray-500"
                    >
                      Found in your confirmation email
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Security Code Field */}
              <div className="space-y-2">
                <Label htmlFor="security" className="text-sm font-medium text-gray-700">
                  Security Code
                </Label>
                <div className="relative">
                  <Input
                    id="security"
                    type={showSecurityCode ? 'text' : 'password'}
                    value={securityCode}
                    onChange={(e) => setSecurityCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    onFocus={() => setFocusedField('security')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="6-digit code"
                    required
                    maxLength={6}
                    className={cn(
                      "pl-10 pr-10 font-mono tracking-wider transition-all",
                      focusedField === 'security' && "ring-2 ring-blue-500"
                    )}
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowSecurityCode(!showSecurityCode)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showSecurityCode ? 
                      <EyeOff className="h-4 w-4" /> : 
                      <Eye className="h-4 w-4" />
                    }
                  </button>
                </div>
                <AnimatePresence>
                  {focusedField === 'security' && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-gray-500"
                    >
                      Sent with your confirmation email
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Optional Additional Verification */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Additional Security (Optional)
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setVerificationType(verificationType === 'email' ? 'none' : 'email')}
                    className={cn(
                      "flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all",
                      verificationType === 'email' 
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">Email</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setVerificationType(verificationType === 'dob' ? 'none' : 'dob')}
                    className={cn(
                      "flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all",
                      verificationType === 'dob' 
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Date of Birth</span>
                  </button>
                </div>
                
                <AnimatePresence mode="wait">
                  {verificationType === 'email' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={additionalVerification}
                        onChange={(e) => setAdditionalVerification(e.target.value)}
                        className="mt-2"
                      />
                    </motion.div>
                  )}
                  {verificationType === 'dob' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Input
                        type="date"
                        value={additionalVerification}
                        onChange={(e) => setAdditionalVerification(e.target.value)}
                        className="mt-2"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* reCAPTCHA Security Verification */}
              {(attempts <= 3 || process.env.NODE_ENV === 'production') && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Security Verification
                  </Label>
                  <RecaptchaWrapper
                    onVerify={handleRecaptchaVerify}
                    size="compact"
                    className="flex justify-center"
                  />
                </div>
              )}

              {/* Error Display */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-red-800">{error}</p>
                      {attempts < 5 && (
                        <p className="text-xs text-red-600 mt-1">
                          {attempts} attempts remaining
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={
                  loading || 
                  attempts === 0 || 
                  !referenceNumber || 
                  securityCode.length !== 6 ||
                  (process.env.NODE_ENV === 'production' && !isRecaptchaVerified)
                }
              >
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Track Application
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              {/* Security Note */}
              <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                <Shield className="h-4 w-4 text-gray-400 mt-0.5" />
                <p className="text-xs text-gray-600">
                  Your session will expire after 30 minutes of inactivity for security.
                </p>
              </div>
            </form>
          </motion.div>

          {/* Help Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center space-y-2"
          >
            <button
              onClick={() => toast.info('Check your email for the security code')}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Can't find your security code?
            </button>
            <div className="text-sm text-gray-500">
              Need help? Contact support at{' '}
              <a href="mailto:support@uketa.gov.uk" className="text-blue-600 hover:text-blue-700">
                support@uketa.gov.uk
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TrackPolished;