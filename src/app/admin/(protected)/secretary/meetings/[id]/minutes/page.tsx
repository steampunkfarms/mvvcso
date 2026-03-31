'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default function MinutesEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/meetings/${id}`)
      .then(r => r.json())
      .then(() => {
        // Load minutes content from a separate endpoint or embed
        // For now, we'll load via the meeting detail
      })
      .finally(() => setLoading(false));

    // Load minutes directly
    fetch(`/api/admin/meetings/${id}/minutes`)
      .then(r => r.json())
      .then(data => {
        setContent(data.editedDraft || data.aiDraft || '');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave() {
    setSaving(true);
    try {
      await fetch(`/api/admin/meetings/${id}/minutes`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ editedDraft: content }),
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-(--text-muted)">Loading...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/admin/secretary/meetings/${id}`} className="text-terra-cotta hover:text-terra-cotta-hover">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-(--text-primary)">Edit Minutes</h1>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-terra-cotta text-white text-sm font-semibold hover:bg-terra-cotta-hover transition-colors disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[600px]">
        {/* Editor */}
        <div>
          <h3 className="text-sm font-semibold text-(--text-muted) mb-2 uppercase tracking-wider">Markdown</h3>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-[calc(100%-2rem)] px-4 py-3 rounded-lg border border-sandy-gold bg-cream-light text-(--text-primary) text-sm font-mono focus:outline-none focus:border-terra-cotta resize-none"
          />
        </div>

        {/* Preview */}
        <div>
          <h3 className="text-sm font-semibold text-(--text-muted) mb-2 uppercase tracking-wider">Preview</h3>
          <div className="h-[calc(100%-2rem)] overflow-y-auto px-6 py-4 rounded-lg border border-sandy-gold bg-white">
            <div className="prose prose-sm max-w-none text-(--text-secondary)">
              {content.split('\n').map((line: string, i: number) => {
                if (line.startsWith('# ')) return <h1 key={i} className="text-lg font-bold mt-4 mb-2 text-(--text-primary)">{line.slice(2)}</h1>;
                if (line.startsWith('## ')) return <h2 key={i} className="text-base font-bold mt-3 mb-1 text-(--text-primary)">{line.slice(3)}</h2>;
                if (line.startsWith('### ')) return <h3 key={i} className="text-sm font-bold mt-2 mb-1 text-(--text-primary)">{line.slice(4)}</h3>;
                if (line.startsWith('- ')) return <li key={i} className="ml-4">{line.slice(2)}</li>;
                if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-bold">{line.slice(2, -2)}</p>;
                if (line.trim() === '') return <br key={i} />;
                return <p key={i} className="mb-1">{line}</p>;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
