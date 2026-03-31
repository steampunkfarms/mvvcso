'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus('sent');
        setMessage(data.message);
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong');
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
          {status === 'sent' ? (
            <div className="text-center py-4">
              <div className="text-3xl mb-3">📧</div>
              <h2 className="text-lg font-semibold text-(--text-primary) mb-2">Check your email</h2>
              <p className="text-sm text-(--text-secondary) leading-relaxed">
                {message}
              </p>
              <button
                type="button"
                onClick={() => { setStatus('idle'); setEmail(''); }}
                className="mt-6 text-sm text-gold-400 hover:text-gold-500 font-medium transition-colors"
              >
                Try a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
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
              {status === 'error' && (
                <p className="text-red-600 text-sm mt-2">{message}</p>
              )}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full mt-4 px-4 py-3 rounded-lg bg-gold-400 text-white font-semibold hover:bg-gold-500 transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? 'Sending...' : 'Send sign-in link'}
              </button>
              <p className="text-xs text-(--text-muted) text-center mt-4">
                Only authorized board members and staff can sign in.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
