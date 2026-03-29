import { motion, AnimatePresence, Variants, Transition } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { ReactNode, memo } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

// Custom easing function
const ease = [0.25, 0.1, 0.25, 1] as const;

// Page transition variants with fade + slide
const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -10,
  },
};

// Transition config
const pageTransition: Transition = {
  duration: 0.5,
  ease: ease,
};

// Container variants for staggered children
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

// Individual item variants
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: ease,
    },
  },
};

// Slide variants for cards/list items
const slideVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: ease,
    },
  },
};

// Scale variants for modals/overlays
const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: ease,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: [0.55, 0.055, 0.675, 0.19],
    },
  },
};

// Fade variants
const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

// Page transition wrapper with AnimatePresence
const PageTransitionComponent = ({ children, className }: PageTransitionProps) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
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
    </AnimatePresence>
  );
};

export const PageTransition = memo(PageTransitionComponent);

// Animated page wrapper with layout
const AnimatedPageComponent = ({ children, className }: PageTransitionProps) => {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={pageTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedPage = memo(AnimatedPageComponent);

// Staggered container for lists/cards
const StaggerContainerComponent = ({ 
  children, 
  className,
  delay = 0 
}: { 
  children: ReactNode; 
  className?: string;
  delay?: number;
}) => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    transition={{
      delay,
      staggerChildren: 0.08,
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerContainer = memo(StaggerContainerComponent);

// Staggered item
const StaggerItemComponent = ({ children, className }: { children: ReactNode; className?: string }) => (
  <motion.div variants={itemVariants} className={className}>
    {children}
  </motion.div>
);

export const StaggerItem = memo(StaggerItemComponent);

// Animated card with hover
const AnimatedCardComponent = ({ 
  children, 
  className,
  onClick 
}: { 
  children: ReactNode; 
  className?: string;
  onClick?: () => void;
}) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.2 }}
    className={className}
    onClick={onClick}
  >
    {children}
  </motion.div>
);

export const AnimatedCard = memo(AnimatedCardComponent);

// Slide in from left
const SlideInLeftComponent = ({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) => (
  <motion.div
    variants={slideVariants}
    initial="hidden"
    animate="visible"
    transition={{ delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export const SlideInLeft = memo(SlideInLeftComponent);

// Scale in (for modals)
const ScaleInPTComponent = ({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) => (
  <motion.div
    variants={scaleVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className={className}
    onClick={onClick}
  >
    {children}
  </motion.div>
);

export const ScaleIn = memo(ScaleInPTComponent);

// Fade in/out
const FadeInPTComponent = ({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) => (
  <motion.div
    variants={fadeVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    transition={{ delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export const FadeIn = memo(FadeInPTComponent);

// Overlay backdrop for modals
const BackdropComponent = ({ 
  children, 
  onClick,
  className 
}: { 
  children: ReactNode; 
  onClick?: () => void;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    onClick={onClick}
    className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center ${className || ''}`}
    style={{ backdropFilter: 'blur(4px)' }}
  >
    {children}
  </motion.div>
);

export const Backdrop = memo(BackdropComponent);

export { pageVariants, itemVariants, slideVariants, scaleVariants, fadeVariants, pageTransition, ease };
