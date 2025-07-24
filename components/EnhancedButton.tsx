import React from 'react';
import { motion } from 'framer-motion';

interface EnhancedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  disabled = false
}) => {
  const baseClasses = "relative flex items-center justify-center gap-3 font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-red-600 to-red-500 text-white border-2 border-transparent hover:from-red-500 hover:to-red-400 hover:shadow-red-500/30",
    secondary: "bg-gradient-to-r from-gray-800 to-gray-700 text-white border-2 border-gray-600 hover:border-red-500 hover:from-gray-700 hover:to-gray-600 hover:shadow-gray-500/30",
    outline: "bg-transparent text-white border-2 border-white/30 hover:border-red-500 hover:bg-red-500/10 backdrop-blur-sm"
  };
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg md:px-12 md:py-5 md:text-xl"
  };

  return (
    <motion.button
      whileHover={{ 
        scale: 1.05, 
        y: -2,
        boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
      }}
      whileTap={{ 
        scale: 0.98,
        y: 0
      }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
      
      {icon && <span className="relative z-10">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export default EnhancedButton;