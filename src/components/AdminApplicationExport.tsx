import React, { useState, useEffect } from 'react';
import { Download, FileText, Package, Mail, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import JSZip from 'jszip';
import { supabase } from '@/lib/supabase';

interface Application {
  id: string;
  reference_number: string;
  status: string;
  payment_status: string;
  payment_amount: number;
  user_email: string;
  submitted_at: string;
  created_at: string;
  updated_at: string;
  application_type: string;
  applicants?: Array<{
    id: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    nationality: string;
    passport_number: string;
    passport_issue_date: string;
    passport_expiry_date: string;
    email: string;
    phone: string;
    passportPhoto?: string;
    personalPhoto?: string;
    [key: string]: any;
  }>;
}

interface AdminApplicationExportProps {
  application: Application;
  onExport?: (format: string) => void;
}

export const AdminApplicationExport: React.FC<AdminApplicationExportProps> = ({
  application,
  onExport
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [exportOptions, setExportOptions] = useState({
    includeFiles: true,
    includeFormData: true,
    includeMetadata: true,
    format: 'zip' as 'zip' | 'pdf' | 'json'
  });

  // Load documents for this application
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('application_id', application.id);

        if (error) {
          console.error('Failed to load documents:', error);
          setDocuments([]);
        } else {
          setDocuments(data || []);
        }
      } catch (error) {
        console.error('Error loading documents:', error);
        setDocuments([]);
      }
    };

    loadDocuments();
  }, [application.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const generateApplicationReport = (): string => {
    const report = `
UK ELECTRONIC TRAVEL AUTHORIZATION (ETA)
APPLICATION EXPORT REPORT

═══════════════════════════════════════════════════════════════════════════════

APPLICATION SUMMARY
═══════════════════════════════════════════════════════════════════════════════

Reference Number:     ${application.reference_number}
Application Type:     ${application.application_type?.toUpperCase() || 'INDIVIDUAL'}
Current Status:       ${application.status?.toUpperCase()}
Payment Status:       ${application.payment_status?.toUpperCase()}
Payment Amount:       £${(application.payment_amount / 100).toFixed(2)}

Submitted:            ${application.submitted_at ? formatDate(application.submitted_at) : 'Not submitted'}
Created:              ${formatDate(application.created_at)}
Last Updated:         ${formatDate(application.updated_at)}

Contact Email:        ${application.user_email}

═══════════════════════════════════════════════════════════════════════════════

APPLICANT DETAILS
═══════════════════════════════════════════════════════════════════════════════

${application.applicants?.map((applicant, index) => `
APPLICANT ${index + 1}:
─────────────────────────────────────────────────────────────────────────────

Personal Information:
  Full Name:          ${applicant.first_name} ${applicant.last_name}
  Date of Birth:      ${applicant.date_of_birth}
  Nationality:        ${applicant.nationality}
  
Contact Information:
  Email:              ${applicant.email || 'Not provided'}
  Phone:              ${applicant.phone || 'Not provided'}

Passport Details:
  Passport Number:    ${applicant.passport_number || 'Not provided'}
  Issue Date:         ${applicant.passport_issue_date || 'Not provided'}
  Expiry Date:        ${applicant.passport_expiry_date || 'Not provided'}

Document Status:
  Passport Photo:     ${applicant.passportPhoto ? '✓ Uploaded' : '✗ Missing'}
  Personal Photo:     ${applicant.personalPhoto ? '✓ Uploaded' : '✗ Missing'}

`).join('\n') || 'No applicant data available'}

═══════════════════════════════════════════════════════════════════════════════

EXPORT INFORMATION
═══════════════════════════════════════════════════════════════════════════════

Export Date:          ${formatDate(new Date().toISOString())}
Exported By:          UK ETA Admin System
Export Format:        ${exportOptions.format.toUpperCase()}
Files Included:       ${exportOptions.includeFiles ? 'Yes' : 'No'}

Total Files:          ${documents.length}

═══════════════════════════════════════════════════════════════════════════════

This export contains all submitted information for application ${application.reference_number}.
All personal data is handled in accordance with UK Data Protection Act 2018.

CONFIDENTIAL - UK GOVERNMENT INTERNAL USE ONLY
`;

    return report.trim();
  };

  const dataUrlToBlob = (dataUrl: string): Blob => {
    const byteCharacters = atob(dataUrl.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'image/jpeg' });
  };

  const exportAsZip = async () => {
    const zip = new JSZip();
    
    // Add application report
    if (exportOptions.includeFormData) {
      zip.file(`${application.reference_number}_application_report.txt`, generateApplicationReport());
    }

    // Add JSON data
    if (exportOptions.includeMetadata) {
      zip.file(`${application.reference_number}_data.json`, JSON.stringify(application, null, 2));
    }

    // Add files from documents table
    if (exportOptions.includeFiles && documents.length > 0) {
      // Group documents by applicant
      const docsByApplicant = new Map();
      
      for (const doc of documents) {
        const applicantId = doc.applicant_id;
        if (!docsByApplicant.has(applicantId)) {
          docsByApplicant.set(applicantId, []);
        }
        docsByApplicant.get(applicantId).push(doc);
      }

      // Create folders for each applicant with documents
      for (const [applicantId, docs] of docsByApplicant.entries()) {
        const applicant = application.applicants?.find(a => a.id === applicantId);
        if (!applicant) continue;

        const applicantFolder = zip.folder(`applicant_${applicant.first_name}_${applicant.last_name}`);
        
        for (const doc of docs) {
          if (doc.metadata?.image_data) {
            try {
              const blob = dataUrlToBlob(doc.metadata.image_data);
              const fileName = doc.file_name || `${doc.document_type}.jpg`;
              applicantFolder?.file(fileName, blob);
            } catch (error) {
              console.error('Failed to process document:', doc.file_name, error);
            }
          }
        }
      }
    }

    // Generate and download
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `UK_ETA_${application.reference_number}_Complete_Export.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportAsJSON = () => {
    const exportData = {
      export_info: {
        export_date: new Date().toISOString(),
        export_format: 'JSON',
        exported_by: 'UK ETA Admin System'
      },
      application: application,
      files_included: exportOptions.includeFiles,
      metadata_included: exportOptions.includeMetadata
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `UK_ETA_${application.reference_number}_data.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      if (exportOptions.format === 'zip') {
        await exportAsZip();
      } else if (exportOptions.format === 'json') {
        exportAsJSON();
      }
      
      toast.success('Export completed!', {
        description: `Application ${application.reference_number} exported successfully`
      });
      
      onExport?.(exportOptions.format);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed', {
        description: 'Please try again or contact support'
      });
    } finally {
      setIsExporting(false);
    }
  };

  const totalFiles = documents.length;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Package className="h-4 w-4 mr-2" />
          Export Complete Application
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Export Application {application.reference_number}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Application Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Export Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Reference:</strong> {application.reference_number}
                </div>
                <div>
                  <strong>Status:</strong> 
                  <Badge className="ml-2" variant={
                    application.status === 'approved' ? 'default' :
                    application.status === 'rejected' ? 'destructive' :
                    'secondary'
                  }>
                    {application.status}
                  </Badge>
                </div>
                <div>
                  <strong>Applicants:</strong> {application.applicants?.length || 0}
                </div>
                <div>
                  <strong>Files:</strong> {totalFiles} documents
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Export Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeFiles"
                    checked={exportOptions.includeFiles}
                    onCheckedChange={(checked) => 
                      setExportOptions(prev => ({ ...prev, includeFiles: checked as boolean }))
                    }
                  />
                  <label htmlFor="includeFiles" className="text-sm font-medium">
                    Include uploaded files ({totalFiles} documents)
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeFormData"
                    checked={exportOptions.includeFormData}
                    onCheckedChange={(checked) => 
                      setExportOptions(prev => ({ ...prev, includeFormData: checked as boolean }))
                    }
                  />
                  <label htmlFor="includeFormData" className="text-sm font-medium">
                    Include formatted application report
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeMetadata"
                    checked={exportOptions.includeMetadata}
                    onCheckedChange={(checked) => 
                      setExportOptions(prev => ({ ...prev, includeMetadata: checked as boolean }))
                    }
                  />
                  <label htmlFor="includeMetadata" className="text-sm font-medium">
                    Include raw JSON data and metadata
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Export Format:</label>
                <div className="flex gap-2">
                  <Button
                    variant={exportOptions.format === 'zip' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setExportOptions(prev => ({ ...prev, format: 'zip' }))}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    ZIP Archive
                  </Button>
                  <Button
                    variant={exportOptions.format === 'json' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setExportOptions(prev => ({ ...prev, format: 'json' }))}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    JSON Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What Will Be Exported */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                What Will Be Exported
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {exportOptions.includeFormData && (
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Complete application form data (names, passport info, contact details)
                  </li>
                )}
                {exportOptions.includeFiles && totalFiles > 0 && (
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    All uploaded files ({totalFiles} documents) organized by applicant
                  </li>
                )}
                {exportOptions.includeMetadata && (
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Application metadata (timestamps, status history, payment info)
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Export report with date/time and admin information
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Export Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleExport} 
              disabled={isExporting}
              className="min-w-40"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export Application
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};