# Animation System Documentation

## Overview

The Learning Platform uses a unified animation system built with Framer Motion, providing consistent, performant, and accessible animations across the entire application.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        ANIMATION SYSTEM                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │                    animation/                              │       │
│  │  ├── index.ts           (Unified exports)                │       │
│  │  ├── animationConfig.ts  (Presets, variants, transitions)  │       │
│  │  └── MotionProvider.tsx  (Page wrapper, scroll-to-top)    │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │                    USAGE LAYER                             │       │
│  │                                                              │       │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │       │
│  │  │   motion/   │  │ animations/ │  │interactive/│          │       │
│  │  │ScrollAnim  │  │PageTrans.  │  │Components  │          │       │
│  │  └─────────────┘  └─────────────┘  └─────────────┘          │       │
│  │                                                              │       │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │       │
│  │  │  loaders/   │  │   hero/    │  │   robot/   │          │       │
│  │  │  Loaders    │  │Hero3DScene │  │Assistant   │          │       │
│  │  └─────────────┘  └─────────────┘  └─────────────┘          │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Quick Start

### 1. Import from unified system

```tsx
import { 
  // Scroll animations
  ScrollReveal,
  StaggeredList,
  StaggeredItem,
  
  // Page transitions  
  AnimatedPage,
  
  // Interactive components
  InteractiveButton,
  InteractiveCard,
  
  // Loaders
  Spinner,
  LoadingPage,
  
  // Config
  ANIMATION,
} from '@/components/animation';
```

### 2. Use presets

```tsx
// Scroll reveal
<ScrollReveal delay={0.2}>
  <Content />
</ScrollReveal>

// Staggered list
<StaggeredList staggerDelay={0.08}>
  <StaggeredItem><Card /></StaggeredItem>
  <StaggeredItem><Card /></StaggeredItem>
</StaggeredList>

// Interactive button
<InteractiveButton variant="primary" onClick={handleClick}>
  Click Me
</InteractiveButton>

// Loading state
{isLoading && <Spinner size="lg" />}
```

## Animation Presets

### Timing

```typescript
ANIMATION.FAST      // 0.15s
ANIMATION.NORMAL    // 0.25s  
ANIMATION.SLOW     // 0.4s
ANIMATION.PAGE      // 0.5s
```

### Easing

```typescript
ANIMATION.EASE_OUT     // cubic-bezier(0.25, 0.1, 0.25, 1)
ANIMATION.EASE_IN_OUT   // cubic-bezier(0.42, 0, 0.58, 1)
ANIMATION.EASE_BOUNCE  // cubic-bezier(0.34, 1.56, 0.64, 1)
ANIMATION.SPRING       // spring with stiffness: 300, damping: 30
```

## Components

### Scroll Animations

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| `ScrollReveal` | Fade + slide on scroll | `delay`, `direction`, `distance` |
| `StaggeredList` | Animated list container | `staggerDelay`, `type` |
| `StaggeredItem` | Individual list item | - |
| `FadeIn` | Simple fade on scroll | `delay`, `duration` |
| `ScaleIn` | Scale animation on scroll | `delay`, `scale` |
| `ParallaxScroll` | Parallax effect | `speed`, `direction` |
| `AnimatedSection` | Section with title animation | `title`, `subtitle`, `centered` |
| `LazyImage` | Lazy load with animation | `src`, `alt`, `placeholder` |

### Page Transitions

| Component | Purpose |
|-----------|---------|
| `AnimatedPage` | Fade + slide page wrapper |
| `PageTransition` | Route transition wrapper |
| `StaggerContainer` | Staggered children |
| `StaggerItem` | Individual stagger item |

### Interactive Components

| Component | Features |
|-----------|---------|
| `InteractiveButton` | Hover scale, glow, loading state |
| `InteractiveCard` | Lift, shadow on hover |
| `InteractiveInput` | Focus glow, icon animation |
| `AnimatedBadge` | Hover scale |
| `ProgressIndicator` | Animated progress bar |
| `ToggleSwitch` | Spring animation |

### Loaders

| Component | Style |
|-----------|-------|
| `Spinner` | Glowing dual-ring spinner |
| `AnimatedSpinner` | SVG gradient spinner |
| `Skeleton` | Content placeholder |
| `SkeletonCard` | Card-shaped skeleton |
| `SkeletonText` | Multi-line text |
| `PulsingDots` | Staggered dots animation |
| `LoadingDots` | Text with animated dots |
| `LoadingPage` | Full page loading state |
| `LoadingOverlay` | Modal-style overlay |

## CSS Animation System

### Classes

```html
<!-- Fade -->
<div class="fade-in">Content</div>

<!-- Slide -->
<div class="slide-up">Content</div>
<div class="slide-down">Content</div>

<!-- Scale -->
<div class="scale-in">Content</div>

<!-- Scroll animate -->
<div class="scroll-animate scroll-animate-up">
  Appears on scroll
</div>

<!-- Stagger -->
<div class="stagger-1">First</div>
<div class="stagger-2">Second</div>

<!-- Section -->
<div class="section-stagger">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### Micro-interactions

```html
<!-- Hover lift -->
<div class="hover-lift">Card</div>

<!-- Hover scale -->
<div class="hover-scale">Element</div>

<!-- Hover glow -->
<div class="hover-glow">Glowing element</div>
```

## Performance

### Optimizations

1. **GPU Acceleration**
   ```css
   .gpu-accelerated {
     transform: translateZ(0);
     will-change: transform;
     backface-visibility: hidden;
   }
   ```

2. **Reduced Motion**
   ```css
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after {
       animation-duration: 0.01ms !important;
       transition-duration: 0.01ms !important;
     }
   }
   ```

3. **Throttled Updates**
   - Scroll animations use `IntersectionObserver`
   - Mouse tracking throttled to 60fps

### Bundle Size

| Module | Approximate Size |
|--------|-----------------|
| framer-motion | ~45kb gzipped |
| CSS animations | ~5kb |
| Total overhead | ~50kb |

## Usage Examples

### Hero Section

```tsx
import { ScrollReveal, StaggeredList, StaggeredItem } from '@/components/animation';

function Hero() {
  return (
    <section className="relative h-screen">
      {/* 3D Background */}
      <Hero3DScene className="absolute inset-0" />
      
      {/* Animated content */}
      <div className="relative z-10 container">
        <ScrollReveal>
          <h1 className="text-5xl font-bold">
            Learn to Code
          </h1>
        </ScrollReveal>
        
        <ScrollReveal delay={0.2}>
          <p className="text-xl text-gray-300">
            Interactive lessons with AI-powered feedback
          </p>
        </ScrollReveal>
        
        <StaggeredList staggerDelay={0.1}>
          <StaggeredItem><FeatureCard1 /></StaggeredItem>
          <StaggeredItem><FeatureCard2 /></StaggeredItem>
          <StaggeredItem><FeatureCard3 /></StaggeredItem>
        </StaggeredList>
      </div>
      
      {/* Floating robot */}
      <SceneRobot position="bottom-right" />
    </section>
  );
}
```

### Course Card Grid

```tsx
import { StaggeredList, StaggeredItem, InteractiveCard } from '@/components/animation';

function CourseGrid({ courses }) {
  return (
    <StaggeredList staggerDelay={0.05} type="scale">
      {courses.map(course => (
        <StaggeredItem key={course.id}>
          <InteractiveCard onClick={() => navigate(course.id)}>
            <img src={course.image} alt={course.title} />
            <h3>{course.title}</h3>
            <p>{course.description}</p>
          </InteractiveCard>
        </StaggeredItem>
      ))}
    </StaggeredList>
  );
}
```

### Loading States

```tsx
import { LoadingPage, Spinner, SkeletonCard } from '@/components/animation';

// Full page loading
{isLoading && <LoadingPage message="Loading courses..." />}

// Inline loading
{isLoading ? (
  <Spinner size="lg" />
) : (
  <Content />
)}

// Skeleton loading
<div className="grid gap-4">
  {[1, 2, 3].map(i => (
    <SkeletonCard key={i} />
  ))}
</div>
```

### Form with Interactions

```tsx
import { InteractiveInput, InteractiveButton } from '@/components/animation';

function LoginForm() {
  return (
    <form onSubmit={handleSubmit}>
      <InteractiveInput
        label="Email"
        type="email"
        placeholder="you@example.com"
        icon={<MailIcon />}
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      
      <InteractiveInput
        label="Password"
        type="password"
        icon={<LockIcon />}
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      
      <InteractiveButton
        type="submit"
        variant="primary"
        isLoading={isSubmitting}
      >
        Sign In
      </InteractiveButton>
    </form>
  );
}
```

## File Structure

```
frontend/src/components/
├── animation/                    # Unified animation exports
│   ├── index.ts                 # Central export
│   ├── animationConfig.ts        # Presets & variants
│   └── MotionProvider.tsx       # Page wrapper
│
├── motion/                       # Scroll animations
│   └── ScrollAnimations.tsx     # Scroll reveal, stagger
│
├── animations/                   # Page transitions
│   └── PageTransition.tsx       # Route animations
│
├── interactive/                  # UI components
│   └── InteractiveComponents.tsx # Buttons, cards, inputs
│
├── loaders/                      # Loading states
│   ├── Loaders.tsx              # All loader components
│   └── Loaders.css              # Loader styles
│
├── hero/                         # Hero section
│   ├── Hero3DScene.tsx          # Three.js scene
│   ├── SceneRobot.tsx            # Floating robot
│   └── HeroScene.tsx            # Combined hero
│
└── styles/                       # CSS animations
    ├── motion.css                # Scroll, stagger
    └── micro-interactions.css    # Buttons, inputs, cards
```

## Best Practices

1. **Consistent Timing**
   - Use `ANIMATION` presets instead of hardcoded values
   - Fast interactions: 0.15s
   - Normal transitions: 0.25s
   - Page transitions: 0.5s

2. **Accessibility**
   - Always include `prefers-reduced-motion` fallback
   - Don't animate user input elements excessively
   - Ensure animation doesn't block interaction

3. **Performance**
   - Prefer CSS animations for simple effects
   - Use `will-change` sparingly
   - Clean up animation listeners on unmount

4. **Consistency**
   - Use unified import: `@/components/animation`
   - Follow naming conventions
   - Document custom animations

## Troubleshooting

### Animation not working?
- Check if element has proper ref for scroll detection
- Verify Framer Motion is imported correctly
- Check console for errors

### Janky performance?
- Add `gpu-accelerated` class
- Reduce number of animated elements
- Use CSS animations for simple effects

### Reduced motion not working?
- Check `@media (prefers-reduced-motion)` is applied
- Test in browser accessibility settings
- Ensure no `!important` overrides
