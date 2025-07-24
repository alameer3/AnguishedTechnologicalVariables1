// مراقب الأداء المتقدم للموقع
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // قياس وقت تحميل المكونات
  measureComponentLoad(componentName: string, startTime: number) {
    const loadTime = performance.now() - startTime;
    
    if (!this.metrics.has(componentName)) {
      this.metrics.set(componentName, []);
    }
    
    this.metrics.get(componentName)!.push(loadTime);
    
    // Silent performance tracking
  }

  // قياس وقت استجابة API
  measureAPICall(endpoint: string, startTime: number) {
    const responseTime = performance.now() - startTime;
    
    const key = `api_${endpoint}`;
    if (!this.metrics.has(key)) {
      this.metrics.set(key, []);
    }
    
    this.metrics.get(key)!.push(responseTime);
    
    // Silent API performance tracking
  }

  // احصائيات الأداء
  getMetrics(componentName?: string) {
    if (componentName) {
      const times = this.metrics.get(componentName) || [];
      return {
        count: times.length,
        average: times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0,
        min: times.length ? Math.min(...times) : 0,
        max: times.length ? Math.max(...times) : 0
      };
    }
    
    const allMetrics: Record<string, {
      count: number;
      average: number;
      min: number;
      max: number;
    }> = {};
    this.metrics.forEach((times, name) => {
      allMetrics[name] = {
        count: times.length,
        average: times.reduce((a, b) => a + b, 0) / times.length,
        min: Math.min(...times),
        max: Math.max(...times)
      };
    });
    
    return allMetrics;
  }

  // مراقبة Core Web Vitals
  measureWebVitals() {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
      
      if (process.env.NODE_ENV === 'development') {
        console.log('LCP:', lastEntry.startTime);
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const performanceEntry = entry as PerformanceEntry & { 
          value?: number; 
          duration?: number; 
        };
        const fidEntry = performanceEntry as PerformanceEntry & { processingStart?: number };
        const fid = (fidEntry.processingStart || 0) - performanceEntry.startTime;
        if (process.env.NODE_ENV === 'development') {
          // FID logged only in development - removed console.log for production
        }
      }
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const clsEntry = entry as PerformanceEntry & { 
          hadRecentInput?: boolean; 
          value?: number; 
        };
        if (!clsEntry.hadRecentInput) {
          clsValue += clsEntry.value || 0;
        }
      }
      
      if (process.env.NODE_ENV === 'development') {
        // CLS logged only in development - removed console.log for production
      }
    }).observe({ entryTypes: ['layout-shift'] });
  }
}

// Hook للاستخدام في المكونات
export const usePerformanceMonitor = () => {
  const monitor = PerformanceMonitor.getInstance();
  
  return {
    measureComponentLoad: monitor.measureComponentLoad.bind(monitor),
    measureAPICall: monitor.measureAPICall.bind(monitor),
    getMetrics: monitor.getMetrics.bind(monitor),
    measureWebVitals: monitor.measureWebVitals.bind(monitor)
  };
};