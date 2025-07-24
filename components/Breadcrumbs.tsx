import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  const router = useRouter();
  
  // إنشاء breadcrumbs تلقائياً من المسار الحالي إذا لم يتم تمرير items
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = router.asPath.split('/').filter(segment => segment);
    const breadcrumbs: BreadcrumbItem[] = [{ label: 'الرئيسية', href: '/' }];
    
    pathSegments.forEach((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/');
      let label = segment;
      
      // ترجمة بعض المسارات الشائعة
      switch (segment) {
        case 'details':
          label = 'التفاصيل';
          break;
        case 'people':
          label = 'الأشخاص';
          break;
        case 'cast':
          label = 'الممثلين';
          break;
        case 'season':
          label = 'المواسم';
          break;
        case 'tv':
          label = 'المسلسلات';
          break;
        case 'favourite':
          label = 'المفضلة';
          break;
        case 'about':
          label = 'حول التطبيق';
          break;
        default:
          // إذا كان رقم، اتركه كما هو
          if (!isNaN(Number(segment))) {
            label = segment;
          }
      }
      
      breadcrumbs.push({ label, href });
    });
    
    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  if (breadcrumbItems.length <= 1) {
    return null; // لا تظهر breadcrumbs في الصفحة الرئيسية
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 ${className}`}
      aria-label="مسار التنقل"
    >
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <svg
              className="w-4 h-4 mx-1 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
          
          {item.href && index < breadcrumbItems.length - 1 ? (
            <Link
              href={item.href}
              className="hover:text-gray-900 dark:hover:text-white transition-colors duration-200 hover:underline"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 dark:text-white font-medium">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </motion.nav>
  );
};

export default Breadcrumbs;