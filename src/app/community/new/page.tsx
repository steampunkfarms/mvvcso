'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send } from 'lucide-react';

const channelOptions = [
  { value: 'general', label: 'General' },
  { value: 'weather', label: 'Weather & Outages' },
  { value: 'trail_reports', label: 'Trail Reports' },
  { value: 'lost_found', label: 'Lost & Found' },
  { value: 'events', label: 'Events' },
];

export default function NewPostPage() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [channel, setChannel] = useState('general');
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setStatus('loading');

    try {
      const res = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, channel }),
      });
      if (res.ok) router.push('/community');
    } finally {
      setStatus('idle');
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-2xl mx-auto px-(--container-padding) py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/community" className="text-gold-400 hover:text-gold-500"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-xl font-bold text-(--text-primary)">New Post</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border border-stone-200 space-y-5">
          <div>
            <label className="block text-sm font-medium text-(--text-primary) mb-1">Channel</label>
            <select value={channel} onChange={e => setChannel(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-50 text-(--text-primary) focus:outline-none focus:border-gold-400">
              {channelOptions.map(ch => <option key={ch.value} value={ch.value}>{ch.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-(--text-primary) mb-1">
              What&apos;s on your mind? <span className="text-(--text-muted)">({content.length}/2000)</span>
            </label>
            <textarea value={content} onChange={e => setContent(e.target.value)} maxLength={2000} rows={6}
              placeholder="Share with the Ranchita community..."
              className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-stone-50 text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:border-gold-400 resize-y" />
          </div>

          <button type="submit" disabled={status === 'loading' || !content.trim()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-400 text-white font-semibold hover:bg-gold-500 transition-colors disabled:opacity-60">
            <Send className="w-4 h-4" />
            {status === 'loading' ? 'Posting...' : 'Post'}
          </button>
        </form>
      </div>
    </div>
  );
}
