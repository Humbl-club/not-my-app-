/**
 * Performance optimization utilities
 */

/**
 * Debounce function to limit function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit function execution rate
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Image optimization - compress image before upload
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.85
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }
    
    img.onload = () => {
      let { width, height } = img;
      
      // Calculate new dimensions while maintaining aspect ratio
      if (width > maxWidth) {
        height = (maxWidth / width) * height;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (maxHeight / height) * width;
        height = maxHeight;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Use better image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Image compression failed'));
          }
        },
        'image/jpeg',
        quality
      );
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Lazy load images with Intersection Observer
 */
export function lazyLoadImage(
  imageElement: HTMLImageElement,
  src: string,
  placeholder?: string
): void {
  // Set placeholder if provided
  if (placeholder) {
    imageElement.src = placeholder;
  }
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          imageElement.src = src;
          imageElement.classList.add('loaded');
          observer.unobserve(imageElement);
        }
      });
    },
    {
      rootMargin: '50px'
    }
  );
  
  observer.observe(imageElement);
}

/**
 * Preload critical resources
 */
export function preloadResources(resources: Array<{ href: string; as: string }>) {
  resources.forEach(({ href, as }) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    
    if (as === 'font') {
      link.crossOrigin = 'anonymous';
    }
    
    document.head.appendChild(link);
  });
}

/**
 * Memory-efficient data pagination
 */
export class DataPaginator<T> {
  private data: T[];
  private pageSize: number;
  private currentPage: number;
  
  constructor(data: T[], pageSize: number = 10) {
    this.data = data;
    this.pageSize = pageSize;
    this.currentPage = 0;
  }
  
  getCurrentPage(): T[] {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    return this.data.slice(start, end);
  }
  
  nextPage(): T[] {
    if (this.hasNextPage()) {
      this.currentPage++;
    }
    return this.getCurrentPage();
  }
  
  previousPage(): T[] {
    if (this.hasPreviousPage()) {
      this.currentPage--;
    }
    return this.getCurrentPage();
  }
  
  hasNextPage(): boolean {
    return (this.currentPage + 1) * this.pageSize < this.data.length;
  }
  
  hasPreviousPage(): boolean {
    return this.currentPage > 0;
  }
  
  getTotalPages(): number {
    return Math.ceil(this.data.length / this.pageSize);
  }
  
  goToPage(page: number): T[] {
    if (page >= 0 && page < this.getTotalPages()) {
      this.currentPage = page;
    }
    return this.getCurrentPage();
  }
}

/**
 * Request animation frame throttling
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  callback: T
): (...args: Parameters<T>) => void {
  let requestId: number | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    if (requestId === null) {
      requestId = requestAnimationFrame(() => {
        callback(...args);
        requestId = null;
      });
    }
  };
}

/**
 * Memoization helper for expensive computations
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    
    // Limit cache size to prevent memory leaks
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    return result;
  }) as T;
}

/**
 * Web Worker wrapper for heavy computations
 */
export class WorkerPool {
  private workers: Worker[] = [];
  private queue: Array<{ resolve: Function; reject: Function; data: any }> = [];
  private busy: Set<Worker> = new Set();
  
  constructor(workerScript: string, poolSize: number = 4) {
    for (let i = 0; i < poolSize; i++) {
      const worker = new Worker(workerScript);
      this.workers.push(worker);
    }
  }
  
  execute(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const availableWorker = this.workers.find(w => !this.busy.has(w));
      
      if (availableWorker) {
        this.runWorker(availableWorker, { resolve, reject, data });
      } else {
        this.queue.push({ resolve, reject, data });
      }
    });
  }
  
  private runWorker(worker: Worker, task: any) {
    this.busy.add(worker);
    
    worker.onmessage = (e) => {
      task.resolve(e.data);
      this.busy.delete(worker);
      
      // Process queue if there are pending tasks
      if (this.queue.length > 0) {
        const nextTask = this.queue.shift();
        if (nextTask) {
          this.runWorker(worker, nextTask);
        }
      }
    };
    
    worker.onerror = (error) => {
      task.reject(error);
      this.busy.delete(worker);
    };
    
    worker.postMessage(task.data);
  }
  
  terminate() {
    this.workers.forEach(worker => worker.terminate());
  }
}

/**
 * Performance monitoring
 */
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map();
  
  mark(name: string) {
    this.marks.set(name, performance.now());
  }
  
  measure(name: string, startMark: string): number {
    const start = this.marks.get(startMark);
    if (!start) {
      console.warn(`Mark ${startMark} not found`);
      return 0;
    }
    
    const duration = performance.now() - start;
    
    // Log slow operations
    if (duration > 100) {
      console.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }
  
  clearMarks() {
    this.marks.clear();
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();