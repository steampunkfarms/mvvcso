'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TreePine, Plus, Users } from 'lucide-react';

interface Tree {
  id: string;
  name: string;
  description: string | null;
  privacy: string;
  personCount: number;
  createdAt: string;
}

export default function MyTreesPage() {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/legacy/trees')
      .then(r => r.ok ? r.json() : [])
      .then(setTrees)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-(--container-max) mx-auto px-(--container-padding) py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-(--text-primary)">My Family Trees</h1>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-400 text-white text-sm font-semibold hover:bg-gold-500 transition-colors">
            <Plus className="w-4 h-4" /> New Tree
          </button>
        </div>

        {loading ? (
          <p className="text-center text-(--text-muted) py-12">Loading...</p>
        ) : trees.length === 0 ? (
          <div className="bg-white rounded-xl p-12 border border-stone-200 text-center">
            <TreePine className="w-12 h-12 text-(--text-muted) mx-auto mb-4" />
            <h2 className="text-xl font-bold text-(--text-primary) mb-2">No family trees yet</h2>
            <p className="text-(--text-secondary) mb-6">Start by creating a new tree or importing a GEDCOM file from Ancestry.com.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="px-6 py-2.5 rounded-lg bg-gold-400 text-white font-semibold hover:bg-gold-500 transition-colors">Create Tree</button>
              <Link href="/legacy/import" className="px-6 py-2.5 rounded-lg border border-stone-300 text-(--text-secondary) font-semibold hover:border-gold-400 transition-colors">Import GEDCOM</Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trees.map(tree => (
              <Link key={tree.id} href={`/legacy/tree/${tree.id}`}
                className="bg-white rounded-xl p-6 border border-stone-200 hover:shadow-md transition-shadow group">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-(--text-primary) group-hover:text-gold-400 transition-colors">{tree.name}</h3>
                    {tree.description && <p className="text-sm text-(--text-secondary) mt-1">{tree.description}</p>}
                  </div>
                  <TreePine className="w-6 h-6 text-gold-400 shrink-0" />
                </div>
                <div className="flex items-center gap-4 text-xs text-(--text-muted)">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {tree.personCount} persons</span>
                  <span className="capitalize">{tree.privacy}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
