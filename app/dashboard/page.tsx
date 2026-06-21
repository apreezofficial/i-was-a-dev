'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StoryEditor from '@/components/story-editor';
import ReasonForm from '@/components/reason-form';

interface User {
  id: string;
  name: string;
  before: string;
  pin: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'profile' | 'story'>('profile');
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem('iwasadev_user');
    if (!userStr) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
    } catch (err) {
      console.error('[v0] Error parsing user data:', err);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('iwasadev_user');
    localStorage.removeItem('iwasadev_pin');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-foreground/60">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">
            Welcome, <span className="text-foreground font-black">{user.name}</span>
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-foreground/30 text-foreground hover:bg-foreground/5 font-bold rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-border sticky top-16 bg-background z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setTab('profile')}
              className={`py-4 px-2 font-bold border-b-2 transition-colors ${
                tab === 'profile'
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-foreground/60 hover:text-foreground'
              }`}
            >
              Why I Left
            </button>
            <button
              onClick={() => setTab('story')}
              className={`py-4 px-2 font-bold border-b-2 transition-colors ${
                tab === 'story'
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-foreground/60 hover:text-foreground'
              }`}
            >
              My Story
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tab === 'profile' && <ReasonForm user={user} />}
        {tab === 'story' && <StoryEditor user={user} />}
      </main>
    </div>
  );
}
