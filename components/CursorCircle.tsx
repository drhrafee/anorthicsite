'use client';

import { useEffect, useRef, useState } from 'react';

export default function CursorCircle() {
  const discRef = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState(100);
  const [isHoveringCard, setIsHoveringCard] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setRadius(window.innerWidth < 768 ? 60 : 100);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

    const updateHover = (x: number, y: number) => {
      if (x === -9999 || y === -9999) return;
      const el = document.elementFromPoint(x, y);
      setIsHoveringCard(!!el?.closest('.project-card'));
    };

    const onMove = (e: MouseEvent) => {
      active = true;
      targetX = e.clientX;
      targetY = e.clientY;
      updateHover(targetX, targetY);
    };
    const onLeave = () => { active = false; };
    const onScroll = () => {
      updateHover(targetX, targetY);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('scroll', onScroll, { passive: true });
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
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  /*
    SVG feColorMatrix that maps these three colors precisely:
      cream  (#f4e9d5)  →  crimson (#cb272c)
      cherry (#281819)  →  cream   (#f4e9d5)
      crimson(#cb272c)  →  cream   (#f4e9d5) (default) / cherry (#281819) (hovering cards)

    Result: inside the cursor circle, cream bg → crimson bg,
    cherry text → cream text, crimson accents → cream/cherry.
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
          <filter id="cream-crimson-swap-cards" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="
                -1.3559  1.1265  0  0  1.064
                -1.3162  0.3560  0  0  1.087
                -1.1855  0.3493  0  0  0.988
                 0       0       0  1  0
              "
            />
          </filter>
        </defs>
      </svg>

      <div
        ref={discRef}
        id="cursor-disc"
        className="fixed inset-0 pointer-events-none z-[9999]"
        style={{
          backdropFilter:       isHoveringCard ? 'url(#cream-crimson-swap-cards)' : 'url(#cream-crimson-swap)',
          WebkitBackdropFilter: isHoveringCard ? 'url(#cream-crimson-swap-cards)' : 'url(#cream-crimson-swap)',
          clipPath: `circle(${radius}px at var(--cursor-x, -9999px) var(--cursor-y, -9999px))`,
          opacity: 0,
        }}
      />
    </>
  );
}
