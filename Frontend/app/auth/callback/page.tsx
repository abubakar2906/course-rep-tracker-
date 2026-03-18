'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');

    if (!code) {
      setError('No authentication code received');
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    fetch('/api/auth/exchange', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ code }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          router.push('/dashboard');
        } else {
          setError(data.error || 'Authentication failed');
          setTimeout(() => router.push('/login'), 2000);
        }
      })
      .catch(() => {
        setError('Authentication failed');
        setTimeout(() => router.push('/login'), 2000);
      });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-muted-foreground">
        {error || 'Completing login...'}
      </p>
      {error && (
        <p className="text-sm text-red-500">Redirecting to login...</p>
      )}
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  );
}