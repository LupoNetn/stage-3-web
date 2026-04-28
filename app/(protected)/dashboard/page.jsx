'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:7000/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // This is critical to send the HTTP-only cookies
          credentials: 'include',
        });

        if (res.status === 401) {
          router.push('/');
          return;
        }

        const data = await res.json();
        if (data.status === 'success') {
          setUser(data.data);
        } else {
          router.push('/');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background text-white p-8">
      <div className="fixed inset-0 mesh-gradient opacity-20 pointer-events-none"></div>
      
      <main className="relative z-10 max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">
              Insignia Dashboard
            </h1>
            <p className="text-muted-text mt-1">Welcome back, {user?.username || 'Analyst'}.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center font-bold">
              U
            </div>
            <button 
              onClick={() => router.push('/')}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium border border-white/10"
            >
              Sign Out
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <h3 className="text-sm font-medium text-muted-text uppercase tracking-widest mb-4">Total Profiles</h3>
            <div className="text-4xl font-bold">1,284</div>
            <div className="mt-2 text-xs text-green-400">+12% from last month</div>
          </div>
          
          <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <h3 className="text-sm font-medium text-muted-text uppercase tracking-widest mb-4">Active Sessions</h3>
            <div className="text-4xl font-bold">42</div>
            <div className="mt-2 text-xs text-blue-400">Stable connectivity</div>
          </div>
          
          <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <h3 className="text-sm font-medium text-muted-text uppercase tracking-widest mb-4">API Requests</h3>
            <div className="text-4xl font-bold">8.4k</div>
            <div className="mt-2 text-xs text-purple-400">Within quota limits</div>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
          <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10 bg-white/5 font-medium text-sm">
              Authentication Logs
            </div>
            <div className="p-6 text-sm text-muted-text">
              <p>Your GitHub authentication was successful. Redirected to dashboard.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
