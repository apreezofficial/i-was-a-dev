'use client';

import { useState } from 'react';
import Hero from '@/components/hero';
import PeopleDirectory from '@/components/people-directory';
import RegisterModal from '@/components/register-modal';

export default function Home() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Hero onRegisterClick={() => setShowRegister(true)} />
      <PeopleDirectory />
      {showRegister && (
        <RegisterModal onClose={() => setShowRegister(false)} />
      )}
    </main>
  );
}
