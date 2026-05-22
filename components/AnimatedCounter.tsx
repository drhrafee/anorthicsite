'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  label: string;
  duration?: number; // in ms
}

export default function AnimatedCounter({ target, suffix = '', label, duration = 1200 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  const startAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const startTime = performance.now();
    const start = 0;
    const end = target;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeProgress * (end - start) + start);
      setCount(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [target, duration]);

  const resetAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setCount(0);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startAnimation();
          } else {
            resetAnimation();
          }
        });
      },
      {
        threshold: 0,
        rootMargin: '-15% 0px -15% 0px'
      }
    );

    const container = containerRef.current;
    if (container) {
      observer.observe(container);
    }

    return () => {
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [startAnimation, resetAnimation]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onFocus={startAnimation}
      aria-label={`${label}: ${target}${suffix}`}
      className="bg-cream text-cherry rounded-[1rem] md:rounded-[2rem] p-3 md:p-8 flex flex-col justify-between shadow-md outline-none focus:ring-2 focus:ring-crimson cursor-default select-none"
    >
      <div aria-hidden="true" className="flex flex-col justify-between h-full w-full">
        <span className="font-geist text-[7vw] md:text-[6vw] lg:text-[5vw] font-black leading-none tracking-tight text-cherry">
          {count}
          <span className="text-crimson font-light ml-0.5">{suffix}</span>
        </span>
        <span className="font-geist text-[2.2vw] md:text-sm lg:text-base font-bold text-cherry/80 uppercase tracking-[0.05em] md:tracking-wider mt-2 md:mt-4">
          {label}
        </span>
      </div>
    </div>
  );
}
