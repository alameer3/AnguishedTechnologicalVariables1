import React, { createContext, useContext, useEffect, useState } from 'react';

interface AccessibilityContextType {
  isHighContrast: boolean;
  isFocusVisible: boolean;
  announceMessage: (message: string) => void;
  toggleHighContrast: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const [announcer, setAnnouncer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create screen reader announcer
    const div = document.createElement('div');
    div.setAttribute('aria-live', 'polite');
    div.setAttribute('aria-atomic', 'true');
    div.className = 'sr-only absolute -top-full -left-full w-1 h-1 overflow-hidden';
    document.body.appendChild(div);
    setAnnouncer(div);

    // Detect focus visibility
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsFocusVisible(true);
      }
    };

    const handleMousedown = () => {
      setIsFocusVisible(false);
    };

    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('mousedown', handleMousedown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('mousedown', handleMousedown);
      if (div.parentNode) {
        div.parentNode.removeChild(div);
      }
    };
  }, []);

  const announceMessage = (message: string) => {
    if (announcer) {
      announcer.textContent = message;
      const timeoutId = setTimeout(() => {
        if (announcer) {
          announcer.textContent = '';
        }
      }, 1000);
      
      // تنظيف timeout عند إلغاء تحميل المكون
      return () => clearTimeout(timeoutId);
    }
  };

  const toggleHighContrast = () => {
    setIsHighContrast(prev => !prev);
    document.documentElement.classList.toggle('high-contrast', !isHighContrast);
  };

  const value: AccessibilityContextType = {
    isHighContrast,
    isFocusVisible,
    announceMessage,
    toggleHighContrast,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      <div className={isFocusVisible ? 'focus-visible' : ''}>
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};