'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profiles/search?q=${encodeURIComponent(query)}`, {
        headers: { 'X-API-Version': '1' },
        credentials: 'include'
      });
      const data = await res.json();
      setResults(data.data || []);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-12 max-w-5xl mx-auto space-y-12 md:space-y-16">
      <header className="text-center space-y-2">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Search</h1>
        <p className="text-zinc-500 text-sm md:text-base">Find profiles using natural language queries.</p>
      </header>

      <div className="max-w-2xl mx-auto space-y-6">
        <form onSubmit={handleSearch} className="relative">
          <input 
            type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. adult males from nigeria"
            className="w-full h-16 md:h-20 bg-white/5 border border-white/10 rounded-2xl px-6 md:px-8 text-lg md:text-xl focus:outline-none focus:border-white/20 transition-all font-medium"
          />
          <button 
            type="submit" disabled={loading}
            className="absolute right-3 top-3 bottom-3 px-6 rounded-xl bg-white text-black font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? '...' : 'Search'}
          </button>
        </form>
        
        <div className="flex flex-wrap gap-2 justify-center">
          {['Young males', 'Adult females', 'UK Senior'].map((suggestion) => (
            <button 
              key={suggestion} onClick={() => setQuery(suggestion)}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-all"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {hasSearched && (
        <div className="space-y-6">
          <h2 className="text-xs font-bold text-zinc-600 uppercase tracking-widest text-center">
            Results ({results.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.length > 0 ? (
              results.map((profile) => (
                <Link 
                  key={profile.id} href={`/profiles/${profile.id}`}
                  className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center gap-4 hover:bg-white/[0.02] transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center font-bold text-lg border border-white/10">
                    {profile.name[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold">{profile.name}</h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                      {profile.gender} • {profile.age} yrs • {profile.country_id}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-20 text-center glass-panel rounded-2xl border border-white/5 text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                No results found for "{query}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
