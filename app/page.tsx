import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-white selection:bg-white/10">
      {/* Background Layer */}
      <div className="fixed inset-0 mesh-gradient pointer-events-none"></div>

      {/* Nav */}
      <nav className="h-24 flex items-center justify-between px-10 md:px-20 relative z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-white/10">
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">Insighta Labs+</span>
        </div>
        <Link href="/login" className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-all font-medium text-sm">
          Log in
        </Link>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-20 pb-40 px-6">
        <div className="max-w-4xl text-center animate-entrance">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-[11px] font-bold uppercase tracking-widest mb-10">
            Platform Update v3.0
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-gradient mb-10 leading-[1.1]">
            Security for the <br /> modern intelligence team.
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto mb-14 leading-relaxed font-light">
            Unified authentication, identity ownership, and role-based permissions. 
            The secure standard for Insighta Labs+ across all interfaces.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <Link href="/login" className="btn-glow h-16 px-10 rounded-2xl flex items-center justify-center gap-3 text-lg font-bold">
              Enter Portal
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 max-w-6xl w-full">
          {[
            { title: 'Identity', desc: 'Secure PKCE flow with GitHub OAuth.' },
            { title: 'Roles', desc: 'Granular access control for analysts.' },
            { title: 'Sync', desc: 'Real-time state between CLI and Web.' }
          ].map((item, i) => (
            <div key={i} className="glass-panel p-10 rounded-[32px] group hover:scale-[1.02] transition-all">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-zinc-500 leading-relaxed text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 px-10 md:px-20 relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="text-zinc-600 text-sm">
          &copy; 2026 Insighta Labs+. Secure by Design.
        </div>
        <div className="flex gap-10 text-zinc-700 text-sm font-medium uppercase tracking-widest">
          <Link href="#" className="hover:text-white transition-colors">Security</Link>
          <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-white transition-colors">Status</Link>
        </div>
      </footer>
    </div>
  );
}
