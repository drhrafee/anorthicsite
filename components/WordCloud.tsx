'use client';

import React, { useEffect, useRef, useState } from 'react';

// User's custom word list
const WORD_LIST = [
  "Python", "Typescript", "Laravel", "React", "MySQL", "PHP", "HTML", "CSS", "JS", "Odoo", "Wordpress", "N8n", "Figma", "GSAP", "Lenis", "GitHub", "Vercel", "Stripe", "PostgreSQL", "Docker", "SaaS", "API", "AI", "LLM", "Gemma", "Claude", "ChatGPT", "VRAM", "GPU", "CPU", "JSON", "URL", "SSL", "DNS", "CDN", "DOM", "SVG", "SQL", "Git", "SSH", "Chatbot", "Agent", "Automation", "Workflow", "Pipeline", "Backend", "Frontend", "Database", "Server", "Cloud", "Hosting", "Domain", "Network", "Security", "Encryption", "Dashboard", "Portal", "Interface", "Web-app", "Website", "Platform", "E-commerce", "CRM", "CMS", "Logo", "Brand", "Identity", "Packaging", "Concept", "Visual", "Typography", "Layout", "Grid", "Structure", "Geometric", "Minimalist", "Monochrome", "Crimson", "Slate", "Contrast", "Palette", "Font", "Icon", "Asset", "Vector", "Canvas", "Mockup", "Prototype", "Wireframe", "Guideline", "Strategy", "Blueprint", "Architecture", "Logic", "Code", "Framework", "Custom", "Bespoke", "System", "Engine", "Script", "Trigger", "Hook", "Compiler", "Stack", "Node", "Token", "Prompt", "Matrix", "Router", "Middleware", "Endpoint", "Query", "Semantic", "Clean-code", "Template-free", "Engineered", "Integration", "Deployment", "Hands-free", "Instant-load", "High-performance", "Core", "Secure", "Functional", "Streamlined", "Dynamic", "Adaptive", "Optimized", "Seamless", "Kinetic", "Execution", "Infrastructure", "Algorithm", "Launch", "Live", "Performance", "Efficiency", "Multiplier", "Robust", "Hardened", "Distributed", "Asynchronous", "Synchronous", "Concurrent", "Parallel", "Low-latency", "Raw-speed", "Compressed", "Minified", "Hydrated", "Telemetry", "Diagnostic", "Refactored", "Verified", "Unit-tested", "Zero-downtime", "Hierarchy", "Containerized", "Microservices", "Real-time", "Direct-access", "Bare-metal", "Low-overhead", "Frame-perfect", "Algorithmic", "Cybernetics", "Automata", "Computational", "Mathematical", "Analytical", "Quantitative", "Validated", "Proven", "Absolute", "Apex", "Catalyst", "Nexus", "Forge", "Metric", "Zenith", "Analytics", "Responsive", "Future-proof", "Lead-gen", "Data-processing", "Source-code", "Lighthouse-score", "Tech-stack", "Asset-roster", "Motion-performance", "Visual-consistency", "Technical-execution", "Scroll-velocity", "Backend-frameworks", "Motion-tools", "Core-brain", "Lead-pipelines", "Support-automation", "Database-engineering", "Interactive-web", "Vector-logo", "UI-layouts", "Geometric-shapes", "System-logs", "Command-line", "Infinite-scrolling", "Core-competencies", "Visual-languages", "Digital-products"
];

interface PositionedWord {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  sizeVw: number;
  absoluteMin: number;
  absoluteMax: number;
  fontFamily: 'bebas' | 'geist';
  opacity: number;
  duration: number;
  delay: number;
  dx1: number;
  dy1: number;
  dx2: number;
  dy2: number;
  dx3: number;
  dy3: number;
  r1: number;
  r2: number;
  r3: number;
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

function checkIntersection(a: Box, b: Box): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export default function WordCloud() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positionedWords, setPositionedWords] = useState<PositionedWord[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let resizeTimer: NodeJS.Timeout;

    const performLayout = () => {
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      if (width === 0 || height === 0) return;

      const isMobile = width < 768;

      // Define central exclusion zone
      const exclWidth = Math.max(280, width * 0.32);
      const exclHeight = Math.max(80, height * 0.12);
      const exclusionBox: Box = {
        x: width / 2 - exclWidth / 2,
        y: height / 2 - exclHeight / 2,
        w: exclWidth,
        h: exclHeight,
      };

      const placedBoxes: Box[] = [exclusionBox];
      const newPlacedWords: PositionedWord[] = [];

      // Sort words randomly to get a unique spread each time
      const shuffledWords = [...WORD_LIST].sort(() => Math.random() - 0.5);

      shuffledWords.forEach((wordText, index) => {
        // Decide font family: 50% Bebas Neue, 50% Geist
        const fontFamily = Math.random() > 0.5 ? 'bebas' as const : 'geist' as const;
        const text = fontFamily === 'bebas' ? wordText.toUpperCase() : wordText;

        // Choose random font sizes based on distribution tiers (measured in % of container width, i.e., responsive units)
        let sizeVw = 1.4;
        const roll = Math.random();
        if (roll > 0.92) {
          // Large words - reduced slightly
          sizeVw = fontFamily === 'bebas' ? 5.5 : 4.5;
        } else if (roll > 0.75) {
          // Medium-Large - reduced slightly
          sizeVw = fontFamily === 'bebas' ? 4.2 : 3.5;
        } else if (roll > 0.45) {
          // Medium - reduced slightly
          sizeVw = fontFamily === 'bebas' ? 3.4 : 2.8;
        } else {
          // Small/Details - reduced slightly
          sizeVw = fontFamily === 'bebas' ? 2.4 : 1.8;
        }

        // Convert responsive width percentage to pixels
        let fontSize = (sizeVw / 100) * width;

        // Enforce safe minimum and maximum bounds
        const absoluteMin = isMobile ? 12 : 15;
        const absoluteMax = isMobile ? 32 : 85;
        if (fontSize < absoluteMin) fontSize = absoluteMin;
        if (fontSize > absoluteMax) fontSize = absoluteMax;

        let placed = false;
        let trials = 0;
        const maxTrials = 150; // Increased trials to allow high-density packing of larger words

        // Bounding box heuristic - reduced gaps significantly
        // Bebas Neue is narrow (0.5 * fontSize), Geist is wider (0.65 * fontSize)
        const charWidthFactor = fontFamily === 'bebas' ? 0.44 : 0.54;
        let wordW = text.length * fontSize * charWidthFactor - 1; 
        let wordH = fontSize * 0.96;

        while (!placed && trials < maxTrials) {
          // Generate a candidate position
          // Ensure coordinates keep the word inside the container padding
          const candidateX = 15 + Math.random() * (width - wordW - 30);
          const candidateY = 15 + Math.random() * (height - wordH - 30);

          const candidateBox: Box = {
            x: candidateX,
            y: candidateY,
            w: wordW,
            h: wordH,
          };

          // Check if candidateBox intersects with any already placed boxes (including the exclusion zone)
          let hasOverlap = false;
          for (const box of placedBoxes) {
            if (checkIntersection(candidateBox, box)) {
              hasOverlap = true;
              break;
            }
          }

          if (!hasOverlap) {
            // Found a valid position!
            placedBoxes.push(candidateBox);
            
            // Randomize floating parameters
            const duration = 10 + Math.random() * 12; // 10s to 22s
            const delay = -(Math.random() * duration); // Starts mid-animation
            const opacity = 0.35 + Math.random() * 0.45; // 0.35 to 0.8 opacity range

            // Custom sway dimensions
            const dx1 = (Math.random() - 0.5) * 14;
            const dy1 = (Math.random() - 0.5) * 14;
            const dx2 = (Math.random() - 0.5) * 14;
            const dy2 = (Math.random() - 0.5) * 14;
            const dx3 = (Math.random() - 0.5) * 14;
            const dy3 = (Math.random() - 0.5) * 14;

            const r1 = (Math.random() - 0.5) * 3;
            const r2 = (Math.random() - 0.5) * 3;
            const r3 = (Math.random() - 0.5) * 3;

            newPlacedWords.push({
              text,
              x: candidateX,
              y: candidateY,
              fontSize,
              sizeVw,
              absoluteMin,
              absoluteMax,
              fontFamily,
              opacity,
              duration,
              delay,
              dx1, dy1,
              dx2, dy2,
              dx3, dy3,
              r1, r2, r3
            });

            placed = true;
          } else {
            trials++;
            // Shrink size on failure to make it easier to pack
            if (trials === 75) {
              fontSize = Math.max(absoluteMin, fontSize * 0.7);
              sizeVw = sizeVw * 0.7; // Also shrink the relative size so style matches
              wordW = text.length * fontSize * charWidthFactor - 1;
              wordH = fontSize * 0.96;
            }
          }
        }
      });

      setPositionedWords(newPlacedWords);
      setIsReady(true);
    };

    // Initial layout
    performLayout();

    // Resize handling with debounce
    const handleResize = () => {
      clearTimeout(resizeTimer);
      setIsReady(false);
      resizeTimer = setTimeout(() => {
        performLayout();
      }, 250);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full z-0 select-none overflow-hidden transition-opacity duration-700 ${
        isReady ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Dynamic Keyframes Generation */}
      <style>{`
        @keyframes word-sway {
          0% {
            transform: translate(0px, 0px) rotate(0deg);
          }
          25% {
            transform: translate(var(--dx1), var(--dy1)) rotate(var(--r1));
          }
          50% {
            transform: translate(var(--dx2), var(--dy2)) rotate(var(--r2));
          }
          75% {
            transform: translate(var(--dx3), var(--dy3)) rotate(var(--r3));
          }
          100% {
            transform: translate(0px, 0px) rotate(0deg);
          }
        }
        .cloud-word {
          animation: word-sway var(--duration) ease-in-out infinite;
        }
      `}</style>

      {positionedWords.map((word, idx) => {
        const fontClass =
          word.fontFamily === 'bebas'
            ? 'font-bebas tracking-wide font-normal'
            : 'font-geist font-medium';

        // Calculate responsive percentage positions for smooth scaling
        const widthVal = containerRef.current?.clientWidth || window.innerWidth || 1;
        const heightVal = containerRef.current?.clientHeight || window.innerHeight || 1;
        const leftPercent = (word.x / widthVal) * 100;
        const topPercent = (word.y / heightVal) * 100;

        return (
          <span
            key={idx}
            className={`absolute block text-crimson hover:text-cherry transition-all duration-300 hover:scale-110 hover:!opacity-100 cursor-default whitespace-nowrap cloud-word ${fontClass}`}
            style={{
              left: `${leftPercent}%`,
              top: `${topPercent}%`,
              fontSize: `clamp(${word.absoluteMin}px, ${word.sizeVw}vw, ${word.absoluteMax}px)`,
              opacity: word.opacity,
              // Custom properties for keyframe sway
              '--duration': `${word.duration}s`,
              '--delay': `${word.delay}s`,
              animationDelay: `${word.delay}s`,
              '--dx1': `${word.dx1}px`,
              '--dy1': `${word.dy1}px`,
              '--dx2': `${word.dx2}px`,
              '--dy2': `${word.dy2}px`,
              '--dx3': `${word.dx3}px`,
              '--dy3': `${word.dy3}px`,
              '--r1': `${word.r1}deg`,
              '--r2': `${word.r2}deg`,
              '--r3': `${word.r3}deg`,
            } as React.CSSProperties}
          >
            {word.text}
          </span>
        );
      })}
    </div>
  );
}
