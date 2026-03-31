'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const categories = ['tools', 'furniture', 'vehicles', 'livestock', 'produce', 'services', 'housing', 'other'];

export default function NewListingPage() {
  const router = useRouter();
  const [type, setType] = useState('for_sale');
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');

    const form = e.currentTarget;
    const priceStr = (form.elements.namedItem('price') as HTMLInputElement)?.value;
    const data = {
      title: (form.elements.namedItem('title') as HTMLInputElement).value,
      description: (form.elements.namedItem('description') as HTMLTextAreaElement).value,
      category: (form.elements.namedItem('category') as HTMLSelectElement).value,
      type,
      price: priceStr ? Math.round(parseFloat(priceStr) * 100) : undefined,
      condition: (form.elements.namedItem('condition') as HTMLSelectElement)?.value || undefined,
      location: (form.elements.namedItem('location') as HTMLInputElement).value || 'Ranchita area',
    };

    try {
      const res = await fetch('/api/marketplace/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) router.push('/marketplace');
    } finally {
      setStatus('idle');
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-xl mx-auto px-(--container-padding) py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/marketplace" className="text-gold-400 hover:text-gold-500"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-xl font-bold text-(--text-primary)">New Listing</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border border-stone-200 space-y-5">
          <div>
            <label className="block text-sm font-medium text-(--text-primary) mb-1">Title</label>
            <input name="title" required className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-50 text-(--text-primary) focus:outline-none focus:border-gold-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-(--text-primary) mb-1">Description</label>
            <textarea name="description" rows={4} required maxLength={1000}
              className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-stone-50 text-(--text-primary) focus:outline-none focus:border-gold-400 resize-y" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-(--text-primary) mb-1">Category</label>
              <select name="category" required className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-50 text-(--text-primary) capitalize focus:outline-none focus:border-gold-400">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-(--text-primary) mb-1">Type</label>
              <div className="grid grid-cols-2 gap-2">
                {['for_sale', 'for_trade', 'free', 'wanted'].map(t => (
                  <button key={t} type="button" onClick={() => setType(t)}
                    className={`px-3 py-2 rounded-lg border text-xs font-medium capitalize transition-colors ${type === t ? 'bg-gold-400 text-white border-gold-400' : 'border-stone-200 text-(--text-secondary) hover:border-gold-400'}`}>
                    {t.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {type === 'for_sale' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-(--text-primary) mb-1">Price ($)</label>
                <input name="price" type="number" step="0.01" min="0"
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-50 text-(--text-primary) focus:outline-none focus:border-gold-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-(--text-primary) mb-1">Condition</label>
                <select name="condition" className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-50 text-(--text-primary) focus:outline-none focus:border-gold-400">
                  <option value="new">New</option>
                  <option value="like_new">Like New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="parts">Parts Only</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-(--text-primary) mb-1">Location</label>
            <input name="location" defaultValue="Ranchita area"
              className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-50 text-(--text-primary) focus:outline-none focus:border-gold-400" />
          </div>

          <button type="submit" disabled={status === 'loading'}
            className="w-full px-6 py-3 rounded-lg bg-gold-400 text-white font-semibold hover:bg-gold-500 transition-colors disabled:opacity-60">
            {status === 'loading' ? 'Creating...' : 'Post Listing'}
          </button>
        </form>
      </div>
    </div>
  );
}
