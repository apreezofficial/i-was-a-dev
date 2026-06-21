'use client';

import { useState, useEffect } from 'react';

interface AnimatedTextProps {
  words: string[];
  interval?: number;
}

export default function AnimatedText({ words, interval = 3000 }: AnimatedTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <span className="inline-block relative w-auto min-w-fit overflow-hidden">
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(-100%); opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(100%); opacity: 1; }
          to { transform: translateY(0); opacity: 1; }
        }
        .word-rotator {
          display: inline-block;
          animation: slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .word-rotator.entering {
          animation: slideDown 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
      <span key={currentIndex} className={`word-rotator ${currentIndex > 0 ? 'entering' : ''}`}>
        {words[currentIndex]}
      </span>
    </span>
  );
}
