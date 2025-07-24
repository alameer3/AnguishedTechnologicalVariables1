import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  text = 'جاري التحميل...', 
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const spinnerVariants = {
    start: {
      rotate: 0
    },
    end: {
      rotate: 360
    }
  };

  const dotVariants = {
    start: {
      y: "0%"
    },
    end: {
      y: "100%"
    }
  };

  const dotTransition = {
    duration: 0.5,
    ease: "easeInOut" as const,
    repeat: Infinity,
    repeatType: "reverse" as const
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      {/* Netflix-style Spinner */}
      <motion.div
        className={`${sizeClasses[size]} relative`}
        variants={spinnerVariants}
        initial="start"
        animate="end"
        transition={{
          duration: 1,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        <div className="w-full h-full border-2 border-gray-600 rounded-full">
          <div className="w-full h-full border-t-2 border-red-500 rounded-full"></div>
        </div>
      </motion.div>

      {/* Loading Text */}
      {text && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center space-x-1 space-x-reverse"
        >
          <span className="text-gray-300 text-sm font-medium">{text}</span>
          <div className="flex space-x-1">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-1 h-1 bg-red-500 rounded-full"
                variants={dotVariants}
                initial="start"
                animate="end"
                transition={{
                  ...dotTransition,
                  delay: index * 0.2
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LoadingSpinner;