'use client';

import { Heart, ArrowRight } from 'lucide-react';

interface PersonCardProps {
  person: {
    id: string;
    name: string;
    before: string;
    after: string;
    likes: number;
    liked: boolean;
  };
  onLike: () => void;
}

export default function PersonCard({ person, onLike }: PersonCardProps) {
  return (
    <div className="group relative bg-card hover:bg-card/80 border border-border rounded-lg p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-xl">
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header with avatar placeholder and name */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full mb-3 flex items-center justify-center text-lg font-bold text-card">
              {person.name.charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-foreground">{person.name}</h3>
          </div>
          <button
            onClick={onLike}
            className="flex-shrink-0 p-2 rounded-full hover:bg-primary/10 transition-colors"
          >
            <Heart
              size={24}
              className={`transition-all duration-300 ${
                person.liked
                  ? 'fill-primary stroke-primary'
                  : 'stroke-foreground/50 hover:stroke-primary'
              }`}
            />
          </button>
        </div>

        {/* Career transition */}
        <div className="space-y-4 mb-6">
          {/* Before */}
          <div>
            <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-1">
              Was a:
            </p>
            <p className="text-sm text-foreground/80 font-semibold">{person.before}</p>
          </div>

          {/* Arrow transition */}
          <div className="flex items-center justify-center py-2">
            <div className="h-px flex-grow bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
            <ArrowRight size={16} className="mx-2 text-primary/60" />
            <div className="h-px flex-grow bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
          </div>

          {/* After */}
          <div>
            <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">
              Now:
            </p>
            <p className="text-sm font-bold text-accent">{person.after}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border my-6"></div>

        {/* Like count and view profile */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart size={16} className="text-primary" />
            <span className="text-sm font-semibold text-foreground/80">
              {person.likes} {person.likes === 1 ? 'like' : 'likes'}
            </span>
          </div>
          <button className="text-xs font-bold text-primary hover:text-accent transition-colors uppercase tracking-wider">
            Full Story →
          </button>
        </div>
      </div>
    </div>
  );
}
