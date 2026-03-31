'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewBlogPostPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');

    const form = e.currentTarget;
    const titleEn = (form.elements.namedItem('titleEn') as HTMLInputElement).value;
    const data = {
      titleEn,
      titleEs: (form.elements.namedItem('titleEs') as HTMLInputElement).value || undefined,
      contentEn: (form.elements.namedItem('contentEn') as HTMLTextAreaElement).value,
      contentEs: (form.elements.namedItem('contentEs') as HTMLTextAreaElement).value || undefined,
      excerptEn: (form.elements.namedItem('excerptEn') as HTMLInputElement).value || undefined,
      category: (form.elements.namedItem('category') as HTMLSelectElement).value || undefined,
      author: (form.elements.namedItem('author') as HTMLInputElement).value || 'MVVCSO',
      slug: titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      published: (form.elements.namedItem('published') as HTMLInputElement).checked,
    };

    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        router.push('/admin/blog');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blog" className="text-gold-400 hover:text-gold-500"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-bold text-(--text-primary)">New Blog Post</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border border-stone-200 space-y-5 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-(--text-primary) mb-1">Title (English)</label>
            <input name="titleEn" required className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-50 text-(--text-primary) focus:outline-none focus:border-gold-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-(--text-primary) mb-1">Title (Spanish)</label>
            <input name="titleEs" className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-50 text-(--text-primary) focus:outline-none focus:border-gold-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-(--text-primary) mb-1">Content (English, Markdown)</label>
          <textarea name="contentEn" rows={12} required className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-stone-50 text-(--text-primary) font-mono text-sm focus:outline-none focus:border-gold-400 resize-y" />
        </div>

        <div>
          <label className="block text-sm font-medium text-(--text-primary) mb-1">Content (Spanish, Markdown)</label>
          <textarea name="contentEs" rows={6} className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-stone-50 text-(--text-primary) font-mono text-sm focus:outline-none focus:border-gold-400 resize-y" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-(--text-primary) mb-1">Excerpt (EN)</label>
            <input name="excerptEn" className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-50 text-(--text-primary) focus:outline-none focus:border-gold-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-(--text-primary) mb-1">Category</label>
            <select name="category" className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-50 text-(--text-primary) focus:outline-none focus:border-gold-400">
              <option value="">None</option>
              <option value="community">Community</option>
              <option value="programs">Programs</option>
              <option value="history">History</option>
              <option value="resources">Resources</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-(--text-primary) mb-1">Author</label>
            <input name="author" defaultValue="MVVCSO" className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-50 text-(--text-primary) focus:outline-none focus:border-gold-400" />
          </div>
        </div>

        <label className="flex items-center gap-2">
          <input name="published" type="checkbox" className="w-4 h-4 rounded border-stone-300 text-gold-400 focus:ring-gold-400" />
          <span className="text-sm text-(--text-primary)">Publish immediately</span>
        </label>

        {status === 'error' && <p className="text-red-600 text-sm">Failed to create post.</p>}

        <button type="submit" disabled={status === 'loading'}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-400 text-white font-semibold hover:bg-gold-500 transition-colors disabled:opacity-60">
          <Save className="w-4 h-4" />
          {status === 'loading' ? 'Saving...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}
