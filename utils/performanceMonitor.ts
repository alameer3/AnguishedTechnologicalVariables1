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
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} loaded in ${loadTime.toFixed(2)}ms`);
    }
  }

  // قياس وقت استجابة API
  measureAPICall(endpoint: string, startTime: number) {
    const responseTime = performance.now() - startTime;
    
    const key = `api_${endpoint}`;
    if (!this.metrics.has(key)) {
      this.metrics.set(key, []);
    }
    
    this.metrics.get(key)!.push(responseTime);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`API ${endpoint} responded in ${responseTime.toFixed(2)}ms`);
    }
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
    
    const allMetrics: Record<string, any> = {};
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
        const performanceEntry = entry as any;
        const fid = performanceEntry.processingStart - performanceEntry.startTime;
        if (process.env.NODE_ENV === 'development') {
          console.log('FID:', fid);
        }
      }
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log('CLS:', clsValue);
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