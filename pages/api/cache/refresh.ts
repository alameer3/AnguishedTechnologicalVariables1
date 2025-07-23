import { NextApiRequest, NextApiResponse } from 'next';
import cachedRequests from '../../../utils/apiWithCache';
import cacheManager from '../../../utils/cacheManager';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      console.log('🔄 بدء تحديث البيانات من TMDB...');
      
      // تحديث جميع البيانات
      await cachedRequests.refreshData();
      
      // الحصول على معلومات الكاش
      const cacheInfo = cacheManager.getInfo();
      
      res.status(200).json({
        success: true,
        message: 'تم تحديث جميع البيانات بنجاح',
        cacheInfo: {
          totalFiles: cacheInfo.totalFiles,
          totalSize: `${cacheInfo.totalSize} KB`
        }
      });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('خطأ في تحديث البيانات:', error);
      }
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء تحديث البيانات',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else if (req.method === 'GET') {
    // الحصول على معلومات الكاش
    const cacheInfo = cacheManager.getInfo();
    
    res.status(200).json({
      success: true,
      cacheInfo: {
        totalFiles: cacheInfo.totalFiles,
        totalSize: `${cacheInfo.totalSize} KB`
      }
    });
  } else if (req.method === 'DELETE') {
    try {
      // مسح جميع ملفات الكاش
      cacheManager.clear();
      
      res.status(200).json({
        success: true,
        message: 'تم مسح جميع ملفات الكاش'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء مسح الكاش'
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}