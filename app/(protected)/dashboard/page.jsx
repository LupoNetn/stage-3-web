'use client';

import { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, loading: true });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiRequest('/api/profiles?limit=1&page=1');
        setStats({ total: data.total || 0, loading: false });
      } catch (err) {
        setStats({ total: 0, loading: false });
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-4 md:p-12 max-w-6xl mx-auto space-y-8 md:space-y-12">
      <header className="space-y-1">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gradient">Dashboard</h1>
        <p className="text-zinc-500 text-sm md:text-base">Quick overview of your Insighta portal metrics.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[
          { label: 'Total Profiles', value: stats.loading ? '...' : stats.total.toLocaleString(), detail: 'All registered users' },
          { label: 'System Health', value: '99.9%', detail: 'Backend Uptime' },
          { label: 'Active Region', value: 'Nigeria', detail: 'Top user base' },
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
           </div>
           <h3 className="text-lg font-bold">Secure Access</h3>
           <p className="text-zinc-500 text-xs">Your session is protected by GitHub OAuth and rotating JWT tokens.</p>
        </div>
      </div>
    </div>
  );
}
