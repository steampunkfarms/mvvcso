'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewEventPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const form = new FormData(e.currentTarget);
    const data = {
      titleEn: form.get('titleEn') as string,
      titleEs: (form.get('titleEs') as string) || undefined,
      descriptionEn: (form.get('descriptionEn') as string) || undefined,
      descriptionEs: (form.get('descriptionEs') as string) || undefined,
      date: form.get('date') as string,
      endDate: (form.get('endDate') as string) || undefined,
      location: (form.get('location') as string) || undefined,
      maxRsvp: form.get('maxRsvp') ? Number(form.get('maxRsvp')) : undefined,
      isPublic: form.get('isPublic') === 'true',
      category: (form.get('category') as string) || undefined,
    };

    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create event');
      }

      router.push('/admin/events');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSaving(false);
    }
  }

  return (
    <div>
      <Link href="/admin/events" className="inline-flex items-center gap-1 text-sm text-terra-cotta hover:text-terra-cotta-hover mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to events
      </Link>

      <h1 className="text-2xl font-bold text-(--text-primary) mb-6">Create Event</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="bg-white rounded-xl border border-sandy-gold p-6 space-y-4">
          <h2 className="text-sm font-semibold text-(--text-secondary) uppercase tracking-wider">English</h2>
          <div>
            <label htmlFor="titleEn" className="block text-sm font-medium text-(--text-primary) mb-1">Title *</label>
            <input id="titleEn" name="titleEn" required className="w-full px-4 py-2.5 rounded-lg border border-sandy-gold bg-cream-light text-sm text-(--text-primary) focus:outline-none focus:border-terra-cotta" />
          </div>
          <div>
            <label htmlFor="descriptionEn" className="block text-sm font-medium text-(--text-primary) mb-1">Description</label>
            <textarea id="descriptionEn" name="descriptionEn" rows={4} className="w-full px-4 py-2.5 rounded-lg border border-sandy-gold bg-cream-light text-sm text-(--text-primary) focus:outline-none focus:border-terra-cotta" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-sandy-gold p-6 space-y-4">
          <h2 className="text-sm font-semibold text-(--text-secondary) uppercase tracking-wider">Spanish (optional)</h2>
          <div>
            <label htmlFor="titleEs" className="block text-sm font-medium text-(--text-primary) mb-1">Título</label>
            <input id="titleEs" name="titleEs" className="w-full px-4 py-2.5 rounded-lg border border-sandy-gold bg-cream-light text-sm text-(--text-primary) focus:outline-none focus:border-terra-cotta" />
          </div>
          <div>
            <label htmlFor="descriptionEs" className="block text-sm font-medium text-(--text-primary) mb-1">Descripción</label>
            <textarea id="descriptionEs" name="descriptionEs" rows={4} className="w-full px-4 py-2.5 rounded-lg border border-sandy-gold bg-cream-light text-sm text-(--text-primary) focus:outline-none focus:border-terra-cotta" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-sandy-gold p-6 space-y-4">
          <h2 className="text-sm font-semibold text-(--text-secondary) uppercase tracking-wider">Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-(--text-primary) mb-1">Start Date/Time *</label>
              <input id="date" name="date" type="datetime-local" required className="w-full px-4 py-2.5 rounded-lg border border-sandy-gold bg-cream-light text-sm text-(--text-primary) focus:outline-none focus:border-terra-cotta" />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-(--text-primary) mb-1">End Date/Time</label>
              <input id="endDate" name="endDate" type="datetime-local" className="w-full px-4 py-2.5 rounded-lg border border-sandy-gold bg-cream-light text-sm text-(--text-primary) focus:outline-none focus:border-terra-cotta" />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-(--text-primary) mb-1">Location</label>
              <input id="location" name="location" defaultValue="MVVCSO Community Center" className="w-full px-4 py-2.5 rounded-lg border border-sandy-gold bg-cream-light text-sm text-(--text-primary) focus:outline-none focus:border-terra-cotta" />
            </div>
            <div>
              <label htmlFor="maxRsvp" className="block text-sm font-medium text-(--text-primary) mb-1">Max RSVPs</label>
              <input id="maxRsvp" name="maxRsvp" type="number" min="0" className="w-full px-4 py-2.5 rounded-lg border border-sandy-gold bg-cream-light text-sm text-(--text-primary) focus:outline-none focus:border-terra-cotta" />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-(--text-primary) mb-1">Category</label>
              <select id="category" name="category" className="w-full px-4 py-2.5 rounded-lg border border-sandy-gold bg-cream-light text-sm text-(--text-primary) focus:outline-none focus:border-terra-cotta">
                <option value="">Select...</option>
                <option value="meeting">Meeting</option>
                <option value="training">Training</option>
                <option value="social">Social</option>
                <option value="fundraiser">Fundraiser</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="isPublic" className="block text-sm font-medium text-(--text-primary) mb-1">Visibility</label>
              <select id="isPublic" name="isPublic" defaultValue="true" className="w-full px-4 py-2.5 rounded-lg border border-sandy-gold bg-cream-light text-sm text-(--text-primary) focus:outline-none focus:border-terra-cotta">
                <option value="true">Public</option>
                <option value="false">Board Only</option>
              </select>
            </div>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-terra-cotta text-white font-semibold hover:bg-terra-cotta-hover transition-colors disabled:opacity-50"
          >
            {saving ? 'Creating...' : 'Create Event'}
          </button>
          <Link
            href="/admin/events"
            className="px-6 py-2.5 rounded-lg border border-sandy-gold text-sm font-medium text-(--text-secondary) hover:bg-cream-light transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
