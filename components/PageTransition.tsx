import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

interface PageTransitionProps {
  children: React.ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: "easeIn" as const
    }
  }
};

const childVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const }
  }
};

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const router = useRouter();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={router.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="min-h-screen"
      >
        <motion.div variants={childVariants}>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;