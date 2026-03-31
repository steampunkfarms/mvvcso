'use client';

import { useState } from 'react';

export function RsvpForm({ eventId, isFull }: { eventId: string; isFull: boolean }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');

    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get('name') as string,
      email: form.get('email') as string,
      phone: (form.get('phone') as string) || undefined,
    };

    try {
      const res = await fetch(`/api/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to RSVP');
      }

      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStatus('error');
    }
  }

  if (isFull) {
    return (
      <div className="bg-white rounded-xl border border-sandy-gold p-6 text-center">
        <div className="text-2xl mb-2">🎟️</div>
        <h3 className="font-semibold text-(--text-primary) mb-1">Event is full</h3>
        <p className="text-sm text-(--text-muted)">All spots have been taken. Check back for future events!</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="bg-white rounded-xl border border-sandy-gold p-6 text-center">
        <div className="text-3xl mb-2">✅</div>
        <h3 className="font-semibold text-(--text-primary) mb-1">You&apos;re in!</h3>
        <p className="text-sm text-(--text-muted)">We&apos;ll see you there. Add it to your calendar so you don&apos;t forget!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-sandy-gold p-6">
      <h3 className="font-semibold text-(--text-primary) mb-4">RSVP</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="rsvp-name" className="block text-sm font-medium text-(--text-primary) mb-1">Name *</label>
          <input
            id="rsvp-name"
            name="name"
            required
            className="w-full px-3 py-2 rounded-lg border border-sandy-gold bg-cream-light text-sm text-(--text-primary) focus:outline-none focus:border-terra-cotta"
          />
        </div>
        <div>
          <label htmlFor="rsvp-email" className="block text-sm font-medium text-(--text-primary) mb-1">Email *</label>
          <input
            id="rsvp-email"
            name="email"
            type="email"
            required
            className="w-full px-3 py-2 rounded-lg border border-sandy-gold bg-cream-light text-sm text-(--text-primary) focus:outline-none focus:border-terra-cotta"
          />
        </div>
        <div>
          <label htmlFor="rsvp-phone" className="block text-sm font-medium text-(--text-primary) mb-1">Phone</label>
          <input
            id="rsvp-phone"
            name="phone"
            type="tel"
            className="w-full px-3 py-2 rounded-lg border border-sandy-gold bg-cream-light text-sm text-(--text-primary) focus:outline-none focus:border-terra-cotta"
          />
        </div>

        {status === 'error' && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full px-4 py-2.5 rounded-lg bg-terra-cotta text-white font-semibold hover:bg-terra-cotta-hover transition-colors disabled:opacity-50"
        >
          {status === 'loading' ? 'Submitting...' : 'RSVP — I\'ll be there!'}
        </button>
      </form>
    </div>
  );
}
