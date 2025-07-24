import { useState, useCallback, useEffect } from 'react';

interface UseImageOptimizationProps {
  src: string;
  quality?: number;
}

export const useImageOptimization = ({ 
  src, 
  quality = 75 
}: UseImageOptimizationProps) => {
  const [optimizedSrc, setOptimizedSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateOptimizedUrl = useCallback((originalSrc: string, targetQuality: number) => {
    // تحسين صور TMDB
    if (originalSrc.includes('image.tmdb.org')) {
      // استبدال w500 بحجم أصغر للأداء الأفضل
      if (originalSrc.includes('w500')) {
        return originalSrc.replace('w500', 'w300');
      }
      if (originalSrc.includes('original')) {
        return originalSrc.replace('original', 'w500');
      }
    }
    return originalSrc;
  }, []);

  const preloadImage = useCallback((url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = url;
    });
  }, []);

  useEffect(() => {
    if (!src) {
      setError('No image source provided');
      setIsLoading(false);
      return;
    }

    const optimized = generateOptimizedUrl(src, quality);
    setOptimizedSrc(optimized);

    // Preload محسن للصورة
    setIsLoading(true);
    setError(null);

    preloadImage(optimized)
      .then(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
        // Fallback للصورة الأصلية
        if (optimized !== src) {
          setOptimizedSrc(src);
        }
      });
  }, [src, quality, generateOptimizedUrl, preloadImage]);

  return {
    optimizedSrc,
    isLoading,
    error,
    preloadImage
  };
};