'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/auth/password-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/admin');
      } else {
        setStatus('error');
        setMessage(data.error || 'Invalid credentials');
      }
    } catch {
      setStatus('error');
      setMessage('Unable to connect. Please try again.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image
            src="/images/ranchita/yeti-closeup.jpg"
            alt="MVVCSO"
            width={80}
            height={80}
            className="rounded-full mx-auto mb-4 border-2 border-stone-200"
          />
          <h1 className="text-2xl font-bold text-(--text-primary)">MVVCSO Admin</h1>
          <p className="text-sm text-(--text-secondary) mt-1">Board & staff portal</p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-8 shadow-sm">
          <form onSubmit={handlePasswordLogin}>
            <label htmlFor="email" className="block text-sm font-medium text-(--text-primary) mb-2">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoFocus
              className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-stone-100 text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:border-gold-400 transition-colors"
            />
            <label htmlFor="password" className="block text-sm font-medium text-(--text-primary) mb-2 mt-4">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Site password"
              required
              className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-stone-100 text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:border-gold-400 transition-colors"
            />
            {status === 'error' && (
              <p className="text-red-600 text-sm mt-2">{message}</p>
            )}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full mt-4 px-4 py-3 rounded-lg bg-gold-400 text-white font-semibold hover:bg-gold-500 transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? 'Signing in...' : 'Sign in'}
            </button>
            <p className="text-xs text-(--text-muted) text-center mt-4">
              Only authorized board members and staff can sign in.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
