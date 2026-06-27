'use client';

import { useState, useEffect } from 'react';
import PeopleDirectory from '@/components/people-directory';
import RegisterModal from '@/components/register-modal';
import AnimatedText from '@/components/animated-text';
import { User, ChevronDown, LogOut, Settings, LayoutDashboard } from 'lucide-react';

export default function Home() {
  const [showRegister, setShowRegister] = useState(false);
  const [registerMode, setRegisterMode] = useState<'register' | 'login'>('register');
  const [user, setUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const animatedWords = ['coding', 'building', 'developing', 'creating', 'innovating'];

  useEffect(() => {
    const savedUser = localStorage.getItem('iwasadev_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('iwasadev_user');
    localStorage.removeItem('iwasadev_pin');
    setUser(null);
    setShowUserMenu(false);
  };

  const openRegister = (mode: 'register' | 'login' = 'register') => {
    setRegisterMode(mode);
    setShowRegister(true);
  };

  return (
    <main className="bg-background text-foreground min-h-screen">
      {/* Simple header */}
      <header className="border-b border-border sticky top-0 bg-background z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">iwasadev</h1>
          
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold rounded-lg transition-colors border border-border"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={14} className="text-primary" />
                    )}
                  </div>
                  <span>Me</span>
                  <ChevronDown size={16} className={`transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl py-2 z-50">
                    <button
                      onClick={() => { setShowUserMenu(false); openRegister('login'); }}
                      className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2 text-sm font-medium"
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </button>
                    <div className="border-t border-border my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left hover:bg-destructive/10 text-destructive flex items-center gap-2 text-sm font-medium"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openRegister('register')}
                className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition-colors"
              >
                Register
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="border-b border-border py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-6xl sm:text-7xl font-black text-foreground mb-4">
            iwasadev
          </h2>
          <h3 className="text-lg sm:text-xl font-black text-foreground mb-2">
            You stopped <AnimatedText words={animatedWords} interval={5000} />, that&apos;s okay
          </h3>
          <p className="text-base sm:text-lg font-semibold text-foreground/80">
            Not registering yours is the crime
          </p>
        </div>
      </section>

      <PeopleDirectory />
      
      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
            <div>
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
            
            {!user && (
              <div className="flex gap-4">
                <button 
                  onClick={() => openRegister('login')}
                  className="text-sm font-bold text-foreground/60 hover:text-foreground transition-colors"
                >
                  Login
                </button>
                <span className="text-foreground/20">|</span>
                <button 
                  onClick={() => openRegister('register')}
                  className="text-sm font-bold text-foreground/60 hover:text-foreground transition-colors"
                >
                  Join Us
                </button>
              </div>
            )}
          </div>
        </div>
      </footer>

      {showRegister && (
        <RegisterModal 
          mode={registerMode} 
          onClose={() => setShowRegister(false)} 
          onSuccess={(userData) => {
            setUser(userData);
            setShowRegister(false);
          }}
        />
      )}
    </main>
  );
}
