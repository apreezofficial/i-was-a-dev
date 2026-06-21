'use client';

import { useState, useEffect } from 'react';

interface AnimatedTextProps {
  words: string[];
  interval?: number;
}

export default function AnimatedText({ words, interval = 3000 }: AnimatedTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <div className="inline-block relative h-[1.2em] overflow-hidden">
      <div className="flex flex-col transition-transform duration-500 ease-in-out" 
           style={{ 
             transform: `translateY(-${currentIndex * 100}%)`,
             transitionDuration: '500ms'
           }}>
        {words.map((word, index) => (
          <div key={index} className="whitespace-nowrap">
            {word}
          </div>
        ))}
      </div>
    </div>
  );
}
