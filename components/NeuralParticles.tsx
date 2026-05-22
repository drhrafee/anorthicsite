'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  blinkSpeed: number;
  blinkOffset: number;
  life?: number;       // For temporary cursor-spawned particles
  maxLife?: number;
  text?: string;       // Floating word text
}

const WORDS = [
  "Architecture", "Pure-coded", "Framework", "Bespoke", "Logic", "Scalable", 
  "Source-code", "System", "Infrastructure", "Dynamic", "Back-end", "Front-end", 
  "Autonomous", "Intelligence", "Optimization", "Workflow", "Pipeline", "Logic-driven", 
  "Integration", "Protocol", "Engine", "Kinetic", "Velocity", "Geometric", 
  "Minimalist", "Structural", "High-contrast", "Identity", "Alignment", "Grid", 
  "Premium", "Precise", "Monolithic", "Interface", "Vision", "Automation", "Agent", 
  "Cybernetic", "Syntactic", "Vector", "High-performance", "Low-latency", "Execution", 
  "Deployment", "Core", "Modular", "Cryptographic", "Synchronous", "Asynchronous", 
  "Algorithm", "Stack", "Database", "Repository", "Compilation", "Render", "Mutation", 
  "Element", "Blueprint", "Paradigm", "Strategy", "Schema", "Node", "Cluster", 
  "Ledger", "Fluid", "Kinetic", "Grid-aligned", "Pixel-perfect", "Strict", 
  "Monospaced", "Terminal", "Apex", "Catalyst", "Matrix", "Quantum", "Nexus", 
  "Vector-space", "Forge", "Metric", "Zenith"
];

export default function NeuralParticles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Configuration
    const maxDistance = 140; // Connection distance between words
    const mouseDistance = 220; // Connection & reveal distance to mouse
    const particleColor = '203, 39, 44'; // Crimson rgb (cb272c)
    const lineColor = '203, 39, 44';

    let particles: Particle[] = [];
    const mouse = { x: 0, y: 0, active: false, opacity: 0 };

    // Initialize particles
    const createParticle = (x?: number, y?: number, isTemp = false, text?: string): Particle => {
      const angle = Math.random() * Math.PI * 2;
      // Background words float extremely slow; temp embers drift slightly faster
      const speed = isTemp ? 0.3 + Math.random() * 0.8 : 0.08 + Math.random() * 0.2;
      return {
        x: x ?? Math.random() * width,
        y: y ?? Math.random() * height,
        vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
        vy: Math.sin(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
        radius: isTemp ? 1 + Math.random() * 1.5 : 0, // Words use text bounding, not circles
        baseAlpha: isTemp ? 0.8 : 0.03, // Faint default opacity for words (ghost grid)
        blinkSpeed: 0.015 + Math.random() * 0.02,
        blinkOffset: Math.random() * Math.PI * 2,
        life: isTemp ? 180 + Math.random() * 120 : undefined,
        maxLife: isTemp ? 300 : undefined,
        text,
      };
    };

    const init = () => {
      particles = [];
      // Initialize exactly one particle for each word in the list
      for (let i = 0; i < WORDS.length; i++) {
        particles.push(createParticle(undefined, undefined, false, WORDS[i]));
      }
    };

    // Handle resizing
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        width = newWidth;
        height = newHeight;
        canvas.width = width;
        canvas.height = height;
        init();
      }
    });
    resizeObserver.observe(container);

    // Mouse events
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;

      // Spawn temporary ember particles on mouse move
      const spawnCount = Math.floor(Math.random() * 2) + 1; // Spawns 1 or 2 embers
      for (let i = 0; i < spawnCount; i++) {
        particles.push(createParticle(mouse.x, mouse.y, true));
      }
    };

    const handleMouseEnter = () => {
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Animation Loop
    let tick = 0;
    const animate = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Calculate font size (65% of fluff word size: text-[7vw] md:text-[5vw] lg:text-[4vw])
      let fluffSize = 0;
      if (width < 768) {
        fluffSize = width * 0.07;
      } else if (width < 1024) {
        fluffSize = width * 0.05;
      } else {
        fluffSize = width * 0.04;
      }
      const fontSize = Math.max(9, fluffSize * 0.65);

      // Smoothly fade mouse opacity in and out
      if (mouse.active) {
        mouse.opacity = Math.min(1, mouse.opacity + 0.05);
      } else {
        mouse.opacity = Math.max(0, mouse.opacity - 0.05);
      }

      // Update and draw particles
      particles = particles.filter((p) => {
        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Bouncing or wrapping logic with padding to prevent sudden text clipping
        const padding = 60;
        if (p.life === undefined) {
          if (p.x < -padding) p.x = width + padding;
          if (p.x > width + padding) p.x = -padding;
          if (p.y < -padding) p.y = height + padding;
          if (p.y > height + padding) p.y = -padding;
        } else {
          p.life--;
          if (p.life <= 0) return false; // Filter out dead temporary particles
        }

        // Calculate dynamic opacity
        let currentAlpha = 0.03; // Default faint base alpha

        if (p.text) {
          // Proximity reveal calculation
          let hoverFactor = 0;
          if (mouse.active) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouseDistance) {
              hoverFactor = Math.max(0, 1 - dist / mouseDistance);
            }
          }
          // Opacity rises to ~0.85 when hovered
          currentAlpha = 0.03 + 0.82 * hoverFactor * mouse.opacity;
          p.baseAlpha = currentAlpha; // Update value so connection line logic accesses it
        } else {
          // Temporary glowing ember
          currentAlpha = p.baseAlpha * ((p.life ?? 0) / (p.maxLife || 300));
        }

        // Draw node
        if (p.text) {
          // Render word node
          ctx.font = `500 ${fontSize}px var(--font-geist), monospace`;
          ctx.fillStyle = `rgba(${particleColor}, ${currentAlpha})`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.text, p.x, p.y);
        } else {
          // Render temporary glowing ember particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${particleColor}, ${currentAlpha})`;
          ctx.fill();
        }

        return true;
      });

      // Draw connections
      const len = particles.length;
      for (let i = 0; i < len; i++) {
        const p1 = particles[i];

        // Draw line to other particles
        for (let j = i + 1; j < len; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha1 = p1.text ? p1.baseAlpha : (p1.life !== undefined ? p1.life / (p1.maxLife || 300) : 1);
            const alpha2 = p2.text ? p2.baseAlpha : (p2.life !== undefined ? p2.life / (p2.maxLife || 300) : 1);
            
            // Connection line is capped by the minimum opacity of the two connected nodes.
            // This ensures only the hovered segment of the network reveals itself.
            const lineAlpha = (1 - dist / maxDistance) * 0.16 * Math.min(alpha1, alpha2);

            if (lineAlpha > 0.005) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(${lineColor}, ${lineAlpha})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }

        // Draw line to mouse pointer (creates constellation connection to cursor)
        if (mouse.opacity > 0) {
          const dx = p1.x - mouse.x;
          const dy = p1.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseDistance) {
            const particleAlpha = p1.text ? p1.baseAlpha : (p1.life !== undefined ? p1.life / (p1.maxLife || 300) : 1);
            const lineAlpha = (1 - dist / mouseDistance) * 0.25 * mouse.opacity * particleAlpha;

            if (lineAlpha > 0.005) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.strokeStyle = `rgba(${lineColor}, ${lineAlpha})`;
              ctx.lineWidth = 0.7;
              ctx.stroke();
            }
          }
        }
      }

      // Draw faint mouse pointer aura
      if (mouse.opacity > 0) {
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleColor}, ${0.6 * mouse.opacity})`;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 12, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${particleColor}, ${0.15 * mouse.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      resizeObserver.disconnect();
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full z-0 cursor-default">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
