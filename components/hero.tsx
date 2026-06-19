'use client';

interface HeroProps {
  onRegisterClick: () => void;
}

export default function Hero({ onRegisterClick }: HeroProps) {
  return (
    <section className="relative min-h-screen bg-background flex items-center justify-center overflow-hidden border-b border-border">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1 h-64 bg-foreground/5"></div>
        <div className="absolute bottom-0 left-0 w-64 h-1 bg-foreground/5"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main headline */}
        <div className="mb-8 space-y-6">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight text-foreground">
            I was a dev.
          </h1>

          {/* Subheading statements */}
          <div className="space-y-4 mt-10">
            <p className="text-xl sm:text-2xl font-bold text-foreground">
              Being an ex-developer shouldn&apos;t be a stigma.
            </p>
            <p className="text-lg sm:text-xl font-semibold text-foreground/80">
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
            className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Register Your Story
          </button>
          <button className="px-8 py-4 border-2 border-foreground text-foreground hover:bg-foreground/5 font-bold text-lg rounded-lg transition-all duration-300">
            Explore Stories
          </button>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
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
  );
}
