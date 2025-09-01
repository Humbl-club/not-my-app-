import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Smartphone,
  Check, 
  X, 
  AlertCircle, 
  RotateCcw, 
  Shield,
  FileImage,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SecurityService } from '@/services/securityService';
import { imageAnalysisService } from '@/services/imageAnalysisService.lazy';
import { toast } from 'sonner';

interface EnhancedPhotoCaptureProps {
  onPhotoCapture: (photoData: string, analysisScore: number, metadata?: any) => void;
  fieldName: string;
  title?: string;
  documentType?: 'passport' | 'personal' | 'other';
}

export const EnhancedPhotoCapture: React.FC<EnhancedPhotoCaptureProps> = ({
  onPhotoCapture,
  fieldName,
  title = 'Capture Photo',
  documentType = 'personal'
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'mobile'>('upload');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mobileFileInputRef = useRef<HTMLInputElement>(null);

  // Load face detection models on mount
  useEffect(() => {
    // Models will be loaded automatically when needed
  }, []);

  // Clean up camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: documentType === 'passport' ? 'environment' : 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCapturing(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Camera Access Failed', {
        description: 'Please ensure you have granted camera permissions'
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
  };

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      ctx?.drawImage(video, 0, 0);
      
      const photoData = canvas.toDataURL('image/jpeg', 0.95);
      
      // Strip EXIF data for privacy
      const cleanedPhoto = await SecurityService.stripEXIFData(photoData);
      setCapturedPhoto(cleanedPhoto);
      stopCamera();
      
      // Analyze the photo
      await analyzePhoto(cleanedPhoto);
    }
  };

  const analyzePhoto = async (photoData: string) => {
    setAnalyzing(true);
    
    try {
      // Convert data URL to blob for analysis
      const response = await fetch(photoData);
      const blob = await response.blob();
      
      // Run comprehensive analysis
      const result = await imageAnalysisService.analyzeImage(dataUrl, { requireFaceDetection: true });
      setAnalysis(result);
      
      // Show appropriate feedback
      if (result.score >= 75) {
        toast.success('Excellent photo quality!', {
          description: 'This photo meets all government requirements'
        });
      } else if (result.score >= 50) {
        toast.warning('Photo quality is acceptable', {
          description: 'Some improvements could be made'
        });
      } else {
        toast.error('Photo quality issues detected', {
          description: 'Please review the requirements and try again'
        });
      }
    } catch (error) {
      console.error('Photo analysis failed:', error);
      toast.error('Analysis failed', {
        description: 'Could not analyze photo quality'
      });
      
      // Provide basic score if analysis fails
      setAnalysis({
        score: 50,
        passes: ['Photo uploaded successfully'],
        warnings: ['Advanced analysis not available'],
        failures: [],
        metadata: {}
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Security validation
    const validation = await SecurityService.validateFile(file);
    if (!validation.isValid) {
      toast.error('Security Check Failed', {
        description: validation.reason
      });
      return;
    }
    
    // Rate limiting check
    if (!SecurityService.checkRateLimit('photo_upload', 5, 60000)) {
      toast.error('Too many uploads', {
        description: 'Please wait before uploading another photo'
      });
      return;
    }
    
    // Check if compression is needed
    let processedFile = file;
    if (file.size > 1024 * 1024) { // If larger than 1MB
      toast.info('Compressing image...', {
        description: 'Optimizing for faster upload'
      });
      // Use browser-image-compression directly
      const imageCompression = (await import('browser-image-compression')).default;
      processedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      });
    }
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      const photoData = e.target?.result as string;
      
      // Strip EXIF data for privacy
      const cleanedPhoto = await SecurityService.stripEXIFData(photoData);
      setCapturedPhoto(cleanedPhoto);
      
      // Analyze the photo
      await analyzePhoto(cleanedPhoto);
    };
    reader.readAsDataURL(processedFile);
  };

  const handleMobileCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // This input accepts both camera capture and file selection on mobile
    await handleFileUpload(event);
  };

  const acceptPhoto = () => {
    if (capturedPhoto && analysis) {
      onPhotoCapture(capturedPhoto, analysis.score, analysis.metadata);
      // Reset state for next photo
      setCapturedPhoto(null);
      setAnalysis(null);
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    setAnalysis(null);
    setActiveTab('upload');
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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <Badge variant="outline" className="ml-2">
            <Shield className="h-3 w-3 mr-1" />
            Secure Upload
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Photo Requirements */}
        <Alert className="border-primary/20 bg-primary/5">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertDescription>
            <div className="font-semibold mb-2">
              {documentType === 'passport' ? 'Passport Photo' : 'Personal Photo'} Requirements:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                <strong>Quality:</strong>
                <ul className="ml-4 mt-1">
                  <li>• High resolution (600x600 minimum)</li>
                  <li>• Good lighting, no shadows</li>
                  <li>• Sharp and in focus</li>
                </ul>
              </div>
              <div>
                <strong>Content:</strong>
                <ul className="ml-4 mt-1">
                  <li>• Plain, light background</li>
                  <li>• Face clearly visible and centered</li>
                  <li>• No filters or editing</li>
                  {documentType === 'personal' && (
                    <>
                      <li>• Neutral expression</li>
                      <li>• No glasses with glare</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        {!capturedPhoto ? (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </TabsTrigger>
              <TabsTrigger value="camera">
                <Camera className="h-4 w-4 mr-2" />
                Use Webcam
              </TabsTrigger>
              <TabsTrigger value="mobile">
                <Smartphone className="h-4 w-4 mr-2" />
                Mobile Camera
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <FileImage className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-4">
                  Click to browse or drag and drop your photo here
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="mx-auto"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  JPG or PNG • Max 5MB • Min 600x600px
                </p>
              </div>
            </TabsContent>

            <TabsContent value="camera" className="space-y-4">
              {isCapturing ? (
                <div className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-80 border-2 border-white/50 rounded-lg">
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-xs bg-black/50 px-2 py-1 rounded">
                        Position face within frame
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={capturePhoto}
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                  >
                    Take Photo
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 bg-muted/50 rounded-lg">
                  <Camera className="h-12 w-12 text-muted-foreground mb-4" />
                  <Button onClick={startCamera}>
                    <Camera className="h-4 w-4 mr-2" />
                    Start Camera
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="mobile" className="space-y-4">
              <div className="text-center p-8 bg-muted/50 rounded-lg">
                <Smartphone className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-4">
                  Use your phone's camera or photo library
                </p>
                <Button
                  onClick={() => mobileFileInputRef.current?.click()}
                  className="mx-auto"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Open Camera / Photos
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Works best on mobile devices
                </p>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-4">
            {/* Preview */}
            <div className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden">
              <img
                src={capturedPhoto}
                alt="Captured"
                className="w-full h-full object-contain"
              />
              {analyzing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-white text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p>Analyzing photo quality...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Analysis Results */}
            {analysis && !analyzing && (
              <div className="space-y-4">
                {/* Score */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getScoreIcon(analysis.score)}
                    <div>
                      <p className="font-semibold">Quality Score</p>
                      <p className="text-sm text-muted-foreground">
                        {analysis.score >= 75 ? 'Excellent' :
                         analysis.score >= 50 ? 'Acceptable' : 'Poor'}
                      </p>
                    </div>
                  </div>
                  <div className={`text-3xl font-bold ${getScoreColor(analysis.score)}`}>
                    {analysis.score}%
                  </div>
                </div>

                <Progress 
                  value={analysis.score} 
                  className={`h-3 ${
                    analysis.score >= 75 ? '[&>div]:bg-green-500' :
                    analysis.score >= 50 ? '[&>div]:bg-yellow-500' :
                    '[&>div]:bg-red-500'
                  }`}
                />

                {/* Detailed Results */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Passes */}
                  {analysis.passes.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-green-600 flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        Passed Checks
                      </h4>
                      <ul className="space-y-1">
                        {analysis.passes.map((pass: string, i: number) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-1">
                            <Check className="h-3 w-3 mt-0.5 text-green-600 shrink-0" />
                            <span>{pass}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Warnings */}
                  {analysis.warnings.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-yellow-600 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Warnings
                      </h4>
                      <ul className="space-y-1">
                        {analysis.warnings.map((warning: string, i: number) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-1">
                            <AlertTriangle className="h-3 w-3 mt-0.5 text-yellow-600 shrink-0" />
                            <span>{warning}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Failures */}
                  {analysis.failures.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-red-600 flex items-center gap-2">
                        <X className="h-4 w-4" />
                        Failed Requirements
                      </h4>
                      <ul className="space-y-1">
                        {analysis.failures.map((failure: string, i: number) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-1">
                            <X className="h-3 w-3 mt-0.5 text-red-600 shrink-0" />
                            <span>{failure}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Metadata */}
                {analysis.metadata && (
                  <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded space-y-1">
                    <p>Resolution: {analysis.metadata.width}x{analysis.metadata.height}px</p>
                    <p>File size: {(analysis.metadata.fileSize / 1024).toFixed(0)}KB</p>
                    {analysis.metadata.faceDetected !== undefined && (
                      <p>Face detection: {analysis.metadata.faceDetected ? 'Yes' : 'No'}</p>
                    )}
                  </div>
                )}

                {/* Warning for low scores */}
                {analysis.score < 50 && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-sm">
                      This photo does not meet government requirements. Please retake following the guidelines.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {/* Action Buttons */}
            {analysis && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={retakePhoto}
                  className="flex-1"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button 
                  onClick={acceptPhoto}
                  className="flex-1"
                  variant={analysis.score >= 50 ? "default" : "secondary"}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Use This Photo
                  {analysis.score < 50 && " Anyway"}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        {/* Mobile camera input with capture attribute */}
        <input
          ref={mobileFileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleMobileCapture}
          className="hidden"
        />

        {/* Canvas for photo capture */}
        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  );
};