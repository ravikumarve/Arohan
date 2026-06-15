"use client";

// Lusion-style 3D Interactive Particle Mesh
// Ported from Console.html design — voice-waveform grid with mouse interaction

import { useEffect, useRef } from 'react';

interface Particle {
  baseX: number;
  baseY: number;
  z: number;
  angle: number;
  speed: number;
}

export default function ParticleMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetY = 0;

    // Constants matching the original design
    const ROWS = 40;
    const COLS = 80;

    function init() {
      width = canvas!.width = window.innerWidth;
      height = canvas!.height = window.innerHeight;
      particles = [];

      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          particles.push({
            baseX: (width / COLS) * x,
            baseY: (height / ROWS) * y + (height * 0.2),
            z: Math.random() * 200 - 100,
            angle: x * 0.2 + y * 0.1,
            speed: 0.02,
          });
        }
      }
    }

    function handleMouse(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }

    function animate() {
      animationId = requestAnimationFrame(animate);
      ctx!.clearRect(0, 0, width, height);

      targetY += (mouseY - targetY) * 0.05;

      ctx!.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx!.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx!.lineWidth = 0.5;

      const fov = 800;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.angle += p.speed;

        const distFromCenter = Math.abs(p.baseX - width / 2) / (width / 2);
        const amplitude = 150 * (1 - distFromCenter);
        const interactiveShift = (targetY / height) * 50 * Math.sin(p.angle);

        const currentY = p.baseY + Math.sin(p.angle) * amplitude + interactiveShift;

        const scale = fov / (fov + p.z);
        const projX = (p.baseX - width / 2) * scale + width / 2;
        const projY = (currentY - height / 2) * scale + height / 2;

        // Draw point
        ctx!.beginPath();
        ctx!.arc(projX, projY, 1 * scale, 0, Math.PI * 2);
        ctx!.fill();

        // Draw connecting mesh lines (horizontal only for waveform look)
        if (i > 0 && i % COLS !== 0) {
          const prevP = particles[i - 1];
          const prevDist = Math.abs(prevP.baseX - width / 2) / (width / 2);
          const prevAmp = 150 * (1 - prevDist);
          const prevY =
            prevP.baseY + Math.sin(prevP.angle) * prevAmp + interactiveShift;

          const prevScale = fov / (fov + prevP.z);
          const prevProjX = (prevP.baseX - width / 2) * prevScale + width / 2;
          const prevProjY = (prevY - height / 2) * prevScale + height / 2;

          ctx!.beginPath();
          ctx!.moveTo(projX, projY);
          ctx!.lineTo(prevProjX, prevProjY);
          ctx!.stroke();
        }
      }
    }

    function handleResize() {
      init();
    }

    // Setup
    init();
    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('resize', handleResize);
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="mesh-canvas"
      className="fixed top-0 left-0 w-screen h-screen pointer-events-none"
      style={{ zIndex: 0, opacity: 0.8 }}
    />
  );
}
