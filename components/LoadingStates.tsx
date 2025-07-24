import React from 'react';

// Reusable loading spinner component
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-red-600`} />
  );
};

// Content loading skeleton
export const ContentSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-700 rounded w-5/6"></div>
  </div>
);

// Movie card skeleton
export const MovieCardSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="bg-gray-700 rounded-lg h-64 w-44 mb-2"></div>
    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
  </div>
);

// Error fallback component
export const ErrorFallback: React.FC<{ message?: string; onRetry?: () => void }> = ({ 
  message = "Something went wrong", 
  onRetry 
}) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <div className="text-red-500 text-6xl mb-4">⚠️</div>
    <h3 className="text-xl font-semibold text-white mb-2">Oops!</h3>
    <p className="text-gray-400 mb-4">{message}</p>
    {onRetry && (
      <button 
        onClick={onRetry}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
);