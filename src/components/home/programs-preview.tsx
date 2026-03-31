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

const programs: { key: string; icon: LucideIcon }[] = [
  { key: 'cert', icon: Shield },
  { key: 'food', icon: Heart },
  { key: 'senior', icon: Users },
  { key: 'youth', icon: GraduationCap },
  { key: 'emergency', icon: AlertTriangle },
  { key: 'volunteer', icon: HandHelping },
];

export function ProgramsPreview() {
  const t = useTranslations('programs');
  const homeT = useTranslations('home');

  return (
    <section className="py-(--section-padding) bg-cream-light">
      <div className="max-w-(--container-max) mx-auto px-(--container-padding)">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-(--text-primary)">
          {homeT('programs_title')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map(({ key, icon: Icon }) => (
            <Link
              key={key}
              href="/programs"
              className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-sandy-gold"
            >
              <div className="w-12 h-12 rounded-lg bg-sunset-peach/15 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-terra-cotta" />
              </div>
              <h3 className="text-lg font-semibold text-(--text-primary) mb-2 group-hover:text-terra-cotta transition-colors">
                {t(`${key}_title`)}
              </h3>
              <p className="text-sm text-(--text-secondary) line-clamp-2">
                {t(`${key}_description`)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
