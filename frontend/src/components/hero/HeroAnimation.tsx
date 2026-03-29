import { memo, useEffect, useRef, useCallback } from 'react';
import './HeroAnimation.css';

interface HeroAnimationProps {
  className?: string;
  activityLevel?: number;
}

const HeroAnimationComponent: React.FC<HeroAnimationProps> = ({ className = '', activityLevel = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const timeRef = useRef(0);
  const animationIdRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);

    interface Node {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      vx: number;
      vy: number;
      radius: number;
      baseRadius: number;
      color: string;
      colorGlow: string;
      pulsePhase: number;
      pulseSpeed: number;
      connections: number[];
    }

    const colors = [
      { main: '#6366f1', glow: 'rgba(99, 102, 241, ' },   // Indigo
      { main: '#8b5cf6', glow: 'rgba(139, 92, 246, ' },   // Purple
      { main: '#06b6d4', glow: 'rgba(6, 182, 212, ' },    // Cyan
      { main: '#a855f7', glow: 'rgba(168, 85, 247, ' },   // Violet
      { main: '#3b82f6', glow: 'rgba(59, 130, 246, ' },  // Blue
    ];

    const nodes: Node[] = [];
    const NODE_COUNT = 50;
    const CONNECTION_DISTANCE = 180;
    const MAX_CONNECTIONS_PER_NODE = 4;

    const initNodes = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      nodes.length = 0;

      for (let i = 0; i < NODE_COUNT; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const baseRadius = 2 + Math.random() * 4;

        nodes.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: baseRadius,
          baseRadius,
          color: color.main,
          colorGlow: color.glow,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.5 + Math.random() * 1.5,
          connections: [],
        });
      }

      updateConnections();
    };

    const updateConnections = () => {
      nodes.forEach(node => node.connections.length = 0);

      for (let i = 0; i < nodes.length; i++) {
        const distances: { node: Node; dist: number; index: number }[] = [];

        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DISTANCE) {
            distances.push({ node: nodes[j], dist, index: j });
          }
        }

        distances.sort((a, b) => a.dist - b.dist);
        const maxConnections = Math.min(MAX_CONNECTIONS_PER_NODE, distances.length);

        for (let k = 0; k < maxConnections; k++) {
          nodes[i].connections.push(distances[k].index);
        }
      }
    };

    initNodes();

    let lastTime = 0;
    const targetActivityRef = { current: 0 };

    const draw = (currentTime: number) => {
      const deltaTime = Math.min((currentTime - lastTime) / 16.67, 2);
      lastTime = currentTime;

      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      ctx.fillStyle = 'rgba(5, 5, 8, 0.12)';
      ctx.fillRect(0, 0, width, height);

      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      timeRef.current += 0.016 * deltaTime;
      const time = timeRef.current;

      targetActivityRef.current += (activityLevel - targetActivityRef.current) * 0.1;
      const activityBoost = 1 + targetActivityRef.current * 0.5;

      nodes.forEach((node) => {
        const waveX = Math.sin(time * node.pulseSpeed + node.pulsePhase) * 0.3;
        const waveY = Math.cos(time * node.pulseSpeed * 0.7 + node.pulsePhase) * 0.3;

        const mouseInfluenceX = mouse.x * 20;
        const mouseInfluenceY = mouse.y * 20;
        const distToMouse = Math.sqrt(
          (node.x - width / 2 - mouseInfluenceX) ** 2 +
          (node.y - height / 2 - mouseInfluenceY) ** 2
        );
        const mouseAttraction = Math.max(0, 1 - distToMouse / 300) * 15;

        node.x += (node.vx + waveX) * deltaTime * activityBoost;
        node.y += (node.vy + waveY) * deltaTime * activityBoost;

        const attractX = mouseInfluenceX;
        const attractY = mouseInfluenceY;
        node.x += (attractX - node.x) * 0.001 * mouseAttraction;
        node.y += (attractY - node.y) * 0.001 * mouseAttraction;

        if (node.x < -50) node.x = width + 50;
        if (node.x > width + 50) node.x = -50;
        if (node.y < -50) node.y = height + 50;
        if (node.y > height + 50) node.y = -50;

        node.radius = node.baseRadius * (0.7 + Math.sin(time * node.pulseSpeed + node.pulsePhase) * 0.3);
      });

      updateConnections();

      nodes.forEach((node) => {
        const connections = node.connections.length;
        const connectionIntensity = connections / MAX_CONNECTIONS_PER_NODE;

        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.radius * 8
        );
        gradient.addColorStop(0, node.colorGlow + (0.6 + connectionIntensity * 0.4) + ')');
        gradient.addColorStop(0.3, node.colorGlow + (0.2 + connectionIntensity * 0.2) + ')');
        gradient.addColorStop(1, node.colorGlow + '0)');

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 8, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = node.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (connections > 0) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
        }
      });

      nodes.forEach((node) => {
        node.connections.forEach((targetIndex) => {
          if (targetIndex > nodes.indexOf(node)) {
            const target = nodes[targetIndex];
            if (!target) return;

            const dx = target.x - node.x;
            const dy = target.y - node.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < CONNECTION_DISTANCE) {
              const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.6;
              const pulse = 0.5 + Math.sin(time * 2 + node.pulsePhase) * 0.3;

              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(target.x, target.y);
              ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * pulse})`;
              ctx.lineWidth = 1 + pulse * 0.5;
              ctx.stroke();

              const flowSpeed = 100;
              const flowOffset = (time * flowSpeed) % dist;
              const t = flowOffset / dist;
              const dotX = node.x + dx * t;
              const dotY = node.y + dy * t;

              ctx.beginPath();
              ctx.arc(dotX, dotY, 2 * pulse, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(99, 102, 241, ${opacity})`;
              ctx.shadowBlur = 10;
              ctx.shadowColor = '#6366f1';
              ctx.fill();
              ctx.shadowBlur = 0;

              const dotX2 = node.x + dx * ((t + 0.5) % 1);
              const dotY2 = node.y + dy * ((t + 0.5) % 1);
              ctx.beginPath();
              ctx.arc(dotX2, dotY2, 1.5 * pulse, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(168, 85, 247, ${opacity * 0.7})`;
              ctx.fill();
            }
          }
        });
      });

      animationIdRef.current = requestAnimationFrame(draw);
    };

    let isVisible = true;
    const handleVisibility = () => {
      isVisible = document.visibilityState === 'visible';
      if (isVisible) {
        lastTime = performance.now();
        animationIdRef.current = requestAnimationFrame(draw);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    animationIdRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animationIdRef.current);
    };
  }, [handleMouseMove, activityLevel]);

  return (
    <div className={`hero-animation ${className}`}>
      <canvas ref={canvasRef} className="hero-animation__canvas" />
      <div className="hero-animation__overlay" />
    </div>
  );
};

export default memo(HeroAnimationComponent);
