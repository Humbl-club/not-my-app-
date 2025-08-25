import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, FileImage, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  validateFile, 
  validatePassportPhoto, 
  validatePersonalPhoto,
  createFilePreview, 
  revokeFilePreview,
  uploadFile 
} from '@/utils/fileValidator';

interface SecureDocumentUploadProps {
  type: 'passport' | 'personal';
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  className?: string;
}

export const SecureDocumentUpload: React.FC<SecureDocumentUploadProps> = ({
  type,
  value,
  onChange,
  error,
  required = true,
  className
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const validationFunction = type === 'passport' ? validatePassportPhoto : validatePersonalPhoto;

  const handleFileSelect = async (file: File) => {
    setUploadError(null);
    
    // Validate file
    const validation = validationFunction(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file');
      return;
    }

    // Create preview
    const previewUrl = createFilePreview(file);
    setPreview(previewUrl);

    // Upload file
    setIsUploading(true);
    try {
      const uploadedUrl = await uploadFile(file, type);
      onChange?.(uploadedUrl);
    } catch (err) {
      setUploadError('Upload failed. Please try again.');
      // Clean up preview on error
      revokeFilePreview(previewUrl);
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = () => {
    if (preview) {
      revokeFilePreview(preview);
      setPreview(null);
    }
    onChange?.('');
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const hasFile = value || preview;
  const displayError = error || uploadError;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Upload Area */}
      <Card className={cn(
        "border-2 border-dashed transition-colors cursor-pointer",
        dragActive && "border-primary bg-primary/5",
        displayError && "border-destructive bg-destructive/5",
        hasFile && "border-success bg-success/5"
      )}>
        <CardContent 
          className="p-6"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={!hasFile ? openFileDialog : undefined}
        >
          {!hasFile ? (
            <div className="text-center space-y-4">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <div className="space-y-2">
                <p className="text-base font-medium">
                  {t(`application.documents.${type}.upload.title`)}
                  {required && <span className="text-destructive ml-1">*</span>}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t(`application.documents.${type}.upload.description`)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('application.documents.upload.requirements')}
                </p>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                disabled={isUploading}
              >
                {isUploading ? (
                  t('application.documents.upload.uploading')
                ) : (
                  t('application.documents.upload.select')
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Preview */}
              {preview && (
                <div className="relative max-w-xs mx-auto">
                  <img
                    src={preview}
                    alt={t(`application.documents.${type}.preview.alt`)}
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleRemove}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              {/* Success message */}
              {value && !uploadError && (
                <div className="flex items-center justify-center gap-2 text-success">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    {t('application.documents.upload.success')}
                  </span>
                </div>
              )}

              {/* Upload new file button */}
              <div className="text-center">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={openFileDialog}
                  disabled={isUploading}
                >
                  <FileImage className="h-4 w-4 mr-2" />
                  {t('application.documents.upload.replace')}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Message */}
      {displayError && (
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{displayError}</span>
        </div>
      )}

      {/* Requirements */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p className="font-medium">
          {t(`application.documents.${type}.requirements.title`)}
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>
            {t(`application.documents.${type}.requirements.format`)}
          </li>
          <li>
            {t(`application.documents.${type}.requirements.size`)}
          </li>
          {type === 'passport' ? (
            <>
              <li>
                {t('application.documents.passport.requirements.pages')}
              </li>
              <li>
                {t('application.documents.passport.requirements.readable')}
              </li>
            </>
          ) : (
            <>
              <li>
                {t('application.documents.personal.requirements.recent')}
              </li>
              <li>
                {t('application.documents.personal.requirements.quality')}
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};