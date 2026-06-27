'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import PersonCard from './person-card';

interface Person {
  id: string;
  name: string;
  before: string;
  after: string;
  story?: string;
  avatar?: string;
  likes: number;
  liked?: boolean;
}

const API_BASE = 'https://api.preciousadedokun.com.ng/iwasadev';

export default function PeopleDirectory() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    limit: 25
  });

  // Fetch people from backend
  const fetchPeople = async (pageNum: number, append = false) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/get-all?page=${pageNum}&limit=25`);
      const data = await response.json();
      if (data.success) {
        // Check which ones are liked by this device
        const peopleWithLikes = await Promise.all(
          data.data.map(async (person: Person) => {
            const likeCheckResponse = await fetch(
              `${API_BASE}/check-like?person_id=${person.id}`
            );
            const likeData = await likeCheckResponse.json();
            return {
              ...person,
              liked: likeData.liked || false,
            };
          })
        );

        let newPeople = peopleWithLikes;
        if (append) {
          newPeople = [...people, ...peopleWithLikes];
        }

        setPeople(newPeople);
        const newPagination = {
          total: Math.max(data.pagination.total, newPeople.length),
          totalPages: data.pagination.total_pages,
          limit: data.pagination.limit
        };
        setPagination(newPagination);

        // Cache the first page
        if (pageNum === 1) {
          localStorage.setItem('iwasadev_cache_people', JSON.stringify(peopleWithLikes));
          localStorage.setItem('iwasadev_cache_pagination', JSON.stringify(newPagination));
          localStorage.setItem('iwasadev_cache_time', Date.now().toString());
        }
      }
    } catch (error) {
      console.error('Error fetching people:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Try to load from cache first
    const cachedPeople = localStorage.getItem('iwasadev_cache_people');
    const cachedPagination = localStorage.getItem('iwasadev_cache_pagination');
    const cachedTime = localStorage.getItem('iwasadev_cache_time');

    // Cache is valid for 5 minutes
    if (cachedPeople && cachedPagination && cachedTime && (Date.now() - parseInt(cachedTime) < 5 * 60 * 1000)) {
      setPeople(JSON.parse(cachedPeople));
      setPagination(JSON.parse(cachedPagination));
      setLoading(false);
      // Still fetch in background to sync
      fetchPeople(1);
    } else {
      fetchPeople(1);
    }
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPeople(nextPage, true);
  };

  const handleLike = async (id: string) => {
    const person = people.find(p => p.id === id);
    if (!person) return;

    try {
      const endpoint = person.liked ? 'unlike' : 'like';
      const response = await fetch(`${API_BASE}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ person_id: id }),
      });

      const data = await response.json();
      if (data.success) {
        setPeople(
          people.map((p) =>
            p.id === id
              ? { ...p, liked: !p.liked, likes: data.likes }
              : p
          )
        );
      } else if (response.status === 400) {
        toast.error(data.error || 'You\'ve already liked this story');
      }
    } catch (error) {
      console.error('Error liking story:', error);
    }
  };

  return (
    <section id="listing" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="text-left">
            <p className="text-primary font-black uppercase tracking-widest text-xs mb-2">The Directory</p>
            <h2 className="text-6xl sm:text-8xl font-black text-foreground leading-[0.8]">
              Listing
            </h2>
          </div>

          <div className="bg-muted px-6 py-3 rounded-2xl border border-border">
            <p className="text-sm font-bold text-foreground/60">
              Showing <span className="text-foreground">{people.length}</span> out of <span className="text-foreground">{pagination.total}</span> stories
            </p>
          </div>
        </div>

        {/* Loading state (initial) */}
        {loading && people.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded-2xl border border-border" />
            ))}
          </div>
        ) : people.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-[3rem] border-2 border-dashed border-border">
            <p className="text-2xl font-bold text-foreground/40 mb-4">No stories found yet.</p>
            <p className="text-foreground/30">Be the first to share your transition from code to life!</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* People grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {people.map((person) => (
                <PersonCard
                  key={person.id}
                  person={person}
                  onLike={handleLike}
                />
              ))}
            </div>

            {/* Pagination / Load More */}
            {page < pagination.totalPages && (
              <div className="flex justify-center pt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="group relative px-12 py-4 bg-muted hover:bg-card border-2 border-border rounded-2xl transition-all disabled:opacity-50 overflow-hidden"
                >
                  <div className="relative z-10 flex items-center gap-3">
                    {loading && <div className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin" />}
                    <span className="text-lg font-black text-foreground">
                      {loading ? 'Crunching stories...' : 'Load More Experiences'}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
