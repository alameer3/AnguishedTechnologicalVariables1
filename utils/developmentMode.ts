// نظام إدارة وضع التطوير
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// إعدادات خاصة بوضع التطوير
export const developmentConfig = {
  // التخزين المؤقت
  cache: {
    enabled: isDevelopment,
    duration: isDevelopment ? Infinity : 30 * 60 * 1000, // لا محدود في التطوير، 30 دقيقة في الإنتاج
    showControls: isDevelopment,
  },
  
  // تحسينات الأداء
  performance: {
    enableOptimizations: isDevelopment,
    skipConsoleRemoval: isDevelopment,
    enableSourceMaps: isDevelopment,
  },
  
  // إعدادات الشبكة
  network: {
    preferOffline: isDevelopment,
    skipAudit: isDevelopment,
    showProgress: !isDevelopment,
  }
};

// وظيفة للتحقق من وضع التطوير
export const getEnvironmentConfig = () => {
  if (isDevelopment) {
    return {
      cacheStrategy: 'unlimited',
      optimizationsEnabled: true,
      debugMode: true,
      message: '🚀 وضع التطوير: تحسينات مفعلة'
    };
  } else {
    return {
      cacheStrategy: 'normal',
      optimizationsEnabled: false,
      debugMode: false,
      message: '🌟 وضع الإنتاج: أداء مُحسّن'
    };
  }
};

export default developmentConfig;