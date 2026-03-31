'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Upload, ArrowLeft, FileText, Check } from 'lucide-react';

export default function GedcomImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'parsing' | 'preview' | 'importing' | 'done' | 'error'>('idle');
  const [preview, setPreview] = useState<{ individuals: number; families: number; sampleNames: string[] } | null>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setStatus('parsing');

    // Read file and send for parsing preview
    const formData = new FormData();
    formData.append('file', f);

    try {
      const res = await fetch('/api/legacy/import/preview', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        setPreview(data);
        setStatus('preview');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  async function handleImport() {
    if (!file) return;
    setStatus('importing');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/legacy/import', { method: 'POST', body: formData });
      if (res.ok) {
        setStatus('done');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-2xl mx-auto px-(--container-padding) py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/legacy" className="text-gold-400 hover:text-gold-500"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-2xl font-bold text-(--text-primary)">Import GEDCOM</h1>
        </div>

        <div className="bg-white rounded-xl p-8 border border-stone-200">
          {status === 'idle' && (
            <div className="text-center">
              <Upload className="w-12 h-12 text-(--text-muted) mx-auto mb-4" />
              <h2 className="text-lg font-bold text-(--text-primary) mb-2">Upload your .ged file</h2>
              <p className="text-sm text-(--text-secondary) mb-6">Export from Ancestry.com, FamilySearch, or any GEDCOM-compatible platform.</p>
              <label className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-400 text-white font-semibold hover:bg-gold-500 transition-colors cursor-pointer">
                <FileText className="w-4 h-4" /> Choose File
                <input type="file" accept=".ged,.gedcom" className="hidden" onChange={handleFileSelect} />
              </label>
            </div>
          )}

          {status === 'parsing' && (
            <div className="text-center py-8">
              <p className="text-(--text-primary) font-medium">Parsing your family tree...</p>
            </div>
          )}

          {status === 'preview' && preview && (
            <div className="space-y-6">
              <div className="text-center">
                <Check className="w-12 h-12 text-sage-400 mx-auto mb-3" />
                <h2 className="text-lg font-bold text-(--text-primary)">Ready to Import</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gold-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-gold-600">{preview.individuals}</div>
                  <div className="text-sm text-(--text-muted)">Individuals</div>
                </div>
                <div className="bg-dusk-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-dusk-600">{preview.families}</div>
                  <div className="text-sm text-(--text-muted)">Families</div>
                </div>
              </div>

              {preview.sampleNames.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-(--text-primary) mb-2">Sample names found:</h3>
                  <ul className="text-sm text-(--text-secondary) space-y-1">
                    {preview.sampleNames.map((name, i) => <li key={i}>{name}</li>)}
                  </ul>
                </div>
              )}

              <button onClick={handleImport}
                className="w-full px-6 py-3 rounded-lg bg-gold-400 text-white font-semibold hover:bg-gold-500 transition-colors">
                Import {preview.individuals} People
              </button>
            </div>
          )}

          {status === 'importing' && (
            <div className="text-center py-8">
              <p className="text-(--text-primary) font-medium">Importing your family tree...</p>
              <p className="text-sm text-(--text-muted) mt-1">This may take a moment for large trees.</p>
            </div>
          )}

          {status === 'done' && (
            <div className="text-center py-8">
              <Check className="w-12 h-12 text-sage-400 mx-auto mb-3" />
              <h2 className="text-lg font-bold text-(--text-primary)">Import Complete!</h2>
              <Link href="/legacy/my-trees" className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 rounded-lg bg-gold-400 text-white font-semibold hover:bg-gold-500 transition-colors">
                View Your Trees
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-8">
              <p className="text-red-600 font-medium">Import failed. Please check your file and try again.</p>
              <button onClick={() => setStatus('idle')} className="mt-4 text-gold-400 hover:underline text-sm">Try Again</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
