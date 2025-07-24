import React from 'react';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  centerContent?: boolean;
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  maxWidth = 'full',
  padding = 'md',
  centerContent = false
}) => {

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md', 
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  };

  const paddingClasses = {
    none: '',
    sm: 'px-4 py-2',
    md: 'px-6 py-4', 
    lg: 'px-8 py-6',
    xl: 'px-12 py-8'
  };

  return (
    <div 
      className={`
        w-full 
        ${maxWidthClasses[maxWidth]} 
        ${paddingClasses[padding]}
        ${centerContent ? 'mx-auto' : ''}
        transition-all duration-300 ease-in-out
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default ResponsiveContainer;