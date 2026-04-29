'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';

export default function ProtectedLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await apiRequest('/auth/me');
        setUser(data.data);
      } catch (err) {
        // apiRequest handles redirect on refresh failure
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Profiles', href: '/profiles', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { name: 'Search', href: '/search', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
    { name: 'Account', href: '/account', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row overflow-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 mesh-gradient opacity-10 pointer-events-none z-0"></div>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 border-r border-white/5 flex-col fixed inset-y-0 z-50 bg-black">
        <div className="h-20 flex items-center px-6">
          <span className="font-bold text-xl tracking-tight">Insighta Portal</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm ${
                  isActive ? 'bg-white text-black' : 'text-zinc-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                </svg>
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center font-bold text-xs">
              {user?.username?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{user?.username}</p>
              <p className="text-[10px] text-zinc-500 uppercase">{user?.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 md:ml-64 pb-24 md:pb-0 relative z-10 w-full overflow-y-auto max-h-screen custom-scrollbar">
        {children}
      </main>

      {/* Bottom Nav - Mobile */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 h-16 bg-zinc-900/90 backdrop-blur-xl rounded-2xl border border-white/10 z-[100] flex items-center justify-around px-2 shadow-2xl">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
                isActive ? 'bg-white text-black' : 'text-zinc-500'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
              </svg>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
