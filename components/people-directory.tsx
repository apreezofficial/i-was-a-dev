'use client';

import { useState, useEffect } from 'react';
import PersonCard from './person-card';

interface Person {
  id: string;
  name: string;
  before: string;
  after: string;
  likes: number;
  liked?: boolean;
}

const API_BASE = 'https://api.preciousadedokun.com.ng/iwasadev';

export default function PeopleDirectory() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch people from backend
  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await fetch(`${API_BASE}/get-all`);
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
          setPeople(peopleWithLikes);
        }
      } catch (error) {
        console.error('Error fetching people:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPeople();
  }, []);

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
        alert(data.error || 'You have already liked this story');
      }
    } catch (error) {
      console.error('Error liking story:', error);
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl sm:text-6xl font-black text-foreground">
            Listing
          </h2>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-foreground/60">Loading stories...</p>
          </div>
        ) : people.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-foreground/60">No stories found. Be the first to register!</p>
          </div>
        ) : (
          /* People grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {people.map((person) => (
              <PersonCard
                key={person.id}
                person={person}
                onLike={handleLike}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
