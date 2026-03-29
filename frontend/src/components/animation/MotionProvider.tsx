import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// ============================================
// Motion Provider
// Wraps app with AnimatePresence for page transitions
// ============================================

interface MotionProviderProps {
  children: ReactNode;
}

export const MotionProvider = ({ children }: MotionProviderProps) => {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {children}
    </AnimatePresence>
  );
};

// ============================================
// Page Wrapper
// Wraps routes with consistent page transition
// ============================================

const pageTransition = {
  duration: 0.5,
  ease: [0.25, 0.1, 0.25, 1] as const,
};

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

export const PageWrapper = ({ children, className }: PageWrapperProps) => {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      transition={pageTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ============================================
// Scroll to Top on Route Change
// ============================================

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useScrollToTop(pathname);

  return null;
};

// ============================================
// Utility Hooks
// ============================================

import { useEffect } from 'react';

function useScrollToTop(key?: string) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [key]);
}

// ============================================
// Animation Presets
// ============================================

export const motionVariants = pageVariants;
export const motionTransition = pageTransition;
