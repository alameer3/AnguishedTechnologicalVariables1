import fs from 'fs';
import path from 'path';
import { developmentConfig } from './developmentMode';

export interface CacheData {
  data: any;
  timestamp: number;
  expiresIn: number; // milliseconds
}

export class CacheManager {
  private cacheDir: string;

  constructor() {
    this.cacheDir = path.join(process.cwd(), 'cache');
    this.ensureCacheDirectory();
  }

  private ensureCacheDirectory(): void {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  private getCacheFilePath(key: string): string {
    const safeKey = key.replace(/[^a-zA-Z0-9-_]/g, '_');
    return path.join(this.cacheDir, `${safeKey}.json`);
  }

  // حفظ البيانات في الكاش
  set(key: string, data: any, expiresIn: number = Infinity): void {
    // في وضع الإنتاج، لا نحفظ الكاش
    if (!developmentConfig.cache.enabled) {
      return;
    }
    const cacheData: CacheData = {
      data,
      timestamp: Date.now(),
      expiresIn: Infinity
    };

    const filePath = this.getCacheFilePath(key);
    try {
      fs.writeFileSync(filePath, JSON.stringify(cacheData, null, 2));
      console.log(`✓ Cached data for: ${key}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`خطأ في حفظ الكاش لـ ${key}:`, error);
      }
    }
  }

  // جلب البيانات من الكاش
  get(key: string): any | null {
    // في وضع الإنتاج، لا نستخدم الكاش
    if (!developmentConfig.cache.enabled) {
      return null;
    }
    
    const filePath = this.getCacheFilePath(key);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }

    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const cacheData: CacheData = JSON.parse(fileContent);
      
      // فحص انتهاء صلاحية الكاش
      if (cacheData.expiresIn !== Infinity && 
          typeof cacheData.expiresIn === 'number' &&
          Date.now() - cacheData.timestamp > cacheData.expiresIn) {
        console.log(`⚠ Cache expired for: ${key}`);
        this.delete(key);
        return null;
      }
      
      console.log(`✓ Loading from cache: ${key}`);
      return cacheData.data;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`خطأ في قراءة الكاش لـ ${key}:`, error);
      }
      return null;
    }
  }

  // فحص إذا كانت البيانات موجودة وصالحة
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  // حذف ملف كاش معين
  delete(key: string): void {
    const filePath = this.getCacheFilePath(key);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`🗑 Deleted cache: ${key}`);
    }
  }

  // مسح جميع ملفات الكاش
  clear(): void {
    if (fs.existsSync(this.cacheDir)) {
      const files = fs.readdirSync(this.cacheDir);
      files.forEach(file => {
        fs.unlinkSync(path.join(this.cacheDir, file));
      });
      console.log('🗑 Cleared all cache files');
    }
  }

  // الحصول على معلومات الكاش
  getInfo(): { totalFiles: number; totalSize: number } {
    if (!fs.existsSync(this.cacheDir)) {
      return { totalFiles: 0, totalSize: 0 };
    }

    const files = fs.readdirSync(this.cacheDir);
    let totalSize = 0;

    files.forEach(file => {
      const filePath = path.join(this.cacheDir, file);
      const stats = fs.statSync(filePath);
      totalSize += stats.size;
    });

    return {
      totalFiles: files.length,
      totalSize: Math.round(totalSize / 1024) // KB
    };
  }
}

export default new CacheManager();