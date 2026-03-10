'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Signing you in...</p>
    </div>
  );
}