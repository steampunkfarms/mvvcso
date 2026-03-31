'use client';

import { useState } from 'react';
import { Wand2 } from 'lucide-react';

interface RawNotesEditorProps {
  meetingId: string;
  rawNotes: string;
}

export function RawNotesEditor({ meetingId, rawNotes }: RawNotesEditorProps) {
  const [notes, setNotes] = useState(rawNotes);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await fetch(`/api/admin/meetings/${meetingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawNotes: notes }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  async function handleGenerateDraft() {
    if (!notes.trim()) return;
    setGenerating(true);
    try {
      const res = await fetch(`/api/admin/meetings/${meetingId}/generate-draft`, {
        method: 'POST',
      });
      if (res.ok) {
        window.location.reload();
      }
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="space-y-4">
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={12}
        placeholder="Paste raw meeting notes here — they can be ragged, unformatted, or from audio transcription. Claude will format them into professional minutes."
        className="w-full px-4 py-3 rounded-lg border border-sandy-gold bg-cream-light text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:border-terra-cotta resize-y text-sm font-mono"
      />
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded-lg border border-chaparral/40 text-sm font-medium text-(--text-secondary) hover:bg-sandy-gold/20 transition-colors disabled:opacity-60"
        >
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Notes'}
        </button>
        <button
          type="button"
          onClick={handleGenerateDraft}
          disabled={generating || !notes.trim()}
          className="px-4 py-2 rounded-lg bg-terra-cotta text-white text-sm font-semibold hover:bg-terra-cotta-hover transition-colors disabled:opacity-60 inline-flex items-center gap-2"
        >
          <Wand2 className="w-4 h-4" />
          {generating ? 'Generating...' : 'Generate AI Draft'}
        </button>
      </div>
    </div>
  );
}
