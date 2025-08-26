import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, Check, X, AlertCircle, RotateCcw, Upload, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { SecurityService } from '@/services/securityService';
import { toast } from 'sonner';

interface PhotoCaptureProps {
  onPhotoCapture: (photoData: string, analysisScore: number) => void;
  fieldName: string;
  title?: string;
}

interface PhotoAnalysis {
  score: number;
  issues: string[];
  passes: string[];
}

export const PhotoCapture: React.FC<PhotoCaptureProps> = ({
  onPhotoCapture,
  fieldName,
  title = 'Capture Photo'
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<PhotoAnalysis | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCapturing(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please ensure you have granted camera permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
  };

  const analyzePhoto = (imageData: string): PhotoAnalysis => {
    // Simple client-side photo analysis for government ID photos
    const img = new Image();
    img.src = imageData;
    
    const analysis: PhotoAnalysis = {
      score: 0,
      issues: [],
      passes: []
    };

    // Simulate analysis (in production, this would use computer vision APIs)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      if (!imageData) return analysis;
      
      // Basic quality checks
      const pixels = imageData.data;
      let brightness = 0;
      let whitePixels = 0;
      
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        
        brightness += (r + g + b) / 3;
        
        // Check for white/light background
        if (r > 200 && g > 200 && b > 200) {
          whitePixels++;
        }
      }
      
      const avgBrightness = brightness / (pixels.length / 4);
      const whitePercentage = (whitePixels / (pixels.length / 4)) * 100;
      
      // Scoring logic
      let score = 0;
      
      // Check brightness (should be well-lit)
      if (avgBrightness > 100 && avgBrightness < 200) {
        score += 25;
        analysis.passes.push('Good lighting');
      } else if (avgBrightness <= 100) {
        analysis.issues.push('Photo is too dark');
      } else {
        analysis.issues.push('Photo is overexposed');
      }
      
      // Check background (should have light background)
      if (whitePercentage > 30) {
        score += 25;
        analysis.passes.push('Light background detected');
      } else {
        analysis.issues.push('Background should be plain and light-colored');
      }
      
      // Check image dimensions
      if (img.width >= 600 && img.height >= 600) {
        score += 25;
        analysis.passes.push('Good resolution');
      } else {
        analysis.issues.push('Photo resolution too low (minimum 600x600)');
      }
      
      // Check aspect ratio (should be roughly square for passport photos)
      const aspectRatio = img.width / img.height;
      if (aspectRatio > 0.8 && aspectRatio < 1.2) {
        score += 25;
        analysis.passes.push('Correct aspect ratio');
      } else {
        analysis.issues.push('Photo should be square or nearly square');
      }
      
      analysis.score = score;
    };
    
    return analysis;
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      ctx?.drawImage(video, 0, 0);
      
      const photoData = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedPhoto(photoData);
      stopCamera();
      
      // Analyze the photo
      setAnalyzing(true);
      setTimeout(() => {
        const result = analyzePhoto(photoData);
        setAnalysis(result);
        setAnalyzing(false);
      }, 1500);
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
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      const photoData = e.target?.result as string;
      
      // Strip EXIF data for privacy
      const cleanedPhoto = await SecurityService.stripEXIFData(photoData);
      setCapturedPhoto(cleanedPhoto);
      
      // Analyze the uploaded photo
      setAnalyzing(true);
      setTimeout(() => {
        const result = analyzePhoto(cleanedPhoto);
        setAnalysis(result);
        setAnalyzing(false);
      }, 1500);
    };
    reader.readAsDataURL(file);
  };

  const acceptPhoto = () => {
    if (capturedPhoto && analysis) {
      onPhotoCapture(capturedPhoto, analysis.score);
      // Reset state
      setCapturedPhoto(null);
      setAnalysis(null);
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    setAnalysis(null);
    startCamera();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Photo Guidelines */}
        <Alert className="border-primary/20 bg-primary/5">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertDescription>
            <div className="font-semibold mb-2">Photo Requirements:</div>
            <ul className="text-sm space-y-1 ml-4">
              <li>• Plain, light-colored background</li>
              <li>• Face clearly visible and centered</li>
              <li>• Good lighting without shadows</li>
              <li>• No glasses with glare or tinted lenses</li>
              <li>• No hats or head coverings (unless for religious reasons)</li>
              <li>• Neutral expression with mouth closed</li>
              <li>• Photo taken within the last 6 months</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Camera/Preview Area */}
        <div className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden">
          {isCapturing && (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Overlay guide */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-60 border-2 border-white/50 rounded-lg">
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-xs bg-black/50 px-2 py-1 rounded">
                    Position face here
                  </div>
                </div>
              </div>
            </>
          )}
          
          {capturedPhoto && !isCapturing && (
            <img
              src={capturedPhoto}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          )}
          
          {!isCapturing && !capturedPhoto && (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <Camera className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">
                Click "Start Camera" to take a photo or upload an existing one
              </p>
            </div>
          )}
        </div>

        {/* Analysis Results */}
        {analyzing && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Analyzing photo quality...</p>
            <Progress value={66} className="h-2" />
          </div>
        )}

        {analysis && !analyzing && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Quality Score:</span>
              <span className={`text-lg font-bold ${
                analysis.score >= 75 ? 'text-green-600' : 
                analysis.score >= 50 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {analysis.score}%
              </span>
            </div>
            
            <Progress 
              value={analysis.score} 
              className={`h-2 ${
                analysis.score >= 75 ? '[&>div]:bg-green-600' : 
                analysis.score >= 50 ? '[&>div]:bg-yellow-600' : '[&>div]:bg-red-600'
              }`}
            />
            
            {analysis.passes.length > 0 && (
              <div className="space-y-1">
                {analysis.passes.map((pass, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-green-600">
                    <Check className="h-3 w-3" />
                    <span>{pass}</span>
                  </div>
                ))}
              </div>
            )}
            
            {analysis.issues.length > 0 && (
              <div className="space-y-1">
                {analysis.issues.map((issue, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-red-600">
                    <X className="h-3 w-3" />
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            )}

            {analysis.score < 75 && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-sm">
                  Your photo may not meet all requirements. You can retake it or proceed anyway.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Control Buttons */}
        <div className="flex gap-2">
          {!isCapturing && !capturedPhoto && (
            <>
              <Button onClick={startCamera} className="flex-1">
                <Camera className="h-4 w-4 mr-2" />
                Start Camera
              </Button>
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo
              </Button>
            </>
          )}
          
          {isCapturing && (
            <Button onClick={capturePhoto} className="w-full">
              Take Photo
            </Button>
          )}
          
          {capturedPhoto && analysis && (
            <>
              <Button 
                variant="outline" 
                onClick={retakePhoto}
                className="flex-1"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake
              </Button>
              <Button 
                onClick={acceptPhoto}
                className="flex-1"
                variant={analysis.score >= 50 ? "default" : "secondary"}
              >
                <Check className="h-4 w-4 mr-2" />
                Use This Photo
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};