import { useEffect, useRef, useCallback, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glow: string;
  alpha: number;
  pulsePhase: number;
  pulseSpeed: number;
  layer: number;
  orbitAngle: number;
  orbitSpeed: number;
  orbitRadius: number;
}

interface Connection {
  particle1: Particle;
  particle2: Particle;
  alpha: number;
}

const COLORS = [
  { primary: 'rgba(99, 102, 241,', glow: 'rgba(99, 102, 241, 0.3)' },   // Indigo
  { primary: 'rgba(139, 92, 246,', glow: 'rgba(139, 92, 246, 0.3)' },   // Purple
  { primary: 'rgba(59, 130, 246,', glow: 'rgba(59, 130, 246, 0.3)' },   // Blue
  { primary: 'rgba(168, 85, 247,', glow: 'rgba(168, 85, 247, 0.3)' },   // Violet
  { primary: 'rgba(34, 211, 238,', glow: 'rgba(34, 211, 238, 0.3)' },    // Cyan
  { primary: 'rgba(16, 185, 129,', glow: 'rgba(16, 185, 129, 0.3)' },    // Emerald (for "thinking")
];

interface MouseState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  velocity: { x: number; y: number };
  isNearInput: boolean;
}

interface AnimationProps {
  inputActivityLevel?: number;
}

export const NeuralNetworkAnimation = ({ inputActivityLevel = 0 }: AnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<MouseState>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    velocity: { x: 0, y: 0 },
    isNearInput: false,
  });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const createParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const particleCount = Math.min(100, Math.floor((width * height) / 12000));
    
    // Create layers for parallax effect
    const layers = 3;
    
    for (let i = 0; i < particleCount; i++) {
      const layer = Math.floor(Math.random() * layers);
      const layerScale = 0.3 + (layer * 0.35); // 0.3, 0.65, 1.0
      
      const baseX = Math.random() * width;
      const baseY = Math.random() * height;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      
      particles.push({
        x: baseX,
        y: baseY,
        baseX,
        baseY,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: (Math.random() * 2 + 1) * layerScale,
        color: color.primary,
        glow: color.glow,
        alpha: 0.4 + (layer * 0.2),
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.015 + 0.008,
        layer,
        orbitAngle: Math.random() * Math.PI * 2,
        orbitSpeed: (Math.random() * 0.003 + 0.001) * (layer === 0 ? 0.5 : layer === 2 ? 1.5 : 1),
        orbitRadius: Math.random() * 20 + 10,
      });
    }
    
    return particles;
  }, []);

  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Smooth mouse following
    const mouse = mouseRef.current;
    const smoothingFactor = 0.08;
    mouse.x += (mouse.targetX - mouse.x) * smoothingFactor;
    mouse.y += (mouse.targetY - mouse.y) * smoothingFactor;
    
    // Background with animated gradient
    const time = Date.now() * 0.0001;
    const gradientX = Math.sin(time) * 100;
    const gradientY = Math.cos(time * 0.7) * 100;
    
    const bgGradient = ctx.createRadialGradient(
      width / 2 + gradientX, height / 2 + gradientY, 0,
      width / 2, height / 2, Math.max(width, height)
    );
    bgGradient.addColorStop(0, '#0f0f1a');
    bgGradient.addColorStop(0.4, '#0a0a14');
    bgGradient.addColorStop(0.7, '#070710');
    bgGradient.addColorStop(1, '#030305');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw subtle grid for depth
    drawGrid(ctx, width, height, mouse);

    // Mouse influence zone (subtle glow where mouse is)
    const mouseGlowGradient = ctx.createRadialGradient(
      mouse.x, mouse.y, 0,
      mouse.x, mouse.y, 200
    );
    mouseGlowGradient.addColorStop(0, 'rgba(99, 102, 241, 0.05)');
    mouseGlowGradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.02)');
    mouseGlowGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = mouseGlowGradient;
    ctx.fillRect(0, 0, width, height);

    // Activity level influence (from typing)
    const activityBoost = inputActivityLevel * 0.5;

    // Update and draw particles with parallax
    const maxConnectionDistance = 180 + activityBoost * 50;
    const connections: Connection[] = [];
    
    // First pass: update positions with parallax
    for (const particle of particlesRef.current) {
      // Update orbit animation
      particle.orbitAngle += particle.orbitSpeed;
      
      // Base position with orbit
      const targetX = particle.baseX + Math.cos(particle.orbitAngle) * particle.orbitRadius;
      const targetY = particle.baseY + Math.sin(particle.orbitAngle) * particle.orbitRadius;
      
      // Layer-based parallax (back layers move slower with mouse)
      const parallaxFactor = 0.02 + (particle.layer * 0.03);
      const parallaxX = (mouse.x - width / 2) * parallaxFactor;
      const parallaxY = (mouse.y - height / 2) * parallaxFactor;
      
      // Apply parallax with smooth lerping
      particle.x += ((targetX + parallaxX) - particle.x) * 0.05;
      particle.y += ((targetY + parallaxY) - particle.y) * 0.05;
      
      // Mouse repulsion (particles move away from mouse slightly)
      const dx = particle.x - mouse.x;
      const dy = particle.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 150 && dist > 0) {
        const force = (150 - dist) / 150 * 0.3;
        particle.x += (dx / dist) * force;
        particle.y += (dy / dist) * force;
      }
      
      // Activity level boost (particles move faster when user is typing)
      const activitySpeedBoost = 1 + activityBoost * 2;
      particle.x += particle.vx * activitySpeedBoost;
      particle.y += particle.vy * activitySpeedBoost;
      
      // Pulse animation
      particle.pulsePhase += particle.pulseSpeed * (1 + activityBoost);
      
      // Bounce within bounds
      const margin = 50;
      if (particle.x < margin) { particle.x = margin; particle.vx *= -0.8; }
      if (particle.x > width - margin) { particle.x = width - margin; particle.vx *= -0.8; }
      if (particle.y < margin) { particle.y = margin; particle.vy *= -0.8; }
      if (particle.y > height - margin) { particle.y = height - margin; particle.vy *= -0.8; }
      
      // Collect potential connections
      for (let j = particlesRef.current.indexOf(particle) + 1; j < particlesRef.current.length; j++) {
        const other = particlesRef.current[j];
        const connDx = particle.x - other.x;
        const connDy = particle.y - other.y;
        const distance = Math.sqrt(connDx * connDx + connDy * connDy);
        
        if (distance < maxConnectionDistance) {
          connections.push({
            particle1: particle,
            particle2: other,
            alpha: (1 - distance / maxConnectionDistance) * Math.min(particle.alpha, other.alpha),
          });
        }
      }
    }

    // Draw connections with neural network style (brighter near mouse)
    ctx.lineWidth = 1;
    for (const conn of connections) {
      const dx = conn.particle1.x - conn.particle2.x;
      const dy = conn.particle1.y - conn.particle2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Neural pulse effect - connections glow when particles are close
      const pulse = Math.sin(Date.now() * 0.003 + dist * 0.05) * 0.3 + 0.7;
      const pulseAlpha = conn.alpha * pulse;
      
      // Gradient line for neural network look
      const grad = ctx.createLinearGradient(
        conn.particle1.x, conn.particle1.y,
        conn.particle2.x, conn.particle2.y
      );
      
      // Data flow effect - animated brightness
      const flowOffset = (Date.now() * 0.001 + dist * 0.01) % 1;
      const flowGradient = `rgba(139, 92, 246, ${pulseAlpha * 0.6 * (0.5 + Math.sin(flowOffset * Math.PI * 2) * 0.5)})`;
      
      grad.addColorStop(0, `rgba(99, 102, 241, ${pulseAlpha * 0.8})`);
      grad.addColorStop(flowOffset, flowGradient);
      grad.addColorStop(Math.min(flowOffset + 0.1, 1), flowGradient);
      grad.addColorStop(1, `rgba(168, 85, 247, ${pulseAlpha * 0.8})`);
      
      ctx.strokeStyle = grad;
      ctx.beginPath();
      ctx.moveTo(conn.particle1.x, conn.particle1.y);
      ctx.lineTo(conn.particle2.x, conn.particle2.y);
      ctx.stroke();
    }

    // Draw particles with enhanced glow
    for (const particle of particlesRef.current) {
      const pulse = Math.sin(particle.pulsePhase) * 0.4 + 0.6;
      const activityPulse = 1 + activityBoost * Math.sin(Date.now() * 0.01);
      
      // Outer glow
      const glowSize = (particle.radius * 12 + pulse * 8) * activityPulse;
      const outerGlow = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, glowSize
      );
      outerGlow.addColorStop(0, `${particle.color} ${particle.alpha * pulse * 0.3 * activityPulse})`);
      outerGlow.addColorStop(0.3, `${particle.color} ${particle.alpha * pulse * 0.15 * activityPulse})`);
      outerGlow.addColorStop(1, `${particle.color} 0)`);
      
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Inner glow
      const innerGlow = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.radius * 5 * pulse
      );
      innerGlow.addColorStop(0, `${particle.color} ${particle.alpha})`);
      innerGlow.addColorStop(0.5, `${particle.color} ${particle.alpha * 0.5 * pulse})`);
      innerGlow.addColorStop(1, `${particle.color} 0)`);
      
      ctx.fillStyle = innerGlow;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius * 5 * pulse, 0, Math.PI * 2);
      ctx.fill();
      
      // Core
      ctx.fillStyle = `rgba(255, 255, 255, ${particle.alpha * pulse * 0.9})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius * pulse * 0.7, 0, Math.PI * 2);
      ctx.fill();
      
      // Sparkle effect on some particles
      if (particle.layer === 2 && Math.random() < 0.001) {
        const sparkleGlow = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius * 20
        );
        sparkleGlow.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        sparkleGlow.addColorStop(0.2, 'rgba(255, 255, 255, 0.3)');
        sparkleGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = sparkleGlow;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * 20, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [inputActivityLevel]);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number, mouse: MouseState) => {
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.03)';
    ctx.lineWidth = 1;
    
    const gridSize = 60;
    const offsetX = (mouse.x - width / 2) * 0.02;
    const offsetY = (mouse.y - height / 2) * 0.02;
    
    for (let x = (offsetX % gridSize + gridSize) % gridSize; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = (offsetY % gridSize + gridSize) % gridSize; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      setDimensions({ width: canvas.width, height: canvas.height });
      particlesRef.current = createParticles(canvas.width, canvas.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.targetX = e.touches[0].clientX;
        mouseRef.current.targetY = e.touches[0].clientY;
      }
    };

    const animate = () => {
      if (dimensions.width && dimensions.height) {
        draw(ctx, dimensions.width, dimensions.height);
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    handleResize();
    animate();
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouch);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouch);
    };
  }, [createParticles, draw, dimensions]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: '#030305' }}
    />
  );
};

export default NeuralNetworkAnimation;
