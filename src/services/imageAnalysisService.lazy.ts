/**
 * Optimized Image Analysis Service
 * Lazy loads face-api.js only when needed
 */

export interface ImageAnalysisResult {
  score: number;
  passes: string[];
  warnings: string[];
  errors: string[];
  metadata: {
    width: number;
    height: number;
    fileSize: number;
    brightness: number;
    contrast: number;
    sharpness: number;
    faceDetected: boolean;
    facePosition?: {
      centered: boolean;
      size: string;
    };
  };
}

class ImageAnalysisService {
  private faceApiLoaded = false;
  private faceApi: any = null;

  /**
   * Lazy load face-api.js only when face detection is needed
   */
  private async loadFaceApi() {
    if (this.faceApiLoaded) return this.faceApi;
    
    // Dynamic import - only loads when actually needed
    const faceApiModule = await import('face-api.js');
    this.faceApi = faceApiModule;
    
    // Load models
    const MODEL_URL = '/models';
    await Promise.all([
      this.faceApi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    ]);
    
    this.faceApiLoaded = true;
    return this.faceApi;
  }

  /**
   * Analyze image with optional face detection
   */
  async analyzeImage(
    imageDataUrl: string,
    options: { 
      requireFaceDetection?: boolean;
      quickMode?: boolean; // Skip heavy operations for faster results
    } = {}
  ): Promise<ImageAnalysisResult> {
    const img = new Image();
    img.src = imageDataUrl;
    
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    let score = 0;
    const passes: string[] = [];
    const warnings: string[] = [];
    const errors: string[] = [];

    // Basic checks (no heavy dependencies)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas context not available');
    }

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    // Resolution check
    if (img.width >= 600 && img.height >= 600) {
      passes.push('Resolution meets requirements');
      score += 20;
    } else {
      errors.push('Image must be at least 600x600 pixels');
    }

    // Aspect ratio check
    const aspectRatio = img.width / img.height;
    if (aspectRatio >= 0.8 && aspectRatio <= 1.2) {
      passes.push('Good aspect ratio');
      score += 15;
    } else {
      warnings.push('Image should be roughly square');
    }

    // Quick brightness/contrast check
    let totalBrightness = 0;
    let minBrightness = 255;
    let maxBrightness = 0;

    // Sample pixels for performance (every 10th pixel)
    for (let i = 0; i < pixels.length; i += 40) {
      const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
      totalBrightness += brightness;
      minBrightness = Math.min(minBrightness, brightness);
      maxBrightness = Math.max(maxBrightness, brightness);
    }

    const avgBrightness = totalBrightness / (pixels.length / 40);
    const contrast = maxBrightness - minBrightness;

    if (avgBrightness >= 100 && avgBrightness <= 200) {
      passes.push('Good brightness level');
      score += 15;
    } else {
      warnings.push('Adjust image brightness');
    }

    if (contrast >= 40) {
      passes.push('Sufficient contrast');
      score += 15;
    } else {
      warnings.push('Low contrast detected');
    }

    // Quick sharpness check (simplified)
    const sharpness = this.calculateSharpness(imageData);
    if (sharpness > 50) {
      passes.push('Image appears sharp');
      score += 15;
    } else {
      warnings.push('Image may be blurry');
    }

    // Face detection - only if required and not in quick mode
    let faceDetected = false;
    let facePosition = undefined;

    if (options.requireFaceDetection && !options.quickMode) {
      try {
        const faceApi = await this.loadFaceApi();
        const detections = await faceApi.detectAllFaces(
          img,
          new faceApi.TinyFaceDetectorOptions()
        );

        if (detections.length === 1) {
          faceDetected = true;
          passes.push('Face detected');
          score += 20;

          // Check face position
          const face = detections[0].box;
          const faceCenterX = face.x + face.width / 2;
          const faceCenterY = face.y + face.height / 2;
          const imageCenterX = img.width / 2;
          const imageCenterY = img.height / 2;

          const centered = 
            Math.abs(faceCenterX - imageCenterX) < img.width * 0.15 &&
            Math.abs(faceCenterY - imageCenterY) < img.height * 0.15;

          const faceHeightRatio = face.height / img.height;
          let size = 'good';
          if (faceHeightRatio < 0.5) size = 'small';
          else if (faceHeightRatio > 0.7) size = 'large';

          facePosition = { centered, size };

          if (centered) {
            passes.push('Face is well centered');
          } else {
            warnings.push('Face should be centered');
          }
        } else if (detections.length === 0) {
          errors.push('No face detected');
        } else {
          errors.push('Multiple faces detected');
        }
      } catch (error) {
        console.warn('Face detection failed, continuing without it');
        warnings.push('Face detection unavailable');
      }
    }

    return {
      score: Math.min(100, score),
      passes,
      warnings,
      errors,
      metadata: {
        width: img.width,
        height: img.height,
        fileSize: imageDataUrl.length * 0.75, // Approximate
        brightness: Math.round(avgBrightness),
        contrast: Math.round(contrast),
        sharpness: Math.round(sharpness),
        faceDetected,
        facePosition,
      },
    };
  }

  /**
   * Calculate image sharpness using simplified Laplacian
   */
  private calculateSharpness(imageData: ImageData): number {
    const pixels = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    
    let sharpness = 0;
    let sampleCount = 0;
    
    // Sample every 10th pixel for performance
    for (let y = 1; y < height - 1; y += 10) {
      for (let x = 1; x < width - 1; x += 10) {
        const idx = (y * width + x) * 4;
        const center = pixels[idx];
        
        const top = pixels[((y - 1) * width + x) * 4];
        const bottom = pixels[((y + 1) * width + x) * 4];
        const left = pixels[(y * width + (x - 1)) * 4];
        const right = pixels[(y * width + (x + 1)) * 4];
        
        const laplacian = Math.abs(4 * center - top - bottom - left - right);
        sharpness += laplacian;
        sampleCount++;
      }
    }
    
    return (sharpness / sampleCount) / 2.55; // Normalize to 0-100
  }
}

export const imageAnalysisService = new ImageAnalysisService();