'use client';

import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  alphaPhase: number;
  alphaSpeed: number;
}

export default function StarryParticles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const STAR_COUNT = 200;
    let stars: Star[] = [];

    const createStar = (x?: number, y?: number): Star => {
      return {
        x: x ?? Math.random() * width,
        y: y ?? Math.random() * height,
        // Extremely slow drift
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        // High visibility size range: 1.2px to 4px
        radius: 1.2 + Math.random() * 2.8,
        // High visibility base opacity range: 0.35 to 0.75
        baseAlpha: 0.35 + Math.random() * 0.4,
        alphaPhase: Math.random() * Math.PI * 2,
        alphaSpeed: 0.01 + Math.random() * 0.02,
      };
    };

    const init = () => {
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push(createStar());
      }
    };
    init();

    // Resize handling
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: nw, height: nh } = entry.contentRect;
        if (nw === 0 || nh === 0) continue;
        if (nw !== width || nh !== height) {
          width = nw;
          height = nh;
          canvas.width = width;
          canvas.height = height;
          init();
        }
      }
    });
    resizeObserver.observe(container);

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (const s of stars) {
        // Move stars
        s.x += s.vx;
        s.y += s.vy;

        // Wrap around boundaries
        if (s.x < -10) s.x = width + 10;
        if (s.x > width + 10) s.x = -10;
        if (s.y < -10) s.y = height + 10;
        if (s.y > height + 10) s.y = -10;

        // Twinkle (oscillate opacity phase)
        s.alphaPhase += s.alphaSpeed;
        const currentAlpha = s.baseAlpha + Math.sin(s.alphaPhase) * 0.15;
        const alpha = Math.max(0.15, Math.min(0.95, currentAlpha));

        // Draw star in crimson
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(203, 39, 44, ${alpha})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none select-none overflow-hidden"
    >
      <canvas ref={canvasRef} className="block w-full h-full absolute inset-0" />
    </div>
  );
}
