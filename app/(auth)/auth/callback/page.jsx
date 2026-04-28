'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');

      if (code) {
        // For now, just logging the code to verify the redirect works.
        // To fully log in, you'll need the HandleGithubWebAuth backend endpoint.
        console.log('GitHub Code:', code);
        console.log('State:', state);

        try {
          const res = await fetch('http://localhost:7000/auth/github/callback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              code,
              state,
            }),
            credentials: 'include',
          });

          const data = await res.json();
          console.log(data);
          
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        } catch (err) {
          console.error('Error during callback:', err);
          setError('Failed to authenticate with backend.');
        }
      } else {
        setError('No authentication code found.');
      }
    };

    handleCallback();
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-white">
        <div className="text-center p-8 glass-panel rounded-2xl">
          <h1 className="text-xl font-bold text-red-500 mb-2">Redirect Error</h1>
          <p className="text-muted-text">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-white">
      <div className="fixed inset-0 mesh-gradient opacity-30"></div>
      <div className="relative z-10 text-center">
        <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-6"></div>
        <h1 className="text-xl font-bold tracking-tight uppercase tracking-[0.2em]">Redirect Success</h1>
        <p className="text-muted-text text-xs mt-2 uppercase tracking-widest opacity-50">Returning to Insighta Labs+</p>
      </div>
    </div>
  );
}
