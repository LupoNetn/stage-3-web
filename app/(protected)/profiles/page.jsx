'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    gender: '', country: '', ageGroup: '', sortBy: 'created_at', order: 'desc'
  });

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        gender: filters.gender,
        country: filters.country,
        age_group: filters.ageGroup,
        sort_by: filters.sortBy,
        order: filters.order
      });
      const data = await apiRequest(`/api/profiles?${params}`);
      setProfiles(data.data || []);
      setTotalPages(data.total_pages || 1);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfiles(); }, [page, filters]);

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setPage(1);
  };

  return (
    <div className="p-4 md:p-12 max-w-6xl mx-auto space-y-6 md:space-y-10">
      <header className="space-y-1">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Profiles</h1>
        <p className="text-zinc-500 text-sm">Browse and filter registered profiles.</p>
      </header>

      {/* Responsive Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <input 
          type="text" name="country" placeholder="Country (e.g. NG)"
          value={filters.country} onChange={handleFilterChange}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/20 transition-all"
        />
        <select 
          name="gender" value={filters.gender} onChange={handleFilterChange}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none"
        >
          <option value="" className="bg-zinc-900">All Genders</option>
          <option value="male" className="bg-zinc-900">Male</option>
          <option value="female" className="bg-zinc-900">Female</option>
        </select>
        <select 
          name="ageGroup" value={filters.ageGroup} onChange={handleFilterChange}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none"
        >
          <option value="" className="bg-zinc-900">All Ages</option>
          <option value="child" className="bg-zinc-900">Child</option>
          <option value="teenager" className="bg-zinc-900">Teenager</option>
          <option value="adult" className="bg-zinc-900">Adult</option>
          <option value="senior" className="bg-zinc-900">Senior</option>
        </select>
        <select 
          name="sortBy" value={filters.sortBy} onChange={handleFilterChange}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none"
        >
          <option value="created_at" className="bg-zinc-900">Newest First</option>
          <option value="age" className="bg-zinc-900">Sort by Age</option>
        </select>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="py-20 text-center animate-pulse text-zinc-600 text-xs font-bold uppercase tracking-widest">Loading...</div>
        ) : profiles.length > 0 ? (
          <>
            {/* Desktop List */}
            <div className="hidden sm:block overflow-hidden border border-white/5 rounded-2xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-zinc-500 font-bold uppercase text-[10px] tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Gender</th>
                    <th className="px-6 py-4">Age</th>
                    <th className="px-6 py-4">Country</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {profiles.map(p => (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-bold">{p.name}</td>
                      <td className="px-6 py-4 capitalize">{p.gender}</td>
                      <td className="px-6 py-4">{p.age} yrs</td>
                      <td className="px-6 py-4">{p.country_name}</td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/profiles/${p.id}`} className="text-zinc-500 hover:text-white transition-colors">View Details</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile List */}
            <div className="sm:hidden space-y-3">
              {profiles.map(p => (
                <Link key={p.id} href={`/profiles/${p.id}`} className="block glass-panel p-5 rounded-2xl space-y-3 active:scale-[0.98] transition-all">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold">{p.name}</h3>
                    <span className="text-[10px] font-bold uppercase text-zinc-500">{p.gender}</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-600">
                    <span>{p.country_name}</span>
                    <span>{p.age} Yrs</span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="py-20 text-center glass-panel rounded-2xl border border-white/5 text-zinc-600 text-xs font-bold uppercase tracking-widest">No profiles found</div>
        )}
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-white/5">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="text-[10px] font-bold uppercase tracking-widest disabled:opacity-20">Prev</button>
        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Page {page} / {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="text-[10px] font-bold uppercase tracking-widest disabled:opacity-20">Next</button>
      </div>
    </div>
  );
}
