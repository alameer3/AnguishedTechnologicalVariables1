// تحسينات خاصة بوضع الإنتاج
import { isProduction } from './developmentMode';

export const productionConfig = {
  // إعدادات الكاش في الإنتاج
  cache: {
    enabled: false, // إيقاف الكاش المحلي في الإنتاج
    duration: 30 * 60 * 1000, // 30 دقيقة للكاش العادي
    useServiceWorker: isProduction, // استخدام Service Worker في الإنتاج
  },
  
  // تحسينات الأداء
  performance: {
    enableCompression: isProduction,
    optimizeImages: isProduction,
    minifyCode: isProduction,
    removeConsole: isProduction,
  },
  
  // إعدادات الشبكة
  network: {
    enableCDN: isProduction,
    useHTTP2: isProduction,
    enableCaching: isProduction,
  },
  
  // الأمان
  security: {
    enableCSP: isProduction,
    removeSourceMaps: isProduction,
    hideErrorDetails: isProduction,
  }
};

// دالة لتطبيق تحسينات الإنتاج
export const applyProductionOptimizations = () => {
  if (!isProduction) {
    console.log('🚀 وضع التطوير: التحسينات معطلة للتطوير السريع');
    return;
  }
  
  console.log('🌟 وضع الإنتاج: تطبيق التحسينات...');
  
  // تنظيف الكاش المحلي
  if (typeof window !== 'undefined') {
    localStorage.removeItem('netflix-clone-cache');
    console.log('✅ تم تنظيف كاش التطوير');
  }
  
  // تفعيل Service Worker
  if (productionConfig.cache.useServiceWorker && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('✅ Service Worker مفعل'))
      .catch(() => console.log('❌ فشل في تفعيل Service Worker'));
  }
};

// دالة للحصول على رسالة الحالة
export const getStatusMessage = () => {
  return isProduction 
    ? '🌟 وضع الإنتاج: أداء محسن، بدون كاش تطوير'
    : '🚀 وضع التطوير: كاش دائم، تحسينات مفعلة';
};

export default productionConfig;