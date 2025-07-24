import React from 'react';
import { motion } from 'framer-motion';

interface ImprovedSkeletonProps {
  type: 'card' | 'banner' | 'text' | 'avatar' | 'list';
  count?: number;
  className?: string;
  width?: string;
  height?: string;
}

const ImprovedSkeleton: React.FC<ImprovedSkeletonProps> = ({
  type,
  count = 1,
  className = '',
  width,
  height
}) => {
  const shimmerAnimation = {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 2,
      ease: 'linear',
      repeat: Infinity,
    }
  };

  const fadeInAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  };

  const SkeletonCard = ({ index = 0 }: { index?: number }) => (
    <motion.div
      {...fadeInAnimation}
      transition={{ ...fadeInAnimation.transition, delay: index * 0.1 }}
      className={`relative h-28 min-w-[180px] md:h-36 md:min-w-[240px] rounded-lg overflow-hidden ${className}`}
      style={{ width, height }}
    >
      <motion.div
        className="w-full h-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:200%_100%]"
        animate={shimmerAnimation}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </motion.div>
  );

  const SkeletonBanner = () => (
    <motion.div
      {...fadeInAnimation}
      className={`relative w-full h-[65vh] overflow-hidden ${className}`}
    >
      <motion.div
        className="w-full h-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:200%_100%]"
        animate={shimmerAnimation}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      
      {/* Content placeholder */}
      <div className="absolute bottom-12 left-24 space-y-4">
        <motion.div
          className="h-12 w-96 bg-gray-700 rounded-lg bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%]"
          animate={shimmerAnimation}
        />
        <motion.div
          className="h-4 w-80 bg-gray-700 rounded bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%]"
          animate={shimmerAnimation}
        />
        <motion.div
          className="h-4 w-64 bg-gray-700 rounded bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%]"
          animate={shimmerAnimation}
        />
        <div className="flex gap-4 mt-6">
          <motion.div
            className="h-12 w-32 bg-gray-600 rounded-lg bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 bg-[length:200%_100%]"
            animate={shimmerAnimation}
          />
          <motion.div
            className="h-12 w-40 bg-gray-600 rounded-lg bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 bg-[length:200%_100%]"
            animate={shimmerAnimation}
          />
        </div>
      </div>
    </motion.div>
  );

  const SkeletonText = ({ lineCount = 3 }: { lineCount?: number }) => (
    <motion.div {...fadeInAnimation} className={`space-y-2 ${className}`}>
      {Array.from({ length: lineCount }).map((_, index) => (
        <motion.div
          key={index}
          className={`h-4 bg-gray-700 rounded bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] ${
            index === lineCount - 1 ? 'w-3/4' : 'w-full'
          }`}
          animate={shimmerAnimation}
          transition={{ ...shimmerAnimation.transition, delay: index * 0.1 }}
        />
      ))}
    </motion.div>
  );

  const SkeletonAvatar = () => (
    <motion.div
      {...fadeInAnimation}
      className={`relative ${className}`}
    >
      <motion.div
        className="w-16 h-16 bg-gray-700 rounded-full bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%]"
        animate={shimmerAnimation}
      />
    </motion.div>
  );

  const SkeletonList = ({ itemCount = 5 }: { itemCount?: number }) => (
    <motion.div {...fadeInAnimation} className={`space-y-4 ${className}`}>
      {Array.from({ length: itemCount }).map((_, index) => (
        <motion.div
          key={index}
          className="flex items-center space-x-4 space-x-reverse"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <motion.div
            className="w-12 h-12 bg-gray-700 rounded-lg bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%]"
            animate={shimmerAnimation}
          />
          <div className="flex-1 space-y-2">
            <motion.div
              className="h-4 bg-gray-700 rounded w-3/4 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%]"
              animate={shimmerAnimation}
            />
            <motion.div
              className="h-3 bg-gray-700 rounded w-1/2 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%]"
              animate={shimmerAnimation}
            />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return Array.from({ length: count }).map((_, index) => (
          <SkeletonCard key={index} index={index} />
        ));
      case 'banner':
        return <SkeletonBanner />;
      case 'text':
        return <SkeletonText lineCount={count} />;
      case 'avatar':
        return <SkeletonAvatar />;
      case 'list':
        return <SkeletonList itemCount={count} />;
      default:
        return <SkeletonCard />;
    }
  };

  return <>{renderSkeleton()}</>;
};

export default ImprovedSkeleton;