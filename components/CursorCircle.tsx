'use client';

import { useEffect, useRef } from 'react';

const RADIUS = 100;

export default function CursorCircle() {
  const discRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const disc = discRef.current;
    if (!disc) return;

    let raf: number;
    let opacity = 0;
    let active  = false;

    let targetX = -9999;
    let targetY = -9999;
    let currentX = -9999;
    let currentY = -9999;

    const onMove = (e: MouseEvent) => {
      active = true;
      targetX = e.clientX;
      targetY = e.clientY;
    };
    const onLeave = () => { active = false; };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);

    const tick = () => {
      if (active) opacity = Math.min(1, opacity + 0.09);
      else        opacity = Math.max(0, opacity - 0.06);

      if (targetX !== -9999 && targetY !== -9999) {
        if (currentX === -9999 || currentY === -9999) {
          currentX = targetX;
          currentY = targetY;
        } else {
          // Easing/latency effect: 0.12 speed factor
          currentX += (targetX - currentX) * 0.12;
          currentY += (targetY - currentY) * 0.12;
        }
        document.documentElement.style.setProperty('--cursor-x', `${currentX}px`);
        document.documentElement.style.setProperty('--cursor-y', `${currentY}px`);
      }

      disc.style.opacity = String(opacity);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  /*
    SVG feColorMatrix that maps these three colors precisely:
      cream  (#f4e9d5)  →  crimson (#cb272c)
      cherry (#281819)  →  cream   (#f4e9d5)
      crimson(#cb272c)  →  cream   (#f4e9d5)

    Result: inside the cursor circle, cream bg → crimson bg,
    cherry text → cream text, crimson accents → cream.
    No solid background needed — the filter IS the crimson circle.
  */

  return (
    <>
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id="cream-crimson-swap" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="
                 0.01992  -0.2158   0  0  0.974
                 0.09417  -1.01992  0  0  0.995
                 0.08192  -0.88727  0  0  0.905
                 0         0        0  1  0
              "
            />
          </filter>
        </defs>
      </svg>

      <div
        ref={discRef}
        className="fixed inset-0 pointer-events-none z-[9999]"
        style={{
          backdropFilter:       'url(#cream-crimson-swap)',
          WebkitBackdropFilter: 'url(#cream-crimson-swap)',
          clipPath: `circle(${RADIUS}px at var(--cursor-x, -9999px) var(--cursor-y, -9999px))`,
          opacity: 0,
        }}
      />
    </>
  );
}
