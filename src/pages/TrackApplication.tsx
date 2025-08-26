import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Info,
  Calendar,
  Mail,
  CreditCard
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

const TrackApplication = () => {
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

    try {
      const response = await fetch(`http://localhost:3001/api/track/${trackingCode.trim().toUpperCase()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setApplicationStatus(data);
      } else {
        setError(data.error || 'Application not found');
      }
    } catch (error) {
      setError('Failed to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
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

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      'approved': 'bg-green-100 text-green-800',
      'denied': 'bg-red-100 text-red-800',
      'need_info': 'bg-amber-100 text-amber-800',
      'in_review': 'bg-blue-100 text-blue-800',
      'submitted': 'bg-gray-100 text-gray-800',
    };
    
    return (
      <Badge className={variants[status.toLowerCase()] || 'bg-gray-100 text-gray-800'}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getStatusMessage = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return 'Your application has been received and is in the queue for review.';
      case 'in_review':
        return 'Your application is currently being reviewed by our team.';
      case 'approved':
        return '🎉 Congratulations! Your UK ETA has been approved. Check your email for details.';
      case 'denied':
        return 'Unfortunately, your application has been denied. Check your email for more information.';
      case 'need_info':
        return 'We need additional information from you. Please check your email for details.';
      default:
        return 'Status update will be sent to your email address.';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Track Your UK ETA Application
            </h1>
            <p className="text-gray-600">
              Enter your tracking code to check the status of your application
            </p>
          </div>

          {/* Search Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Enter Tracking Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTrack} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="trackingCode">Tracking Code</Label>
                  <Input
                    id="trackingCode"
                    type="text"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                    placeholder="ETA-1234-5678"
                    maxLength={12}
                    className="font-mono text-center text-lg"
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500">
                    Format: ETA-XXXX-XXXX (case insensitive)
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Search className="w-4 h-4 mr-2 animate-pulse" />
                      Tracking...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Track Application
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Application Status */}
          {applicationStatus && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Application Status: {applicationStatus.trackingCode}</span>
                  {getStatusIcon(applicationStatus.currentStatus)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Current Status</p>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(applicationStatus.currentStatus)}
                      <span className="text-sm text-gray-500">
                        Last updated: {new Date(applicationStatus.lastUpdated).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Message */}
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    {applicationStatus.statusMessage || getStatusMessage(applicationStatus.currentStatus)}
                  </AlertDescription>
                </Alert>

                {/* Application Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Submitted</p>
                      <p className="text-sm text-gray-600">
                        {new Date(applicationStatus.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Payment Status</p>
                      <Badge variant={applicationStatus.paymentStatus === 'completed' ? 'default' : 'secondary'}>
                        {applicationStatus.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Status History */}
                {applicationStatus.statusHistory && applicationStatus.statusHistory.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Status History</h3>
                    <div className="space-y-3">
                      {applicationStatus.statusHistory.map((entry, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 border-l-2 border-blue-200 bg-blue-50 rounded">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              {getStatusBadge(entry.new_status)}
                              <span className="text-sm text-gray-500">
                                {new Date(entry.changed_at).toLocaleString()}
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
                )}

                {/* Next Steps */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
                  {applicationStatus.currentStatus === 'approved' ? (
                    <p className="text-blue-800 text-sm">
                      Your UK ETA is ready! Check your email for the official authorization document. You can now travel to the UK.
                    </p>
                  ) : applicationStatus.currentStatus === 'denied' ? (
                    <p className="text-blue-800 text-sm">
                      Your application was not approved. Check your email for detailed information about the decision and next steps.
                    </p>
                  ) : applicationStatus.currentStatus === 'need_info' ? (
                    <p className="text-blue-800 text-sm">
                      Please check your email for instructions on what additional information we need. Respond promptly to avoid delays.
                    </p>
                  ) : (
                    <p className="text-blue-800 text-sm">
                      Your application is being processed. We'll send you an email update when the status changes. Processing typically takes 3-5 business days.
                    </p>
                  )}
                </div>

                <div className="flex justify-center">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setApplicationStatus(null);
                      setTrackingCode('');
                    }}
                  >
                    Track Another Application
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Help Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Your tracking code was sent to your email after payment</p>
                <p>• Processing typically takes 3-5 business days</p>
                <p>• Check your spam folder for status updates</p>
                <p>• Contact support if you can't find your tracking code</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TrackApplication;