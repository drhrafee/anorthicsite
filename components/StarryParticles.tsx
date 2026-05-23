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

    let stars: Star[] = [];
    let isVisible = false;

    const createStar = (x?: number, y?: number): Star => {
      return {
        x: x ?? Math.random() * width,
        y: y ?? Math.random() * height,
        // Gentle drift
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        // Smaller particle sizes for a neat "node" look (0.8px to 2px)
        radius: 1.3 + Math.random() * 1.1,
        // Soft opacity range
        baseAlpha: 0.25 + Math.random() * 0.4,
        alphaPhase: Math.random() * Math.PI * 2,
        alphaSpeed: 0.2 + Math.random() * 0.02,
      };
    };

    const init = () => {
      const area = width * height;
      const isMobile = width < 768;
      const divisor = isMobile ? 18000 : 12000;
      const minStars = isMobile ? 15 : 40;
      const maxStars = isMobile ? 40 : 170;
      const starCount = Math.max(minStars, Math.min(maxStars, Math.floor(area / divisor)));
      stars = [];
      for (let i = 0; i < starCount; i++) {
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
      if (!isVisible) return;

      ctx.clearRect(0, 0, width, height);

      // Move stars & wrap boundaries
      for (const s of stars) {
        s.x += s.vx;
        s.y += s.vy;

        if (s.x < -10) s.x = width + 10;
        if (s.x > width + 10) s.x = -10;
        if (s.y < -10) s.y = height + 10;
        if (s.y > height + 10) s.y = -10;
      }

      // Draw connection lines (Neurolink network)
      const maxDistance = width < 768 ? 80 : 110;
      for (let i = 0; i < stars.length; i++) {
        const s1 = stars[i];
        for (let j = i + 1; j < stars.length; j++) {
          const s2 = stars[j];
          const dx = s1.x - s2.x;
          const dy = s1.y - s2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            // Opacity fades out to 0 as distance reaches maxDistance
            const lineAlpha = (1 - dist / maxDistance) * 0.24;
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.strokeStyle = `rgba(203, 39, 44, ${lineAlpha})`;
            ctx.lineWidth = 1.0;
            ctx.stroke();
          }
        }
      }

      // Draw particle nodes
      for (const s of stars) {
        s.alphaPhase += s.alphaSpeed;
        const currentAlpha = s.baseAlpha + Math.sin(s.alphaPhase) * 0.15;
        const alpha = Math.max(0.1, Math.min(0.85, currentAlpha));

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(203, 39, 44, ${alpha})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // IntersectionObserver to pause off-screen canvas loops
    const intersectionObserver = new IntersectionObserver((entries) => {
      const entry = entries[0];
      isVisible = entry.isIntersecting;
      if (isVisible) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(animate);
      }
    }, {
      rootMargin: '100px', // start generating slightly before entering viewport
    });
    intersectionObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
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
