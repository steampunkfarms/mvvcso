import Link from 'next/link';
import { BookOpen, Shield, ClipboardList, FileEdit, Map, Calendar } from 'lucide-react';
import { RESOURCE_CATEGORIES, POLICIES, SOPS, MEETING_MINUTES, FORMS, MAPS, BYLAWS } from '@/lib/transparency-docs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resources & Transparency',
  description: 'Public governance documents — bylaws, policies, SOPs, forms, boundary maps, and meeting minutes from 2020 to present.',
};

const ICONS: Record<string, typeof BookOpen> = {
  BookOpen, Shield, ClipboardList, FileEdit, Map, Calendar,
};

const DOC_COUNTS: Record<string, number> = {
  bylaws: BYLAWS.length,
  policies: POLICIES.length,
  sops: SOPS.length,
  forms: FORMS.length,
  maps: MAPS.length,
  minutes: MEETING_MINUTES.length,
};

const COLOR_MAP: Record<string, { bg: string; icon: string; border: string }> = {
  terra: { bg: 'bg-terra-50', icon: 'text-terra-500', border: 'border-terra-200' },
  dusk: { bg: 'bg-terra-50', icon: 'text-stone-600', border: 'border-stone-200' },
  sage: { bg: 'bg-sage-50', icon: 'text-sage-600', border: 'border-sage-200' },
  gold: { bg: 'bg-gold-50', icon: 'text-gold-500', border: 'border-gold-200' },
};

export default function ResourcesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-(--section-padding) bg-stone-200/20">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding) text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-(--text-primary)">
            Resources &amp; Transparency
          </h1>
          <p className="text-lg text-(--text-secondary) max-w-2xl mx-auto">
            MVVCSO is committed to open governance. Browse our bylaws, policies,
            procedures, and six years of meeting minutes.
          </p>
        </div>
      </section>

      {/* Category Cards */}
      <section className="py-(--section-padding) bg-stone-50">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding)">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {RESOURCE_CATEGORIES.map((cat) => {
              const Icon = ICONS[cat.icon] || BookOpen;
              const colors = COLOR_MAP[cat.color] || COLOR_MAP.terra;
              const count = DOC_COUNTS[cat.slug] || 0;

              return (
                <Link
                  key={cat.slug}
                  href={`/resources/${cat.slug}`}
                  className={`group bg-white rounded-xl p-6 border ${colors.border} hover:shadow-lg transition-all hover:-translate-y-0.5`}
                >
                  <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${colors.icon}`} />
                  </div>
                  <h2 className="text-lg font-bold text-(--text-primary) group-hover:text-gold-400 transition-colors">
                    {cat.title}
                  </h2>
                  <p className="text-sm text-(--text-secondary) mt-1 mb-3">
                    {cat.description}
                  </p>
                  <span className="text-xs font-medium text-(--text-muted)">
                    {count} {count === 1 ? 'document' : 'documents'}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Nonprofit verification */}
      <section className="py-8 bg-stone-100">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding) text-center">
          <p className="text-sm text-(--text-muted) mb-3">Verify our nonprofit status:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://projects.propublica.org/nonprofits/organizations/953173208" target="_blank" rel="noopener noreferrer" className="text-sm text-(--text-secondary) hover:text-gold-400 transition-colors underline decoration-stone-300 hover:decoration-gold-400">ProPublica</a>
            <a href="https://app.candid.org/profile/8449076/montezuma-valley-volunteer-community-service-organization-95-3173208" target="_blank" rel="noopener noreferrer" className="text-sm text-(--text-secondary) hover:text-gold-400 transition-colors underline decoration-stone-300 hover:decoration-gold-400">Candid</a>
            <a href="https://www.charitynavigator.org/ein/953173208" target="_blank" rel="noopener noreferrer" className="text-sm text-(--text-secondary) hover:text-gold-400 transition-colors underline decoration-stone-300 hover:decoration-gold-400">Charity Navigator</a>
          </div>
          <p className="text-xs text-(--text-muted) mt-3">EIN: 95-3173208</p>
        </div>
      </section>
    </div>
  );
}
