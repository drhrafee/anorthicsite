'use client';

import React, { useEffect, useRef } from 'react';
import AnimatedCounter from '@/components/AnimatedCounter';
import StarryParticles from '@/components/StarryParticles';
import WordCloud from '@/components/WordCloud';

export default function Page() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const overlay = overlayRef.current;
    if (!section || !overlay) return;

    let targetX = -9999;
    let targetY = -9999;
    let currentX = -9999;
    let currentY = -9999;
    let active = false;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      active = true;
    };

    const onMouseLeave = () => {
      active = false;
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    let rAF: number;
    const tick = () => {
      if (targetX !== -9999 && targetY !== -9999) {
        if (currentX === -9999 || currentY === -9999) {
          currentX = targetX;
          currentY = targetY;
        } else {
          // Easing matches CursorCircle.tsx exactly
          currentX += (targetX - currentX) * 0.12;
          currentY += (targetY - currentY) * 0.12;
        }

        const rect = section.getBoundingClientRect();
        const localX = currentX - rect.left;
        const localY = currentY - rect.top;

        // Check if cursor is over the section (with 100px padding for the spotlight boundary)
        const isOverSection =
          currentX >= rect.left - 100 &&
          currentX <= rect.right + 100 &&
          currentY >= rect.top - 100 &&
          currentY <= rect.bottom + 100;

        if (isOverSection && active) {
          overlay.style.clipPath = `circle(100px at ${localX}px ${localY}px)`;
          overlay.style.opacity = '1';
        } else {
          overlay.style.clipPath = `circle(0px at ${localX}px ${localY}px)`;
          overlay.style.opacity = '0';
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

  return (
    <div className="flex-1 flex flex-col">
      <section className="w-screen h-screen -mx-[4vw] -mt-[4vw] lg:-mx-[2vw] lg:-mt-[2vw] px-[4vw] pb-[4vw] lg:px-[2vw] lg:pb-[2vw] relative flex flex-col justify-end shrink-0">
        <div className="w-full">
          <h1
            className="font-krona text-[13vw] md:text-[11vw] leading-[0.85] tracking-tighter text-cherry font-black uppercase"
            style={{ textShadow: '2px 2px 0px rgba(203, 39, 44, 0.1)' }}
          >
            Anorthic<br />
            <span className="inline-flex items-baseline">
              Studio
              <span className="relative inline-flex w-[2.5vw] h-[2.5vw] md:w-[2vw] md:h-[2vw] ml-2 md:ml-4 self-center md:self-end md:mb-[0.5vw]">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-crimson opacity-75" style={{ animationDuration: '2s' }}></span>
                <span className="relative inline-flex rounded-full h-full w-full bg-crimson"></span>
              </span>
            </span>
          </h1>
        </div>
      </section>

      <section className="flex flex-col shrink-0 w-full">
        <div className="w-full bg-cherry text-cream rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 lg:p-10 flex flex-col justify-start items-start shadow-xl mt-[4vw] lg:mt-[2vw]">
          <p className="m-0 font-geist text-[7vw] md:text-[5vw] lg:text-[4vw] leading-[1.1] md:leading-[1.1] text-cream font-medium w-full">
            We are an atelier of digital architects building uncompromising brand identities, custom web applications, and ai automated workflows.
          </p>

          <div className="grid grid-cols-3 gap-2 md:gap-6 w-full mt-8 md:mt-12 lg:mt-16">
            <AnimatedCounter target={95} suffix="+" label="Lighthouse Speed Score" />
            <AnimatedCounter target={100} suffix="%" label="Custom Code & Design" />
            <AnimatedCounter target={24} suffix="/7" label="Autonomous AI Automation" />
          </div>
        </div>
      </section>

      {/* 3rd Section: Dual-layer Spotlight Reveal */}
      <div
        ref={sectionRef}
        className="relative w-screen h-screen -mx-[4vw] lg:-mx-[2vw] mt-[4vw] lg:mt-[2vw] shrink-0 flex items-center justify-center overflow-hidden"
      >
        {/* Layer 1: Base Layer (Visible normally) */}
        <div className="absolute inset-0 w-full h-full z-0 bg-cream pointer-events-none select-none">
          <StarryParticles />
        </div>

        {/* Central Fluff Text on Base Layer (Crimson) */}
        <span className="relative z-10 font-sacramento text-crimson text-[7vw] md:text-[5vw] lg:text-[4vw] italic select-none">
          no fluff, just hard work.
        </span>

        {/* Layer 2: Overlay Layer (Revealed inside the cursor circle) */}
        <div
          ref={overlayRef}
          className="absolute inset-0 w-full h-full z-20 bg-cream flex items-center justify-center select-none opacity-0"
          style={{
            transform: 'translate3d(0,0,0)',
            willChange: 'clip-path, opacity'
          }}
        >
          {/* Word Cloud inside the overlay (Crimson text, which inverts to Cream) */}
          <WordCloud />

          {/* Central Fluff Text in Crimson inside the overlay (which inverts to Cream) */}
          <span className="relative z-10 font-sacramento text-crimson text-[7vw] md:text-[5vw] lg:text-[4vw] italic">
            no fluff, just hard work.
          </span>
        </div>
      </div>
    </div>
  );
}
