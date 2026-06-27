'use client';

import { useState, useEffect, use, type ReactNode } from 'react';
import { Heart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Story {
  id: string;
  name: string;
  before: string;
  after: string;
  story: string;
  avatar: string;
  likes: number;
  created_at: string;
}

const API_BASE = 'https://api.preciousadedokun.com.ng/iwasadev';

// Inline markdown renderer: handles **bold**, *italic*, `code`, [link](url)
function renderInline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  // Combined regex for bold, italic, inline code, links
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[(.+?)\]\((.+?)\))/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Push preceding plain text
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[2] !== undefined) {
      // **bold**
      parts.push(<strong key={match.index} className="font-black text-foreground">{match[2]}</strong>);
    } else if (match[3] !== undefined) {
      // *italic*
      parts.push(<em key={match.index} className="italic text-foreground/80">{match[3]}</em>);
    } else if (match[4] !== undefined) {
      // `code`
      parts.push(<code key={match.index} className="px-1.5 py-0.5 bg-muted rounded text-sm font-mono text-primary">{match[4]}</code>);
    } else if (match[5] !== undefined && match[6] !== undefined) {
      // [link](url)
      parts.push(<a key={match.index} href={match[6]} target="_blank" rel="noopener noreferrer" className="underline decoration-primary text-primary hover:opacity-80 transition-opacity">{match[5]}</a>);
    }

    lastIndex = match.index + match[0].length;
  }

  // Push remaining plain text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

// Full story markdown renderer
function StoryMarkdown({ content }: { content: string }) {
  const lines = content.split('\n');

  return (
    <div className="space-y-4">
      {lines.map((line, i) => {
        if (line.startsWith('# '))
          return <h1 key={i} className="text-4xl font-black mb-2 mt-8 text-foreground">{renderInline(line.slice(2))}</h1>;
        if (line.startsWith('## '))
          return <h2 key={i} className="text-3xl font-black mb-2 mt-6 text-foreground/90">{renderInline(line.slice(3))}</h2>;
        if (line.startsWith('### '))
          return <h3 key={i} className="text-2xl font-black mb-2 mt-4 text-foreground/80">{renderInline(line.slice(4))}</h3>;
        if (line.startsWith('> '))
          return <blockquote key={i} className="border-l-4 border-primary pl-6 italic my-6 text-foreground/60 bg-primary/5 py-4 rounded-r-xl">{renderInline(line.slice(2))}</blockquote>;
        if (line.startsWith('- '))
          return <li key={i} className="ml-6 mb-1 list-disc">{renderInline(line.slice(2))}</li>;
        if (line.trim() === '')
          return <div key={i} className="h-3" />;

        return <p key={i} className="leading-relaxed">{renderInline(line)}</p>;
      })}
    </div>
  );
}

export default function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(0);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchStory = async () => {
      try {
        const response = await fetch(`${API_BASE}/get-story?id=${id}`);
        const data = await response.json();

        if (data.success) {
          setStory(data.data);
          setCurrentLikes(data.data.likes);

          // Check if already liked
          const likeCheckResponse = await fetch(
            `${API_BASE}/check-like?person_id=${id}`
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
  }, [id]);

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
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-foreground/60 font-bold animate-pulse">Loading Story...</p>
        </div>
      </main>
    );
  }

  if (error || !story) {
    return (
      <main className="bg-background text-foreground min-h-screen">
        <header className="border-b border-border sticky top-0 bg-background z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/" className="flex items-center gap-2 text-foreground hover:text-foreground/70 transition-colors">
              <ArrowLeft size={20} />
              Back to Home
            </Link>
          </div>
        </header>
        <div className="flex flex-col items-center justify-center py-24 text-center px-4">
          <h2 className="text-4xl font-black mb-4">404</h2>
          <p className="text-xl text-foreground/60 mb-8">{error || 'Story not found'}</p>
          <Link href="/" className="px-8 py-3 bg-primary text-primary-foreground font-black rounded-xl">
            Explore Other Stories
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-background text-foreground min-h-screen">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-foreground hover:text-foreground/70 transition-colors font-bold">
            <ArrowLeft size={20} />
            Back
          </Link>
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Live Journey</span>
          </div>
        </div>
      </header>

      {/* Story Content */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Main Card */}
          <div className="bg-card border-2 border-border rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5">
            {/* Profile Header */}
            <div className="p-8 sm:p-12 border-b border-border space-y-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                <div className="w-32 h-32 rounded-[2rem] bg-foreground flex items-center justify-center text-4xl font-black text-background overflow-hidden border-4 border-border shadow-xl rotate-3 sm:rotate-6 hover:rotate-0 transition-transform duration-500">
                  {story.avatar ? (
                    <img src={story.avatar} alt={story.name} className="w-full h-full object-cover" />
                  ) : (
                    story.name.charAt(0)
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left space-y-4">
                  <div>
                    <h1 className="text-4xl sm:text-6xl font-black text-foreground mb-2 leading-tight">{story.name}</h1>
                    <p className="inline-flex items-center gap-2 px-4 py-1.5 bg-muted border border-border rounded-full text-foreground/60 text-xs font-black uppercase tracking-wider">
                      Transitioned {new Date(story.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                    <button
                      onClick={handleLike}
                      disabled={isLiking}
                      className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black transition-all ${liked
                        ? 'bg-primary text-primary-foreground scale-105'
                        : 'bg-muted border border-border text-foreground hover:border-primary/50'
                        }`}
                    >
                      <Heart size={20} className={liked ? 'fill-current' : ''} />
                      <span>{currentLikes} {currentLikes === 1 ? 'Like' : 'Likes'}</span>
                    </button>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link copied to clipboard!');
                      }}
                      className="px-6 py-3 bg-muted border border-border text-foreground font-black rounded-2xl hover:bg-card transition-all"
                    >
                      Share Story
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Transition View */}
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4 py-8 border-t border-b border-border/50">
                <div className="text-center sm:text-right">
                  <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-1">Previously</p>
                  <p className="text-xl font-black text-foreground/80">{story.before}</p>
                </div>
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <ArrowLeft size={24} className="rotate-180" />
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Now</p>
                  <p className="text-xl font-black text-foreground italic underline decoration-primary decoration-4 underline-offset-4">{story.after}</p>
                </div>
              </div>
            </div>

            {/* Long Story Section */}
            <div className="p-8 sm:p-12 bg-muted/30">
              <div className="max-w-2xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-border" />
                  <h2 className="text-center text-xs font-black text-foreground/30 uppercase tracking-[0.4em] whitespace-nowrap">Behind the Screen</h2>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <div className="prose prose-invert max-w-none">
                  {story.story ? (
                    <div className="text-lg sm:text-xl font-medium text-foreground/90 leading-relaxed">
                      <StoryMarkdown content={story.story} />
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-foreground/40 italic font-medium">
                        {(story.name.split(' ')[0] || 'This dev')} hasn&apos;t shared their full story yet, but their transition from {story.before} to {story.after} speaks for itself.
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-12 flex justify-center">
                  <div className="inline-flex flex-col items-center gap-2">
                    <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">End of story</p>
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sharing footer */}
      <footer className="py-24 text-center">
        <div className="max-w-xl mx-auto px-4">
          <h3 className="text-2xl font-black mb-6">Are you also an ex-dev?</h3>
          <p className="text-foreground/60 mb-8 font-medium">Join thousands of others in celebrating the life after code. Your story matters.</p>
          <Link href="/" className="inline-block px-10 py-4 bg-foreground text-background font-black rounded-2xl hover:scale-105 transition-transform">
            Register Your Journey
          </Link>
        </div>
      </footer>
    </main>
  );
}
