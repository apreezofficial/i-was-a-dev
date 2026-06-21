'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('[v0] Attempting login with PIN:', pin);
      
      const response = await fetch('https://api.preciousadedokun.com.ng/iwasadev/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      const data = await response.json();
      console.log('[v0] Login response:', data);

      if (data.success) {
        // Store user data and PIN in localStorage
        localStorage.setItem('iwasadev_user', JSON.stringify(data.user));
        localStorage.setItem('iwasadev_pin', pin);
        router.push('/dashboard');
      } else {
        setError(data.error || 'Invalid PIN');
      }
    } catch (err) {
      console.error('[v0] Login error:', err);
      setError('Error logging in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-foreground hover:text-foreground/80 transition-colors">
            iwasadev
          </a>
          <a href="/" className="flex items-center gap-2 text-foreground hover:text-foreground/80 transition-colors">
            <ArrowLeft size={20} />
            Back
          </a>
        </div>
      </header>

      {/* Login Form */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-2xl p-8">
            <h1 className="text-3xl font-black text-foreground mb-2">Welcome Back</h1>
            <p className="text-foreground/70 mb-8">Enter your 6-digit PIN to access your story</p>

            {error && (
              <div className="mb-6 p-4 bg-destructive/20 border border-destructive rounded-lg">
                <p className="text-sm text-foreground">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Your PIN
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground text-center text-2xl tracking-widest"
                />
              </div>

              <button
                type="submit"
                disabled={loading || pin.length !== 6}
                className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <p className="text-center text-sm text-foreground/60 mt-6">
              Don&apos;t have a PIN?{' '}
              <a href="/" className="font-bold text-foreground hover:underline">
                Register here
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
