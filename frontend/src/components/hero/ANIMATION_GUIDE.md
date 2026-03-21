# Neural Network Animation Component

## Overview

The `NeuralNetworkAnimation` component creates an interactive neural network visualization using HTML5 Canvas. It features floating particles with glowing connections that respond to mouse movement, typing activity, and include parallax effects.

## Features

### 1. Particle System
- **Multi-layer particles**: 3 layers (0.3x, 0.65x, 1.0x scale) for depth
- **Orbital motion**: Each particle orbits around its base position
- **Pulsing glow**: Sine-wave based breathing effect
- **6 AI-themed colors**: Indigo, Purple, Blue, Violet, Cyan, Emerald

### 2. Neural Network Connections
- **Dynamic connections**: Particles connect when within 180px
- **Data flow animation**: Animated gradient showing "data" moving along connections
- **Adaptive distance**: Connection range increases with typing activity
- **Neural pulse**: Connections glow brighter when particles are close

### 3. Mouse Interactions
- **Smooth following**: Mouse position interpolates smoothly
- **Parallax effect**: Layers move at different speeds based on mouse position
- **Repulsion zone**: Particles gently push away from cursor
- **Glow indicator**: Subtle glow where mouse is located

### 4. Input Activity Reactivity
When user types in input fields:
- Connection range expands (180px → 230px)
- Particle speed increases
- Pulse animation speeds up
- Activity level decays smoothly over time

## Animation Logic

### Frame Loop (60fps)

```
1. Smooth mouse following (lerp factor 0.08)
   ↓
2. Draw animated gradient background
   ↓
3. Draw parallax grid (subtle depth effect)
   ↓
4. Draw mouse influence zone glow
   ↓
5. Update particles:
   - Orbital motion around base position
   - Parallax offset based on layer (0.02 - 0.08x)
   - Mouse repulsion (if within 150px)
   - Activity speed boost (from typing)
   - Pulse phase increment
   ↓
6. Create neural connections (within 180px + activity boost)
   ↓
7. Draw connections with data flow animation
   ↓
8. Draw particles with:
   - Outer glow (12x radius)
   - Inner glow (5x radius)
   - Solid core
   - Random sparkles (0.1% chance)
```

### Movement Algorithm

```javascript
// Smooth mouse following
mouse.x += (mouse.targetX - mouse.x) * 0.08;
mouse.y += (mouse.targetY - mouse.y) * 0.08;

// Parallax (different speeds per layer)
const parallaxFactor = 0.02 + (particle.layer * 0.03);
particle.x += (mouse.x - width/2) * parallaxFactor;

// Mouse repulsion
if (dist < 150) {
  const force = (150 - dist) / 150 * 0.3;
  particle.x += (dx / dist) * force;
}

// Orbital motion
particle.orbitAngle += particle.orbitSpeed;
particle.x = baseX + cos(orbitAngle) * orbitRadius;
```

## Props

```typescript
interface AnimationProps {
  inputActivityLevel?: number;  // 0-1, increases when user types
}
```

## Customization Guide

### Change Colors

Edit the `COLORS` array:

```typescript
const COLORS = [
  { primary: 'rgba(99, 102, 241,', glow: 'rgba(99, 102, 241, 0.3)' },  // Indigo
  { primary: 'rgba(139, 92, 246,', glow: 'rgba(139, 92, 246, 0.3)' },  // Purple
  { primary: 'rgba(59, 130, 246,', glow: 'rgba(59, 130, 246, 0.3)' },  // Blue
  { primary: 'rgba(168, 85, 247,', glow: 'rgba(168, 85, 247, 0.3)' },  // Violet
  { primary: 'rgba(34, 211, 238,', glow: 'rgba(34, 211, 238, 0.3)' },   // Cyan
  { primary: 'rgba(16, 185, 129,', glow: 'rgba(16, 185, 129, 0.3)' },   // Emerald
];
```

### Change Parallax Intensity

In `draw` function:

```typescript
// Layer-based parallax (back layers move slower)
const parallaxFactor = 0.02 + (particle.layer * 0.03);
// Increase for more dramatic parallax
// Decrease for subtler effect
```

### Change Mouse Repulsion Strength

```typescript
// In particle update loop
if (dist < 150 && dist > 0) {
  const force = (150 - dist) / 150 * 0.3;  // Change 0.3 for stronger/weaker
  particle.x += (dx / dist) * force;
}
```

### Change Connection Distance

```typescript
const maxConnectionDistance = 180 + activityBoost * 50;
// Base: 180px, Max with activity: 230px
```

### Change Orbital Motion Speed

In `createParticles`:

```typescript
orbitSpeed: (Math.random() * 0.003 + 0.001) * 
            (layer === 0 ? 0.5 : layer === 2 ? 1.5 : 1),
// Layer 0: slowest, Layer 2: fastest
```

### Change Activity Boost Effect

In `draw` function:

```typescript
// Activity speed boost
const activitySpeedBoost = 1 + activityBoost * 2;

// Activity pulse boost
particle.pulsePhase += particle.pulseSpeed * (1 + activityBoost);

// Activity connection boost
const maxConnectionDistance = 180 + activityBoost * 50;
```

## Integration with Login Form

### Setup Input Activity Tracking

```tsx
const [inputActivityLevel, setInputActivityLevel] = useState(0);

// Decay activity over time
useEffect(() => {
  if (inputActivityLevel > 0) {
    const decayInterval = setInterval(() => {
      setInputActivityLevel(prev => Math.max(0, prev - 0.05));
    }, 50);
    return () => clearInterval(decayInterval);
  }
}, [inputActivityLevel]);

// Pass to animation
<NeuralNetworkAnimation inputActivityLevel={inputActivityLevel} />

// Update on input change
<input
  onChange={() => setInputActivityLevel(prev => Math.min(1, prev + 0.15))}
  onFocus={() => setInputActivityLevel(0.3)}
/>
```

## Performance Optimization

- Uses `requestAnimationFrame` for smooth 60fps
- Particle count scales with screen size
- Connections recalculated each frame (spatial optimization possible)
- No unnecessary re-renders (uses refs)
- Gradient caching possible for heavy optimization

### Performance Tips

1. **Reduce particle count** for mobile:
   ```typescript
   const particleCount = Math.min(60, Math.floor((width * height) / 15000));
   ```

2. **Simplify connections** by increasing minimum distance:
   ```typescript
   const maxConnectionDistance = 120; // Instead of 180
   ```

3. **Disable sparkles** on low-end devices:
   ```typescript
   if (particle.layer === 2 && Math.random() < 0.001) {
     // Remove sparkle code
   }
   ```

## File Structure

```
frontend/src/
├── components/
│   └── hero/
│       ├── NeuralNetworkAnimation.tsx  # Background animation
│       ├── HeroRobot.tsx             # Robot assistant
│       ├── index.ts                  # Exports
│       └── ANIMATION_GUIDE.md       # This file
└── pages/
    └── LoginPage.tsx                 # Uses both components
```

---

# HeroRobot Component

## Overview

The `HeroRobot` is a compact, interactive robot assistant that appears on the login page. It features eye-tracking, mood animations, and reacts to user input.

## Features

### Visual Design
- **Futuristic body**: Dark gradient with glowing neon accents
- **Animated eyes**: Cyan glowing eyes that track cursor movement
- **Antenna**: With pulsing indicator light
- **Side LEDs**: Status lights that change with mood
- **Glow effect**: Ambient purple/indigo glow behind the robot

### Animations
- **Floating idle**: Gentle bobbing when not active
- **Thinking bounce**: Bounces when user focuses on inputs
- **Eye tracking**: Eyes follow cursor movement
- **Mood transitions**: Smooth transitions between states
- **Hover effect**: Scales up slightly on hover

## Props

```typescript
interface HeroRobotProps {
  isActive?: boolean;   // Triggers thinking animation
  onFocus?: () => void;  // Called when robot is clicked
}
```

## Mood States

| Mood | Visual | When Active |
|------|--------|-------------|
| `idle` | Neutral face, cyan eyes pulse | Default state |
| `thinking` | Bouncing, purple eyes | Input focused |
| `happy` | Smiling, enlarged | Hover or click |
| `excited` | Pulsing, scaled up | Celebration |
| `speaking` | Open mouth animation | AI responding |

## Customization

### Change Robot Colors

In `HeroRobot.tsx`:

```tsx
// Eye color
bg-cyan-400 with boxShadow

// Antenna glow
bg-cyan-400  // or bg-purple-400 for thinking

// Body gradient
bg-gradient-to-br from-gray-800 to-gray-900

// Border gradient
bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500
```

### Change Size

```tsx
// Smaller
<div className="w-16 h-16">

// Larger
<div className="w-28 h-28">
```

### Change Mood Timing

```typescript
// Random mood change interval (5-15 seconds)
const delay = 5000 + Math.random() * 10000;

// Mood duration (2-5 seconds)
setTimeout(() => setMood('idle'), 2000 + Math.random() * 3000);
```

## Usage Example

```tsx
import { HeroRobot } from '@/components/hero';

const LoginPage = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div>
      <HeroRobot 
        isActive={isActive}
        onFocus={() => setIsActive(false)}
      />
      
      <input
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
      />
    </div>
  );
};
```

## Integration with Animation

The robot and neural network animation can work together:

```tsx
const [inputActivity, setInputActivity] = useState(0);
const [robotActive, setRobotActive] = useState(false);

<NeuralNetworkAnimation inputActivityLevel={inputActivity} />
<HeroRobot isActive={robotActive} />

<input
  onChange={() => {
    setInputActivity(prev => Math.min(1, prev + 0.1));
    setRobotActive(true);
  }}
  onFocus={() => setRobotActive(true)}
/>
```

## Performance

- Uses CSS animations (GPU accelerated)
- No canvas rendering overhead
- Cleanup timers on unmount
- Lightweight (~5KB gzipped)
