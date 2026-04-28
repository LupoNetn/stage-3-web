'use client';

import { useEffect, useState } from 'react';

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
          headers: { 'X-API-Version': '1' },
          credentials: 'include'
        });
        const data = await res.json();
        setUser(data.data);
      } catch (err) {
        console.error('Failed to fetch user:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="p-16 flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-white/5 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-16 max-w-5xl mx-auto space-y-16">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
          User Settings
        </div>
        <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-gradient">Account</h1>
        <p className="text-zinc-500 font-light text-lg">Control your identity and security authorization.</p>
      </header>

      <div className="space-y-12 animate-entrance">
        <section className="glass-panel rounded-[56px] border border-white/5 overflow-hidden shadow-2xl">
          <div className="px-10 md:px-14 py-10 border-b border-white/5 bg-white/[0.02]">
            <h2 className="text-xl font-bold tracking-tight">Access Credentials</h2>
          </div>
          <div className="p-10 md:p-14 flex flex-col md:flex-row items-center gap-12">
            <div className="w-40 h-40 rounded-[48px] bg-gradient-to-tr from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center text-5xl font-bold shadow-2xl relative group overflow-hidden">
               <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity shimmer"></div>
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 w-full space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-600 px-1">Network Alias</label>
                  <div className="px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-lg font-bold tracking-tight">
                    {user?.username}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-600 px-1">Identity Endpoint</label>
                  <div className="px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-lg font-bold tracking-tight truncate">
                    {user?.email || 'unmapped@node.local'}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                 <div className="space-y-3">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-600 px-1">Authorization Clearance</label>
                  <div className="px-8 py-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-[10px] font-bold uppercase tracking-[0.4em] text-blue-400 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    {user?.role}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-600 px-1">Biometric Token Hash</label>
                  <div className="px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-mono text-zinc-600 break-all leading-relaxed">
                    {user?.id}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="glass-panel rounded-[56px] border border-white/5 overflow-hidden">
           <div className="px-10 md:px-14 py-10 border-b border-white/5 bg-white/[0.02]">
            <h2 className="text-xl font-bold tracking-tight">Encryption & Privacy</h2>
          </div>
          <div className="p-10 md:p-14 space-y-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group p-8 rounded-[32px] hover:bg-white/[0.02] transition-all border border-transparent hover:border-white/5">
              <div className="space-y-2">
                <h4 className="text-xl font-bold tracking-tight">OAuth2 Identity Synchronization</h4>
                <p className="text-sm text-zinc-500 font-light">Your session is currently synchronized with GitHub IAM.</p>
              </div>
              <span className="px-6 py-2 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-[0.3em] shadow-2xl">Linked</span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group p-8 rounded-[32px] hover:bg-white/[0.02] transition-all border border-transparent hover:border-white/5">
              <div className="space-y-2">
                <h4 className="text-xl font-bold tracking-tight">Cryptographic Cookies</h4>
                <p className="text-sm text-zinc-500 font-light">All authorization tokens are encrypted and strictly HTTP-only.</p>
              </div>
              <span className="px-6 py-2 rounded-full border border-white/10 text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em]">Hardware Secured</span>
            </div>
          </div>
        </section>

        <footer className="pt-12 text-center">
           <div className="inline-flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.5em] text-zinc-800">
             <span className="w-10 h-px bg-zinc-900"></span>
             Insighta Labs+ Security v3.0.4
             <span className="w-10 h-px bg-zinc-900"></span>
           </div>
        </footer>
      </div>
    </div>
  );
}
