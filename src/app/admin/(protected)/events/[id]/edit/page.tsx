'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const REPEAT_PATTERNS = [
  { value: '', label: 'Does not repeat' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Every 2 weeks' },
  { value: '1st_3rd_tue', label: '1st & 3rd Tuesday' },
  { value: '2nd_4th_tue', label: '2nd & 4th Tuesday' },
  { value: 'monthly', label: 'Monthly (same date)' },
  { value: 'monthly_dow', label: 'Monthly (same day of week)' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annually', label: 'Annually' },
];

interface EventData {
  id: string;
  titleEn: string;
  titleEs: string | null;
  descriptionEn: string | null;
  descriptionEs: string | null;
  date: string;
  endDate: string | null;
  location: string | null;
  maxRsvp: number | null;
  isPublic: boolean;
  category: string | null;
}

function toLocalDatetimeStr(isoStr: string): string {
  const d = new Date(isoStr);
  // Adjust for Pacific Time (UTC-7 for PDT)
  const pacific = new Date(d.getTime() - 7 * 60 * 60 * 1000);
  return pacific.toISOString().slice(0, 16);
}

function fromLocalToPacificISO(localStr: string): string {
  // localStr is "YYYY-MM-DDThh:mm" in Pacific
  // Add 7 hours to get UTC
  const d = new Date(localStr + ':00');
  d.setTime(d.getTime() + 7 * 60 * 60 * 1000);
  return d.toISOString();
}

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [titleEn, setTitleEn] = useState('');
  const [titleEs, setTitleEs] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionEs, setDescriptionEs] = useState('');
  const [date, setDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [maxRsvp, setMaxRsvp] = useState('');
  const [isPublic, setIsPublic] = useState('true');
  const [category, setCategory] = useState('');
  const [repeatPattern, setRepeatPattern] = useState('');
  const [repeatUntil, setRepeatUntil] = useState('');

  useEffect(() => {
    fetch(`/api/admin/events`)
      .then(r => r.json())
      .then((events: EventData[]) => {
        const ev = events.find(e => e.id === id);
        if (!ev) { setError('Event not found'); setLoading(false); return; }
        setTitleEn(ev.titleEn);
        setTitleEs(ev.titleEs || '');
        setDescriptionEn(ev.descriptionEn || '');
        setDescriptionEs(ev.descriptionEs || '');
        setDate(toLocalDatetimeStr(ev.date));
        setEndDate(ev.endDate ? toLocalDatetimeStr(ev.endDate) : '');
        setLocation(ev.location || '');
        setMaxRsvp(ev.maxRsvp ? String(ev.maxRsvp) : '');
        setIsPublic(ev.isPublic ? 'true' : 'false');
        setCategory(ev.category || '');
        setLoading(false);
      })
      .catch(() => { setError('Failed to load event'); setLoading(false); });
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/admin/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          titleEn,
          titleEs: titleEs || undefined,
          descriptionEn: descriptionEn || undefined,
          descriptionEs: descriptionEs || undefined,
          date: fromLocalToPacificISO(date),
          endDate: endDate ? fromLocalToPacificISO(endDate) : undefined,
          location: location || undefined,
          maxRsvp: maxRsvp ? Number(maxRsvp) : undefined,
          isPublic: isPublic === 'true',
          category: category || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save');
      }
      router.push(`/admin/events/${id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSaving(false);
    }
  }

  async function handleCreateSeries(e: React.FormEvent) {
    e.preventDefault();
    if (!repeatPattern || !repeatUntil) {
      setError('Select a repeat pattern and end date');
      return;
    }
    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/admin/events/repeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceId: id,
          pattern: repeatPattern,
          until: repeatUntil,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create series');
      router.push('/admin/events');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSaving(false);
    }
  }

  if (loading) return <div className="p-8 text-center text-(--text-muted)">Loading...</div>;

  return (
    <div>
      <Link href={`/admin/events/${id}`} className="inline-flex items-center gap-1 text-sm text-gold-400 hover:text-gold-500 mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to event
      </Link>
      <h1 className="text-2xl font-bold text-(--text-primary) mb-6">Edit Event</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main edit form */}
        <form onSubmit={handleSave} className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-(--text-secondary) uppercase tracking-wider">English</h2>
            <div>
              <label className="block text-sm font-medium text-(--text-primary) mb-1">Title *</label>
              <input value={titleEn} onChange={e => setTitleEn(e.target.value)} required
                className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-100 text-sm text-(--text-primary) focus:outline-none focus:border-gold-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-(--text-primary) mb-1">Description</label>
              <textarea value={descriptionEn} onChange={e => setDescriptionEn(e.target.value)} rows={4}
                className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-100 text-sm text-(--text-primary) focus:outline-none focus:border-gold-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-(--text-secondary) uppercase tracking-wider">Spanish (optional)</h2>
            <div>
              <label className="block text-sm font-medium text-(--text-primary) mb-1">Titulo</label>
              <input value={titleEs} onChange={e => setTitleEs(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-100 text-sm text-(--text-primary) focus:outline-none focus:border-gold-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-(--text-primary) mb-1">Descripcion</label>
              <textarea value={descriptionEs} onChange={e => setDescriptionEs(e.target.value)} rows={4}
                className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-100 text-sm text-(--text-primary) focus:outline-none focus:border-gold-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-(--text-secondary) uppercase tracking-wider">Details</h2>
            <p className="text-xs text-(--text-muted)">Times are Pacific (PT)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-(--text-primary) mb-1">Start Date/Time * (PT)</label>
                <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} required
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-100 text-sm text-(--text-primary) focus:outline-none focus:border-gold-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-(--text-primary) mb-1">End Date/Time (PT)</label>
                <input type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-100 text-sm text-(--text-primary) focus:outline-none focus:border-gold-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-(--text-primary) mb-1">Location</label>
                <input value={location} onChange={e => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-100 text-sm text-(--text-primary) focus:outline-none focus:border-gold-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-(--text-primary) mb-1">Max RSVPs</label>
                <input type="number" min="0" value={maxRsvp} onChange={e => setMaxRsvp(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-100 text-sm text-(--text-primary) focus:outline-none focus:border-gold-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-(--text-primary) mb-1">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-100 text-sm text-(--text-primary) focus:outline-none focus:border-gold-400">
                  <option value="">Select...</option>
                  <option value="meeting">Meeting</option>
                  <option value="training">Training</option>
                  <option value="social">Social</option>
                  <option value="fundraiser">Fundraiser</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-(--text-primary) mb-1">Visibility</label>
                <select value={isPublic} onChange={e => setIsPublic(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-100 text-sm text-(--text-primary) focus:outline-none focus:border-gold-400">
                  <option value="true">Public</option>
                  <option value="false">Board Only</option>
                </select>
              </div>
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex gap-3">
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 rounded-lg bg-gold-400 text-white font-semibold hover:bg-gold-500 transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <Link href={`/admin/events/${id}`}
              className="px-6 py-2.5 rounded-lg border border-stone-200 text-sm font-medium text-(--text-secondary) hover:bg-stone-100 transition-colors">
              Cancel
            </Link>
          </div>
        </form>

        {/* Repeat sidebar */}
        <div className="space-y-4">
          <form onSubmit={handleCreateSeries} className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
            <h2 className="font-semibold text-(--text-primary) text-sm">Create Repeat Series</h2>
            <p className="text-xs text-(--text-muted)">Generate future events based on this one&apos;s details.</p>
            <div>
              <label className="block text-xs font-medium text-(--text-primary) mb-1">Repeat Pattern</label>
              <select value={repeatPattern} onChange={e => setRepeatPattern(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-100 text-sm text-(--text-primary) focus:outline-none focus:border-gold-400">
                {REPEAT_PATTERNS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-(--text-primary) mb-1">Repeat Until</label>
              <input type="date" value={repeatUntil} onChange={e => setRepeatUntil(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-100 text-sm text-(--text-primary) focus:outline-none focus:border-gold-400" />
            </div>
            <button type="submit" disabled={saving || !repeatPattern || !repeatUntil}
              className="w-full px-4 py-2 rounded-lg border border-gold-400 text-gold-400 text-sm font-semibold hover:bg-gold-50 transition-colors disabled:opacity-40">
              Generate Events
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
