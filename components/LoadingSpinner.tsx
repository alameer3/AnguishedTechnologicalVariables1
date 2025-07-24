import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  color?: 'red' | 'white' | 'gray';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  text,
  color = 'red'
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  };
  
  const colorClasses = {
    red: 'border-red-500',
    white: 'border-white',
    gray: 'border-gray-500'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-xl'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
        className={`
          ${sizeClasses[size]} 
          ${colorClasses[color]}
          border-4 border-t-transparent rounded-full
          shadow-lg
        `}
      />
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`
            ${textSizeClasses[size]}
            text-white font-medium text-center
            animate-pulse
          `}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;