'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      language: (form.elements.namedItem('language') as HTMLSelectElement).value,
    };

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) setStatus('success');
      else setStatus('error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <Image src="/images/logo-placeholder.svg" alt="MVVCSO" width={160} height={40} className="mx-auto mb-4" />
          </Link>
          <h1 className="text-2xl font-bold text-(--text-primary)">Join the Community</h1>
          <p className="text-sm text-(--text-secondary) mt-1">Create your MVVCSO resident account</p>
        </div>

        {status === 'success' ? (
          <div className="bg-white rounded-xl p-8 border border-stone-200 text-center">
            <h2 className="text-lg font-semibold text-(--text-primary) mb-2">Check Your Email</h2>
            <p className="text-sm text-(--text-secondary)">We sent a verification link. Click it to complete your registration.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 border border-stone-200 space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-(--text-primary) mb-1">Name</label>
              <input id="name" name="name" required className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-50 text-(--text-primary) focus:outline-none focus:border-gold-400" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-(--text-primary) mb-1">Email</label>
              <input id="email" name="email" type="email" required className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-50 text-(--text-primary) focus:outline-none focus:border-gold-400" />
            </div>
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-(--text-primary) mb-1">Preferred Language</label>
              <select id="language" name="language" className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-50 text-(--text-primary) focus:outline-none focus:border-gold-400">
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>

            {status === 'error' && <p className="text-red-600 text-sm">Registration failed. Please try again.</p>}

            <button type="submit" disabled={status === 'loading'}
              className="w-full px-6 py-3 rounded-lg bg-gold-400 text-white font-semibold hover:bg-gold-500 transition-colors disabled:opacity-60">
              {status === 'loading' ? 'Creating Account...' : 'Create Account'}
            </button>

            <p className="text-center text-sm text-(--text-muted)">
              Already have an account? <Link href="/admin/login" className="text-gold-400 hover:underline">Sign in</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
