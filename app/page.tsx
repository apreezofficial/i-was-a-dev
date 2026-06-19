'use client';

import { useState } from 'react';
import PeopleDirectory from '@/components/people-directory';
import RegisterModal from '@/components/register-modal';

export default function Home() {
  const [showRegister, setShowRegister] = useState(false);

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

      {/* Hero section with content */}
      <section className="border-b border-border py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Join thousands of developers who&apos;ve transformed their careers. Share your journey, celebrate your growth, and inspire others. Your story matters—let&apos;s tell it.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={() => setShowRegister(true)}
              className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-lg transition-all duration-300"
            >
              Register Your Story
            </button>
            <button className="px-8 py-4 border-2 border-foreground text-foreground hover:bg-foreground/5 font-bold text-lg rounded-lg transition-all duration-300">
              Explore Stories
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-foreground">2.5K+</p>
              <p className="text-sm text-foreground/60 mt-2">Stories Shared</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">50+</p>
              <p className="text-sm text-foreground/60 mt-2">Career Paths</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">15K+</p>
              <p className="text-sm text-foreground/60 mt-2">Community Likes</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">100%</p>
              <p className="text-sm text-foreground/60 mt-2">No Judgment</p>
            </div>
          </div>
        </div>
      </section>

      <PeopleDirectory />
      {showRegister && (
        <RegisterModal onClose={() => setShowRegister(false)} />
      )}
    </main>
  );
}
