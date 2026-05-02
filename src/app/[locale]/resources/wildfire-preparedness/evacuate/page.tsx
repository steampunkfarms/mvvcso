import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import {
  CriticalCallout,
  RequiredAction,
  TipCallout,
} from '@/components/resources/callouts';
import { PrintButton } from '@/components/resources/print-button';

export const metadata: Metadata = {
  title: 'Evacuate — Wildfire Preparedness for Ranchita',
  description:
    'The Set, Go, and Return phases. Routes from Ranchita, trigger points to leave during the watch, what to do if trapped, apps and alerts, PSPS preparedness, smoke and air quality, and re-entry safety.',
};

export default async function EvacuatePage() {
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
            {t('spokes.evacuate.title')}
          </h1>
          <p className="text-lg text-(--text-secondary) max-w-3xl mb-3">
            {t('spokes.evacuate.description')}
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

        {/* Intro callout — the page's spine */}
        <CriticalCallout title={t('spokes.evacuate.intro.critical_title')}>
          <p>{t('spokes.evacuate.intro.critical_body')}</p>
        </CriticalCallout>

        {/* Framework on the day of a fire */}
        <section className="pb-10 pt-4">
          <h2 className="text-2xl md:text-3xl font-bold text-(--text-primary) mb-4">
            {t('spokes.evacuate.framework.heading')}
          </h2>
          <p className="text-(--text-secondary) leading-relaxed">
            {t('spokes.evacuate.framework.body')}
          </p>
        </section>

        {/* Set / Go / Return phases */}
        <section className="pb-10">
          <div className="space-y-8">
            {(['set_phase', 'go_phase', 'return_phase'] as const).map((slug) => (
              <div key={slug}>
                <h2 className="text-2xl md:text-3xl font-bold text-(--text-primary) mb-3">
                  {t(`spokes.evacuate.${slug}.heading`)}
                </h2>
                <p className="text-(--text-secondary) leading-relaxed">
                  {t(`spokes.evacuate.${slug}.body`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Routes from Ranchita */}
        <section className="pb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-(--text-primary) mb-4">
            {t('spokes.evacuate.routes.heading')}
          </h2>
          <TipCallout title={t('spokes.evacuate.routes.tip_title')}>
            <p>{t('spokes.evacuate.routes.tip_body')}</p>
          </TipCallout>
          <p className="text-(--text-secondary) leading-relaxed">
            {t('spokes.evacuate.routes.body')}
          </p>
        </section>

        {/* Triggers — when to leave early */}
        <section className="pb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-(--text-primary) mb-4">
            {t('spokes.evacuate.triggers.heading')}
          </h2>
          <RequiredAction title={t('spokes.evacuate.triggers.required_title')}>
            <p>{t('spokes.evacuate.triggers.required_body')}</p>
          </RequiredAction>
          <p className="text-(--text-secondary) leading-relaxed">
            {t('spokes.evacuate.triggers.body')}
          </p>
        </section>

        {/* What to do if trapped */}
        <section className="pb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-(--text-primary) mb-4">
            {t('spokes.evacuate.trapped.heading')}
          </h2>
          <CriticalCallout title={t('spokes.evacuate.trapped.critical_title')}>
            <p>{t('spokes.evacuate.trapped.critical_body')}</p>
          </CriticalCallout>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-(--text-primary) mb-2">
                {t('spokes.evacuate.trapped.vehicle_heading')}
              </h3>
              <p className="text-(--text-secondary) leading-relaxed">
                {t('spokes.evacuate.trapped.vehicle_body')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-(--text-primary) mb-2">
                {t('spokes.evacuate.trapped.home_heading')}
              </h3>
              <p className="text-(--text-secondary) leading-relaxed">
                {t('spokes.evacuate.trapped.home_body')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-(--text-primary) mb-2">
                {t('spokes.evacuate.trapped.foot_heading')}
              </h3>
              <p className="text-(--text-secondary) leading-relaxed">
                {t('spokes.evacuate.trapped.foot_body')}
              </p>
            </div>
          </div>
        </section>

        {/* Apps and alerts */}
        <section className="pb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-(--text-primary) mb-4">
            {t('spokes.evacuate.apps.heading')}
          </h2>
          <p className="text-(--text-secondary) leading-relaxed mb-4">
            {t('spokes.evacuate.apps.lead')}
          </p>
          <RequiredAction title="Install these first">
            <ul className="space-y-3">
              {(['genasys', 'alert', 'sdge'] as const).map((slug) => (
                <li key={slug} className="text-(--text-primary) leading-relaxed">
                  <span className="font-semibold">
                    {t(`spokes.evacuate.apps.${slug}_label`)}:
                  </span>{' '}
                  {t(`spokes.evacuate.apps.${slug}_body`)}
                </li>
              ))}
            </ul>
          </RequiredAction>
          <TipCallout title="Useful situational awareness">
            <ul className="space-y-3">
              {(['watchduty', 'pulsepoint', 'airnow'] as const).map((slug) => (
                <li key={slug} className="text-(--text-primary) leading-relaxed">
                  <span className="font-semibold">
                    {t(`spokes.evacuate.apps.${slug}_label`)}:
                  </span>{' '}
                  {t(`spokes.evacuate.apps.${slug}_body`)}
                </li>
              ))}
            </ul>
          </TipCallout>
        </section>

        {/* PSPS */}
        <section className="pb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-(--text-primary) mb-4">
            {t('spokes.evacuate.psps.heading')}
          </h2>
          <p className="text-(--text-secondary) leading-relaxed mb-4">
            {t('spokes.evacuate.psps.lead')}
          </p>
          <p className="text-(--text-secondary) leading-relaxed mb-6">
            {t('spokes.evacuate.psps.cadence_body')}
          </p>
          <h3 className="text-xl font-semibold text-(--text-primary) mb-2">
            {t('spokes.evacuate.psps.what_to_do_heading')}
          </h3>
          <p className="text-(--text-secondary) leading-relaxed">
            {t('spokes.evacuate.psps.what_to_do_body')}
          </p>
        </section>

        {/* Smoke and air quality */}
        <section className="pb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-(--text-primary) mb-4">
            {t('spokes.evacuate.smoke.heading')}
          </h2>
          <TipCallout title={t('spokes.evacuate.smoke.tip_title')}>
            <p>{t('spokes.evacuate.smoke.tip_body')}</p>
          </TipCallout>
          <p className="text-(--text-secondary) leading-relaxed mb-6">
            {t('spokes.evacuate.smoke.body')}
          </p>
          <div className="space-y-6">
            {(
              [
                ['indoor_heading', 'indoor_body'],
                ['masks_heading', 'masks_body'],
                ['vulnerable_heading', 'vulnerable_body'],
              ] as const
            ).map(([headingKey, bodyKey]) => (
              <div key={headingKey}>
                <h3 className="text-xl font-semibold text-(--text-primary) mb-2">
                  {t(`spokes.evacuate.smoke.${headingKey}`)}
                </h3>
                <p className="text-(--text-secondary) leading-relaxed">
                  {t(`spokes.evacuate.smoke.${bodyKey}`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Re-entry safety */}
        <section className="pb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-(--text-primary) mb-4">
            {t('spokes.evacuate.reentry.heading')}
          </h2>
          <p className="text-(--text-secondary) leading-relaxed mb-4">
            {t('spokes.evacuate.reentry.lead_body')}
          </p>
          <p className="text-(--text-secondary) leading-relaxed mb-6">
            {t('spokes.evacuate.reentry.body')}
          </p>
          <h3 className="text-xl font-semibold text-(--text-primary) mb-2">
            {t('spokes.evacuate.reentry.ppe_heading')}
          </h3>
          <p className="text-(--text-secondary) leading-relaxed">
            {t('spokes.evacuate.reentry.ppe_body')}
          </p>
        </section>

        {/* Printable evacuate-phase checklist */}
        <section className="pb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-(--text-primary) mb-3">
            {t('spokes.evacuate.checklist.heading')}
          </h2>
          <p className="text-(--text-secondary) leading-relaxed mb-6">
            {t('spokes.evacuate.checklist.lead')}
          </p>
          <div className="rounded-xl border border-stone-200 bg-white p-6 md:p-8 print:border-0 print:p-0">
            <ChecklistGroup
              heading={t('spokes.evacuate.checklist.set_heading')}
              items={[
                'Go-bag in vehicle',
                'Vehicle fueled (at least half tank)',
                'Animals ID-applied (collars, paint marks, leg bands)',
                'Trailer hitched if you have animals',
                'Neighbors with limited mobility checked on',
                'Protective clothing accessible (long pants, long sleeves, cap, eye protection)',
                'Phones charged; backup battery available',
              ]}
            />
            <ChecklistGroup
              heading={t('spokes.evacuate.checklist.go_heading')}
              items={[
                'Leave immediately on the planned route',
                'Headlights on, recirc air on, windows up',
                'Bring neighbors without transport',
                'Stay on pavement — no fire roads',
                "Don't pass on narrow roads in low visibility",
              ]}
            />
            <ChecklistGroup
              heading={t('spokes.evacuate.checklist.vehicle_heading')}
              items={[
                'Park on pavement, outside turn, away from vegetation',
                'Headlights and emergency flashers on',
                'Windows and doors closed, vents closed, A/C off',
                'Below windows, floor of vehicle, wool blanket if available',
                'Call 911 with location',
                'Stay in the vehicle until the fire front passes',
              ]}
            />
            <ChecklistGroup
              heading={t('spokes.evacuate.checklist.home_heading')}
              items={[
                'Stay inside; doors and windows closed but unlocked',
                'Flammables moved 30 ft from house',
                'Gas and propane shut off',
                'Gates open',
                'Tubs, sinks, garbage cans filled with water',
                'Move to interior room with smallest windows',
              ]}
            />
            <ChecklistGroup
              heading={t('spokes.evacuate.checklist.return_heading')}
              items={[
                'Wait for official re-entry authorization',
                'PPE: long pants, long sleeves, gloves, boots, N95/P100',
                'Document with photos before moving anything',
                'Inspect for hot embers (mulch, attic, deck, woodpile)',
                'Check power lines, gas pilots, water lines',
                'Contact insurance',
              ]}
            />
            <ChecklistGroup
              heading={t('spokes.evacuate.checklist.apps_heading')}
              items={[
                'Genasys Protect (zone code recorded)',
                'AlertSanDiego (registered)',
                'SDG&E Alerts',
                'Watch Duty',
                'PulsePoint',
                'AirNow',
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
