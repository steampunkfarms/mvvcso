import { useTranslations } from 'next-intl';
import { HistoryTimeline } from '@/components/about/history-timeline';
import { BoardGrid } from '@/components/about/board-grid';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn about MVVCSO — from volunteer firefighters to community champions. Over 50 years of service in Ranchita.',
};

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <div>
      {/* Hero */}
      <section className="py-(--section-padding) bg-sandy-gold/20">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding) text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-(--text-primary)">
            {t('title')}
          </h1>
          <p className="text-lg text-(--text-secondary) max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-(--section-padding) bg-desert-cream">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding)">
          <h2 className="text-3xl font-bold mb-12 text-center text-(--text-primary)">
            {t('timeline_title')}
          </h2>
          <HistoryTimeline />
        </div>
      </section>

      {/* Board */}
      <BoardGrid />

      {/* Transparency */}
      <section className="py-(--section-padding) bg-desert-cream">
        <div className="max-w-2xl mx-auto px-(--container-padding) text-center">
          <h2 className="text-2xl font-bold mb-4 text-(--text-primary)">
            {t('transparency_title')}
          </h2>
          <p className="text-(--text-secondary) leading-relaxed">
            {t('transparency_text')}
          </p>
        </div>
      </section>
    </div>
  );
}
