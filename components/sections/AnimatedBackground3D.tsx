'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Cube {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
}

const AnimatedBackground3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cubesRef = useRef<Cube[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create floating tech cubes
    const colors = [0x1b5b99, 0x3b82f6, 0x60a5fa, 0x93c5fd];
    const cubes: Cube[] = [];

    for (let i = 0; i < 8; i++) {
      const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const material = new THREE.MeshPhongMaterial({
        color: colors[i % colors.length],
        emissive: colors[i % colors.length],
        emissiveIntensity: 0.2,
        shininess: 100,
      });
      const mesh = new THREE.Mesh(geometry, material);

      mesh.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );

      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.05
      );

      scene.add(mesh);
      cubes.push({ mesh, velocity });
    }
    cubesRef.current = cubes;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Particle system for tech dots
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = (Math.random() - 0.5) * 20;
      positions[i + 2] = (Math.random() - 0.5) * 20;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x1b5b99,
      size: 0.1,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Rotate and move cubes
      cubes.forEach((cube) => {
        cube.mesh.rotation.x += cube.velocity.x;
        cube.mesh.rotation.y += cube.velocity.y;
        cube.mesh.rotation.z += cube.velocity.z;

        cube.mesh.position.add(cube.velocity);

        // Bounce off walls
        if (cube.mesh.position.x > 5 || cube.mesh.position.x < -5) {
          cube.velocity.x *= -1;
        }
        if (cube.mesh.position.y > 5 || cube.mesh.position.y < -5) {
          cube.velocity.y *= -1;
        }
        if (cube.mesh.position.z > 5 || cube.mesh.position.z < -5) {
          cube.velocity.z *= -1;
        }
      });

      // Rotate particles
      particles.rotation.x += 0.0001;
      particles.rotation.y += 0.0001;

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 -z-10"
      style={{ 
        background: 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden'
      }}
    />
  );
};

export default AnimatedBackground3D;
