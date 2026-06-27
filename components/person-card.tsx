'use client';

import { Heart, ArrowRight } from 'lucide-react';
import { useState } from 'react';

interface PersonCardProps {
  person: {
    id: string;
    name: string;
    before: string;
    after: string;
    avatar?: string;
    likes: number;
    liked?: boolean;
  };
  onLike: (id: string) => Promise<void>;
}

export default function PersonCard({ person, onLike }: PersonCardProps) {
  const [isLiking, setIsLiking] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(person.likes);
  const [liked, setLiked] = useState(person.liked || false);

  const handleLikeClick = async () => {
    setIsLiking(true);
    try {
      await onLike(person.id);
      if (liked) {
        setCurrentLikes(prev => prev - 1);
        setLiked(false);
      } else {
        setCurrentLikes(prev => prev + 1);
        setLiked(true);
      }
    } catch (error) {
      console.error('Error liking story:', error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="group relative bg-card hover:bg-muted border border-border rounded-lg p-6 transition-all duration-300 hover:border-foreground/30 hover:shadow-md">
      <div className="relative z-10">
        {/* Header with avatar and name */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="w-12 h-12 bg-foreground rounded-full mb-3 flex items-center justify-center text-lg font-bold text-background overflow-hidden border border-border">
              {person.avatar ? (
                <img src={person.avatar} alt={person.name} className="w-full h-full object-cover" />
              ) : (
                person.name.charAt(0)
              )}
            </div>
            <h3 className="text-xl font-bold text-foreground">{person.name}</h3>
          </div>
          <button
            onClick={handleLikeClick}
            disabled={isLiking}
            className="flex-shrink-0 p-2 rounded-full hover:bg-foreground/10 transition-colors disabled:opacity-50"
          >
            <Heart
              size={24}
              className={`transition-all duration-300 ${liked
                  ? 'fill-foreground stroke-foreground'
                  : 'stroke-foreground/40 hover:stroke-foreground'
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
            <div className="h-px flex-grow bg-foreground/20"></div>
            <ArrowRight size={16} className="mx-2 text-foreground/40" />
            <div className="h-px flex-grow bg-foreground/20"></div>
          </div>

          {/* After */}
          <div>
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-1">
              Now:
            </p>
            <p className="text-sm font-bold text-foreground">{person.after}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border my-6"></div>

        {/* Like count and view profile */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart size={16} className="text-foreground" />
            <span className="text-sm font-semibold text-foreground/80">
              {currentLikes} {currentLikes === 1 ? 'like' : 'likes'}
            </span>
          </div>
          <a href={`/story/${person.id}`} className="text-xs font-bold text-foreground hover:text-foreground/70 transition-colors uppercase tracking-wider">
            Full Story →
          </a>
        </div>
      </div>
    </div>
  );
}
