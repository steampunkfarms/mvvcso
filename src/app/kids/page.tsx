'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function KidsLandingPage() {
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/kids/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: name, pin }),
      });
      if (res.ok) {
        window.location.href = '/kids/home';
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="min-h-screen bg-gold-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto rounded-full bg-gold-200 flex items-center justify-center text-4xl mb-4">
            🏔️
          </div>
          <h1 className="text-3xl font-bold text-(--text-primary)">Rancheti&apos;s World</h1>
          <p className="text-(--text-secondary) mt-1">Enter your explorer name and secret code!</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white rounded-2xl p-8 border border-gold-200 shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-bold text-(--text-primary) mb-2">Explorer Name</label>
            <input value={name} onChange={e => setName(e.target.value)} required
              placeholder="Your explorer name"
              className="w-full px-4 py-3 rounded-xl border-2 border-gold-200 bg-gold-50 text-(--text-primary) text-center text-lg font-medium placeholder:text-(--text-muted) focus:outline-none focus:border-gold-400" />
          </div>

          <div>
            <label className="block text-sm font-bold text-(--text-primary) mb-2">Secret Code</label>
            <input value={pin} onChange={e => setPin(e.target.value)} required maxLength={6}
              placeholder="••••••" type="password"
              className="w-full px-4 py-3 rounded-xl border-2 border-gold-200 bg-gold-50 text-(--text-primary) text-center text-2xl tracking-[0.5em] font-mono placeholder:text-(--text-muted) focus:outline-none focus:border-gold-400" />
          </div>

          {status === 'error' && (
            <p className="text-red-600 text-sm">Hmm, that doesn&apos;t match. Try again!</p>
          )}

          <button type="submit" disabled={status === 'loading'}
            className="w-full px-6 py-3.5 rounded-xl bg-gold-400 text-white font-bold text-lg hover:bg-gold-500 transition-colors disabled:opacity-60">
            {status === 'loading' ? 'Opening door...' : 'Let&apos;s Explore! 🌵'}
          </button>
        </form>

        <p className="text-sm text-(--text-muted) mt-6">
          Parents: <Link href="/community/profile" className="text-gold-400 hover:underline">Set up a kids account</Link>
          {' · '}
          <Link href="/kids/privacy" className="text-gold-400 hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
