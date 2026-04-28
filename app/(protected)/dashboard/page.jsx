'use client';

import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, loading: true });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profiles?limit=1&page=1`, {
          headers: { 'X-API-Version': '1' },
          credentials: 'include'
        });
        const data = await res.json();
        setStats({ total: data.total || 0, loading: false });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        setStats({ total: 0, loading: false });
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-4 md:p-12 max-w-6xl mx-auto space-y-8 md:space-y-12">
      <header className="space-y-1">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-zinc-500 text-sm md:text-base">Quick overview of your Insighta portal metrics.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[
          { label: 'Total Profiles', value: stats.loading ? '...' : stats.total.toLocaleString(), detail: 'All registered users' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5 space-y-2">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl md:text-4xl font-bold">{stat.value}</p>
            <p className="text-[10px] text-zinc-600 font-medium">{stat.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-4">
          <h2 className="text-xl font-bold">About Insighta</h2>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Insighta is your central platform for managing and searching profiles. 
            All data is synchronized in real-time with the secure backend API.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col justify-center items-center text-center space-y-4">
           <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-black">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
           </div>
           <h3 className="text-lg font-bold">Manage Data</h3>
           <p className="text-zinc-500 text-xs">Navigate to the profiles page to view or filter entries.</p>
        </div>
      </div>
    </div>
  );
}
