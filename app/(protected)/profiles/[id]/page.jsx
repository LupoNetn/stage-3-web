'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfileDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profiles/${id}`, {
          headers: { 'X-API-Version': '1' },
          credentials: 'include'
        });
        if (res.status === 404) {
          router.push('/profiles');
          return;
        }
        const data = await res.json();
        setProfile(data.data);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, router]);

  if (loading) {
    return (
      <div className="p-16 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="p-4 md:p-12 max-w-4xl mx-auto space-y-6 md:space-y-8">
      <Link 
        href="/profiles"
        className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-all font-bold text-[10px] uppercase tracking-widest"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to List
      </Link>

      <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden">
        <header className="p-8 md:p-12 bg-white/[0.02] border-b border-white/5 flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-4xl md:text-5xl font-bold shadow-xl">
            {profile.name[0]}
          </div>
          
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{profile.name}</h1>
            <p className="text-zinc-600 font-mono text-[10px] md:text-xs">{profile.id}</p>
          </div>
        </header>

        <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          <section className="space-y-6">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-700 border-b border-white/5 pb-2">Details</h3>
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-1">
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Gender</p>
                  <p className="font-bold capitalize">{profile.gender}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Age Group</p>
                  <p className="font-bold capitalize">{profile.age_group}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Age</p>
                  <p className="font-bold">{profile.age} Yrs</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Confidence</p>
                  <p className="font-bold text-green-500">{(profile.gender_probability * 100).toFixed(0)}%</p>
               </div>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-700 border-b border-white/5 pb-2">Location</h3>
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Country</p>
                  <p className="font-bold">{profile.country_name}</p>
               </div>
               <div className="flex justify-between items-center">
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">ISO Code</p>
                  <p className="text-xs font-mono text-zinc-500">{profile.country_id}</p>
               </div>
               <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                     <span>Reliability</span>
                     <span>{(profile.country_probability * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                     <div 
                        className="h-full bg-white rounded-full transition-all duration-1000" 
                        style={{ width: `${profile.country_probability * 100}%` }}
                     ></div>
                  </div>
               </div>
            </div>
          </section>
        </div>

        <footer className="px-8 py-8 md:px-12 bg-white/[0.01] border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-700">
            Created: {new Date(profile.created_at).toLocaleDateString()}
          </p>
          <div className="flex gap-3 w-full sm:w-auto">
             <button className="flex-1 sm:flex-none h-10 px-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-bold uppercase tracking-widest transition-all">
              Export
            </button>
            <button className="flex-1 sm:flex-none h-10 px-6 rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-black border border-red-500/20 text-[10px] font-bold uppercase tracking-widest transition-all">
              Flag
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
