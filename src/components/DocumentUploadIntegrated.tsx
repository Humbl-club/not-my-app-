/**
 * Integrated Document Upload Component
 * Handles photo and document uploads with Supabase Storage integration
 */

import React, { useState, useCallback } from 'react';
import { 
  Upload, 
  Camera, 
  FileImage,
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle,
  Shield,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { documentService } from '@/services/supabaseService';
import { applicationIntegration } from '@/services/applicationIntegrationService';
import { imageAnalysisService } from '@/services/imageAnalysisService.lazy';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface DocumentUploadIntegratedProps {
  applicantId: string;
  documentType: 'passport' | 'photo' | 'supporting';
  onUploadComplete?: (documentId: string, metadata?: any) => void;
  onError?: (error: string) => void;
  required?: boolean;
}

export const DocumentUploadIntegrated: React.FC<DocumentUploadIntegratedProps> = ({
  applicantId,
  documentType,
  onUploadComplete,
  onError,
  required = true
}) => {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedDocument, setUploadedDocument] = useState<{
    id: string;
    name: string;
    score?: number;
  } | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const getDocumentTitle = () => {
    switch (documentType) {
      case 'passport':
        return t('documents.passport_scan');
      case 'photo':
        return t('documents.passport_photo');
      case 'supporting':
        return t('documents.supporting_documents');
      default:
        return t('documents.upload_document');
    }
  };

  const getDocumentRequirements = () => {
    if (documentType === 'photo') {
      return [
        'Clear, recent photograph',
        'White or light background',
        'Face clearly visible',
        'No glasses or head coverings (unless religious)',
        'Minimum 600x600 pixels',
        'Maximum file size: 5MB'
      ];
    } else if (documentType === 'passport') {
      return [
        'Clear scan or photo of passport bio page',
        'All details clearly readable',
        'No glare or shadows',
        'Include machine-readable zone',
        'Maximum file size: 10MB'
      ];
    } else {
      return [
        'Clear, readable document',
        'PDF or image format',
        'Maximum file size: 10MB'
      ];
    }
  };

  const validateFile = async (file: File): Promise<{ valid: boolean; error?: string }> => {
    // Check file type
    const allowedTypes = documentType === 'photo' 
      ? ['image/jpeg', 'image/png', 'image/jpg']
      : ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

    if (!allowedTypes.includes(file.type)) {
      return { 
        valid: false, 
        error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}` 
      };
    }

    // Check file size
    const maxSize = documentType === 'photo' ? 5242880 : 10485760; // 5MB or 10MB
    if (file.size > maxSize) {
      return { 
        valid: false, 
        error: `File too large. Maximum size: ${maxSize / 1048576}MB` 
      };
    }

    // For photos, perform additional validation
    if (documentType === 'photo' && file.type.startsWith('image/')) {
      try {
        setAnalyzing(true);
        
        // Create preview URL
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        // Analyze the photo
        const analysis = await imageAnalysisService.analyzePhoto(url);
        setAnalysisResult(analysis);

        if (analysis.score < 50) {
          return { 
            valid: false, 
            error: 'Photo quality too low. Please upload a clearer image.' 
          };
        }

        return { valid: true };
      } catch (error) {
        console.error('Photo analysis failed:', error);
        return { valid: true }; // Allow upload even if analysis fails
      } finally {
        setAnalyzing(false);
      }
    }

    return { valid: true };
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset state
    setUploadedDocument(null);
    setAnalysisResult(null);
    setUploadProgress(0);

    // Validate file
    const validation = await validateFile(file);
    if (!validation.valid) {
      toast.error(validation.error || 'Invalid file');
      if (onError) onError(validation.error || 'Invalid file');
      return;
    }

    // Upload to Supabase
    await uploadToSupabase(file);
  };

  const uploadToSupabase = async (file: File) => {
    setUploading(true);
    setUploadProgress(10);

    try {
      // Simulate progress (real progress tracking would require XMLHttpRequest)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Upload document
      const result = await applicationIntegration.uploadDocument(
        applicantId,
        file,
        documentType,
        analysisResult?.score
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success && result.documentId) {
        setUploadedDocument({
          id: result.documentId,
          name: file.name,
          score: analysisResult?.score
        });

        toast.success(`${getDocumentTitle()} uploaded successfully!`);
        
        if (onUploadComplete) {
          onUploadComplete(result.documentId, {
            fileName: file.name,
            fileSize: file.size,
            analysisScore: analysisResult?.score,
            analysisDetails: analysisResult
          });
        }
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload document');
      
      if (onError) {
        onError(error.message || 'Upload failed');
      }
    } finally {
      setUploading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 75) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score >= 50) return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            {documentType === 'photo' ? <Camera className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
            {getDocumentTitle()}
          </span>
          {required && (
            <Badge variant="destructive" className="text-xs">
              Required
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Requirements List */}
        <div className="bg-blue-50 p-4 rounded-lg space-y-2">
          <h4 className="font-medium text-sm text-blue-900 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Requirements:
          </h4>
          <ul className="text-xs text-blue-800 space-y-1">
            {getDocumentRequirements().map((req, index) => (
              <li key={index} className="flex items-start gap-1">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Upload Area */}
        {!uploadedDocument ? (
          <div className="space-y-4">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer relative"
              onClick={() => document.getElementById(`file-input-${applicantId}-${documentType}`)?.click()}
            >
              {uploading ? (
                <div className="space-y-3">
                  <Loader2 className="h-10 w-10 mx-auto text-blue-600 animate-spin" />
                  <p className="text-sm text-gray-600">Uploading...</p>
                  <Progress value={uploadProgress} className="max-w-xs mx-auto" />
                </div>
              ) : analyzing ? (
                <div className="space-y-3">
                  <Loader2 className="h-10 w-10 mx-auto text-blue-600 animate-spin" />
                  <p className="text-sm text-gray-600">Analyzing image quality...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="h-10 w-10 mx-auto text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {documentType === 'photo' 
                        ? 'JPG, PNG up to 5MB'
                        : 'JPG, PNG, PDF up to 10MB'
                      }
                    </p>
                  </div>
                </div>
              )}
              
              <input
                id={`file-input-${applicantId}-${documentType}`}
                type="file"
                accept={documentType === 'photo' 
                  ? "image/jpeg,image/jpg,image/png"
                  : "image/jpeg,image/jpg,image/png,application/pdf"
                }
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading || analyzing}
              />
            </div>

            {/* Preview */}
            {previewUrl && documentType === 'photo' && (
              <div className="flex justify-center">
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Photo preview"
                    className="max-w-xs max-h-64 rounded-lg shadow-lg"
                  />
                  {analysisResult && (
                    <div className="absolute top-2 right-2 bg-white rounded-lg shadow-md p-2">
                      <div className="flex items-center gap-1">
                        {getScoreIcon(analysisResult.score)}
                        <span className={`font-bold text-sm ${getScoreColor(analysisResult.score)}`}>
                          {analysisResult.score}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Analysis Results */}
            {analysisResult && documentType === 'photo' && (
              <Alert className={
                analysisResult.score >= 75 ? 'border-green-200 bg-green-50' :
                analysisResult.score >= 50 ? 'border-yellow-200 bg-yellow-50' :
                'border-red-200 bg-red-50'
              }>
                <AlertDescription className="space-y-2">
                  <div className="font-medium">
                    Photo Quality Score: {analysisResult.score}%
                  </div>
                  {analysisResult.issues && analysisResult.issues.length > 0 && (
                    <div className="text-sm space-y-1">
                      <p className="font-medium">Issues detected:</p>
                      <ul className="list-disc list-inside">
                        {analysisResult.issues.map((issue: string, index: number) => (
                          <li key={index}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </div>
        ) : (
          /* Success State */
          <div className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="ml-2">
                <div className="font-medium">Document uploaded successfully!</div>
                <div className="text-sm text-gray-600 mt-1">
                  File: {uploadedDocument.name}
                  {uploadedDocument.score && (
                    <span className="ml-2">
                      (Quality: {uploadedDocument.score}%)
                    </span>
                  )}
                </div>
              </AlertDescription>
            </Alert>

            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setUploadedDocument(null);
                  setPreviewUrl(null);
                  setAnalysisResult(null);
                }}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Replace Document
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentUploadIntegrated;