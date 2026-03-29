import { Variants, Transition } from 'framer-motion';

// ============================================
// Animation Presets (Apple-style)
// ============================================

export const ANIMATION = {
  // Timing
  FAST: 0.15,
  NORMAL: 0.25,
  SLOW: 0.4,
  PAGE: 0.5,

  // Easing
  EASE_OUT: [0.25, 0.1, 0.25, 1] as const,
  EASE_IN_OUT: [0.42, 0, 0.58, 1] as const,
  EASE_BOUNCE: [0.34, 1.56, 0.64, 1] as const,
  SPRING: { type: 'spring', stiffness: 300, damping: 30 } as const,
} as const;

// ============================================
// Animation Variants
// ============================================

export const variants = {
  // Page transitions
  page: {
    initial: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },

  // Fade in
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },

  // Slide up
  slideUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  },

  // Slide down
  slideDown: {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 },
  },

  // Scale in
  scale: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },

  // Slide from left
  slideLeft: {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  },

  // Slide from right
  slideRight: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  },
} as const;

// ============================================
// Transition Presets
// ============================================

export const transitions = {
  fast: {
    duration: ANIMATION.FAST,
    ease: ANIMATION.EASE_OUT,
  } as Transition,

  normal: {
    duration: ANIMATION.NORMAL,
    ease: ANIMATION.EASE_OUT,
  } as Transition,

  slow: {
    duration: ANIMATION.SLOW,
    ease: ANIMATION.EASE_OUT,
  } as Transition,

  page: {
    duration: ANIMATION.PAGE,
    ease: ANIMATION.EASE_OUT,
  } as Transition,

  spring: ANIMATION.SPRING,
} as const;

// ============================================
// Stagger Presets
// ============================================

export const stagger = {
  fast: 0.05,
  normal: 0.08,
  slow: 0.12,
} as const;

// ============================================
// Composable Animation Hook
// ============================================

import { useAnimation } from 'framer-motion';
import { useCallback } from 'react';

export function useAnimationPresets() {
  const controls = useAnimation();

  const animate = useCallback(
    async (variant: keyof typeof variants) => {
      await controls.start(variant);
    },
    [controls]
  );

  return { controls, animate };
}

// ============================================
// Animation Config for Components
// ============================================

export interface AnimationConfig {
  variants: Variants;
  transition: Transition;
}

export function getAnimationConfig(
  type: keyof typeof variants,
  speed: keyof typeof transitions = 'normal',
  staggerDelay: number = stagger.normal
): AnimationConfig {
  return {
    variants: variants[type],
    transition: {
      ...transitions[speed],
      staggerChildren: staggerDelay,
      delayChildren: 0,
    },
  };
}

// ============================================
// Reduced Motion Support
// ============================================

export function getReducedMotionVariants(baseVariants: Variants): Variants {
  if (typeof window !== 'undefined' && window.matchMedia) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      };
    }
  }
  
  return baseVariants;
}

// ============================================
// CSS Variables Reference
// ============================================

/*
CSS Custom Properties (in micro-interactions.css):

--ease-out: cubic-bezier(0.25, 0.1, 0.25, 1)
--ease-in-out: cubic-bezier(0.42, 0, 0.58, 1)
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1)

--duration-fast: 0.15s
--duration-normal: 0.25s
--duration-slow: 0.4s
--duration-page: 0.5s

Usage in CSS:
.element {
  transition: all var(--duration-normal) var(--ease-out);
}
*/
