import Link from 'next/link';
import { ArrowLeft, Paintbrush } from 'lucide-react';

export default function KidsCreatePage() {
  return (
    <div className="min-h-screen bg-cream-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/kids/home" className="inline-flex items-center gap-1 text-gold-400 hover:text-gold-500 text-sm mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="bg-white rounded-2xl p-12 border-2 border-gold-200 text-center">
          <Paintbrush className="w-12 h-12 text-gold-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-(--text-primary) mb-2">Create Studio</h1>
          <p className="text-(--text-secondary) mb-6">
            Draw desert creatures, design trail signs, and create art inspired by Ranchita!
          </p>
          <div className="inline-block bg-gold-50 text-gold-600 text-sm font-medium px-4 py-2 rounded-full">
            Coming Soon — Earn XP for your creations!
          </div>
        </div>
      </div>
    </div>
  );
}
