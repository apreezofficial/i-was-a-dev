'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import PersonCard from './person-card';

interface Person {
  id: string;
  name: string;
  before: string;
  after: string;
  likes: number;
  liked: boolean;
}

// Mock data - will be replaced with real backend data
const mockPeople: Person[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    before: 'Full-Stack Developer (10 yrs)',
    after: 'Product Manager @ Tech Startup',
    likes: 234,
    liked: false,
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    before: 'Backend Engineer',
    after: 'Founder - SaaS Company',
    likes: 189,
    liked: false,
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    before: 'React Developer',
    after: 'UX Designer & Design Lead',
    likes: 312,
    liked: false,
  },
  {
    id: '4',
    name: 'David Kim',
    before: 'DevOps Engineer',
    after: 'Solutions Architect',
    likes: 156,
    liked: false,
  },
  {
    id: '5',
    name: 'Sophie Laurent',
    before: 'Frontend Developer',
    after: 'Content Creator & Tech Writer',
    likes: 421,
    liked: false,
  },
  {
    id: '6',
    name: 'James Wilson',
    before: 'Senior Developer',
    after: 'Business Consultant',
    likes: 198,
    liked: false,
  },
];

export default function PeopleDirectory() {
  const [people, setPeople] = useState<Person[]>(mockPeople);

  const handleLike = (id: string) => {
    setPeople(
      people.map((person) =>
        person.id === id
          ? {
              ...person,
              liked: !person.liked,
              likes: person.liked ? person.likes - 1 : person.likes + 1,
            }
          : person
      )
    );
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl sm:text-6xl font-black mb-6 text-foreground">
            Listing
          </h2>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-3 justify-center mb-12 flex-wrap">
          {['All', 'Founder', 'Manager', 'Designer', 'Consultant'].map(
            (filter) => (
              <button
                key={filter}
                className="px-6 py-2 rounded-full border border-foreground/30 text-sm font-semibold hover:bg-foreground/5 transition-colors text-foreground"
              >
                {filter}
              </button>
            )
          )}
        </div>

        {/* People grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {people.map((person) => (
            <PersonCard
              key={person.id}
              person={person}
              onLike={() => handleLike(person.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
