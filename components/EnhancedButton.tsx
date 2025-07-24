import React, { forwardRef } from 'react';
import { useAccessibility } from './AccessibilityProvider';

interface EnhancedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled,
    className = '',
    children,
    onClick,
    ...props
  }, ref) => {
    const { announceMessage } = useAccessibility();

    const baseClasses = `
      relative inline-flex items-center justify-center
      font-medium rounded-lg transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      transform hover:scale-105 active:scale-95
    `;

    const variantClasses = {
      primary: `
        bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800
        text-white shadow-lg hover:shadow-xl
        focus:ring-red-500 focus:ring-offset-red-100
      `,
      secondary: `
        bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800
        text-white shadow-lg hover:shadow-xl
        focus:ring-gray-500 focus:ring-offset-gray-100
      `,
      danger: `
        bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700
        text-white shadow-lg hover:shadow-xl
        focus:ring-red-400 focus:ring-offset-red-50
      `,
      ghost: `
        bg-transparent hover:bg-white/10 text-white border border-white/20
        focus:ring-white/50 focus:ring-offset-transparent
      `
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-base gap-2',
      lg: 'px-6 py-3 text-lg gap-2.5'
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || disabled) return;
      
      announceMessage(`تم النقر على ${children}`);
      onClick?.(e);
    };

    const classes = `
      ${baseClasses}
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `;

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        onClick={handleClick}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        <div className={`flex items-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </div>
      </button>
    );
  }
);

EnhancedButton.displayName = 'EnhancedButton';

export default EnhancedButton;