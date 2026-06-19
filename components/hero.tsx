'use client';

interface HeroProps {
  onRegisterClick: () => void;
}

export default function Hero({ onRegisterClick }: HeroProps) {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-background via-muted to-background flex items-center justify-center overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main headline */}
        <div className="mb-8 space-y-6">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              I was a dev.
            </span>
          </h1>

          {/* Subheading statements */}
          <div className="space-y-4 mt-10">
            <p className="text-xl sm:text-2xl font-bold text-foreground/90">
              Being an ex-developer shouldn&apos;t be a stigma.
            </p>
            <p className="text-lg sm:text-xl font-semibold text-accent">
              Not registering yours is the crime.
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-foreground/70 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
          Join thousands of developers who&apos;ve transformed their careers. Share your journey, celebrate your growth, and inspire others. Your story matters—let&apos;s tell it.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={onRegisterClick}
            className="px-8 py-4 bg-primary hover:bg-primary-dark text-primary-foreground font-bold text-lg rounded-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            Register Your Story
          </button>
          <button className="px-8 py-4 border-2 border-primary text-primary hover:bg-primary/10 font-bold text-lg rounded-lg transition-all duration-300">
            Explore Stories
          </button>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-primary">2.5K+</p>
            <p className="text-sm text-foreground/60 mt-2">Stories Shared</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-accent">50+</p>
            <p className="text-sm text-foreground/60 mt-2">Career Paths</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">15K+</p>
            <p className="text-sm text-foreground/60 mt-2">Community Likes</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-accent">100%</p>
            <p className="text-sm text-foreground/60 mt-2">No Judgment</p>
          </div>
        </div>
      </div>
    </section>
  );
}
