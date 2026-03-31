'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';

export function ContactForm() {
  const t = useTranslations('contact');
  const locale = useLocale();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value || undefined,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
      language: locale,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-white rounded-xl p-8 border border-stone-200 text-center">
        <p className="text-lg font-medium text-(--text-primary)">{t('success')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-sm border border-stone-200 space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-(--text-primary) mb-1">
          {t('name_label')}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-100 text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:border-gold-400"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-(--text-primary) mb-1">
          {t('email_label')}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-100 text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:border-gold-400"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-(--text-primary) mb-1">
          {t('phone_label')}
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-100 text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:border-gold-400"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-(--text-primary) mb-1">
          {t('message_label')}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-100 text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:border-gold-400 resize-y"
        />
      </div>

      {status === 'error' && (
        <p className="text-red-700 text-sm">{t('error')}</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full px-6 py-3 rounded-lg bg-gold-400 text-white font-semibold hover:bg-gold-500 transition-colors disabled:opacity-60"
      >
        {status === 'loading' ? t('sending') : t('submit')}
      </button>
    </form>
  );
}
