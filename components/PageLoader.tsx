'use client';

import { useEffect, useState } from 'react';

const COLS = [
  { bg: '#5a6b7c', key: 'slate' },
  { bg: '#cb272c', key: 'crimson' },
  { bg: '#281819', key: 'cherry' },
];

// ── Timing (ms) ─────────────────────────────────────────────────────────────
const IN_DUR   = 1100;  // each column slides in
const IN_STAG  =  160;  // delay between each column start
const HOLD     =   80;  // pause while all three are visible
const OUT_DUR  =  900;  // each column slides out
const OUT_STAG =  140;  // delay between each column on exit

const ALL_IN    = IN_DUR + IN_STAG * (COLS.length - 1); // 1420ms
const OUT_START = ALL_IN + HOLD;                          // 1500ms
const ALL_OUT   = OUT_START + OUT_DUR + OUT_STAG * (COLS.length - 1); // 2680ms
const DONE_AT   = ALL_OUT + 80;                           // 2760ms

export default function PageLoader() {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out' | 'gone'>('in');

  useEffect(() => {
    // Reduced-motion: skip straight to done
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('gone');
      (window as unknown as Record<string, unknown>).__anorthicLoaded = true;
      window.dispatchEvent(new CustomEvent('anorthic:loader-done'));
      return;
    }

    const t1 = setTimeout(() => setPhase('hold'),   ALL_IN);
    const t2 = setTimeout(() => setPhase('out'),    OUT_START);
    const t3 = setTimeout(() => {
      setPhase('gone');
      (window as unknown as Record<string, unknown>).__anorthicLoaded = true;
      window.dispatchEvent(new CustomEvent('anorthic:loader-done'));
    }, DONE_AT);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (phase === 'gone') return null;

  return (
    <>
      <style>{`
        html, body, * {
          cursor: none !important;
        }

        @keyframes anorthic-col-in {
          from { transform: translateY(100%); }
          to   { transform: translateY(0%);   }
        }
        @keyframes anorthic-col-out {
          from { transform: translateY(0%);    }
          to   { transform: translateY(-100%); }
        }


        /*
         * Override the CursorCircle SVG filter while the loader is visible.
         * The feColorMatrix only knows cream/cherry/crimson — slate maps to
         * an unexpected salmon colour. Instead, show a plain cream circle.
         * This rule is removed automatically when PageLoader unmounts.
         */
        #cursor-disc {
          background-color: #f4e9d5 !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }
      `}</style>

      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9998, // CursorCircle is z-9999 — stays above loader so cursor stays visible
          pointerEvents: 'none',
        }}
      >
        {/* Pure cream background behind columns */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#f4e9d5',
            zIndex: 1,
            opacity: phase === 'out' ? 0 : 1,
          }}
        />

        {/* Columns container */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            zIndex: 2,
            width: '100%',
            height: '100%',
          }}
        >
          {COLS.map((col, i) => {
            const isOut = phase === 'out';
            return (
              <div
                // key changes on 'out' to force remount → fresh keyframe
                key={`${isOut ? 'out' : 'in'}-${col.key}`}
                style={{
                  flex: 1,
                  backgroundColor: col.bg,
                  // slide-in: ease-out-cubic → decelerates as it lands
                  ...(phase === 'in' && {
                    animation: `anorthic-col-in ${IN_DUR}ms cubic-bezier(0.33, 1, 0.68, 1) ${i * IN_STAG}ms both`,
                  }),
                  // hold: static
                  ...(phase === 'hold' && {
                    transform: 'translateY(0%)',
                  }),
                  // slide-out: ease-in-cubic → accelerates as it leaves
                  ...(phase === 'out' && {
                    animation: `anorthic-col-out ${OUT_DUR}ms cubic-bezier(0.32, 0, 0.67, 0) ${i * OUT_STAG}ms both`,
                  }),
                }}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
