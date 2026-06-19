'use client';

import { useState, useEffect } from 'react';
import { Heart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Story {
  id: string;
  name: string;
  before: string;
  after: string;
  likes: number;
  created_at: string;
}

const API_BASE = 'https://api.preciousadedokun.com.ng/iwasadev';

export default function StoryPage({ params }: { params: { id: string } }) {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(0);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(`${API_BASE}/get-story?id=${params.id}`);
        const data = await response.json();

        if (data.success) {
          setStory(data.data);
          setCurrentLikes(data.data.likes);

          // Check if already liked
          const likeCheckResponse = await fetch(
            `${API_BASE}/check-like?person_id=${params.id}`
          );
          const likeData = await likeCheckResponse.json();
          setLiked(likeData.liked || false);
        } else {
          setError('Story not found');
        }
      } catch (err) {
        setError('Error loading story');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [params.id]);

  const handleLike = async () => {
    setIsLiking(true);
    try {
      const endpoint = liked ? 'unlike' : 'like';
      const response = await fetch(`${API_BASE}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ person_id: params.id }),
      });

      const data = await response.json();
      if (data.success) {
        setLiked(!liked);
        setCurrentLikes(data.likes);
      } else if (response.status === 400) {
        alert(data.error || 'You have already liked this story');
      }
    } catch (error) {
      console.error('Error liking story:', error);
    } finally {
      setIsLiking(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-background text-foreground min-h-screen flex items-center justify-center">
        <p className="text-foreground/60">Loading...</p>
      </main>
    );
  }

  if (error || !story) {
    return (
      <main className="bg-background text-foreground min-h-screen">
        <header className="border-b border-border sticky top-0 bg-background z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/" className="flex items-center gap-2 text-foreground hover:text-foreground/70">
              <ArrowLeft size={20} />
              Back to Listing
            </Link>
          </div>
        </header>
        <div className="flex items-center justify-center py-20">
          <p className="text-foreground/60">{error || 'Story not found'}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-background text-foreground min-h-screen">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center gap-2 text-foreground hover:text-foreground/70 transition-colors">
            <ArrowLeft size={20} />
            Back to Listing
          </Link>
        </div>
      </header>

      {/* Story Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile section */}
          <div className="border border-border rounded-lg p-8 mb-12">
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="w-16 h-16 bg-foreground rounded-full mb-4 flex items-center justify-center text-2xl font-bold text-background">
                  {story.name.charAt(0)}
                </div>
                <h1 className="text-4xl font-black text-foreground mb-2">{story.name}</h1>
                <p className="text-foreground/60 text-sm">
                  Joined {new Date(story.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={handleLike}
                disabled={isLiking}
                className="flex-shrink-0 p-4 rounded-full hover:bg-foreground/10 transition-colors disabled:opacity-50"
              >
                <Heart
                  size={32}
                  className={`transition-all duration-300 ${
                    liked
                      ? 'fill-foreground stroke-foreground'
                      : 'stroke-foreground/40 hover:stroke-foreground'
                  }`}
                />
              </button>
            </div>

            {/* Career transition */}
            <div className="space-y-6">
              {/* Before */}
              <div className="bg-muted p-6 rounded-lg">
                <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-2">
                  Used to do:
                </p>
                <p className="text-lg font-bold text-foreground">{story.before}</p>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center">
                <div className="h-px flex-grow bg-foreground/20"></div>
                <span className="mx-4 font-bold text-foreground">↓</span>
                <div className="h-px flex-grow bg-foreground/20"></div>
              </div>

              {/* After */}
              <div className="bg-muted p-6 rounded-lg">
                <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-2">
                  Now doing:
                </p>
                <p className="text-lg font-bold text-foreground">{story.after}</p>
              </div>
            </div>

            {/* Like stats */}
            <div className="mt-8 pt-8 border-t border-border flex items-center gap-3">
              <Heart size={20} className="fill-foreground stroke-foreground" />
              <span className="text-lg font-semibold text-foreground">
                {currentLikes} {currentLikes === 1 ? 'person has' : 'people have'} appreciated this story
              </span>
            </div>
          </div>

          {/* Like button section */}
          <div className="text-center mb-12">
            <p className="text-foreground/70 text-sm mb-4">
              {liked ? 'You appreciate this story' : 'Appreciate this story (once per device)'}
            </p>
            <button
              onClick={handleLike}
              disabled={isLiking}
              className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition-colors disabled:opacity-50"
            >
              {liked ? 'Unlike' : 'Like This Story'}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
      </footer>
    </main>
  );
}
