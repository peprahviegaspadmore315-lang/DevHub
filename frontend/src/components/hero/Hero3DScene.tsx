import { useEffect, useRef, memo } from 'react';
import * as THREE from 'three';
import './Hero3DScene.css';

interface Hero3DSceneProps {
  className?: string;
}

// Smooth lerp function for fluid transitions
const lerp = (start: number, end: number, factor: number): number => {
  return start + (end - start) * factor;
};

// Pre-computed color palette outside component to avoid recreation
const COLOR_PALETTE = [
  new THREE.Color(0x6366f1),
  new THREE.Color(0x8b5cf6),
  new THREE.Color(0x06b6d4),
  new THREE.Color(0x10b981),
] as const;

const Hero3DSceneComponent: React.FC<Hero3DSceneProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    animationId: number;
    particleSphere: THREE.Points;
    core: THREE.Mesh;
    rings: THREE.Mesh[];
    ambientParticles: THREE.Points;
    pointLights: THREE.PointLight[];
    mouse: { x: number; y: number };
    targetMouse: { x: number; y: number };
    time: number;
    originalPositions: Float32Array | null;
    particlePositions: Float32Array | null;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 8;

    // Renderer setup with performance optimizations
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const pointLights: THREE.PointLight[] = [];
    const lightPositions = [
      { color: 0x6366f1, intensity: 2, pos: new THREE.Vector3(5, 5, 5) },
      { color: 0x8b5cf6, intensity: 1.5, pos: new THREE.Vector3(-5, -3, 3) },
      { color: 0x06b6d4, intensity: 1, pos: new THREE.Vector3(0, 5, -3) },
    ];

    lightPositions.forEach(({ color, intensity, pos }) => {
      const light = new THREE.PointLight(color, intensity, 20);
      light.position.copy(pos);
      scene.add(light);
      pointLights.push(light);
    });

    // Create particle sphere
    const createParticleSphere = () => {
      const geometry = new THREE.BufferGeometry();
      const particleCount = 2500;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        const radius = 2 + Math.random() * 1.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        const color = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      });

      return new THREE.Points(geometry, material);
    };

    // Create glowing core
    const createCore = () => {
      const geometry = new THREE.IcosahedronGeometry(1.2, 3);
      const material = new THREE.MeshPhongMaterial({
        color: 0x6366f1,
        emissive: 0x312e81,
        emissiveIntensity: 0.3,
        shininess: 100,
        flatShading: true,
        wireframe: true,
      });
      return new THREE.Mesh(geometry, material);
    };

    // Create orbital rings
    const createRings = () => {
      const rings: THREE.Mesh[] = [];
      const ringData = [
        { radius: 2.5, tube: 0.02, rotation: new THREE.Euler(Math.PI / 2, 0, 0), color: 0x6366f1 },
        { radius: 3, tube: 0.015, rotation: new THREE.Euler(Math.PI / 3, Math.PI / 4, 0), color: 0x8b5cf6 },
        { radius: 3.5, tube: 0.01, rotation: new THREE.Euler(Math.PI / 6, Math.PI / 2, Math.PI / 4), color: 0x06b6d4 },
      ];

      ringData.forEach((data) => {
        const geometry = new THREE.TorusGeometry(data.radius, data.tube, 8, 100);
        const material = new THREE.MeshBasicMaterial({
          color: data.color,
          transparent: true,
          opacity: 0.6,
        });
        const ring = new THREE.Mesh(geometry, material);
        ring.rotation.copy(data.rotation);
        rings.push(ring);
        scene.add(ring);
      });

      return rings;
    };

    // Create ambient floating particles
    const createAmbientParticles = () => {
      const geometry = new THREE.BufferGeometry();
      const particleCount = 400;
      const positions = new Float32Array(particleCount * 3);
      const originalPositions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        const x = (Math.random() - 0.5) * 20;
        const y = (Math.random() - 0.5) * 20;
        const z = (Math.random() - 0.5) * 10 - 5;
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        originalPositions[i * 3] = x;
        originalPositions[i * 3 + 1] = y;
        originalPositions[i * 3 + 2] = z;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const material = new THREE.PointsMaterial({
        size: 0.03,
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
      });

      return { points: new THREE.Points(geometry, material), originalPositions };
    };

    // Create all objects
    const particleSphere = createParticleSphere();
    const core = createCore();
    const rings = createRings();
    const { points: ambientParticles, originalPositions } = createAmbientParticles();

    scene.add(particleSphere);
    scene.add(core);
    scene.add(ambientParticles);

    // Store references
    sceneRef.current = {
      scene,
      camera,
      renderer,
      particleSphere,
      core,
      rings,
      ambientParticles,
      pointLights,
      mouse: { x: 0, y: 0 },
      targetMouse: { x: 0, y: 0 },
      time: 0,
      originalPositions,
      particlePositions: ambientParticles.geometry.attributes.position.array as Float32Array,
      animationId: 0,
    };

    // Smooth mouse tracking with throttling
    let lastMouseUpdate = 0;
    const mouseThrottle = 16; // ~60fps

    const handleMouseMove = (event: MouseEvent | TouchEvent) => {
      if (!sceneRef.current) return;

      const now = performance.now();
      if (now - lastMouseUpdate < mouseThrottle) return;
      lastMouseUpdate = now;

      let clientX: number, clientY: number;

      if ('touches' in event) {
        clientX = event.touches[0]?.clientX ?? event.changedTouches[0]?.clientX ?? 0;
        clientY = event.touches[0]?.clientY ?? event.changedTouches[0]?.clientY ?? 0;
      } else {
        clientX = event.clientX;
        clientY = event.clientY;
      }

      // Normalize to -1 to 1 range
      sceneRef.current.targetMouse.x = (clientX / window.innerWidth) * 2 - 1;
      sceneRef.current.targetMouse.y = -(clientY / window.innerHeight) * 2 + 1;
    };

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !sceneRef.current) return;

      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;

      sceneRef.current.camera.aspect = newWidth / newHeight;
      sceneRef.current.camera.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Pause rendering when tab is not visible
    let isVisible = true;
    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Animation loop with visibility-based pausing
    const animate = () => {
      if (!sceneRef.current) return;

      sceneRef.current.animationId = requestAnimationFrame(animate);

      // Skip rendering if tab is not visible
      if (!isVisible) return;

      const refs_2 = sceneRef.current;
      const { scene, camera, renderer, particleSphere, core, rings, ambientParticles, pointLights } = refs_2;
      
      refs_2.time += 0.01;

      // Smooth mouse interpolation (lerp)
      refs_2.mouse.x = lerp(refs_2.mouse.x, refs_2.targetMouse.x, 0.05);
      refs_2.mouse.y = lerp(refs_2.mouse.y, refs_2.targetMouse.y, 0.05);

      const { mouse } = refs_2;

      // Particle sphere rotation + subtle mouse influence
      particleSphere.rotation.y += 0.002;
      particleSphere.rotation.x += 0.001;
      particleSphere.rotation.z = lerp(particleSphere.rotation.z, mouse.x * 0.1, 0.02);

      // Core rotation (follows mouse slightly)
      core.rotation.y -= 0.003;
      core.rotation.x += 0.002;
      
      // Core tilts toward mouse cursor
      const targetRotX = mouse.y * 0.3;
      const targetRotZ = -mouse.x * 0.3;
      core.rotation.x = lerp(core.rotation.x, targetRotX, 0.03);
      core.rotation.z = lerp(core.rotation.z, targetRotZ, 0.03);

      // Ring rotations with mouse influence
      rings.forEach((ring, index) => {
        const direction = index % 2 === 0 ? 1 : -1;
        ring.rotation.z += 0.002 * direction;
        ring.rotation.x += 0.001 * direction;
        
        // Rings also follow mouse slightly
        ring.rotation.y = lerp(ring.rotation.y, mouse.x * 0.2 * direction, 0.02);
      });

      // Floating movement (sine wave)
      const floatY = Math.sin(refs_2.time) * 0.2;
      const floatX = Math.cos(refs_2.time * 0.5) * 0.1;
      
      core.position.y = floatY;
      core.position.x = floatX;
      particleSphere.position.y = floatY * 0.8;
      particleSphere.position.x = floatX * 0.8;
      rings.forEach((ring) => {
        ring.position.y = floatY * 0.5;
        ring.position.x = floatX * 0.5;
      });

      // Camera parallax (smooth follow)
      const cameraTargetX = mouse.x * 0.5;
      const cameraTargetY = mouse.y * 0.3;
      camera.position.x = lerp(camera.position.x, cameraTargetX, 0.03);
      camera.position.y = lerp(camera.position.y, cameraTargetY, 0.03);
      camera.lookAt(scene.position);

      // Pulse effect on core
      const pulseScale = 1 + Math.sin(refs_2.time * 2) * 0.05;
      core.scale.set(pulseScale, pulseScale, pulseScale);

      // Particles react to mouse proximity
      if (refs_2.particlePositions && refs_2.originalPositions) {
        const positions = refs_2.particlePositions;
        const original = refs_2.originalPositions;
        const mouseWorldX = mouse.x * 5;
        const mouseWorldY = mouse.y * 3;
        const mouseInfluence = 0.5;
        const maxDistance = 3;

        for (let i = 0; i < positions.length; i += 3) {
          const ox = original[i];
          const oy = original[i + 1];
          const oz = original[i + 2];

          // Distance from particle to mouse position
          const dx = ox - mouseWorldX;
          const dy = oy - mouseWorldY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            // Push particles away from mouse
            const force = (1 - dist / maxDistance) * mouseInfluence;
            const angle = Math.atan2(dy, dx);
            positions[i] = ox + Math.cos(angle) * force * 0.3;
            positions[i + 1] = oy + Math.sin(angle) * force * 0.3;
            positions[i + 2] = oz + force * 0.2;
          } else {
            // Return to original position
            positions[i] = lerp(positions[i], ox, 0.05);
            positions[i + 1] = lerp(positions[i + 1], oy, 0.05);
            positions[i + 2] = lerp(positions[i + 2], oz, 0.05);
          }
        }
        ambientParticles.geometry.attributes.position.needsUpdate = true;
      }

      // Animate point lights
      pointLights.forEach((light, index) => {
        const offset = index * Math.PI * 0.5;
        light.position.x = Math.cos(refs_2.time + offset) * 5 + mouse.x * 2;
        light.position.y = Math.sin(refs_2.time * 0.5 + offset) * 3 + mouse.y * 2;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }

      renderer.dispose();
      container.removeChild(renderer.domElement);

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((m) => m.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      sceneRef.current = null;
    };
  }, []);

  return (
    <div ref={containerRef} className={`hero-3d-scene ${className}`}>
      <div className="hero-3d-overlay" />
    </div>
  );
};

export default memo(Hero3DSceneComponent);
