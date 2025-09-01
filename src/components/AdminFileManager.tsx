import React, { useState, useEffect } from 'react';
import { Download, Eye, FileText, Camera, Shield, AlertCircle, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';

interface ApplicantFile {
  id: string;
  type: 'passport' | 'photo';
  data: string; // base64 data URL from metadata
  quality?: number;
  filename: string;
  size: number;
  uploadDate: string;
  verification_status: string;
  original_name?: string;
}

interface ApplicantData {
  id: string;
  first_name: string;
  last_name: string;
  passport_number?: string;
  email?: string;
}

interface AdminFileManagerProps {
  applicant: ApplicantData;
  applicationRef: string;
}

export const AdminFileManager: React.FC<AdminFileManagerProps> = ({
  applicant,
  applicationRef
}) => {
  const [files, setFiles] = useState<ApplicantFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewFile, setPreviewFile] = useState<ApplicantFile | null>(null);

  // Load documents for this applicant
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const { data: documents, error } = await supabase
          .from('documents')
          .select('*')
          .eq('applicant_id', applicant.id)
          .in('document_type', ['passport', 'photo']);

        if (error) {
          console.error('Failed to load documents:', error);
          setFiles([]);
          return;
        }

        const fileList: ApplicantFile[] = documents.map(doc => ({
          id: doc.id,
          type: doc.document_type as 'passport' | 'photo',
          data: doc.metadata?.image_data || '',
          quality: doc.metadata?.quality_score,
          filename: doc.file_name,
          size: doc.file_size,
          uploadDate: doc.created_at,
          verification_status: doc.verification_status,
          original_name: doc.metadata?.original_name
        }));

        setFiles(fileList);
      } catch (error) {
        console.error('Error loading documents:', error);
        setFiles([]);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [applicant.id]);

  const downloadFile = (file: ApplicantFile) => {
    try {
      // Convert base64 to blob
      const byteCharacters = atob(file.data.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.filename || `${file.type}_photo.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const downloadAllFiles = () => {
    files.forEach(file => {
      setTimeout(() => downloadFile(file), 100 * files.indexOf(file)); // Stagger downloads
    });
  };

  const getFileSize = (dataUrl: string): string => {
    try {
      const base64 = dataUrl.split(',')[1];
      const sizeInBytes = (base64.length * 3) / 4;
      if (sizeInBytes < 1024) return `${sizeInBytes.toFixed(0)} B`;
      if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(1)} KB`;
      return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
    } catch {
      return 'Unknown';
    }
  };

  const getQualityBadge = (quality?: number) => {
    if (!quality) return null;
    
    if (quality >= 75) {
      return <Badge className="bg-green-100 text-green-800 border-green-300">Excellent ({quality}%)</Badge>;
    } else if (quality >= 50) {
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Acceptable ({quality}%)</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800 border-red-300">Poor ({quality}%)</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-600">Loading documents...</p>
        </CardContent>
      </Card>
    );
  }

  if (files.length === 0) {
    return (
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertCircle className="h-4 w-4 text-yellow-600" />
        <AlertDescription>
          No files uploaded for this applicant yet.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Document Files ({files.length})
          </CardTitle>
          {files.length > 1 && (
            <Button onClick={downloadAllFiles} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                {file.type === 'passport' ? (
                  <FileText className="h-5 w-5 text-blue-600" />
                ) : (
                  <Camera className="h-5 w-5 text-blue-600" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium capitalize">
                    {file.type === 'passport' ? 'Passport Photo' : 'Personal Photo'}
                  </h4>
                  {getQualityBadge(file.quality)}
                  <Badge variant={file.verification_status === 'verified' ? 'default' : 'secondary'}>
                    {file.verification_status}
                  </Badge>
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Size: {getFileSize(file.data)}</p>
                  <p className="font-mono text-xs">{file.filename}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>
                      {applicant.first_name} {applicant.last_name} - {file.type === 'passport' ? 'Passport Photo' : 'Personal Photo'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <img
                        src={file.data}
                        alt={`${file.type} photo`}
                        className="max-w-full max-h-96 rounded-lg shadow-lg"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>File Details:</strong>
                        <ul className="mt-1 space-y-1 text-gray-600">
                          <li>Type: {file.type === 'passport' ? 'Passport Photo' : 'Personal Photo'}</li>
                          <li>Size: {getFileSize(file.data)}</li>
                          <li>Format: JPEG</li>
                        </ul>
                      </div>
                      <div>
                        <strong>Applicant:</strong>
                        <ul className="mt-1 space-y-1 text-gray-600">
                          <li>Name: {applicant.first_name} {applicant.last_name}</li>
                          <li>Email: {applicant.email || 'Not provided'}</li>
                          <li>Passport: {applicant.passport_number || 'Not provided'}</li>
                        </ul>
                      </div>
                    </div>

                    {file.quality && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <strong>Photo Quality Analysis</strong>
                          {getQualityBadge(file.quality)}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${
                              file.quality >= 75 ? 'bg-green-500' :
                              file.quality >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${file.quality}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          {file.quality >= 75 ? 'Meets all government requirements' :
                           file.quality >= 50 ? 'Acceptable but could be improved' :
                           'Below recommended quality standards'}
                        </p>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              <Button onClick={() => downloadFile(file)} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        ))}

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">File Security Notice</p>
              <p className="text-blue-700">
                All files have been automatically processed for security (EXIF data removed, 
                malware scanned) and quality validated using AI analysis.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};