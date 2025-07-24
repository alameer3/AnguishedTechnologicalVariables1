import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Movie } from "../typings";
import MoviesLine from "./MoviesLine";
import LoadingSpinner from "./LoadingSpinner";

interface InfiniteScrollProps {
  title: string;
  initialMovies: Movie[];
  fetchUrl: string;
  type: string;
  isDetails?: boolean;
  className?: string;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  title,
  initialMovies,
  fetchUrl,
  type,
  isDetails = false,
  className = ""
}) => {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const observerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // تحميل المزيد من الأفلام
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;
      if (!apiKey) {
        throw new Error('API key not found');
      }

      const nextPage = page + 1;
      const url = `${fetchUrl}&page=${nextPage}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const newMovies = data.results || [];

      if (newMovies.length === 0) {
        setHasMore(false);
      } else {
        setMovies(prev => [...prev, ...newMovies]);
        setPage(nextPage);
        
        // تحقق من وجود صفحات أخرى
        if (nextPage >= data.total_pages) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error('Error loading more movies:', error);
      setError('حدث خطأ في تحميل المزيد من الأفلام');
    } finally {
      setLoading(false);
    }
  }, [fetchUrl, page, loading, hasMore]);

  // Intersection Observer للتحميل التلقائي
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loadMore, hasMore, loading]);

  // متغيرات الأنيميشن
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* عنوان القسم */}
      <div className="flex items-center justify-between px-4 md:px-12">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
        >
          {title}
        </motion.h2>
        
        <div className="text-sm text-gray-400">
          {movies.length} عنصر
        </div>
      </div>

      {/* شبكة الأفلام */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 px-4 md:px-12"
      >
        <AnimatePresence>
          {movies.map((movie, index) => (
            <motion.div
              key={`${movie.id}-${index}`}
              variants={itemVariants}
              layout
              className="group"
            >
              <MoviesLine
                movie={movie}
                isDetails={isDetails}
                type={type}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* حالة التحميل */}
      {loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center py-8"
        >
          <LoadingSpinner size="medium" text="جاري تحميل المزيد..." />
        </motion.div>
      )}

      {/* رسالة الخطأ */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-8 px-4"
        >
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
            <p className="text-red-400 mb-3">{error}</p>
            <button
              onClick={loadMore}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        </motion.div>
      )}

      {/* نهاية القائمة */}
      {!hasMore && movies.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-gray-400"
        >
          <div className="inline-flex items-center space-x-2 space-x-reverse">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
            <span className="text-sm">تم عرض جميع العناصر</span>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
          </div>
        </motion.div>
      )}

      {/* العنصر المراقب للتحميل التلقائي */}
      <div ref={loadMoreRef} className="h-4" />

      {/* زر التحميل اليدوي (كبديل) */}
      {hasMore && !loading && movies.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center py-4"
        >
          <button
            onClick={loadMore}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            تحميل المزيد
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default InfiniteScroll;