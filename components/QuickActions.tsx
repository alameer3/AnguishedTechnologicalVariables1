import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, HandThumbUpIcon } from './Icons';
import { Movie } from '../typings';

interface QuickActionsProps {
  movie: Movie;
  isVisible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  movie,
  isVisible,
  position,
  onClose
}) => {
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const actions = [
    {
      id: 'add',
      icon: PlusIcon,
      label: 'إضافة للقائمة',
      color: 'bg-green-600 hover:bg-green-500'
    },
    {
      id: 'like',
      icon: HandThumbUpIcon,
      label: 'أعجبني',
      color: 'bg-blue-600 hover:bg-blue-500'
    }
  ];

  const handleAction = (actionId: string) => {
    setActiveAction(actionId);
    // هنا يمكن إضافة المنطق الخاص بكل إجراء
    setTimeout(() => {
      setActiveAction(null);
      onClose();
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="fixed z-50 bg-black/90 backdrop-blur-sm rounded-xl p-4 border border-white/20"
          style={{
            left: Math.min(position.x, window.innerWidth - 200),
            top: Math.max(position.y - 80, 20),
          }}
          onMouseLeave={onClose}
        >
          <div className="flex space-x-3 space-x-reverse">
            {actions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <motion.button
                  key={action.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleAction(action.id)}
                  className={`
                    relative p-3 rounded-full transition-all duration-300
                    ${action.color}
                    ${activeAction === action.id ? 'scale-110' : 'hover:scale-105'}
                    group
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconComponent className="w-5 h-5 text-white" />
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-white text-black text-xs rounded-lg px-2 py-1 whitespace-nowrap">
                      {action.label}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                    </div>
                  </div>

                  {/* تأثير النجاح */}
                  {activeAction === action.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 bg-white/20 rounded-full"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuickActions;