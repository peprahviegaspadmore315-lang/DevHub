// ============================================
// Unified Animation System
// Central export for all animation components
// ============================================

// Core Animation Hooks & Components
export {
  useScrollAnimation,
  ScrollReveal,
  StaggeredList,
  StaggeredItem,
  FadeIn,
  ScaleIn,
  ParallaxScroll,
  AnimatedSection,
  LazyImage,
  AnimatedContent,
} from '../motion/ScrollAnimations';

// Page Transitions
export {
  PageTransition,
  AnimatedPage,
  StaggerContainer,
  StaggerItem,
  AnimatedCard,
  SlideInLeft,
  ScaleIn as ModalScaleIn,
  FadeIn as ModalFadeIn,
  Backdrop,
} from '../animations/PageTransition';

// Interactive Components
export {
  InteractiveButton,
  InteractiveCard,
  InteractiveInput,
  AnimatedListItem,
  AnimatedBadge,
  ProgressIndicator,
  ToggleSwitch,
} from '../interactive/InteractiveComponents';

// Loaders
export {
  Spinner,
  AnimatedSpinner,
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonAvatar,
  PulsingDots,
  LoadingDots,
  LoadingSpinner,
  LoadingPage,
  LoadingOverlay,
  ProgressLoader,
} from '../loaders/Loaders';

// Motion Provider & Page Wrapper
export {
  MotionProvider,
  PageWrapper,
  ScrollToTop,
  motionVariants,
  motionTransition,
} from './MotionProvider';

// Animation Config & Presets
export {
  ANIMATION,
  variants,
  transitions,
  stagger,
  getAnimationConfig,
  getReducedMotionVariants,
} from './animationConfig';
