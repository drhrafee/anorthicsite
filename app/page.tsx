'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import AnimatedCounter from '@/components/AnimatedCounter';
import StarryParticles from '@/components/StarryParticles';
import WordCloud from '@/components/WordCloud';

const LINE1 = 'Anorthic';
const LINE2 = 'Studio';
const TOTAL  = LINE1.length + LINE2.length; // 14
const TYPE_MS = 78; // ms per character

/* ──────────────────────── Project Cards ──────────────────────── */

interface CardData {
  title: string;
  heading: string[];
  bg: string;
  text: string;
  pillBg: string;
  pillText: string;
  image: string | null;
  pills: string[];
  highlightWord?: string;
}

interface RowData {
  label: string;
  cards: [CardData, CardData];
}

const ROWS: RowData[] = [
  {
    label: 'Elite Web Engineering',
    cards: [
      {
        title: 'Bespoke Web Architecture',
        heading: ['Bespoke', 'Web Architecture'],
        bg: '#281819',
        text: '#f4e9d5',
        pillBg: '#f4e9d5',
        pillText: '#281819',
        image: '/card1.jpg',
        pills: ['Pure-Coded Web Apps', 'Scalable Architectures', 'Custom Web Engineering', 'API Integrations', 'Secure Databases'],
        highlightWord: 'Pure-Coded',
      },
      {
        title: 'High-End Digital Frontends',
        heading: ['High-End', 'Digital Frontends'],
        bg: '#5a6b7c',
        text: '#f4e9d5',
        pillBg: '#f4e9d5',
        pillText: '#5a6b7c',
        image: '/card2.jpg',
        pills: ['High-Performance Landing Pages', 'Premium Agency Portfolios', 'Interactive Personal Sites', 'Business Showcase Portals', 'Conversion-Driven UI'],
        highlightWord: 'High-End',
      },
    ],
  },
  {
    label: 'Digital Commerce & CMS Platforms',
    cards: [
      {
        title: 'Next-Gen E‑Commerce Systems',
        heading: ['Next-Gen', 'E‑Commerce Systems'],
        bg: '#cb272c',
        text: '#f4e9d5',
        pillBg: '#f4e9d5',
        pillText: '#cb272c',
        image: '/card3.jpg',
        pills: ['Custom Digital Storefronts', 'Secure Payment Gateways', 'Optimized Checkout Flows', 'Inventory System Integration', 'B2B/B2C Marketplaces'],
        highlightWord: 'Next-Gen',
      },
      {
        title: 'Custom-Tailored CMS Architectures',
        heading: ['Custom-Tailored', 'CMS Architectures'],
        bg: '#281819',
        text: '#f4e9d5',
        pillBg: '#f4e9d5',
        pillText: '#281819',
        image: '/card4.jpg',
        pills: ['Custom Theme Development', 'Dynamic Blogs & Magazines', 'High-Traffic Content Architectures', 'Core Web Vitals Optimization', 'Custom WordPress Plugins'],
        highlightWord: 'Custom-Tailored',
      },
    ],
  },
  {
    label: 'Strategic Brand Identity',
    cards: [
      {
        title: 'Iconic & Minimalist Visual Identity',
        heading: ['Iconic & Minimalist', 'Visual Identity'],
        bg: '#5a6b7c',
        text: '#f4e9d5',
        pillBg: '#f4e9d5',
        pillText: '#5a6b7c',
        image: '/card5.jpg',
        pills: ['Minimalist & Iconic Logos', 'High-Tech Corporate Visuals', 'Vector Assets & SVG Formats', 'Custom Geometric Typography', 'Structural Symbol Design'],
        highlightWord: 'Identity',
      },
      {
        title: 'Brand Guidelines & Design Systems',
        heading: ['Brand Guidelines', '& Design Systems'],
        bg: '#cb272c',
        text: '#f4e9d5',
        pillBg: '#f4e9d5',
        pillText: '#cb272c',
        image: '/card6.jpg',
        pills: ['Comprehensive Style Manuals', 'Brand Layout & Grid Systems', 'Cohesive Identity Playbooks', 'Typography Rules', 'Uniform Asset Frameworks'],
        highlightWord: 'Systems',
      },
    ],
  },
  {
    label: 'Next-Gen AI & Automation',
    cards: [
      {
        title: 'Autonomous AI Assistants',
        heading: ['Autonomous', 'AI Assistants'],
        bg: '#281819',
        text: '#f4e9d5',
        pillBg: '#f4e9d5',
        pillText: '#281819',
        image: '/card7.jpg',
        pills: ['Autonomous AI Agents', 'Context-Aware Support Systems', 'Custom Conversational Bots', 'Intelligent Natural Language Routing', '24/7 Automated Triaging'],
        highlightWord: 'Autonomous',
      },
      {
        title: 'Intelligent Workflow Automation',
        heading: ['Intelligent', 'Workflow Automation'],
        bg: '#5a6b7c',
        text: '#f4e9d5',
        pillBg: '#f4e9d5',
        pillText: '#5a6b7c',
        image: '/card8.jpg',
        pills: ['Automated Email Funnels', 'Intelligent Lead Gen Pipelines', 'E-commerce Operations Automation', 'Cross-Platform Social Syncing', 'Frictionless Internal Workflows'],
        highlightWord: 'Workflow',
      },
    ],
  },
];

type PillPos = { top?: string; bottom?: string; left?: string; right?: string };

const ALL_PILL_POSITIONS: PillPos[][] = [
  [
    { top: '-6%', left: '-12%' },
    { top: '-2%', right: '-10%' },
    { top: '38%', left: '-16%' },
    { top: '48%', right: '-12%' },
    { bottom: '-8%', left: '10%' },
  ],
  [
    { top: '-2%', left: '-10%' },
    { top: '-6%', right: '-12%' },
    { top: '48%', left: '-12%' },
    { top: '38%', right: '-16%' },
    { bottom: '-8%', right: '10%' },
  ],
  [
    { top: '-5%', left: '-15%' },
    { top: '-3%', right: '-8%' },
    { top: '35%', left: '-10%' },
    { top: '50%', right: '-15%' },
    { bottom: '-8%', left: '15%' },
  ],
  [
    { top: '-3%', left: '-8%' },
    { top: '-5%', right: '-15%' },
    { top: '50%', left: '-15%' },
    { top: '35%', right: '-10%' },
    { bottom: '-8%', right: '15%' },
  ],
  [
    { top: '-7%', left: '-10%' },
    { top: '-2%', right: '-14%' },
    { top: '42%', left: '-18%' },
    { top: '40%', right: '-8%' },
    { bottom: '-8%', left: '8%' },
  ],
  [
    { top: '-2%', left: '-14%' },
    { top: '-7%', right: '-10%' },
    { top: '40%', left: '-8%' },
    { top: '42%', right: '-18%' },
    { bottom: '-8%', right: '8%' },
  ],
  [
    { top: '-4%', left: '-12%' },
    { top: '-6%', right: '-12%' },
    { top: '44%', left: '-12%' },
    { top: '44%', right: '-12%' },
    { bottom: '-8%', left: '12%' },
  ],
  [
    { top: '-6%', left: '-12%' },
    { top: '-4%', right: '-12%' },
    { top: '44%', left: '-12%' },
    { top: '44%', right: '-12%' },
    { bottom: '-8%', right: '12%' },
  ],
];

function ProjectCard({ card, pillPositions }: { card: CardData; pillPositions: PillPos[] }) {
  return (
    <div
      className="project-card relative overflow-hidden rounded-[clamp(16px,2.2vw,48px)] h-[calc(100vh-var(--nav-height,78px)-8vw)] lg:h-[calc(100vh-var(--nav-height,96px)-4vw)] flex flex-col justify-evenly items-center px-[clamp(16px,2.2vw,40px)]"
      style={{ backgroundColor: card.bg }}
    >
      {/* Heading - centered in Geist */}
      <div className="w-full text-center z-10">
        <h2
          className="font-geist font-bold leading-[1.15] tracking-tight max-w-[85%] mx-auto"
          style={{ color: card.text, fontSize: 'clamp(30px, 4.5vw, 64px)' }}
        >
          {card.heading.map((line, lIdx) => (
            <React.Fragment key={lIdx}>
              {lIdx > 0 && <br />}
              {line.split(' ').map((word, wIdx, arr) => {
                const cleanWord = word.replace(/[^\w\s-]/g, '').toLowerCase();
                const cleanHighlight = card.highlightWord?.toLowerCase() || '';
                const isHighlight = cleanHighlight && (cleanWord.includes(cleanHighlight) || cleanHighlight.includes(cleanWord));
                
                const highlightColor = 
                  card.bg === '#281819' ? '#cb272c' : // Cherry card -> Crimson highlight
                  card.bg === '#5a6b7c' ? '#281819' : // Slate card -> Cherry highlight
                  card.bg === '#cb272c' ? '#281819' : // Crimson card -> Cherry highlight
                  '#cb272c';
                
                return (
                  <span key={wIdx}>
                    {isHighlight ? (
                      <span style={{ color: highlightColor }}>{word}</span>
                    ) : (
                      word
                    )}
                    {wIdx < arr.length - 1 ? ' ' : ''}
                  </span>
                );
              })}
            </React.Fragment>
          ))}
        </h2>
      </div>

      {/* Centered Image Container (allows pills to overflow) */}
      {card.image ? (
        <div className="relative w-[70%] h-[48%]">
          {/* Rounded, overflow-hidden wrapper for image and its border */}
          <div className="absolute inset-0 rounded-[clamp(12px,1.6vw,32px)] overflow-hidden shadow-2xl border border-white/5">
            <Image
              src={card.image}
              fill
              className="object-cover"
              alt={card.title}
              sizes="(max-width: 768px) 70vw, 35vw"
            />
          </div>

          {/* Pill tags absolute-positioned relative to this image container */}
          {card.pills.map((pill, i) => (
            <span
              key={pill}
              className="absolute z-20 font-geist font-normal rounded-full whitespace-nowrap shadow-[0_4px_15px_rgba(40,24,25,0.12)] border border-cherry/5"
              style={{
                backgroundColor: '#ffffff',
                color: '#281819',
                padding: 'clamp(8px, 0.6vw, 12px) clamp(14px, 1.4vw, 24px)',
                fontSize: 'clamp(10px, 0.9vw, 16px)',
                ...pillPositions[i],
              }}
            >
              {pill}
            </span>
          ))}
        </div>
      ) : (
        <div
          className="relative pointer-events-none select-none w-[42%] aspect-square opacity-10"
        >
          <Image src="/logo.svg" fill className="object-contain" alt="" />
          {/* Pill tags relative to fallback logo container */}
          {card.pills.map((pill, i) => (
            <span
              key={pill}
              className="absolute z-20 font-geist font-normal rounded-full whitespace-nowrap shadow-[0_4px_15px_rgba(40,24,25,0.12)] border border-cherry/5"
              style={{
                backgroundColor: '#ffffff',
                color: '#281819',
                padding: 'clamp(8px, 0.6vw, 12px) clamp(14px, 1.4vw, 24px)',
                fontSize: 'clamp(10px, 0.9vw, 16px)',
                ...pillPositions[i],
              }}
            >
              {pill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Page() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // ── Typewriter / dot state ──────────────────────────────────────────────
  const [typedCount,  setTypedCount]  = useState(0);
  const [dotActive,   setDotActive]   = useState(false);
  const [dotSettled,  setDotSettled]  = useState(false);
  const dotPhysicsRef = useRef<HTMLSpanElement>(null); // target for JS physics

  // ── Spotlight: cursor-circle reveal (unchanged) ─────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    const overlay = overlayRef.current;
    if (!section || !overlay) return;

    let targetX = -9999, targetY = -9999;
    let currentX = -9999, currentY = -9999;
    let active = false;

    const onMouseMove = (e: MouseEvent) => { targetX = e.clientX; targetY = e.clientY; active = true; };
    const onMouseLeave = () => { active = false; };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    let rAF: number;
    const tick = () => {
      if (targetX !== -9999 && targetY !== -9999) {
        if (currentX === -9999 || currentY === -9999) {
          currentX = targetX; currentY = targetY;
        } else {
          currentX += (targetX - currentX) * 0.12;
          currentY += (targetY - currentY) * 0.12;
        }

        const radius  = window.innerWidth < 768 ? 60 : 100;
        const rect    = section.getBoundingClientRect();
        const localX  = currentX - rect.left;
        const localY  = currentY - rect.top;
        const isOver  =
          currentX >= rect.left - radius && currentX <= rect.right  + radius &&
          currentY >= rect.top  - radius && currentY <= rect.bottom + radius;

        if (isOver && active) {
          overlay.style.clipPath = `circle(${radius}px at ${localX}px ${localY}px)`;
          overlay.style.opacity  = '1';
        } else {
          overlay.style.clipPath = `circle(0px at ${localX}px ${localY}px)`;
          overlay.style.opacity  = '0';
        }
      } else {
        overlay.style.opacity = '0';
      }
      rAF = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(rAF);
    };
  }, []);

  // ── Smooth scroll to hash anchor ────────────────────────────────────────
  useEffect(() => {
    if (window.location.hash) {
      const el = document.getElementById(window.location.hash.substring(1));
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
    }
  }, []);

  // ── Navigation Bar Height Measurement ───────────────────────────────────
  useEffect(() => {
    const updateNavHeight = () => {
      const header = document.querySelector('header');
      if (header) {
        document.documentElement.style.setProperty('--nav-height', `${header.offsetHeight}px`);
      }
    };

    updateNavHeight();
    window.addEventListener('resize', updateNavHeight);
    window.addEventListener('scroll', updateNavHeight, { passive: true });
    const timer = setTimeout(updateNavHeight, 200);

    return () => {
      window.removeEventListener('resize', updateNavHeight);
      window.removeEventListener('scroll', updateNavHeight);
      clearTimeout(timer);
    };
  }, []);

  // ── Typewriter + dot entrance ───────────────────────────────────────────
  useEffect(() => {
    const w = window as unknown as Record<string, unknown>;
    let interval: ReturnType<typeof setInterval>;

    // Already typed this session (e.g. navigated away and came back)
    if (w.__anorthicTyped) {
      setTypedCount(TOTAL);
      setDotActive(true);
      setDotSettled(true);
      return;
    }

    const startTyping = () => {
      let count = 0;
      interval = setInterval(() => {
        count++;
        setTypedCount(count);
        if (count >= TOTAL) {
          clearInterval(interval);
          w.__anorthicTyped = true;
          setDotActive(true);
        }
      }, TYPE_MS);
    };

    // Loader already finished before this page mounted (client-side nav)
    if (w.__anorthicLoaded) {
      const t = setTimeout(startTyping, 80);
      return () => { clearTimeout(t); clearInterval(interval); };
    }

    // First load: wait for loader to finish
    window.addEventListener('anorthic:loader-done', startTyping, { once: true });
    return () => {
      window.removeEventListener('anorthic:loader-done', startTyping);
      clearInterval(interval);
    };
  }, []);

  // ── Dot Physics Bounce Simulation ───────────────────────────────────────
  useLayoutEffect(() => {
    if (!dotActive || dotSettled) return;
    const dot = dotPhysicsRef.current;
    if (!dot) return;

    const parent = dot.parentElement;
    if (!parent) return;

    // Get the absolute positions
    const rect = parent.getBoundingClientRect();
    const targetX = rect.left;
    const targetY = rect.top;

    // Start position: top-right corner of viewport, just off-screen
    const startX = window.innerWidth + 50;
    const startY = rect.top - 300;

    let dx = startX - targetX;
    let dy = startY - targetY;

    // Physics parameters
    const gravity = 2800; // px/s^2 (snappier, less floaty gravity)
    const restitution = 0.55; // vertical rebound velocity retention
    const groundY = 0; // relative baseline
    const groundFriction = 0.65; // horizontal speed reduction on bounce impact

    // Horizontal spring parameters
    const springK = 30; // stiffer spring for faster settle
    const dampingC = 9.5; // near-critical damping to prevent backwards oscillation
    const maxClampX = 600; // soft-distance spring clamp

    let vy = 0;
    let vx = -dx * 0.95; // fast horizontal throw speed
    let verticalSettled = false;
    let horizontalSettled = false;

    const startTime = performance.now();
    let lastTime = startTime;
    let rId: number;

    const tick = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      // Fail-safe cutoff
      if (elapsed > 4.0) {
        dot.style.transform = '';
        setDotSettled(true);
        return;
      }

      let dt = (now - lastTime) / 1000;
      lastTime = now;

      if (dt > 0.1) dt = 0.1; // cap dt

      // 1. Vertical physics (gravity + bounce)
      if (!verticalSettled) {
        vy += gravity * dt;
        dy += vy * dt;

        if (dy >= groundY) {
          dy = groundY;
          vy = -vy * restitution;

          // Apply ground friction: reduce horizontal speed on bounce impact
          vx *= groundFriction;

          // If bounce velocity is very low, lock it to ground
          if (Math.abs(vy) < 60) {
            vy = 0;
            verticalSettled = true;
          }
        }
      } else {
        dy = groundY;
        vy = 0;
      }

      // 2. Horizontal physics (spring-damper)
      if (!horizontalSettled) {
        const clampedDx = Math.max(-maxClampX, Math.min(maxClampX, dx));
        const ax = -springK * clampedDx - dampingC * vx;
        vx += ax * dt;
        dx += vx * dt;

        // Settle horizontal when close to 0 with very low speed
        if (Math.abs(dx) < 0.1 && Math.abs(vx) < 5) {
          dx = 0;
          vx = 0;
          horizontalSettled = true;
        }
      } else {
        dx = 0;
        vx = 0;
      }

      // Apply style
      dot.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;

      if (verticalSettled && horizontalSettled) {
        dot.style.transform = '';
        setDotSettled(true);
      } else {
        rId = requestAnimationFrame(tick);
      }
    };

    rId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rId);
  }, [dotActive, dotSettled]);

  return (
    <div className="flex-1 flex flex-col">

      {/* No CSS keyframe needed — dot uses JS physics simulation */}

      {/* ── Hero section ──────────────────────────────────────────────────── */}
      <section className="w-screen h-screen -mx-[4vw] -mt-[4vw] lg:-mx-[2vw] lg:-mt-[2vw] px-[4vw] pb-[4vw] lg:px-[2vw] lg:pb-[2vw] relative flex flex-col justify-end shrink-0">
        <div className="w-full">
          <h1
            className="font-krona text-[13vw] md:text-[11vw] leading-[0.85] tracking-tighter text-cherry font-black uppercase"
            style={{ textShadow: '2px 2px 0px rgba(203, 39, 44, 0.1)' }}
          >
            {/*
             * Both lines are ALWAYS rendered as invisible characters first.
             * Characters become visible one-by-one via typedCount.
             * This locks the layout from frame 1 — no shifting.
             */}

            {/* Line 1: "Anorthic" */}
            {LINE1.split('').map((char, i) => (
              <span
                key={`l1-${i}`}
                style={{ visibility: i < typedCount ? 'visible' : 'hidden' }}
              >
                {char}
              </span>
            ))}

            <br />

            {/* Line 2: "Studio" + dot */}
            <span className="inline-flex items-baseline">
              {LINE2.split('').map((char, i) => (
                <span
                  key={`l2-${i}`}
                  style={{ visibility: (LINE1.length + i) < typedCount ? 'visible' : 'hidden' }}
                >
                  {char}
                </span>
              ))}

              {/*
               * Dot container — always in DOM (takes space, transparent bg).
               * The solid dot only renders inside when dotActive is true,
               * and its animation handles its own opacity from 0→1.
               */}
              <span className="relative inline-flex w-[2vw] h-[2vw] md:w-[1.6vw] md:h-[1.6vw] ml-[0.4vw] md:ml-[0.6vw]">
                {dotActive && (
                  <>
                    {/* Ping ring — starts after dot settles */}
                    {dotSettled && (
                      <span
                        className="animate-ping absolute inline-flex h-full w-full rounded-full bg-crimson opacity-75"
                        style={{ animationDuration: '2s' }}
                      />
                    )}
                    {/* Solid dot — physics driven via dotPhysicsRef */}
                    <span
                      ref={dotPhysicsRef}
                      className="relative inline-flex rounded-full h-full w-full bg-crimson"
                    />
                  </>
                )}
              </span>
            </span>
          </h1>
        </div>
      </section>

      {/* ── About section (unchanged) ─────────────────────────────────────── */}
      <section id="about-section" className="flex flex-col shrink-0 w-full scroll-mt-[var(--nav-height,78px)] lg:scroll-mt-[var(--nav-height,96px)]">
        <div className="w-full bg-cherry text-cream rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 lg:p-10 flex flex-col justify-start items-start shadow-xl mt-[4vw] lg:mt-[2vw]">
          <p className="m-0 font-geist text-[7vw] md:text-[5vw] lg:text-[4vw] leading-[1.1] md:leading-[1.1] text-cream font-medium w-full">
            We are an atelier of digital architects building uncompromising brand identities, custom web applications, and ai automated workflows.
          </p>

          <div className="grid grid-cols-3 gap-2 md:gap-6 w-full mt-8 md:mt-12 lg:mt-16">
            <AnimatedCounter target={95}  suffix="+"  label="Lighthouse Speed Score" />
            <AnimatedCounter target={100} suffix="%"  label="Custom Code & Design" />
            <AnimatedCounter target={24}  suffix="/7" label="Autonomous AI Agents" />
          </div>
        </div>
      </section>

      {/* ── Spotlight / word-cloud section (unchanged) ────────────────────── */}
      <div
        ref={sectionRef}
        className="sticky top-0 w-screen h-screen -mx-[4vw] lg:-mx-[2vw] shrink-0 flex items-center justify-center overflow-hidden z-0"
      >
        {/* Base layer */}
        <div className="absolute inset-0 w-full h-full z-0 bg-cream pointer-events-none select-none">
          <StarryParticles />
        </div>

        <span className="relative z-10 font-sacramento text-crimson text-[7vw] md:text-[5vw] lg:text-[4vw] italic select-none">
          no fluff, just hard work.
        </span>

        {/* Cursor-reveal overlay */}
        <div
          ref={overlayRef}
          className="absolute inset-0 w-full h-full z-20 bg-cream flex items-center justify-center select-none opacity-0"
          style={{ transform: 'translate3d(0,0,0)', willChange: 'clip-path, opacity' }}
        >
          <WordCloud />
          <span className="relative z-10 font-sacramento text-crimson text-[7vw] md:text-[5vw] lg:text-[4vw] italic">
            no fluff, just hard work.
          </span>
        </div>
      </div>

      {/* ── Projects section ──────────────────────────────────────────── */}
      <div id="projects-section" className="relative z-10 w-full mt-[4vw] lg:mt-[2vw] shrink-0 scroll-mt-[var(--nav-height,78px)] lg:scroll-mt-[var(--nav-height,96px)]">


        {/* Cards */}
        <div className="relative z-10 w-full pb-[4vw] lg:pb-[2vw]">
          <div className="flex flex-col gap-[4vw] lg:gap-[2vw]">
            {ROWS.map((row, rowIdx) => (
              <div key={row.label}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[4vw] lg:gap-[2vw]">
                  {row.cards.map((card, cardIdx) => {
                    const globalIdx = rowIdx * 2 + cardIdx;
                    return (
                      <ProjectCard
                        key={card.title}
                        card={card}
                        pillPositions={ALL_PILL_POSITIONS[globalIdx]}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
