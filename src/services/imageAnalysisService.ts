import * as faceapi from 'face-api.js';
import imageCompression from 'browser-image-compression';

/**
 * Government-grade photo analysis service
 * Validates photos against official document requirements
 */
export class ImageAnalysisService {
  private static modelsLoaded = false;
  private static loadingPromise: Promise<void> | null = null;

  /**
   * Load face detection models (run once on app start)
   */
  static async loadModels(): Promise<void> {
    if (this.modelsLoaded) return;
    
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = (async () => {
      try {
        // Load models from CDN or public folder
        const MODEL_URL = '/models';
        
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
        ]);
        
        this.modelsLoaded = true;
      } catch (error) {
        console.warn('Face detection models not loaded. Using basic analysis only.', error);
        // Continue without face detection - use basic analysis
        this.modelsLoaded = false;
      }
    })();

    return this.loadingPromise;
  }

  /**
   * Comprehensive photo analysis for government documents
   */
  static async analyzePhoto(
    imageFile: File | Blob | string
  ): Promise<{
    score: number;
    passes: string[];
    warnings: string[];
    failures: string[];
    metadata: {
      width: number;
      height: number;
      fileSize: number;
      format: string;
      brightness: number;
      contrast: number;
      sharpness: number;
      hasMultipleFaces: boolean;
      faceDetected: boolean;
      facePosition?: {
        centered: boolean;
        size: 'too-small' | 'too-large' | 'good';
      };
    };
  }> {
    const passes: string[] = [];
    const warnings: string[] = [];
    const failures: string[] = [];
    let score = 0;

    // Convert to image element
    const img = await this.loadImage(imageFile);
    
    // Get image metadata
    const metadata = {
      width: img.width,
      height: img.height,
      fileSize: 0,
      format: 'unknown',
      brightness: 0,
      contrast: 0,
      sharpness: 0,
      hasMultipleFaces: false,
      faceDetected: false,
      facePosition: undefined as any
    };

    // Get file size
    if (imageFile instanceof File) {
      metadata.fileSize = imageFile.size;
      metadata.format = imageFile.type.split('/')[1] || 'unknown';
    } else if (imageFile instanceof Blob) {
      metadata.fileSize = imageFile.size;
      metadata.format = imageFile.type.split('/')[1] || 'unknown';
    }

    // 1. Check resolution (600x600 minimum for government docs)
    if (img.width >= 600 && img.height >= 600) {
      passes.push('Resolution meets requirements (600x600 minimum)');
      score += 15;
    } else if (img.width >= 400 && img.height >= 400) {
      warnings.push(`Resolution is ${img.width}x${img.height} (600x600 recommended)`);
      score += 8;
    } else {
      failures.push(`Resolution too low: ${img.width}x${img.height} (minimum 600x600)`);
    }

    // 2. Check aspect ratio (should be close to square for passport photos)
    const aspectRatio = img.width / img.height;
    if (aspectRatio >= 0.9 && aspectRatio <= 1.1) {
      passes.push('Aspect ratio is correct (square format)');
      score += 10;
    } else if (aspectRatio >= 0.8 && aspectRatio <= 1.2) {
      warnings.push('Photo should be more square');
      score += 5;
    } else {
      failures.push('Aspect ratio incorrect (photo must be square)');
    }

    // 3. Check file size (should be between 50KB and 5MB)
    if (metadata.fileSize > 50 * 1024 && metadata.fileSize < 5 * 1024 * 1024) {
      passes.push('File size is appropriate');
      score += 10;
    } else if (metadata.fileSize < 50 * 1024) {
      warnings.push('File size very small - quality may be too low');
      score += 5;
    } else if (metadata.fileSize > 5 * 1024 * 1024) {
      failures.push('File size exceeds 5MB limit');
    }

    // 4. Analyze image quality
    const qualityMetrics = await this.analyzeImageQuality(img);
    metadata.brightness = qualityMetrics.brightness;
    metadata.contrast = qualityMetrics.contrast;
    metadata.sharpness = qualityMetrics.sharpness;

    // Check brightness (should be well-lit)
    if (qualityMetrics.brightness >= 100 && qualityMetrics.brightness <= 200) {
      passes.push('Good lighting detected');
      score += 15;
    } else if (qualityMetrics.brightness < 100) {
      failures.push('Photo is too dark');
    } else {
      warnings.push('Photo may be overexposed');
      score += 7;
    }

    // Check contrast
    if (qualityMetrics.contrast >= 40) {
      passes.push('Good contrast');
      score += 10;
    } else {
      warnings.push('Low contrast detected');
      score += 5;
    }

    // Check sharpness
    if (qualityMetrics.sharpness >= 50) {
      passes.push('Image is sharp and clear');
      score += 10;
    } else {
      warnings.push('Image may be blurry');
      score += 5;
    }

    // 5. Face detection (if models are loaded)
    if (this.modelsLoaded) {
      try {
        const detections = await faceapi.detectAllFaces(
          img,
          new faceapi.TinyFaceDetectorOptions()
        );

        metadata.faceDetected = detections.length > 0;
        metadata.hasMultipleFaces = detections.length > 1;

        if (detections.length === 0) {
          failures.push('No face detected in photo');
        } else if (detections.length === 1) {
          passes.push('Single face detected');
          score += 15;

          // Check face position and size
          const face = detections[0];
          const faceBox = face.box;
          
          // Check if face is centered
          const imageCenterX = img.width / 2;
          const imageCenterY = img.height / 2;
          const faceCenterX = faceBox.x + faceBox.width / 2;
          const faceCenterY = faceBox.y + faceBox.height / 2;
          
          const xOffset = Math.abs(faceCenterX - imageCenterX) / img.width;
          const yOffset = Math.abs(faceCenterY - imageCenterY) / img.height;
          
          const isCentered = xOffset < 0.15 && yOffset < 0.15;
          
          // Check face size (should be 50-70% of image height)
          const faceHeightRatio = faceBox.height / img.height;
          let faceSize: 'too-small' | 'too-large' | 'good' = 'good';
          
          if (faceHeightRatio < 0.4) {
            faceSize = 'too-small';
            warnings.push('Face is too small (move closer to camera)');
            score += 5;
          } else if (faceHeightRatio > 0.8) {
            faceSize = 'too-large';
            warnings.push('Face is too large (move further from camera)');
            score += 5;
          } else {
            passes.push('Face size is appropriate');
            score += 10;
          }

          if (isCentered) {
            passes.push('Face is properly centered');
            score += 5;
          } else {
            warnings.push('Face should be more centered');
            score += 2;
          }

          metadata.facePosition = {
            centered: isCentered,
            size: faceSize
          };
        } else {
          failures.push('Multiple faces detected (only one person allowed)');
          metadata.hasMultipleFaces = true;
        }
      } catch (error) {
        console.warn('Face detection failed:', error);
        warnings.push('Could not verify face presence');
      }
    } else {
      // Basic checks without face detection
      warnings.push('Advanced face detection not available');
      score += 5; // Give some points for effort
    }

    // 6. Check for common issues
    const backgroundAnalysis = await this.analyzeBackground(img);
    if (backgroundAnalysis.isUniform) {
      passes.push('Background appears uniform');
      score += 10;
    } else {
      warnings.push('Background should be plain and light-colored');
      score += 5;
    }

    // Calculate final score (max 100)
    score = Math.min(100, Math.max(0, score));

    return {
      score,
      passes,
      warnings,
      failures,
      metadata
    };
  }

  /**
   * Analyze image quality metrics
   */
  private static async analyzeImageQuality(
    img: HTMLImageElement
  ): Promise<{
    brightness: number;
    contrast: number;
    sharpness: number;
  }> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return { brightness: 0, contrast: 0, sharpness: 0 };
    }

    canvas.width = Math.min(img.width, 500); // Limit size for performance
    canvas.height = Math.min(img.height, 500);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    // Calculate brightness
    let totalBrightness = 0;
    let minBrightness = 255;
    let maxBrightness = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
      totalBrightness += brightness;
      minBrightness = Math.min(minBrightness, brightness);
      maxBrightness = Math.max(maxBrightness, brightness);
    }

    const avgBrightness = totalBrightness / (pixels.length / 4);
    const contrast = maxBrightness - minBrightness;

    // Calculate sharpness using Laplacian operator
    let sharpness = 0;
    const width = canvas.width;
    const height = canvas.height;

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        const center = pixels[idx];
        const top = pixels[idx - width * 4];
        const bottom = pixels[idx + width * 4];
        const left = pixels[idx - 4];
        const right = pixels[idx + 4];
        
        const laplacian = Math.abs(4 * center - top - bottom - left - right);
        sharpness += laplacian;
      }
    }

    sharpness = sharpness / ((width - 2) * (height - 2) * 255) * 100;

    return {
      brightness: avgBrightness,
      contrast,
      sharpness: Math.min(100, sharpness * 2) // Normalize to 0-100
    };
  }

  /**
   * Analyze background uniformity
   */
  private static async analyzeBackground(
    img: HTMLImageElement
  ): Promise<{ isUniform: boolean; dominantColor: string }> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return { isUniform: false, dominantColor: '#ffffff' };
    }

    canvas.width = Math.min(img.width, 200);
    canvas.height = Math.min(img.height, 200);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Sample corners and edges for background
    const samples = [
      ctx.getImageData(0, 0, 10, 10), // Top-left
      ctx.getImageData(canvas.width - 10, 0, 10, 10), // Top-right
      ctx.getImageData(0, canvas.height - 10, 10, 10), // Bottom-left
      ctx.getImageData(canvas.width - 10, canvas.height - 10, 10, 10), // Bottom-right
    ];

    const colors: number[][] = [];
    samples.forEach(sample => {
      const data = sample.data;
      let r = 0, g = 0, b = 0;
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }
      const pixelCount = data.length / 4;
      colors.push([r / pixelCount, g / pixelCount, b / pixelCount]);
    });

    // Check if colors are similar (uniform background)
    const avgColor = colors.reduce((acc, color) => [
      acc[0] + color[0] / colors.length,
      acc[1] + color[1] / colors.length,
      acc[2] + color[2] / colors.length
    ], [0, 0, 0]);

    const maxDeviation = colors.reduce((max, color) => {
      const deviation = Math.sqrt(
        Math.pow(color[0] - avgColor[0], 2) +
        Math.pow(color[1] - avgColor[1], 2) +
        Math.pow(color[2] - avgColor[2], 2)
      );
      return Math.max(max, deviation);
    }, 0);

    const isUniform = maxDeviation < 30; // Threshold for uniform background
    const dominantColor = `rgb(${Math.round(avgColor[0])}, ${Math.round(avgColor[1])}, ${Math.round(avgColor[2])})`;

    return { isUniform, dominantColor };
  }

  /**
   * Load image from various sources
   */
  private static loadImage(source: File | Blob | string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => resolve(img);
      img.onerror = reject;

      if (typeof source === 'string') {
        img.src = source;
      } else {
        const url = URL.createObjectURL(source);
        img.src = url;
        img.onload = () => {
          URL.revokeObjectURL(url);
          resolve(img);
        };
      }
    });
  }

  /**
   * Compress image if too large
   */
  static async compressImage(
    file: File,
    maxSizeMB: number = 1
  ): Promise<File> {
    const options = {
      maxSizeMB,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      maxIteration: 10,
      fileType: 'image/jpeg'
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return new File([compressedFile], file.name, {
        type: compressedFile.type,
        lastModified: Date.now()
      });
    } catch (error) {
      console.error('Image compression failed:', error);
      return file; // Return original if compression fails
    }
  }

  /**
   * Validate image format
   */
  static isValidImageFormat(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const validExtensions = ['.jpg', '.jpeg', '.png'];
    
    const hasValidType = validTypes.includes(file.type.toLowerCase());
    const hasValidExtension = validExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );

    return hasValidType && hasValidExtension;
  }
}

export default ImageAnalysisService;