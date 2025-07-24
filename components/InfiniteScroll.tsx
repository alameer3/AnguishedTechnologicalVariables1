import React, { useEffect, useRef, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Movie } from '../typings';
import LoadingSpinner from './LoadingSpinner';
import MoviesLine from './MoviesLine';

interface InfiniteScrollProps {
  items: Movie[];
  hasMore: boolean;
  loadMore: () => Promise<void>;
  loading: boolean;
  title: string;
  type: string;
  className?: string;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  items,
  hasMore,
  loadMore,
  loading,
  title,
  type,
  className = ''
}) => {
  const observerRef = useRef<HTMLDivElement>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleLoadMore = useCallback(async () => {
    if (!loading && !loadingMore && hasMore) {
      setLoadingMore(true);
      try {
        await loadMore();
      } finally {
        setLoadingMore(false);
      }
    }
  }, [loading, loadingMore, hasMore, loadMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          handleLoadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [handleLoadMore]);

  return (
    <div className={`space-y-4 ${className}`}>
      {title && (
        <h2 className="subtitle-enhanced responsive-subtitle font-bold mb-6 px-4 md:px-12">
          {title}
        </h2>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 px-4 md:px-12">
        {items.map((movie, index) => (
          <motion.div
            key={`${movie.id}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.05,
              ease: "easeOut"
            }}
          >
            <MoviesLine
              movie={movie}
              isDetails={false}
              type={type}
            />
          </motion.div>
        ))}
      </div>

      {/* Loading indicator */}
      {(loading || loadingMore) && (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="medium" text="جاري تحميل المزيد..." />
        </div>
      )}

      {/* Intersection observer target */}
      <div ref={observerRef} className="h-4" />

      {/* End message */}
      {!hasMore && items.length > 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-gray-400"
        >
          <p>تم عرض جميع العناصر المتاحة</p>
        </motion.div>
      )}
    </div>
  );
};

export default InfiniteScroll;