import { motion } from 'framer-motion';
import { memo, useMemo } from 'react';
import { OrbitalLoader } from '@/components/ui/orbital-loader';
import './Loaders.css';

// ============================================
// 1. AI-Style Glowing Spinner
// ============================================

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const spinnerSizeClassMap = {
  sm: 'spinner--sm',
  md: 'spinner--md',
  lg: 'spinner--lg',
} as const;

const spinnerSvgSizes = {
  sm: 24,
  md: 40,
  lg: 60,
} as const;

const SpinnerComponent = ({ size = 'md', className = '' }: SpinnerProps) => (
  <div className={`spinner-container ${className}`}>
    <div className={`spinner ${spinnerSizeClassMap[size]}`}>
      <div className="spinner-glow" />
      <div className="spinner-ring" />
      <div className="spinner-ring spinner-ring--delayed" />
    </div>
  </div>
);

export const Spinner = memo(SpinnerComponent);

// Framer Motion version
const AnimatedSpinnerComponent = ({ size = 'md', className = '' }: SpinnerProps) => (
  <motion.div
    className={`spinner-container ${className}`}
    animate={{ rotate: 360 }}
    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
  >
    <svg width={spinnerSvgSizes[size]} height={spinnerSvgSizes[size]} viewBox="0 0 50 50">
      <defs>
        <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="url(#spinnerGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="80, 60"
        filter="url(#glow)"
      />
    </svg>
  </motion.div>
);

export const AnimatedSpinner = memo(AnimatedSpinnerComponent);

// ============================================
// 2. Skeleton Loading
// ============================================

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
  animation?: 'pulse' | 'wave' | 'none';
}

const defaultDimensions = {
  text: { width: '100%', height: '1em' },
  circular: { width: '40px', height: '40px' },
  rectangular: { width: '100%', height: '200px' },
} as const;

const SkeletonComponent = ({
  variant = 'text',
  width,
  height,
  className = '',
  animation = 'wave',
}: SkeletonProps) => {
  const dimensions = useMemo(() => {
    if (width && height) return { width, height };
    return defaultDimensions[variant];
  }, [width, height, variant]);

  return (
    <div
      className={`skeleton skeleton--${variant} skeleton--${animation} ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width || dimensions.width,
        height: typeof height === 'number' ? `${height}px` : height || dimensions.height,
      }}
    />
  );
};

export const Skeleton = memo(SkeletonComponent);

// Skeleton for specific content
const SkeletonTextComponent = ({ lines = 3, className = '' }: { lines?: number; className?: string }) => (
  <div className={`skeleton-text ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        width={i === lines - 1 ? '70%' : '100%'}
      />
    ))}
  </div>
);

export const SkeletonText = memo(SkeletonTextComponent);

const SkeletonCardComponent = ({ className = '' }: { className?: string }) => (
  <div className={`skeleton-card ${className}`}>
    <Skeleton variant="rectangular" height={160} />
    <div className="skeleton-card__content">
      <Skeleton variant="text" width="80%" height={24} />
      <SkeletonText lines={2} />
    </div>
  </div>
);

export const SkeletonCard = memo(SkeletonCardComponent);

const SkeletonAvatarComponent = ({ size = 40 }: { size?: number }) => (
  <Skeleton variant="circular" width={size} height={size} />
);

export const SkeletonAvatar = memo(SkeletonAvatarComponent);

// ============================================
// 3. Pulsing Dots Animation
// ============================================

interface PulsingDotsProps {
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const dotsSizeClassMap = {
  sm: 'dots--sm',
  md: 'dots--md',
  lg: 'dots--lg',
} as const;

const PulsingDotsComponent = ({ count = 3, size = 'md', className = '' }: PulsingDotsProps) => (
  <div className={`pulsing-dots ${dotsSizeClassMap[size]} ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        className="pulsing-dot"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          delay: i * 0.2,
          ease: 'easeInOut',
        }}
      />
    ))}
  </div>
);

export const PulsingDots = memo(PulsingDotsComponent);

// Loading text with dots
const LoadingDotsComponent = ({ text = 'Loading', className = '' }: { text?: string; className?: string }) => (
  <div className={`loading-dots ${className}`}>
    <span>{text}</span>
    <div className="loading-dots__dots">
      <span />
      <span />
      <span />
    </div>
  </div>
);

export const LoadingDots = memo(LoadingDotsComponent);

// ============================================
// 4. Combined Loading States
// ============================================

const LoadingSpinnerComponent = ({ className = '' }: { className?: string }) => (
  <div className={`loading-container loading-container--center ${className}`}>
    <OrbitalLoader size="md" />
  </div>
);

export const LoadingSpinner = memo(LoadingSpinnerComponent);

const LoadingPageComponent = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="loading-page">
    <OrbitalLoader message={message} size="lg" />
  </div>
);

export const LoadingPage = memo(LoadingPageComponent);

const LoadingOverlayComponent = () => (
  <div className="loading-overlay">
    <div className="loading-overlay__content">
      <OrbitalLoader message="Working on it..." size="lg" />
    </div>
  </div>
);

export const LoadingOverlay = memo(LoadingOverlayComponent);

// ============================================
// 5. Progress Loader
// ============================================

interface ProgressLoaderProps {
  progress?: number;
  className?: string;
}

const ProgressLoaderComponent = ({ progress, className = '' }: ProgressLoaderProps) => (
  <div className={`progress-loader ${className}`}>
    <div className="progress-loader__track">
      <motion.div
        className="progress-loader__fill"
        initial={{ width: 0 }}
        animate={{ width: `${progress || 100}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
    {progress !== undefined && (
      <span className="progress-loader__text">{Math.round(progress)}%</span>
    )}
  </div>
);

export const ProgressLoader = memo(ProgressLoaderComponent);
