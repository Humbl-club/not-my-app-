/**
 * Professional Application Tracking Page
 * Clean, modern design with real security
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { SecureFormInput } from '@/components/SecureFormInput';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { secureTrackingService } from '@/services/secureTrackingService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { 
  Search, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Info,
  Calendar,
  Mail,
  CreditCard,
  Shield,
  Globe,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Download
} from 'lucide-react';

interface ApplicationStatus {
  trackingCode: string;
  currentStatus: string;
  statusMessage?: string;
  paymentStatus: string;
  submittedAt: string;
  lastUpdated: string;
  statusHistory: Array<{
    new_status: string;
    change_reason?: string;
    changed_at: string;
  }>;
}

const TrackApplicationPro = () => {
  const navigate = useNavigate();
  const [trackingCode, setTrackingCode] = useState('');
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingCode.trim()) {
      setError('Please enter a tracking code');
      return;
    }

    // Validate tracking code format
    if (!/^ETA-\d{4}-\d{4}$/.test(trackingCode.trim().toUpperCase())) {
      setError('Invalid tracking code format. Should be: ETA-XXXX-XXXX');
      return;
    }

    setLoading(true);
    setError('');
    setApplicationStatus(null);

    // Simulate API call - replace with actual backend
    setTimeout(() => {
      // Mock response for demo
      setApplicationStatus({
        trackingCode: trackingCode.trim().toUpperCase(),
        currentStatus: 'in_review',
        statusMessage: 'Your application is currently being reviewed by our processing team.',
        paymentStatus: 'completed',
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        statusHistory: [
          {
            new_status: 'submitted',
            changed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            change_reason: 'Application received and payment confirmed'
          },
          {
            new_status: 'in_review',
            changed_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            change_reason: 'Application under review by UK Home Office'
          }
        ]
      });
      setLoading(false);
    }, 1500);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'denied': return <XCircle className="w-6 h-6 text-red-600" />;
      case 'need_info': return <Info className="w-6 h-6 text-amber-600" />;
      case 'in_review': return <Clock className="w-6 h-6 text-blue-600" />;
      default: return <FileText className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'green';
      case 'denied': return 'red';
      case 'need_info': return 'amber';
      case 'in_review': return 'blue';
      default: return 'gray';
    }
  };

  const getStatusBadge = (status: string) => {
    const color = getStatusColor(status);
    const variants: Record<string, string> = {
      'green': 'bg-green-100 text-green-800 border-green-200',
      'red': 'bg-red-100 text-red-800 border-red-200',
      'amber': 'bg-amber-100 text-amber-800 border-amber-200',
      'blue': 'bg-blue-100 text-blue-800 border-blue-200',
      'gray': 'bg-gray-100 text-gray-800 border-gray-200',
    };
    
    return (
      <Badge className={cn("border", variants[color])}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getStatusMessage = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return 'Your application has been received and is in the queue for review.';
      case 'in_review':
        return 'Your application is currently being reviewed by our team. This typically takes 48-72 hours.';
      case 'approved':
        return 'Congratulations! Your UK ETA has been approved. You can download your authorization below.';
      case 'denied':
        return 'Unfortunately, your application has been denied. Please check your email for more information.';
      case 'need_info':
        return 'We need additional information from you. Please check your email for instructions.';
      default:
        return 'Status update will be sent to your email address.';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <HeaderPro />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
              <Search className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Application Tracking</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Track Your UK ETA Application
            </h1>
            <p className="text-xl text-gray-600">
              Enter your tracking code to check the current status of your application
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Search Form */}
          <Card className="shadow-xl border-2 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-blue-600" />
                </div>
                Enter Your Tracking Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTrack} className="space-y-6">
                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="trackingCode" className="text-base font-medium">
                    Application Reference Number
                  </Label>
                  <div className="relative">
                    <SecureFormInput
                      id="trackingCode"
                      type="text"
                      value={trackingCode}
                      onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                      placeholder="ETA-1234-5678"
                      maxLength={12}
                      className="font-mono text-center text-xl py-6 pr-12"
                      disabled={loading}
                      forceUppercase={true}
                      validatePattern={/^[A-Z0-9-]*$/}
                    />
                    <FileText className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">
                    Your tracking code was sent to your email after payment completion
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Tracking Application...
                    </>
                  ) : (
                    <>
                      Track Application
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600 flex items-start gap-2">
                  <Shield className="w-4 h-4 mt-0.5 text-gray-400" />
                  Your tracking information is secured with 256-bit encryption
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Application Status */}
          {applicationStatus && (
            <Card className="shadow-xl border-2">
              <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      getStatusColor(applicationStatus.currentStatus) === 'green' && "bg-green-100",
                      getStatusColor(applicationStatus.currentStatus) === 'blue' && "bg-blue-100",
                      getStatusColor(applicationStatus.currentStatus) === 'amber' && "bg-amber-100",
                      getStatusColor(applicationStatus.currentStatus) === 'red' && "bg-red-100",
                      getStatusColor(applicationStatus.currentStatus) === 'gray' && "bg-gray-100"
                    )}>
                      {getStatusIcon(applicationStatus.currentStatus)}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Reference Number</p>
                      <p className="font-mono text-lg font-bold">{applicationStatus.trackingCode}</p>
                    </div>
                  </div>
                  {getStatusBadge(applicationStatus.currentStatus)}
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Status Message */}
                <div className={cn(
                  "p-4 rounded-xl border-2",
                  getStatusColor(applicationStatus.currentStatus) === 'green' && "bg-green-50 border-green-200",
                  getStatusColor(applicationStatus.currentStatus) === 'blue' && "bg-blue-50 border-blue-200",
                  getStatusColor(applicationStatus.currentStatus) === 'amber' && "bg-amber-50 border-amber-200",
                  getStatusColor(applicationStatus.currentStatus) === 'red' && "bg-red-50 border-red-200",
                  getStatusColor(applicationStatus.currentStatus) === 'gray' && "bg-gray-50 border-gray-200"
                )}>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Current Status
                  </h3>
                  <p className="text-gray-700">
                    {applicationStatus.statusMessage || getStatusMessage(applicationStatus.currentStatus)}
                  </p>
                </div>

                {/* Application Details Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="border">
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Submitted Date</p>
                        <p className="font-semibold">
                          {new Date(applicationStatus.submittedAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(applicationStatus.submittedAt).toLocaleTimeString('en-GB')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border">
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Payment Status</p>
                        <p className="font-semibold">
                          {applicationStatus.paymentStatus === 'completed' ? 'Payment Received' : 'Pending'}
                        </p>
                        <Badge className="mt-1 bg-green-100 text-green-700 border-green-200 text-xs">
                          £16.00 Paid
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Processing Timeline */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-600" />
                    Processing Timeline
                  </h3>
                  <div className="space-y-4">
                    {applicationStatus.statusHistory.map((entry, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="relative">
                          <div className={cn(
                            "w-3 h-3 rounded-full",
                            index === 0 ? "bg-blue-600" : "bg-gray-300"
                          )} />
                          {index < applicationStatus.statusHistory.length - 1 && (
                            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-gray-300" />
                          )}
                        </div>
                        <div className="flex-1 -mt-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getStatusBadge(entry.new_status)}
                            <span className="text-sm text-gray-500">
                              {new Date(entry.changed_at).toLocaleDateString('en-GB')} at{' '}
                              {new Date(entry.changed_at).toLocaleTimeString('en-GB', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          {entry.change_reason && (
                            <p className="text-sm text-gray-600">{entry.change_reason}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                {applicationStatus.currentStatus === 'approved' && (
                  <div className="flex gap-4">
                    <Button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                      <Download className="w-4 h-4 mr-2" />
                      Download ETA Document
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Mail className="w-4 h-4 mr-2" />
                      Email to Me
                    </Button>
                  </div>
                )}

                {/* Track Another */}
                <div className="text-center pt-4 border-t">
                  <Button 
                    variant="ghost"
                    onClick={() => {
                      setApplicationStatus(null);
                      setTrackingCode('');
                    }}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Track Another Application
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Help Section */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <Card className="border hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Processing Time</h3>
                <p className="text-sm text-gray-600">
                  Most applications are processed within 48-72 hours
                </p>
              </CardContent>
            </Card>

            <Card className="border hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Email Updates</h3>
                <p className="text-sm text-gray-600">
                  Check your email (including spam) for status updates
                </p>
              </CardContent>
            </Card>

            <Card className="border hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Secure & Private</h3>
                <p className="text-sm text-gray-600">
                  Your data is protected with enterprise-grade security
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          {!applicationStatus && (
            <div className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Don't Have a Tracking Code?
              </h2>
              <p className="text-gray-600 mb-6">
                Start your UK ETA application today and receive your tracking code instantly
              </p>
              <Button
                onClick={() => navigate('/application')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Start New Application
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </section>

      <FooterPro />
    </div>
  );
};

export default TrackApplicationPro;