import Link from 'next/link';
import { TreePine, Upload, Mic, Map, Users, FileText } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Build Your Ranchita Legacy',
  description: 'Community genealogy for the Montezuma Valley. Family trees, oral histories, property records, and inter-family connections.',
};

export default function LegacyLandingPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <section className="py-(--section-padding) bg-stone-100">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding) text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-(--text-primary) mb-4">Build Your Ranchita Legacy</h1>
          <p className="text-lg text-(--text-secondary) max-w-2xl mx-auto mb-8">
            Preserve your family&apos;s story. Connect with neighbors across generations. The Montezuma Valley remembers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/legacy/my-trees" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-400 text-white font-semibold hover:bg-gold-500 transition-colors">
              <TreePine className="w-5 h-5" /> My Family Trees
            </Link>
            <Link href="/legacy/import" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-stone-300 text-(--text-secondary) font-semibold hover:border-gold-400 hover:text-gold-400 transition-colors">
              <Upload className="w-5 h-5" /> Import GEDCOM
            </Link>
          </div>
        </div>
      </section>

      <section className="py-(--section-padding) bg-stone-50">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding)">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={TreePine} title="Interactive Family Trees" description="Visual, zoomable trees. Click any person to see their story. Multiple view modes: network, pedigree, timeline." href="/legacy/my-trees" />
            <FeatureCard icon={Upload} title="GEDCOM Import" description="Bring your Ancestry.com or FamilySearch tree. Upload a .ged file and we'll build it for you." href="/legacy/import" />
            <FeatureCard icon={Mic} title="Oral Histories" description="Record and preserve stories in your family's own voices. AI transcription included." href="/legacy/oral-history" />
            <FeatureCard icon={Map} title="Property History" description="Who lived on your land before you? Timeline of ownership and events for Ranchita parcels." href="/legacy/property" />
            <FeatureCard icon={Users} title="Community Connections" description="See how Ranchita families connect across generations. The valley's shared story." href="/legacy/community" />
            <FeatureCard icon={FileText} title="Reports" description="Classic genealogy reports: Ahnentafel, Descendancy, Register, Family Group Sheets. PDF export." href="/legacy/my-trees" />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, href }: { icon: React.ComponentType<{ className?: string }>; title: string; description: string; href: string }) {
  return (
    <Link href={href} className="bg-white rounded-xl p-6 border border-stone-200 hover:shadow-md transition-shadow group">
      <Icon className="w-8 h-8 text-gold-400 mb-3 group-hover:scale-110 transition-transform" />
      <h3 className="font-bold text-(--text-primary) mb-2">{title}</h3>
      <p className="text-sm text-(--text-secondary)">{description}</p>
    </Link>
  );
}
