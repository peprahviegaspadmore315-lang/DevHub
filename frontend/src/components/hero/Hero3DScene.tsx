import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './Hero3DScene.css';

interface Hero3DSceneProps {
  className?: string;
}

const Hero3DScene: React.FC<Hero3DSceneProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    animationId: number;
    particles: THREE.Points;
    core: THREE.Mesh;
    rings: THREE.Mesh[];
    mouse: { x: number; y: number };
    time: number;
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
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x6366f1, 2, 20);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x8b5cf6, 1.5, 15);
    pointLight2.position.set(-5, -3, 3);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x06b6d4, 1, 15);
    pointLight3.position.set(0, 5, -3);
    scene.add(pointLight3);

    // Create particle sphere (AI neural network core)
    const createParticleSphere = () => {
      const geometry = new THREE.BufferGeometry();
      const particleCount = 3000;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);

      const colorPalette = [
        new THREE.Color(0x6366f1), // Indigo
        new THREE.Color(0x8b5cf6), // Violet
        new THREE.Color(0x06b6d4), // Cyan
        new THREE.Color(0x10b981), // Emerald
      ];

      for (let i = 0; i < particleCount; i++) {
        // Distribute particles in a sphere
        const radius = 2 + Math.random() * 1.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        sizes[i] = Math.random() * 0.5 + 0.1;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

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

    // Create floating particles around the scene
    const createFloatingParticles = () => {
      const geometry = new THREE.BufferGeometry();
      const particleCount = 500;
      const positions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const material = new THREE.PointsMaterial({
        size: 0.03,
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
      });

      return new THREE.Points(geometry, material);
    };

    // Create all objects
    const particles = createParticleSphere();
    const core = createCore();
    const rings = createRings();
    const floatingParticles = createFloatingParticles();

    scene.add(particles);
    scene.add(core);
    scene.add(floatingParticles);

    // Store references
    sceneRef.current = {
      scene,
      camera,
      renderer,
      particles,
      core,
      rings,
      animationId: 0,
      mouse: { x: 0, y: 0 },
      time: 0,
    };

    // Mouse tracking for parallax
    const handleMouseMove = (event: MouseEvent) => {
      if (sceneRef.current) {
        sceneRef.current.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        sceneRef.current.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      }
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
    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      if (!sceneRef.current) return;

      const { scene, camera, renderer, particles, core, rings, mouse } = sceneRef.current;
      sceneRef.current.animationId = requestAnimationFrame(animate);

      sceneRef.current.time += 0.01;

      // Particle sphere rotation
      particles.rotation.y += 0.002;
      particles.rotation.x += 0.001;

      // Core rotation (opposite direction)
      core.rotation.y -= 0.003;
      core.rotation.x += 0.002;

      // Ring rotations
      rings.forEach((ring, index) => {
        ring.rotation.z += 0.002 * (index % 2 === 0 ? 1 : -1);
        ring.rotation.x += 0.001 * (index % 2 === 0 ? 1 : -1);
      });

      // Floating movement (sine wave)
      const floatY = Math.sin(sceneRef.current.time) * 0.2;
      const floatX = Math.cos(sceneRef.current.time * 0.5) * 0.1;
      core.position.y = floatY;
      core.position.x = floatX;
      particles.position.y = floatY * 0.8;
      particles.position.x = floatX * 0.8;
      rings.forEach((ring) => {
        ring.position.y = floatY * 0.5;
        ring.position.x = floatX * 0.5;
      });

      // Camera parallax
      camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.05;
      camera.position.y += (mouse.y * 0.3 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      // Pulse effect on core
      const pulseScale = 1 + Math.sin(sceneRef.current.time * 2) * 0.05;
      core.scale.set(pulseScale, pulseScale, pulseScale);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      
      renderer.dispose();
      container.removeChild(renderer.domElement);
      
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
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

export default Hero3DScene;
