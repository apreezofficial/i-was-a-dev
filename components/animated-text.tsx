'use client';

import { useState, useEffect } from 'react';

interface AnimatedTextProps {
  words: string[];
  interval?: number;
}

export default function AnimatedText({ words, interval = 5000 }: AnimatedTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <span className="inline relative align-baseline">
      <style>{`
        @keyframes spinFade {
          0% { 
            opacity: 1;
            transform: rotateY(0deg) scale(1);
          }
          45% { 
            opacity: 1;
          }
          50% { 
            opacity: 0;
            transform: rotateY(90deg) scale(0.8);
          }
          55% { 
            opacity: 0;
            transform: rotateY(-90deg) scale(0.8);
          }
          100% { 
            opacity: 1;
            transform: rotateY(0deg) scale(1);
          }
        }
        .word-rotator {
          display: inline-block;
          animation: spinFade 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          will-change: transform, opacity;
          transform-style: preserve-3d;
        }
      `}</style>
      <span key={currentIndex} className="word-rotator">
        {words[currentIndex]}
      </span>
    </span>
  );
}
