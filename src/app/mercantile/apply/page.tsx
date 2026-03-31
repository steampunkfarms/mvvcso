'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Store } from 'lucide-react';

export default function VendorApplyPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    // Would submit to /api/mercantile/apply
    setTimeout(() => setStatus('success'), 1500);
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl p-8 border border-stone-200 text-center max-w-md">
          <Store className="w-12 h-12 text-sage-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-(--text-primary) mb-2">Application Received!</h2>
          <p className="text-sm text-(--text-secondary) mb-4">We'll review your application and get back to you within a few days.</p>
          <Link href="/mercantile" className="text-gold-400 hover:underline text-sm">Back to Mercantile</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-xl mx-auto px-(--container-padding) py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/mercantile" className="text-gold-400 hover:text-gold-500"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-2xl font-bold text-(--text-primary)">Apply to Sell</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border border-stone-200 space-y-5">
          <p className="text-sm text-(--text-secondary)">
            Join the Ranchita Mercantile! Sell your handmade goods, produce, or crafts. MVVCSO takes a 10% commission to fund community programs.
          </p>

          <div>
            <label className="block text-sm font-medium text-(--text-primary) mb-1">Shop Name</label>
            <input name="shopName" required placeholder="e.g., Desert Rose Pottery"
              className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-50 text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:border-gold-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-(--text-primary) mb-1">What do you make or sell?</label>
            <textarea name="description" rows={3} required placeholder="Tell us about your craft..."
              className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-50 text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:border-gold-400 resize-y" />
          </div>

          <div>
            <label className="block text-sm font-medium text-(--text-primary) mb-1">Categories</label>
            <select name="category" className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-50 text-(--text-primary) focus:outline-none focus:border-gold-400">
              <option value="pottery">Pottery</option>
              <option value="jewelry">Jewelry</option>
              <option value="preserves">Preserves / Honey</option>
              <option value="art">Art</option>
              <option value="woodwork">Woodwork</option>
              <option value="textiles">Textiles</option>
              <option value="plants">Plants</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button type="submit" disabled={status === 'loading'}
            className="w-full px-6 py-3 rounded-lg bg-gold-400 text-white font-semibold hover:bg-gold-500 transition-colors disabled:opacity-60">
            {status === 'loading' ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}
