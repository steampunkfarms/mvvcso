import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import {
  CriticalCallout,
  RequiredAction,
  TipCallout,
} from '@/components/resources/callouts';
import { PrintButton } from '@/components/resources/print-button';
import { ZoneDiagram } from '@/components/resources/zone-diagram';

export const metadata: Metadata = {
  title: 'Prepare — Wildfire Preparedness for Ranchita',
  description:
    'Defensible space, home hardening, rural-property specifics, chaparral considerations, seasonal maintenance calendar, and a printable inspection checklist for Ranchita and Montezuma Valley properties.',
};

export default async function PreparePage() {
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
            {t('spokes.prepare.title')}
          </h1>
          <p className="text-lg text-(--text-secondary) max-w-3xl mb-3">
            {t('spokes.prepare.description')}
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

        {/* Intro callout */}
        <TipCallout title="About defensible space">
          <p>{t('spokes.prepare.intro.lead')}</p>
        </TipCallout>

        {/* Defensible Space — the three zones */}
        <section className="pb-10 pt-4">
          <h2 className="text-2xl md:text-3xl font-bold text-(--text-primary) mb-4">
            {t('spokes.prepare.zones.heading')}
          </h2>
          <p className="text-(--text-secondary) leading-relaxed mb-2">
            {t('spokes.prepare.zones.lead')}
          </p>

          <ZoneDiagram
            labels={{
              house: t('spokes.prepare.zones.diagram_label_house'),
              zone0: t('spokes.prepare.zones.diagram_label_zone0'),
              zone1: t('spokes.prepare.zones.diagram_label_zone1'),
              zone2: t('spokes.prepare.zones.diagram_label_zone2'),
              slopeNote: t('spokes.prepare.zones.slope_note'),
              sdCountyNote: t('spokes.prepare.zones.sd_county_note'),
            }}
            ariaLabel={t('spokes.prepare.zones.diagram_aria')}
          />

          {/* Zone 0 */}
          <h3 className="text-xl font-bold text-(--text-primary) mt-8 mb-3">
            {t('spokes.prepare.zone0.heading')}
          </h3>
          <CriticalCallout title="Regulatory status">
            <p>{t('spokes.prepare.zone0.regulatory_note')}</p>
          </CriticalCallout>
          <p className="text-(--text-secondary) leading-relaxed">
            {t('spokes.prepare.zone0.body')}
          </p>

          {/* Zone 1 */}
          <h3 className="text-xl font-bold text-(--text-primary) mt-8 mb-3">
            {t('spokes.prepare.zone1.heading')}
          </h3>
          <RequiredAction title="San Diego County requirement">
            <p>{t('spokes.prepare.zone1.required_action')}</p>
          </RequiredAction>
          <p className="text-(--text-secondary) leading-relaxed">
            {t('spokes.prepare.zone1.body')}
          </p>

          {/* Zone 2 */}
          <h3 className="text-xl font-bold text-(--text-primary) mt-8 mb-3">
            {t('spokes.prepare.zone2.heading')}
          </h3>
          <p className="text-(--text-secondary) leading-relaxed">
            {t('spokes.prepare.zone2.body')}
          </p>

          {/* Slope adjustments */}
          <h3 className="text-xl font-bold text-(--text-primary) mt-8 mb-3">
            {t('spokes.prepare.slope.heading')}
          </h3>
          <p className="text-(--text-secondary) leading-relaxed">
            {t('spokes.prepare.slope.body')}
          </p>
        </section>

        {/* Home hardening */}
        <section className="pb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-(--text-primary) mb-4">
            {t('spokes.prepare.hardening.heading')}
          </h2>
          <p className="text-(--text-secondary) leading-relaxed mb-6">
            {t('spokes.prepare.hardening.lead')}
          </p>

          <div className="space-y-6">
            {(
              [
                'roof',
                'vents',
                'eaves',
                'windows',
                'siding',
                'decks',
                'chimneys',
                'garage',
                'fences',
              ] as const
            ).map((slug) => (
              <div key={slug}>
                <h3 className="text-xl font-semibold text-(--text-primary) mb-2">
                  {t(`spokes.prepare.hardening.${slug}.heading`)}
                </h3>
                <p className="text-(--text-secondary) leading-relaxed">
                  {t(`spokes.prepare.hardening.${slug}.body`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Rural-property specifics */}
        <section className="pb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-(--text-primary) mb-4">
            {t('spokes.prepare.rural.heading')}
          </h2>
          <p className="text-(--text-secondary) leading-relaxed mb-6">
            {t('spokes.prepare.rural.lead')}
          </p>

          <div className="space-y-6">
            {(
              [
                'outbuildings',
                'propane',
                'water',
                'driveway',
                'solar',
              ] as const
            ).map((slug) => (
              <div key={slug}>
                <h3 className="text-xl font-semibold text-(--text-primary) mb-2">
                  {t(`spokes.prepare.rural.${slug}.heading`)}
                </h3>
                <p className="text-(--text-secondary) leading-relaxed">
                  {t(`spokes.prepare.rural.${slug}.body`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Chaparral */}
        <section className="pb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-(--text-primary) mb-4">
            {t('spokes.prepare.chaparral.heading')}
          </h2>
          <TipCallout title={t('spokes.prepare.chaparral.tip_title')}>
            <p>{t('spokes.prepare.chaparral.tip_body')}</p>
          </TipCallout>
          <p className="text-(--text-secondary) leading-relaxed">
            {t('spokes.prepare.chaparral.body')}
          </p>
        </section>

        {/* Seasonal maintenance calendar */}
        <section className="pb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-(--text-primary) mb-4">
            {t('spokes.prepare.calendar.heading')}
          </h2>
          <p className="text-(--text-secondary) leading-relaxed mb-6">
            {t('spokes.prepare.calendar.lead')}
          </p>
          <div className="overflow-x-auto rounded-xl border border-stone-200">
            <table className="w-full text-left">
              <thead className="bg-stone-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-(--text-primary) w-1/4">
                    Window
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-(--text-primary)">
                    Tasks
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {(
                  [
                    ['preseason_label', 'preseason_tasks'],
                    ['season_label', 'season_tasks'],
                    ['postseason_label', 'postseason_tasks'],
                    ['quarterly_label', 'quarterly_tasks'],
                  ] as const
                ).map(([labelKey, tasksKey]) => (
                  <tr key={labelKey}>
                    <td className="px-4 py-4 align-top font-medium text-(--text-primary)">
                      {t(`spokes.prepare.calendar.${labelKey}`)}
                    </td>
                    <td className="px-4 py-4 text-(--text-secondary) leading-relaxed">
                      {t(`spokes.prepare.calendar.${tasksKey}`)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Printable inspection checklist */}
        <section className="pb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-(--text-primary) mb-3">
            {t('spokes.prepare.checklist.heading')}
          </h2>
          <p className="text-(--text-secondary) leading-relaxed mb-6">
            {t('spokes.prepare.checklist.lead')}
          </p>
          <div className="rounded-xl border border-stone-200 bg-white p-6 md:p-8 print:border-0 print:p-0">
            <ChecklistGroup
              heading={t('spokes.prepare.checklist.zone0_heading')}
              items={[
                'Hardscape (gravel/pavers/concrete) replacing bark mulch',
                'No combustible furniture, planters, doormats within 5 ft',
                'No stored firewood within 5 ft',
                'Roof, gutters, deck, porch clear of leaves and needles',
                'Branches trimmed 10 ft from chimneys and stovepipes',
              ]}
            />
            <ChecklistGroup
              heading={t('spokes.prepare.checklist.zone1_heading')}
              items={[
                'Dead vegetation removed',
                'Tree branches trimmed 6 ft above ground',
                'Vertical spacing between shrubs and trees (height × 3)',
                'Horizontal spacing between shrubs adjusted for slope',
                'No firewood stacked against the house',
                'Outbuildings: 10 ft bare-soil clearance + 10 ft no-flam-veg',
                'Propane tanks: 10 ft bare-soil clearance + 10 ft no-flam-veg',
              ]}
            />
            <ChecklistGroup
              heading={t('spokes.prepare.checklist.zone2_heading')}
              items={[
                'Annual grass mowed to 4-inch maximum',
                'Fallen leaves and needles removed (3-inch max depth)',
                'Shrubs and trees thinned',
                'Slope adjustments applied where applicable',
              ]}
            />
            <ChecklistGroup
              heading={t('spokes.prepare.checklist.hardening_heading')}
              items={[
                'Class A roof confirmed (composition shingle / tile / metal)',
                'Vent mesh 1/16 to 1/8 inch, non-combustible metal',
                'Eaves enclosed with non-combustible material',
                'Windows dual-paned with at least one tempered layer',
                'Chimney spark arrestor 3/8 to 1/2 inch',
                'Garage door weather-stripped',
                'Fence: non-combustible section at house connection',
              ]}
            />
            <ChecklistGroup
              heading={t('spokes.prepare.checklist.rural_heading')}
              items={[
                'Driveway: 10 ft horizontal clearance, 14 ft overhead',
                'Address number visible from road, reflective',
                'Water tank / pool / trough marked for fire crews',
                'Well location marked',
                'Solar inverter / battery enclosure hardened',
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
