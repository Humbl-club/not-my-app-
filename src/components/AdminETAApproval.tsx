/**
 * Admin ETA Approval Component
 * Allows admins to approve applications and automatically deliver ETAs to clients
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { 
  CheckCircle, 
  XCircle, 
  Send,
  User,
  FileText,
  Loader2,
  AlertCircle,
  Download,
  Eye
} from 'lucide-react';
import { etaDeliveryService } from '@/services/etaDeliveryService';
import { toast } from 'sonner';

interface AdminETAApprovalProps {
  application: {
    id: string;
    referenceNumber: string;
    status: string;
    applicants: Array<{
      id: string;
      firstName: string;
      lastName: string;
      passportNumber: string;
      status: string;
    }>;
    userEmail: string;
  };
  onApprovalComplete?: () => void;
}

export const AdminETAApproval: React.FC<AdminETAApprovalProps> = ({
  application,
  onApprovalComplete
}) => {
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [etaDocuments, setEtaDocuments] = useState<any[]>([]);

  // Select all approved applicants by default
  React.useEffect(() => {
    const approvedIds = application.applicants
      .filter(a => a.status === 'approved' || a.status === 'verified')
      .map(a => a.id);
    setSelectedApplicants(approvedIds);
  }, [application]);

  const handleApproveAndDeliver = async () => {
    if (selectedApplicants.length === 0) {
      toast.error('Please select at least one applicant to approve');
      return;
    }

    setProcessing(true);
    try {
      // Get admin user ID (in production, this would come from auth)
      const adminUserId = 'admin-user-id';

      // Process the approval and generate ETAs
      const result = await etaDeliveryService.processApprovedApplication(
        application.id,
        adminUserId
      );

      if (result.success && result.etaDocuments) {
        setEtaDocuments(result.etaDocuments);
        
        toast.success(
          `✅ Successfully approved and delivered ${result.etaDocuments.length} ETA(s)`,
          {
            description: `Documents have been automatically added to ${application.userEmail}'s dashboard`,
            duration: 5000
          }
        );

        if (onApprovalComplete) {
          onApprovalComplete();
        }
      } else {
        toast.error(result.error || 'Failed to process approval');
      }
    } catch (error: any) {
      console.error('Approval error:', error);
      toast.error('Failed to approve application');
    } finally {
      setProcessing(false);
    }
  };

  const toggleApplicant = (applicantId: string) => {
    setSelectedApplicants(prev =>
      prev.includes(applicantId)
        ? prev.filter(id => id !== applicantId)
        : [...prev, applicantId]
    );
  };

  // If ETAs have been generated, show success view
  if (etaDocuments.length > 0) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            ETAs Delivered Successfully
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-green-200 bg-white">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">
                  {etaDocuments.length} ETA document(s) have been:
                </p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Generated with unique ETA numbers</li>
                  <li>Automatically added to client's dashboard</li>
                  <li>Email notification sent to {application.userEmail}</li>
                  <li>Ready for immediate download by client</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Generated ETAs:</p>
            {etaDocuments.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-mono text-sm">{doc.etaNumber}</p>
                    <p className="text-xs text-gray-500">
                      Valid: {new Date(doc.validFrom).toLocaleDateString()} - 
                      {' '}{new Date(doc.validUntil).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Delivered</Badge>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <p className="text-sm text-gray-600">
              The client can now log into their dashboard to view and download these documents.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Approve & Deliver ETAs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Application Info */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Reference:</span>
              <span className="font-mono">{application.referenceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Client Email:</span>
              <span>{application.userEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Current Status:</span>
              <Badge variant="outline">{application.status}</Badge>
            </div>
          </div>
        </div>

        {/* Applicant Selection */}
        <div className="space-y-3">
          <p className="text-sm font-medium">Select Applicants to Approve:</p>
          {application.applicants.map((applicant) => (
            <div
              key={applicant.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                selectedApplicants.includes(applicant.id)
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedApplicants.includes(applicant.id)}
                  onCheckedChange={() => toggleApplicant(applicant.id)}
                />
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium text-sm">
                    {applicant.firstName} {applicant.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    Passport: {applicant.passportNumber}
                  </p>
                </div>
              </div>
              <Badge
                variant={applicant.status === 'approved' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {applicant.status}
              </Badge>
            </div>
          ))}
        </div>

        {/* Approval Notes */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Admin Notes (Optional):</p>
          <Textarea
            placeholder="Any notes about this approval..."
            value={approvalNotes}
            onChange={(e) => setApprovalNotes(e.target.value)}
            rows={3}
          />
        </div>

        {/* Warning */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Approving will:
            <ul className="list-disc list-inside mt-1 text-xs">
              <li>Generate official ETA documents with 2-year validity</li>
              <li>Automatically add them to the client's dashboard</li>
              <li>Send email notification to {application.userEmail}</li>
              <li>Allow immediate download by the client</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            className="flex-1"
            onClick={handleApproveAndDeliver}
            disabled={processing || selectedApplicants.length === 0}
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Approve & Deliver ETAs ({selectedApplicants.length})
              </>
            )}
          </Button>
          <Button variant="outline" disabled={processing}>
            <XCircle className="mr-2 h-4 w-4" />
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminETAApproval;