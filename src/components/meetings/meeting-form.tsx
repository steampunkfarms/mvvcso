'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function MeetingForm() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');

    const form = e.currentTarget;
    const data = {
      meetingDate: (form.elements.namedItem('meetingDate') as HTMLInputElement).value,
      meetingType: (form.elements.namedItem('meetingType') as HTMLSelectElement).value,
      location: (form.elements.namedItem('location') as HTMLInputElement).value,
      calledBy: (form.elements.namedItem('calledBy') as HTMLInputElement).value || undefined,
    };

    try {
      const res = await fetch('/api/admin/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const { id } = await res.json();
        router.push(`/admin/secretary/meetings/${id}`);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border border-stone-200 space-y-5 max-w-xl">
      <div>
        <label htmlFor="meetingDate" className="block text-sm font-medium text-(--text-primary) mb-1">
          Meeting Date & Time
        </label>
        <input
          id="meetingDate"
          name="meetingDate"
          type="datetime-local"
          required
          className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-100 text-(--text-primary) focus:outline-none focus:border-gold-400"
        />
      </div>

      <div>
        <label htmlFor="meetingType" className="block text-sm font-medium text-(--text-primary) mb-1">
          Meeting Type
        </label>
        <select
          id="meetingType"
          name="meetingType"
          className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-100 text-(--text-primary) focus:outline-none focus:border-gold-400"
        >
          <option value="regular">Regular</option>
          <option value="special">Special</option>
          <option value="emergency">Emergency</option>
          <option value="annual">Annual</option>
        </select>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-(--text-primary) mb-1">
          Location
        </label>
        <input
          id="location"
          name="location"
          type="text"
          defaultValue="MVVCSO Community Center"
          className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-100 text-(--text-primary) focus:outline-none focus:border-gold-400"
        />
      </div>

      <div>
        <label htmlFor="calledBy" className="block text-sm font-medium text-(--text-primary) mb-1">
          Called By (for special/emergency meetings)
        </label>
        <input
          id="calledBy"
          name="calledBy"
          type="text"
          placeholder="Optional"
          className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-100 text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:border-gold-400"
        />
      </div>

      {status === 'error' && (
        <p className="text-red-600 text-sm">Failed to create meeting. Please try again.</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full px-6 py-3 rounded-lg bg-gold-400 text-white font-semibold hover:bg-gold-500 transition-colors disabled:opacity-60"
      >
        {status === 'loading' ? 'Creating...' : 'Create Meeting'}
      </button>
    </form>
  );
}
