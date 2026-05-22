'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  onStartTransition: () => void;
  onComplete: () => void;
}

export default function LoadingScreen({ onStartTransition, onComplete }: LoadingScreenProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [clipPathClass, setClipPathClass] = useState('clip-full');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Set initial mouse position to center of screen
    setMousePos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Simulate loading duration of 2.2 seconds
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2200);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (isLoaded) {
      // 1. The scale-up takes ~1000ms.
      // 2. Once the logo fills the screen (making it crimson), we contract the clip-path of the crimson screen to the mouse.
      const contractTimer = setTimeout(() => {
        setClipPathClass('clip-cursor');
        onStartTransition();
      }, 1000);

      // 3. Once the contraction animation completes (~800ms), call onComplete to unmount the loading screen
      const completeTimer = setTimeout(() => {
        onComplete();
      }, 1800);

      return () => {
        clearTimeout(contractTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [isLoaded, onStartTransition, onComplete]);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-cream z-[9999] overflow-hidden flex items-center justify-center pointer-events-none">
      <style>{`
        .clip-full {
          clip-path: circle(150% at 50% 50%);
          transition: clip-path 800ms cubic-bezier(0.76, 0, 0.24, 1);
        }
        .clip-cursor {
          clip-path: circle(100px at ${mousePos.x}px ${mousePos.y}px);
          transition: clip-path 800ms cubic-bezier(0.76, 0, 0.24, 1);
        }
      `}</style>

      {/* Main loading screen content */}
      <motion.div
        className="w-full h-full flex items-center justify-center bg-cream relative"
        animate={isLoaded ? { opacity: [1, 1, 0], transition: { duration: 1.8 } } : {}}
      >
        {/* Logo container */}
        <motion.div
          className="w-[20vw] min-w-[120px] max-w-[280px] aspect-[1856.82/1920] relative flex items-center justify-center"
          animate={
            isLoaded
              ? {
                  rotate: 360,
                  scale: 35,
                  transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] }
                }
              : {
                  rotate: [0, 360, 360],
                  transition: {
                    rotate: {
                      duration: 2.2,
                      ease: "easeInOut",
                      times: [0, 0.6, 1],
                      repeat: Infinity
                    }
                  }
                }
          }
        >
          {/* Logo SVG */}
          <svg
            id="Layer_2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1856.82 1920"
            className="w-full h-full"
          >
            {/* Cherry polygon */}
            <motion.polygon
              points="0 639.16 0 749.99 573.4 1147.29 434.07 1243.84 0 943.09 0 1621.14 431.3 1920 886.44 1604.62 886.44 1364.21 1270.07 1630.03 420.77 347.6 0 639.16"
              fill="#281819"
              animate={isLoaded ? { opacity: 0, scale: 0.8, transition: { duration: 0.6, ease: "easeOut" } } : {}}
            />
            {/* Crimson polygon */}
            <polygon
              points="1856.82 976.91 1856.82 298.86 1425.52 0 970.38 315.38 970.38 555.79 586.74 289.97 1436.04 1572.4 1856.82 1280.84 1856.82 1170.01 1283.42 772.71 1422.75 676.16 1856.82 976.91"
              fill="#cb272c"
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Full-screen Crimson overlay that contracts to the mouse position */}
      {isLoaded && (
        <div
          className={`absolute inset-0 w-full h-full bg-crimson z-10 ${clipPathClass}`}
          style={{ mixBlendMode: 'normal' }}
        />
      )}
    </div>
  );
}
