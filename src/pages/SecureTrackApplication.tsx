/**
 * Secure Application Tracking Page
 * Implements multi-factor verification for viewing application status
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Lock, 
  Search, 
  AlertCircle, 
  CheckCircle,
  XCircle,
  Loader2,
  Info,
  Calendar,
  User,
  CreditCard,
  FileText,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';
import { secureTrackingService } from '@/services/secureTrackingService';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface ApplicationStatus {
  reference: string;
  status: 'draft' | 'submitted' | 'processing' | 'approved' | 'rejected';
  paymentStatus: 'pending' | 'paid' | 'failed';
  submittedDate?: string;
  lastUpdated: string;
  applicants: Array<{
    name: string;
    status: string;
  }>;
  estimatedProcessingTime?: string;
}

export const SecureTrackApplication: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Form state
  const [referenceNumber, setReferenceNumber] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [showSecurityCode, setShowSecurityCode] = useState(false);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<'code' | 'email' | 'dob'>('code');
  const [attempts, setAttempts] = useState(5);
  const [lockoutTime, setLockoutTime] = useState<Date | null>(null);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [applicationData, setApplicationData] = useState<ApplicationStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Get user's IP address (simplified - in production use proper IP detection)
   */
  const getUserIP = (): string => {
    // In production, this would come from the server
    return 'user-' + Math.random().toString(36).substring(7);
  };

  /**
   * Handle verification submission
   */
  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Build credentials based on verification method
      const credentials: any = {
        referenceNumber: referenceNumber.toUpperCase(),
        securityCode
      };

      if (verificationMethod === 'email' && email) {
        credentials.email = email;
      }

      if (verificationMethod === 'dob' && dateOfBirth) {
        credentials.dateOfBirth = dateOfBirth;
      }

      // Verify credentials
      const result = await secureTrackingService.verifyAndIssueToken(
        credentials,
        getUserIP()
      );

      if (result.success && result.token) {
        setVerificationToken(result.token.token);
        toast.success('Verification successful! Loading your application...');
        
        // Load application data
        await loadApplicationData(result.token.token);
      } else {
        setError(result.error || 'Verification failed');
        
        if (result.remainingAttempts !== undefined) {
          setAttempts(result.remainingAttempts);
          if (result.remainingAttempts === 0 && result.lockoutUntil) {
            setLockoutTime(result.lockoutUntil);
          }
        }
        
        toast.error(result.error || 'Verification failed');
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      setError('An error occurred during verification. Please try again.');
      toast.error('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load application data with token
   */
  const loadApplicationData = async (token: string) => {
    try {
      const result = await secureTrackingService.getSecureApplicationData(
        token,
        getUserIP()
      );

      if (result.success && result.data) {
        // Map the data to our display format
        const statusData: ApplicationStatus = {
          reference: result.data.reference_number,
          status: result.data.status,
          paymentStatus: result.data.payment_status,
          submittedDate: result.data.submitted_at,
          lastUpdated: result.data.created_at,
          applicants: result.data.applicants?.map((a: any) => ({
            name: `${a.first_name} ${a.last_name}`,
            status: a.status
          })) || [],
          estimatedProcessingTime: getEstimatedTime(result.data.status)
        };

        setApplicationData(statusData);
      } else {
        setError(result.error || 'Failed to load application data');
        toast.error('Failed to load application data');
      }
    } catch (error) {
      console.error('Data loading error:', error);
      setError('Failed to load application data');
    }
  };

  /**
   * Get estimated processing time
   */
  const getEstimatedTime = (status: string): string => {
    switch (status) {
      case 'submitted':
        return '3-5 business days';
      case 'processing':
        return '1-2 business days';
      case 'approved':
        return 'Completed';
      case 'rejected':
        return 'Review required';
      default:
        return 'Not submitted';
    }
  };

  /**
   * Get status color
   */
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  /**
   * Format date for display
   */
  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Check if locked out
  if (lockoutTime && new Date() < lockoutTime) {
    const minutesRemaining = Math.ceil((lockoutTime.getTime() - Date.now()) / 60000);
    
    return (
      <div className="container mx-auto py-12 px-4 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Lock className="h-5 w-5" />
              Account Locked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription>
                Too many failed attempts. Please try again in {minutesRemaining} minutes.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show verification form if not verified
  if (!verificationToken || !applicationData) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              Track Your Application Securely
            </CardTitle>
            <CardDescription>
              Enter your reference number and verification details to view your application status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerification} className="space-y-6">
              {/* Security Notice */}
              <Alert className="border-blue-200 bg-blue-50">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-sm">
                  For security, you'll need your reference number and security code sent to your email.
                  You have {attempts} attempts remaining.
                </AlertDescription>
              </Alert>

              {/* Reference Number */}
              <div className="space-y-2">
                <Label htmlFor="reference">
                  Reference Number *
                </Label>
                <Input
                  id="reference"
                  type="text"
                  placeholder="UK-2024-XXXX-XXXX-XX"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  required
                  className="font-mono"
                  pattern="^UK-\d{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-\d{2}$"
                />
                <p className="text-xs text-muted-foreground">
                  Format: UK-YYYY-XXXX-XXXX-XX (found in your confirmation email)
                </p>
              </div>

              {/* Security Code */}
              <div className="space-y-2">
                <Label htmlFor="security">
                  Security Code *
                </Label>
                <div className="relative">
                  <Input
                    id="security"
                    type={showSecurityCode ? 'text' : 'password'}
                    placeholder="6-digit code"
                    value={securityCode}
                    onChange={(e) => setSecurityCode(e.target.value)}
                    required
                    maxLength={6}
                    pattern="\d{6}"
                    className="pr-10 font-mono"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowSecurityCode(!showSecurityCode)}
                  >
                    {showSecurityCode ? 
                      <EyeOff className="h-4 w-4" /> : 
                      <Eye className="h-4 w-4" />
                    }
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  The 6-digit code sent to your email with your confirmation
                </p>
              </div>

              {/* Additional Verification */}
              <div className="space-y-4">
                <Label>Additional Verification (Optional)</Label>
                <Tabs 
                  value={verificationMethod} 
                  onValueChange={(v) => setVerificationMethod(v as any)}
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="code">Code Only</TabsTrigger>
                    <TabsTrigger value="email">+ Email</TabsTrigger>
                    <TabsTrigger value="dob">+ Date of Birth</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="email" className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      The email used when submitting your application
                    </p>
                  </TabsContent>
                  
                  <TabsContent value="dob" className="space-y-2">
                    <Label htmlFor="dob">Primary Applicant's Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Date of birth of the primary applicant
                    </p>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Error Display */}
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={loading || attempts === 0}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Track Application
                  </>
                )}
              </Button>

              {/* Help Text */}
              <div className="text-center text-sm text-muted-foreground">
                Don't have your security code?{' '}
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => toast.info('Please check your email for the security code')}
                >
                  Resend Code
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show application status
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              Application Status
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setVerificationToken(null);
                setApplicationData(null);
                setReferenceNumber('');
                setSecurityCode('');
              }}
            >
              <Lock className="h-4 w-4 mr-1" />
              Lock
            </Button>
          </CardTitle>
          <CardDescription>
            Reference: {applicationData.reference}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Overview */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Application Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={getStatusColor(applicationData.status)}>
                  {applicationData.status.toUpperCase()}
                </Badge>
                <p className="text-xs text-muted-foreground mt-2">
                  Estimated: {applicationData.estimatedProcessingTime}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Payment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={getStatusColor(applicationData.paymentStatus)}>
                  {applicationData.paymentStatus.toUpperCase()}
                </Badge>
                {applicationData.paymentStatus === 'paid' && (
                  <p className="text-xs text-muted-foreground mt-2">
                    <CheckCircle className="h-3 w-3 inline mr-1 text-green-600" />
                    Payment confirmed
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Label>Processing Progress</Label>
            <Progress 
              value={
                applicationData.status === 'draft' ? 0 :
                applicationData.status === 'submitted' ? 25 :
                applicationData.status === 'processing' ? 50 :
                applicationData.status === 'approved' ? 100 : 75
              } 
              className="h-2"
            />
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <Label>Application Timeline</Label>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Created: {formatDate(applicationData.lastUpdated)}</span>
              </div>
              {applicationData.submittedDate && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>Submitted: {formatDate(applicationData.submittedDate)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Applicants */}
          {applicationData.applicants.length > 0 && (
            <div className="space-y-3">
              <Label>Applicants ({applicationData.applicants.length})</Label>
              <div className="space-y-2">
                {applicationData.applicants.map((applicant, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{applicant.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {applicant.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Notice */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription className="text-xs">
              This session will expire in 30 minutes for security. 
              Your data is protected and only visible after verification.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecureTrackApplication;