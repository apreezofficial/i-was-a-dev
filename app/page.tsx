'use client';

import { useState } from 'react';
import PeopleDirectory from '@/components/people-directory';
import RegisterModal from '@/components/register-modal';

export default function Home() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <main className="bg-background text-foreground min-h-screen">
      {/* Simple header with Register button */}
      <header className="border-b border-border sticky top-0 bg-background">
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

      <PeopleDirectory />
      {showRegister && (
        <RegisterModal onClose={() => setShowRegister(false)} />
      )}
    </main>
  );
}
