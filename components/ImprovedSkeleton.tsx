import React from 'react';
import { motion } from 'framer-motion';

interface ImprovedSkeletonProps {
  type?: 'card' | 'banner' | 'text' | 'avatar' | 'button';
  className?: string;
  count?: number;
  animated?: boolean;
}

const ImprovedSkeleton: React.FC<ImprovedSkeletonProps> = ({ 
  type = 'card', 
  className = '', 
  count = 1,
  animated = true 
}) => {
  const skeletonVariants = {
    initial: { opacity: 0.6 },
    animate: { 
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const getSkeletonComponent = () => {
    switch (type) {
      case 'banner':
        return (
          <div className={`w-full h-64 md:h-96 bg-gray-300 dark:bg-gray-700 rounded-lg ${className}`}>
            <div className="flex flex-col justify-end h-full p-8 space-y-4">
              <div className="w-3/4 h-8 bg-gray-400 dark:bg-gray-600 rounded"></div>
              <div className="w-1/2 h-4 bg-gray-400 dark:bg-gray-600 rounded"></div>
              <div className="w-full h-16 bg-gray-400 dark:bg-gray-600 rounded"></div>
              <div className="flex space-x-4">
                <div className="w-24 h-10 bg-gray-400 dark:bg-gray-600 rounded"></div>
                <div className="w-24 h-10 bg-gray-400 dark:bg-gray-600 rounded"></div>
              </div>
            </div>
          </div>
        );

      case 'card':
        return (
          <div className={`bg-gray-300 dark:bg-gray-700 rounded-lg overflow-hidden ${className}`}>
            <div className="h-48 bg-gray-400 dark:bg-gray-600"></div>
            <div className="p-4 space-y-3">
              <div className="w-3/4 h-4 bg-gray-400 dark:bg-gray-600 rounded"></div>
              <div className="w-1/2 h-3 bg-gray-400 dark:bg-gray-600 rounded"></div>
              <div className="w-full h-3 bg-gray-400 dark:bg-gray-600 rounded"></div>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className={`space-y-2 ${className}`}>
            <div className="w-full h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="w-3/4 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="w-1/2 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        );

      case 'avatar':
        return (
          <div className={`w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full ${className}`}></div>
        );

      case 'button':
        return (
          <div className={`w-24 h-10 bg-gray-300 dark:bg-gray-700 rounded ${className}`}></div>
        );

      default:
        return <div className={`w-full h-4 bg-gray-300 dark:bg-gray-700 rounded ${className}`}></div>;
    }
  };

  const SkeletonComponent = animated ? motion.div : 'div';

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonComponent
          key={index}
          className="skeleton"
          {...(animated && {
            variants: skeletonVariants,
            initial: "initial",
            animate: "animate"
          })}
        >
          {getSkeletonComponent()}
        </SkeletonComponent>
      ))}
    </>
  );
};

export default ImprovedSkeleton;