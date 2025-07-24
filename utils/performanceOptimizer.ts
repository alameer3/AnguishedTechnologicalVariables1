// Performance optimization utilities
import React, { useCallback, useRef, useEffect, useState } from 'react';

// Debounce hook for better performance
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Throttle function for scroll events
export const useThrottle = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T => {
  const lastCall = useRef(0);
  
  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      callback(...args);
    }
  }, [callback, delay]) as T;
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      options
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [elementRef, options]);

  return isIntersecting;
};

// Preload images for better UX
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Bundle size analyzer helper
export const logBundleSize = () => {
  if (process.env.NODE_ENV === 'development') {
    // Performance marks for development
    performance.mark('bundle-start');
    
    window.addEventListener('load', () => {
      performance.mark('bundle-end');
      performance.measure('bundle-load-time', 'bundle-start', 'bundle-end');
      
      const measure = performance.getEntriesByName('bundle-load-time')[0];
      console.info(`Bundle load time: ${measure.duration}ms`);
    });
  }
};

// Memory usage monitor
export const monitorMemoryUsage = () => {
  if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
    const memInfo = (performance as any).memory;
    console.info('Memory Usage:', {
      used: `${Math.round(memInfo.usedJSHeapSize / 1024 / 1024)} MB`,
      total: `${Math.round(memInfo.totalJSHeapSize / 1024 / 1024)} MB`,
      limit: `${Math.round(memInfo.jsHeapSizeLimit / 1024 / 1024)} MB`
    });
  }
};