'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminVerifyPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'error'>('verifying');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      setStatus('error');
      return;
    }

    // The API route handles verification and sets the session cookie,
    // then redirects to /admin. We just need to navigate to it.
    window.location.href = `/api/auth/verify?token=${token}`;
  }, []);

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-desert-cream px-4">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-(--text-primary) mb-2">Invalid or expired link</h1>
          <p className="text-sm text-(--text-secondary) mb-6">
            This sign-in link is no longer valid. Please request a new one.
          </p>
          <a
            href="/admin/login"
            className="inline-block px-6 py-3 rounded-lg bg-terra-cotta text-white font-semibold hover:bg-terra-cotta-hover transition-colors"
          >
            Back to login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-desert-cream">
      <div className="text-center">
        <div className="text-3xl mb-3 animate-pulse">🔐</div>
        <p className="text-(--text-secondary)">Verifying...</p>
      </div>
    </div>
  );
}
