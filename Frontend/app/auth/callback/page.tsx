'use client';
import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

function CallbackHandler() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const me = await api.getMe();
      if (me?.success) router.push('/dashboard');
      else router.push('/login');
    })();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Signing you in...</p>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Signing you in...</p>
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  );
}