import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

const Track = () => {
  const { t } = useTranslation();
  const [referenceNumber, setReferenceNumber] = useState('');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Track Your Application</h1>
            <p className="text-muted-foreground">
              Enter your application reference number to check the status of your UK ETA application.
            </p>
          </div>

          {/* Search Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Application Lookup</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Enter your reference number (e.g., ETA-2024-001234)"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                  />
                </div>
                <Button className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Search
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Your reference number was provided in your confirmation email.
              </p>
            </CardContent>
          </Card>

          {/* Sample Application Status */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Application Status: ETA-2024-001234</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Application Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-secondary/20 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Applicant Name</label>
                    <p className="font-medium">John Smith</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Submission Date</label>
                    <p>{new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Current Status</label>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium text-yellow-600">Under Review</span>
                    </div>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Application Timeline</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Application Submitted</h4>
                          <span className="text-sm text-muted-foreground">
                            {new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Your application was successfully received and payment confirmed.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Documents Verified</h4>
                          <span className="text-sm text-muted-foreground">
                            {new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          All submitted documents have been verified and accepted.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <Clock className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Under Review</h4>
                          <span className="text-sm text-muted-foreground">Current</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Your application is currently being reviewed by UK authorities.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-muted-foreground">ETA Issued</h4>
                          <span className="text-sm text-muted-foreground">Pending</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Your ETA will be issued and sent to your email once approved.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Estimated Completion */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium text-blue-900">Estimated Completion</h4>
                  </div>
                  <p className="text-blue-800 text-sm">
                    Based on current processing times, your ETA is expected to be issued within the next 24-48 hours.
                    You will receive an email notification once your ETA is ready.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card>
            <CardHeader>
              <CardTitle>Need Assistance?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Contact Support</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    If you have questions about your application status, our support team is here to help.
                  </p>
                  <div className="space-y-2 text-sm">
                    <p><strong>Email:</strong> support@uketaservice.com</p>
                    <p><strong>Phone:</strong> +44 20 7946 0958</p>
                    <p><strong>Hours:</strong> Available 24/7</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Processing Times</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Current average processing times for UK ETA applications.
                  </p>
                  <div className="space-y-2 text-sm">
                    <p><strong>Standard Processing:</strong> 24-72 hours</p>
                    <p><strong>Peak Season:</strong> Up to 5 days</p>
                    <p><strong>Complex Cases:</strong> Up to 10 days</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Track;