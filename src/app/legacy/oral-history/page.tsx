import Link from 'next/link';
import { Mic, Play, Plus } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Oral Histories',
  description: 'Preserved voices of the Montezuma Valley. Listen to stories from Ranchita families.',
};

export default function OralHistoryPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <section className="py-(--section-padding) bg-stone-100">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding) text-center">
          <h1 className="text-4xl font-bold text-(--text-primary) mb-4">Oral Histories</h1>
          <p className="text-lg text-(--text-secondary) max-w-2xl mx-auto mb-6">
            The voices of the Montezuma Valley, preserved for generations to come.
          </p>
          <Link href="/legacy/oral-history/record"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-400 text-white font-semibold hover:bg-gold-500 transition-colors">
            <Mic className="w-5 h-5" /> Record a Story
          </Link>
        </div>
      </section>

      <section className="py-(--section-padding) bg-stone-50">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding)">
          <div className="bg-white rounded-xl p-12 border border-stone-200 text-center">
            <Mic className="w-10 h-10 text-(--text-muted) mx-auto mb-3" />
            <p className="text-(--text-primary) font-medium">No oral histories recorded yet.</p>
            <p className="text-sm text-(--text-muted) mt-1">Be the first to preserve a family story.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
