import { motion } from 'framer-motion';
import './Loaders.css';

// ============================================
// 1. AI-Style Glowing Spinner
// ============================================

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner = ({ size = 'md', className = '' }: SpinnerProps) => {
  const sizeClass = {
    sm: 'spinner--sm',
    md: 'spinner--md',
    lg: 'spinner--lg',
  }[size];

  return (
    <div className={`spinner-container ${className}`}>
      <div className={`spinner ${sizeClass}`}>
        <div className="spinner-glow" />
        <div className="spinner-ring" />
        <div className="spinner-ring spinner-ring--delayed" />
      </div>
    </div>
  );
};

// Framer Motion version
export const AnimatedSpinner = ({ size = 'md', className = '' }: SpinnerProps) => {
  const sizes = { sm: 24, md: 40, lg: 60 };

  return (
    <motion.div
      className={`spinner-container ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
    >
      <svg width={sizes[size]} height={sizes[size]} viewBox="0 0 50 50">
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
};

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

export const Skeleton = ({
  variant = 'text',
  width,
  height,
  className = '',
  animation = 'wave',
}: SkeletonProps) => {
  const getDimensions = () => {
    if (width && height) return { width, height };
    switch (variant) {
      case 'text':
        return { width: '100%', height: '1em' };
      case 'circular':
        return { width: '40px', height: '40px' };
      case 'rectangular':
        return { width: '100%', height: '200px' };
      default:
        return {};
    }
  };

  const dimensions = getDimensions();

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

// Skeleton for specific content
export const SkeletonText = ({ lines = 3, className = '' }: { lines?: number; className?: string }) => (
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

export const SkeletonCard = ({ className = '' }: { className?: string }) => (
  <div className={`skeleton-card ${className}`}>
    <Skeleton variant="rectangular" height={160} />
    <div className="skeleton-card__content">
      <Skeleton variant="text" width="80%" height={24} />
      <SkeletonText lines={2} />
    </div>
  </div>
);

export const SkeletonAvatar = ({ size = 40 }: { size?: number }) => (
  <Skeleton variant="circular" width={size} height={size} />
);

// ============================================
// 3. Pulsing Dots Animation
// ============================================

interface PulsingDotsProps {
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PulsingDots = ({ count = 3, size = 'md', className = '' }: PulsingDotsProps) => {
  const sizeClass = {
    sm: 'dots--sm',
    md: 'dots--md',
    lg: 'dots--lg',
  }[size];

  return (
    <div className={`pulsing-dots ${sizeClass} ${className}`}>
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
};

// Loading text with dots
export const LoadingDots = ({ text = 'Loading', className = '' }: { text?: string; className?: string }) => (
  <div className={`loading-dots ${className}`}>
    <span>{text}</span>
    <div className="loading-dots__dots">
      <span />
      <span />
      <span />
    </div>
  </div>
);

// ============================================
// 4. Combined Loading States
// ============================================

export const LoadingSpinner = ({ className = '' }: { className?: string }) => (
  <div className={`loading-container loading-container--center ${className}`}>
    <AnimatedSpinner size="lg" />
  </div>
);

export const LoadingPage = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="loading-page">
    <AnimatedSpinner size="lg" />
    <LoadingDots text={message} />
  </div>
);

export const LoadingOverlay = () => (
  <div className="loading-overlay">
    <div className="loading-overlay__content">
      <AnimatedSpinner size="lg" />
    </div>
  </div>
);

// ============================================
// 5. Progress Loader
// ============================================

interface ProgressLoaderProps {
  progress?: number;
  className?: string;
}

export const ProgressLoader = ({ progress, className = '' }: ProgressLoaderProps) => (
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
