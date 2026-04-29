'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/context/ToastContext';

function CallbackHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');

      if (code) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/github/callback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, state }),
            credentials: 'include',
          });

          const data = await res.json();
          if (data.status === 'success') {
            addToast('Access Granted. Welcome back.', 'success');
            setTimeout(() => {
              router.push('/dashboard');
            }, 1000);
          } else {
            setError(data.message || 'Authentication failed');
            addToast(data.message || 'Authentication failed', 'error');
          }
        } catch (err) {
          console.error('Error during callback:', err);
          setError('Failed to connect to authentication server.');
          addToast('Network error: Could not reach authentication server.', 'error');
        }
      } else {
        setError('No authentication code found.');
      }
    };

    handleCallback();
  }, [searchParams, router, addToast]);

  if (error) {
    return (
      <div className="text-center p-8 glass-panel rounded-2xl">
        <h1 className="text-xl font-bold text-red-500 mb-2">Auth Error</h1>
        <p className="text-zinc-500 text-xs uppercase tracking-widest">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative z-10 text-center">
      <div className="w-10 h-10 border-2 border-white/10 border-t-white rounded-full animate-spin mx-auto mb-6"></div>
      <h1 className="text-lg font-bold tracking-tight uppercase tracking-[0.2em]">Authenticating</h1>
      <p className="text-zinc-600 text-[10px] mt-2 uppercase tracking-widest">Finalizing secure session...</p>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
      <div className="fixed inset-0 mesh-gradient opacity-10"></div>
      <Suspense fallback={
        <div className="w-10 h-10 border-2 border-white/10 border-t-white rounded-full animate-spin"></div>
      }>
        <CallbackHandler />
      </Suspense>
    </div>
  );
}
