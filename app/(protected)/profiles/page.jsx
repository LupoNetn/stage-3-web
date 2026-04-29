'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import { useToast } from '@/context/ToastContext';

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userRole, setUserRole] = useState('analyst');
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [filters, setFilters] = useState({
    gender: '', country: '', ageGroup: '', sortBy: 'created_at', order: 'desc'
  });
  
  const { addToast } = useToast();

  const fetchUser = async () => {
    try {
      const data = await apiRequest('/auth/me');
      setUserRole(data.data.role);
    } catch (err) {}
  };

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

  useEffect(() => { 
    fetchUser();
    fetchProfiles(); 
  }, [page, filters]);

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setPage(1);
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        format: 'csv',
        gender: filters.gender,
        country: filters.country,
        age_group: filters.ageGroup
      });
      
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${baseUrl}/api/profiles/export?${params}`, {
        headers: { 'X-API-Version': '1' },
        credentials: 'include'
      });
      
      if (!res.ok) throw new Error('Export failed');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `profiles_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      addToast('Export successful!', 'success');
    } catch (err) {
      addToast('Export failed', 'error');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      await apiRequest('/api/profiles', {
        method: 'POST',
        body: JSON.stringify({ name: newName })
      });
      addToast('Profile created successfully', 'success');
      setNewName('');
      setShowCreate(false);
      fetchProfiles();
    } catch (err) {
      addToast('Failed to create profile', 'error');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-4 md:p-12 max-w-6xl mx-auto space-y-6 md:space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <header className="space-y-1">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gradient">Profiles</h1>
          <p className="text-zinc-500 text-sm">Browse and filter registered profiles.</p>
        </header>
        
        <div className="flex gap-3">
           {userRole === 'admin' && (
             <button 
              onClick={() => setShowCreate(!showCreate)}
              className="px-6 py-3 rounded-xl bg-white text-black font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
             >
               {showCreate ? 'Cancel' : 'Create Profile'}
             </button>
           )}
           <button 
            onClick={handleExport}
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 font-bold text-sm hover:bg-white/10 transition-all"
           >
             Export CSV
           </button>
        </div>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="glass-panel p-8 rounded-3xl border border-white/5 animate-slide-up space-y-4">
          <h2 className="text-lg font-bold">Register New Profile</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
              placeholder="Full Name (e.g. Harriet Tubman)"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/20"
            />
            <button 
              type="submit" disabled={creating}
              className="px-8 py-3 bg-white text-black rounded-xl font-bold text-sm disabled:opacity-50"
            >
              {creating ? 'Processing...' : 'Register'}
            </button>
          </div>
        </form>
      )}

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
