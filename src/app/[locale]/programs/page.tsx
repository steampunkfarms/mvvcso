import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  Shield,
  Heart,
  Users,
  GraduationCap,
  AlertTriangle,
  HandHelping,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Programs',
  description:
    'MVVCSO community programs: CERT training, food security, senior support, youth programs, emergency preparedness, and volunteer services.',
};

const programs: { key: string; icon: LucideIcon }[] = [
  { key: 'cert', icon: Shield },
  { key: 'food', icon: Heart },
  { key: 'senior', icon: Users },
  { key: 'youth', icon: GraduationCap },
  { key: 'emergency', icon: AlertTriangle },
  { key: 'volunteer', icon: HandHelping },
];

export default function ProgramsPage() {
  const t = useTranslations('programs');

  return (
    <div>
      {/* Hero */}
      <section className="py-(--section-padding) bg-stone-200/20">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding) text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-(--text-primary)">
            {t('title')}
          </h1>
          <p className="text-lg text-(--text-secondary) max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Programs grid */}
      <section className="py-(--section-padding) bg-stone-50">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programs.map(({ key, icon: Icon }) => (
              <div
                key={key}
                className="bg-white rounded-xl p-8 shadow-sm border border-stone-200"
              >
                <div className="w-14 h-14 rounded-lg bg-gold-100/15 flex items-center justify-center mb-5">
                  <Icon className="w-7 h-7 text-gold-400" />
                </div>
                <h2 className="text-xl font-bold text-(--text-primary) mb-3">
                  {t(`${key}_title`)}
                </h2>
                <p className="text-(--text-secondary) leading-relaxed">
                  {t(`${key}_description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-(--section-padding) bg-gold-100/40">
        <div className="max-w-2xl mx-auto px-(--container-padding) text-center">
          <h2 className="text-3xl font-bold mb-4 text-(--text-primary)">
            {t('cta_title')}
          </h2>
          <p className="text-(--text-secondary) mb-8">
            {t('cta_text')}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-gold-400 text-white font-semibold hover:bg-gold-500 transition-colors"
          >
            {t('cta_button')}
          </Link>
        </div>
      </section>
    </div>
  );
}
