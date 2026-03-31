'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export function NewsletterSection() {
  const t = useTranslations('home');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'homepage' }),
      });
      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className="py-(--section-padding) bg-gold-200/30">
      <div className="max-w-2xl mx-auto px-(--container-padding) text-center">
        <h2 className="text-3xl font-bold mb-2 text-(--text-primary)">
          {t('newsletter_title')}
        </h2>
        <p className="text-(--text-secondary) mb-6">
          {t('newsletter_subtitle')}
        </p>

        {status === 'success' ? (
          <p className="text-(--text-primary) font-medium py-3">
            {t('newsletter_success')}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('newsletter_placeholder')}
              className="flex-1 px-4 py-3 rounded-lg border border-stone-300 bg-white text-(--text-primary) placeholder:text-(--text-muted)"
              required
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3 rounded-lg bg-gold-400 text-white font-semibold hover:bg-gold-500 transition-colors disabled:opacity-60"
            >
              {status === 'loading' ? '...' : t('newsletter_button')}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="text-red-700 text-sm mt-3">
            {t('newsletter_error', { defaultValue: 'Something went wrong. Please try again.' })}
          </p>
        )}
      </div>
    </section>
  );
}
