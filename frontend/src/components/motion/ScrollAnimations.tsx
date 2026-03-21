import { useEffect, useRef, useState, ReactNode } from 'react';
import { motion, useInView, useAnimation, Variants } from 'framer-motion';

// ============================================
// Scroll Animation Hook
// ============================================

interface UseScrollAnimationOptions {
  once?: boolean;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const { once = true } = options;
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else if (!once) {
      controls.start('hidden');
    }
  }, [isInView, controls, once]);

  return { ref, isInView, controls };
};

// ============================================
// Scroll Reveal Container
// ============================================

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  distance?: number;
}

export const ScrollReveal = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.5,
  distance = 30,
}: ScrollRevealProps) => {
  const { ref, isInView } = useScrollAnimation();

  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: distance };
      case 'down': return { y: -distance };
      case 'left': return { x: distance };
      case 'right': return { x: -distance };
      case 'none': return {};
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...getInitialPosition() }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...getInitialPosition() }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ============================================
// Staggered List Animation
// ============================================

interface StaggeredListProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  initialDelay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  type?: 'fade' | 'scale' | 'slide';
}

export const StaggeredList = ({
  children,
  className = '',
  staggerDelay = 0.08,
  initialDelay = 0,
  direction = 'up',
  type = 'fade',
}: StaggeredListProps) => {
  const { ref, isInView } = useScrollAnimation({ once: true });

  const getVariants = (): Variants => {
    const baseOffset = direction === 'up' ? 30 : direction === 'down' ? -30 : 0;
    const xOffset = direction === 'left' ? 30 : direction === 'right' ? -30 : 0;

    const initial = {
      opacity: 0,
      y: baseOffset,
      x: xOffset,
      scale: type === 'scale' ? 0.95 : 1,
    };

    const animate = {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
    };

    return {
      hidden: initial,
      visible: {
        ...animate,
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: initialDelay,
          duration: 0.4,
          ease: [0.25, 0.1, 0.25, 1],
        },
      },
    };
  };

  return (
    <motion.div
      ref={ref}
      variants={getVariants()}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ============================================
// Staggered Item
// ============================================

interface StaggeredItemProps {
  children: ReactNode;
  className?: string;
}

export const StaggeredItem = ({ children, className = '' }: StaggeredItemProps) => {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
};

// ============================================
// Fade In Container
// ============================================

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export const FadeIn = ({
  children,
  className = '',
  delay = 0,
  duration = 0.4,
}: FadeInProps) => {
  const { ref, isInView } = useScrollAnimation({ once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ============================================
// Scale In
// ============================================

interface ScaleInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  scale?: number;
}

export const ScaleIn = ({
  children,
  className = '',
  delay = 0,
  scale = 0.95,
}: ScaleInProps) => {
  const { ref, isInView } = useScrollAnimation({ once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ============================================
// Parallax Scroll Effect
// ============================================

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: 'up' | 'down';
}

export const ParallaxScroll = ({
  children,
  className = '',
  speed = 0.5,
  direction = 'up',
}: ParallaxProps) => {
  const [scrollY, setScrollY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        const elementCenter = rect.top + rect.height / 2;
        const offset = (viewportCenter - elementCenter) * speed;
        setScrollY(direction === 'up' ? offset : -offset);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, direction]);

  return (
    <motion.div
      ref={ref}
      style={{ y: scrollY }}
      transition={{ type: 'spring', stiffness: 100, damping: 30 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ============================================
// Animated Section
// ============================================

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  centered?: boolean;
}

export const AnimatedSection = ({
  children,
  className = '',
  title,
  subtitle,
  centered = false,
}: AnimatedSectionProps) => {
  return (
    <div className={className}>
      {title && (
        <ScrollReveal>
          <h2 className={`text-3xl font-bold mb-4 ${centered ? 'text-center' : ''}`}>
            {title}
          </h2>
        </ScrollReveal>
      )}
      {subtitle && (
        <ScrollReveal delay={0.1}>
          <p className={`text-gray-400 mb-8 ${centered ? 'text-center' : ''}`}>
            {subtitle}
          </p>
        </ScrollReveal>
      )}
      {children}
    </div>
  );
};

// ============================================
// Lazy Load Image with Animation
// ============================================

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}

export const LazyImage = ({
  src,
  alt,
  className = '',
  placeholder = '/placeholder.png',
}: LazyImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={loaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={className}
    >
      <img
        src={inView ? src : placeholder}
        alt={alt}
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0.5 }}
      />
    </motion.div>
  );
};

// ============================================
// Content Toggle Animation
// ============================================

interface AnimatedContentProps {
  show: boolean;
  children: ReactNode;
  className?: string;
  type?: 'fade' | 'slide' | 'scale';
}

export const AnimatedContent = ({
  show,
  children,
  className = '',
  type = 'fade',
}: AnimatedContentProps) => {
  const getVariants = (): Variants => {
    switch (type) {
      case 'fade':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
          exit: { opacity: 0 },
        };
      case 'slide':
        return {
          hidden: { opacity: 0, y: -10 },
          visible: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 10 },
        };
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.95 },
          visible: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.95 },
        };
    }
  };

  return (
    <motion.div
      variants={getVariants()}
      initial="hidden"
      animate={show ? 'visible' : 'hidden'}
      exit="exit"
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
