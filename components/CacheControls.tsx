import React, { useState } from 'react';
import { developmentConfig, getEnvironmentConfig } from '../utils/developmentMode';

interface CacheInfo {
  totalFiles: number;
  totalSize: string;
}

interface CacheControlsProps {
  showControls?: boolean;
}

const CacheControls: React.FC<CacheControlsProps> = ({ showControls = false }) => {
  const [cacheInfo, setCacheInfo] = useState<CacheInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const envConfig = getEnvironmentConfig();
  
  // إخفاء أدوات التحكم في الإنتاج
  if (!developmentConfig.cache.showControls) {
    return null;
  }

  const getCacheInfo = async () => {
    try {
      const response = await fetch('/api/cache/refresh');
      const data = await response.json();
      setCacheInfo(data.cacheInfo);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('خطأ في جلب معلومات الكاش:', error);
      }
    }
  };

  const refreshCache = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/cache/refresh', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success) {
        setMessage('✅ تم تحديث البيانات بنجاح');
        setCacheInfo(data.cacheInfo);
        // إعادة تحميل الصفحة لإظهار البيانات الجديدة
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setMessage('❌ فشل في تحديث البيانات');
      }
    } catch (error) {
      setMessage('❌ حدث خطأ أثناء التحديث');
      if (process.env.NODE_ENV === 'development') {
        console.error('Error refreshing cache:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearCache = async () => {
    if (!confirm('هل أنت متأكد من مسح جميع ملفات الكاش؟')) {
      return;
    }

    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/cache/refresh', {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (data.success) {
        setMessage('🗑 تم مسح الكاش بنجاح');
        setCacheInfo({ totalFiles: 0, totalSize: '0 KB' });
      } else {
        setMessage('❌ فشل في مسح الكاش');
      }
    } catch (error) {
      setMessage('❌ حدث خطأ أثناء مسح الكاش');
      if (process.env.NODE_ENV === 'development') {
        console.error('Error clearing cache:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (showControls) {
      getCacheInfo();
    }
  }, [showControls]);

  if (!showControls) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg z-50 min-w-[300px]">
      <h3 className="text-lg font-bold mb-2">🚀 أدوات التخزين المؤقت</h3>
      <p className="text-xs text-green-400 mb-3">{envConfig.message}</p>
      
      {cacheInfo && (
        <div className="mb-3 text-sm">
          <p>📁 ملفات الكاش: {cacheInfo.totalFiles}</p>
          <p>💾 الحجم: {cacheInfo.totalSize}</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <button
          onClick={refreshCache}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-3 py-2 rounded text-sm transition-colors"
        >
          {isLoading ? '⏳ جاري التحديث...' : '🔄 تحديث البيانات'}
        </button>
        
        <button
          onClick={clearCache}
          disabled={isLoading}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-3 py-2 rounded text-sm transition-colors"
        >
          🗑 مسح الكاش
        </button>
        
        <button
          onClick={getCacheInfo}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-3 py-2 rounded text-sm transition-colors"
        >
          ℹ️ معلومات الكاش
        </button>
      </div>

      {message && (
        <div className="mt-3 p-2 bg-gray-800 rounded text-sm">
          {message}
        </div>
      )}
    </div>
  );
};

export default CacheControls;