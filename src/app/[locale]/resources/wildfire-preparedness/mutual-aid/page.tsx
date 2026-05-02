import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import {
  CriticalCallout,
  NeverRule,
  TipCallout,
} from '@/components/resources/callouts';
import { PrintButton } from '@/components/resources/print-button';

export const metadata: Metadata = {
  title: 'Mutual Aid — Wildfire Preparedness for Ranchita',
  description:
    'How we show up for each other in Ranchita — and stay out of the way of the people fighting fires. Year-round community work, neighbor check-in lists, communications during incidents, the help-vs-interference line, and after-fire community recovery.',
};

export default async function MutualAidPage() {
  const t = await getTranslations('wildfire_prep');

  return (
    <main>
      {/* Hero band */}
      <section className="py-(--section-padding) bg-stone-200/20">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding)">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm">
            <Link
              href="/resources/wildfire-preparedness"
              className="text-teal-600 hover:text-terra-400 underline transition-colors"
            >
              {t('common.back_to_hub')}
            </Link>
          </nav>
          <span className="inline-block mb-4 px-3 py-1 rounded-full bg-gold-100 text-gold-600 text-sm font-medium">
            {t('hero.draft_badge')}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-3 text-(--text-primary)">
            {t('spokes.mutual_aid.title')}
          </h1>
          <p className="text-lg text-(--text-secondary) max-w-3xl mb-3">
            {t('spokes.mutual_aid.description')}
          </p>
          <p className="text-sm text-(--text-secondary)">
            {t('hero.last_updated', { date: 'May 2026' })}
          </p>
        </div>
      </section>

      <div className="max-w-(--container-max) mx-auto px-(--container-padding)">
        {/* Print button (top) */}
        <div className="flex justify-end my-4">
          <PrintButton />
        </div>

        {/* Intro — voice section, no callout */}
        <section className="pb-10 pt-4">
          <p className="text-(--text-secondary) leading-relaxed mb-4 text-lg">
            {t('spokes.mutual_aid.intro.para_1')}
          </p>
          <p className="text-(--text-secondary) leading-relaxed text-lg">
            {t('spokes.mutual_aid.intro.para_2')}
          </p>
        </section>

        {/* How residents support firefighters */}
        <section className="pb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-(--text-primary) mb-4">
            {t('spokes.mutual_aid.support.heading')}
          </h2>
          <CriticalCallout title={t('spokes.mutual_aid.support.critical_title')}>
            <p>{t('spokes.mutual_aid.support.critical_body')}</p>
          </CriticalCallout>
          <p className="text-(--text-secondary) leading-relaxed">
            {t('spokes.mutual_aid.support.body')}
          </p>
        </section>

        {/* Year-round community work */}
        <section className="pb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-(--text-primary) mb-4">
            {t('spokes.mutual_aid.year_round.heading')}
          </h2>
          <p className="text-(--text-secondary) leading-relaxed mb-6">
            {t('spokes.mutual_aid.year_round.lead')}
          </p>
          <div className="space-y-6">
            {(
              [
                ['roads_heading', 'roads_body'],
                ['chipping_heading', 'chipping_body'],
                ['water_heading', 'water_body'],
                ['driveway_heading', 'driveway_body'],
              ] as const
            ).map(([headingKey, bodyKey]) => (
              <div key={headingKey}>
                <h3 className="text-xl font-semibold text-(--text-primary) mb-2">
                  {t(`spokes.mutual_aid.year_round.${headingKey}`)}
                </h3>
                <p className="text-(--text-secondary) leading-relaxed">
                  {t(`spokes.mutual_aid.year_round.${bodyKey}`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Neighbor check-in lists */}
        <section className="pb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-(--text-primary) mb-4">
            {t('spokes.mutual_aid.checkin.heading')}
          </h2>
          <p className="text-(--text-secondary) leading-relaxed mb-4">
            {t('spokes.mutual_aid.checkin.lead_body')}
          </p>
          <p className="text-(--text-secondary) leading-relaxed">
            {t('spokes.mutual_aid.checkin.body')}
          </p>
        </section>

        {/* Communications during incidents */}
        <section className="pb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-(--text-primary) mb-4">
            {t('spokes.mutual_aid.comms.heading')}
          </h2>
          <TipCallout title={t('spokes.mutual_aid.comms.tip_title')}>
            <p>{t('spokes.mutual_aid.comms.tip_body')}</p>
          </TipCallout>
          <p className="text-(--text-secondary) leading-relaxed mb-6">
            {t('spokes.mutual_aid.comms.lead')}
          </p>
          <div className="space-y-6">
            {(
              [
                ['phone_tree_heading', 'phone_tree_body'],
                ['frs_heading', 'frs_body'],
                ['ham_heading', 'ham_body'],
                ['rally_heading', 'rally_body'],
              ] as const
            ).map(([headingKey, bodyKey]) => (
              <div key={headingKey}>
                <h3 className="text-xl font-semibold text-(--text-primary) mb-2">
                  {t(`spokes.mutual_aid.comms.${headingKey}`)}
                </h3>
                <p className="text-(--text-secondary) leading-relaxed">
                  {t(`spokes.mutual_aid.comms.${bodyKey}`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* When help is help — and when it's interference */}
        <section className="pb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-(--text-primary) mb-4">
            {t('spokes.mutual_aid.line.heading')}
          </h2>
          <NeverRule title={t('spokes.mutual_aid.line.never_title')}>
            <p>{t('spokes.mutual_aid.line.never_body')}</p>
          </NeverRule>
          <p className="text-(--text-secondary) leading-relaxed">
            {t('spokes.mutual_aid.line.body')}
          </p>
        </section>

        {/* After the fire */}
        <section className="pb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-(--text-primary) mb-4">
            {t('spokes.mutual_aid.after.heading')}
          </h2>
          <p className="text-(--text-secondary) leading-relaxed mb-4">
            {t('spokes.mutual_aid.after.lead')}
          </p>
          <p className="text-(--text-secondary) leading-relaxed mb-6">
            {t('spokes.mutual_aid.after.body')}
          </p>
          <h3 className="text-xl font-semibold text-(--text-primary) mb-2">
            {t('spokes.mutual_aid.after.emotional_heading')}
          </h3>
          <p className="text-(--text-secondary) leading-relaxed">
            {t('spokes.mutual_aid.after.emotional_body')}
          </p>
        </section>

        {/* Printable mutual-aid checklist */}
        <section className="pb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-(--text-primary) mb-3">
            {t('spokes.mutual_aid.checklist.heading')}
          </h2>
          <p className="text-(--text-secondary) leading-relaxed mb-6">
            {t('spokes.mutual_aid.checklist.lead')}
          </p>
          <div className="rounded-xl border border-stone-200 bg-white p-6 md:p-8 print:border-0 print:p-0">
            <ChecklistGroup
              heading={t('spokes.mutual_aid.checklist.annual_heading')}
              items={[
                'Pre-clear shoulders of community roads',
                'Chipping day organized',
                'Water-source map updated',
                'Neighbor check-in list updated (with permission)',
                'Phone tree refreshed',
              ]}
            />
            <ChecklistGroup
              heading={t('spokes.mutual_aid.checklist.preflag_heading')}
              items={[
                'Phone tree activated for situational awareness',
                'Check-in list called through',
                'Anyone away from home identified (so others can check their property if needed)',
                'FRS/GMRS handhelds charged and on',
              ]}
            />
            <ChecklistGroup
              heading={t('spokes.mutual_aid.checklist.active_heading')}
              items={[
                'Stay in your role: your property, your neighbors at their request, evacuation',
                "Stay out of the firefighter's role: the fire line, the water draft sources, the closed roads",
                'Communicate via established phone tree / radio channel',
                'Call 911 only for genuine emergencies',
              ]}
            />
            <ChecklistGroup
              heading={t('spokes.mutual_aid.checklist.after_heading')}
              items={[
                'Damage assessment support (insurance, photos, claims)',
                'Continue check-ins for the residents most affected',
                'Coordinate community recovery resource access',
              ]}
              last
            />
          </div>
        </section>

        {/* Print button (bottom) */}
        <div className="flex justify-center pb-8 print:hidden">
          <PrintButton />
        </div>

        {/* Footer */}
        <footer className="pb-12 pt-4 border-t border-stone-200">
          <Link
            href="/resources/wildfire-preparedness"
            className="text-teal-600 hover:text-terra-400 underline transition-colors"
          >
            ← {t('common.back_to_hub')}
          </Link>
        </footer>
      </div>
    </main>
  );
}

function ChecklistGroup({
  heading,
  items,
  last = false,
}: {
  heading: string;
  items: string[];
  last?: boolean;
}) {
  return (
    <div className={last ? '' : 'mb-6'}>
      <h3 className="text-lg font-semibold text-(--text-primary) mb-3">{heading}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-(--text-secondary)">
            <span
              aria-hidden="true"
              className="mt-1 inline-block h-4 w-4 shrink-0 rounded border border-stone-300"
            />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
