'use client';

import { useState } from 'react';
import PeopleDirectory from '@/components/people-directory';
import RegisterModal from '@/components/register-modal';
import AnimatedText from '@/components/animated-text';

export default function Home() {
  const [showRegister, setShowRegister] = useState(false);
  const animatedWords = ['coding', 'building', 'developing', 'creating', 'innovating'];

  return (
    <main className="bg-background text-foreground min-h-screen">
      {/* Simple header with Register button */}
      <header className="border-b border-border sticky top-0 bg-background z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">iwasadev</h1>
          <button
            onClick={() => setShowRegister(true)}
            className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition-colors"
          >
            Register
          </button>
        </div>
      </header>

      {/* Hero section */}
      <section className="border-b border-border py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-6xl sm:text-7xl font-black text-foreground mb-4">
            iwasadev
          </h2>
          <h3 className="text-2xl sm:text-3xl font-black text-foreground mb-2">
            You stopped <AnimatedText words={animatedWords} interval={3000} />, that&apos;s okay
          </h3>
          <p className="text-base sm:text-lg font-semibold text-foreground/80">
            Not registering yours is the crime
          </p>
        </div>
      </section>

      <PeopleDirectory />
      
      {/* Footer */}
      <footer className="border-t border-border bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-foreground/70 text-sm">
            Built with love by{' '}
            <a
              href="https://preciousadedokun.com.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-foreground hover:underline transition-colors"
            >
              Precious Adedokun
            </a>
          </p>
        </div>
      </footer>

      {showRegister && (
        <RegisterModal onClose={() => setShowRegister(false)} />
      )}
    </main>
  );
}
