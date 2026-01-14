'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface LoadingAnimationProps {
  isVisible?: boolean;
}

const LoadingAnimation3D: React.FC<LoadingAnimationProps> = ({ isVisible = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !isVisible) return;

    // Scene setup
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00d4ff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Create rotating cubes and spheres
    const objects: THREE.Mesh[] = [];
    
    // Central rotating cube
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshPhongMaterial({
      color: 0x00d4ff,
      emissive: 0x0066ff,
      shininess: 100,
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(cube);
    objects.push(cube);

    // Orbiting spheres
    const sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const colors = [0xff0080, 0x00d4ff, 0x00ff88, 0xffaa00];

    colors.forEach((color, index) => {
      const material = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        shininess: 100,
      });
      const sphere = new THREE.Mesh(sphereGeometry, material);
      sphere.position.x = Math.cos((index / colors.length) * Math.PI * 2) * 2;
      sphere.position.y = Math.sin((index / colors.length) * Math.PI * 2) * 2;
      scene.add(sphere);
      objects.push(sphere);
    });

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Rotate cube
      cube.rotation.x += 0.005;
      cube.rotation.y += 0.008;

      // Orbit spheres around cube
      objects.slice(1).forEach((sphere, index) => {
        const time = Date.now() * 0.0005;
        const angle = (index / (colors.length)) * Math.PI * 2 + time;
        const radius = 2;
        sphere.position.x = Math.cos(angle) * radius;
        sphere.position.y = Math.sin(angle) * radius;
        sphere.position.z = Math.sin(time) * 0.5;
        sphere.rotation.x += 0.003;
        sphere.rotation.y += 0.005;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute bottom-20 text-center">
        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-600 mb-4">
          Loading...
        </p>
        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation3D;
