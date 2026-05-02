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
  title: 'Animals & Livestock — Wildfire Preparedness for Ranchita',
  description:
    'Standalone, comprehensive coverage for pets and livestock — multi-dog households, horses, goats, chickens, evacuation kits, pre-identified destinations, shelter-in-place protocols, trailer practice, and a printable pre-fire checklist for Ranchita property owners.',
};

export default async function AnimalsAndLivestockPage() {
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
            {t('spokes.animals.title')}
          </h1>
          <p className="text-lg text-(--text-secondary) max-w-3xl mb-3">
            {t('spokes.animals.description')}
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
        <TipCallout title={t('spokes.animals.intro.tip_title')}>
          <p>{t('spokes.animals.intro.tip_body')}</p>
        </TipCallout>

        {/* The basic principle */}
        <section className="pb-10 pt-4">
          <h2 className="text-2xl md:text-3xl font-bold text-(--text-primary) mb-4">
            {t('spokes.animals.principle.heading')}
          </h2>
          <p className="text-(--text-secondary) leading-relaxed">
            {t('spokes.animals.principle.body')}
          </p>
        </section>

        {/* Multi-pet households */}
        <section className="pb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-(--text-primary) mb-4">
            {t('spokes.animals.multipet.heading')}
          </h2>
          <p className="text-(--text-secondary) leading-relaxed">
            {t('spokes.animals.multipet.body')}
          </p>
        </section>

        {/* Pet evacuation kit */}
        <section className="pb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-(--text-primary) mb-4">
            {t('spokes.animals.kit.heading')}
          </h2>
          <p className="text-(--text-secondary) leading-relaxed mb-4">
            {t('spokes.animals.kit.lead')}
          </p>
          <RequiredAction title={t('spokes.animals.kit.heading')}>
            <ul className="space-y-3">
              {(
                [
                  ['food_label', 'food_body'],
                  ['water_label', 'water_body'],
                  ['meds_label', 'meds_body'],
                  ['records_label', 'records_body'],
                  ['comfort_label', 'comfort_body'],
                  ['firstaid_label', 'firstaid_body'],
                  ['transport_label', 'transport_body'],
                ] as const
              ).map(([labelKey, bodyKey]) => (
                <li key={labelKey} className="text-(--text-primary) leading-relaxed">
                  <span className="font-semibold">
                    {t(`spokes.animals.kit.${labelKey}`)}:
                  </span>{' '}
                  {t(`spokes.animals.kit.${bodyKey}`)}
                </li>
              ))}
            </ul>
          </RequiredAction>
        </section>

        {/* Species-specific sections */}
        <section className="pb-10">
          <div className="space-y-8">
            {(['horses', 'small_livestock', 'poultry', 'pigs'] as const).map(
              (slug) => (
                <div key={slug}>
                  <h2 className="text-2xl md:text-3xl font-bold text-(--text-primary) mb-3">
                    {t(`spokes.animals.${slug}.heading`)}
                  </h2>
                  <p className="text-(--text-secondary) leading-relaxed">
                    {t(`spokes.animals.${slug}.body`)}
                  </p>
                </div>
              ),
            )}
          </div>
        </section>

        {/* Shelter-in-place */}
        <section className="pb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-(--text-primary) mb-4">
            {t('spokes.animals.shelter_in_place.heading')}
          </h2>
          <CriticalCallout title={t('spokes.animals.shelter_in_place.critical_title')}>
            <p>{t('spokes.animals.shelter_in_place.critical_body')}</p>
          </CriticalCallout>
          <p className="text-(--text-secondary) leading-relaxed">
            {t('spokes.animals.shelter_in_place.body')}
          </p>
        </section>

        {/* Pre-identified destinations */}
        <section className="pb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-(--text-primary) mb-4">
            {t('spokes.animals.destinations.heading')}
          </h2>
          <RequiredAction title={t('spokes.animals.destinations.required_title')}>
            <p>{t('spokes.animals.destinations.required_body')}</p>
          </RequiredAction>

          <div className="overflow-x-auto rounded-xl border border-stone-200">
            <table className="w-full text-left">
              <thead className="bg-stone-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-(--text-primary)">
                    Site
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-(--text-primary)">
                    Address
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-(--text-primary)">
                    Notes
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-(--text-primary)">
                    Phone
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-sm">
                <tr>
                  <td className="px-4 py-4 align-top font-medium text-(--text-primary)">
                    {t('spokes.animals.destinations.site_djlep_name')}
                  </td>
                  <td className="px-4 py-4 align-top text-(--text-secondary)">
                    {t('spokes.animals.destinations.site_djlep_address')}
                  </td>
                  <td className="px-4 py-4 align-top text-(--text-secondary)">
                    {t('spokes.animals.destinations.site_djlep_notes')}
                  </td>
                  <td className="px-4 py-4 align-top text-(--text-secondary)">
                    Call 211
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4 align-top font-medium text-(--text-primary)">
                    {t('spokes.animals.destinations.site_lakeside_name')}
                  </td>
                  <td className="px-4 py-4 align-top text-(--text-secondary)">
                    {t('spokes.animals.destinations.site_lakeside_address')}
                  </td>
                  <td className="px-4 py-4 align-top text-(--text-secondary)">
                    {t('spokes.animals.destinations.site_lakeside_notes')}
                  </td>
                  <td className="px-4 py-4 align-top text-(--text-secondary)">
                    Call 211
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4 align-top font-medium text-(--text-primary)">
                    {t('spokes.animals.destinations.site_iron_oak_name')}
                  </td>
                  <td className="px-4 py-4 align-top text-(--text-secondary)">
                    {t('spokes.animals.destinations.site_iron_oak_address')}
                  </td>
                  <td className="px-4 py-4 align-top text-(--text-secondary)">
                    {t('spokes.animals.destinations.site_iron_oak_notes')}
                  </td>
                  <td className="px-4 py-4 align-top text-(--text-secondary)">
                    Call 211
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4 align-top font-medium text-(--text-primary)">
                    {t('spokes.animals.destinations.site_delmar_name')}
                  </td>
                  <td className="px-4 py-4 align-top text-(--text-secondary)">
                    {t('spokes.animals.destinations.site_delmar_address')}
                  </td>
                  <td className="px-4 py-4 align-top text-(--text-secondary)">
                    {t('spokes.animals.destinations.site_delmar_notes')}
                  </td>
                  <td className="px-4 py-4 align-top text-(--text-secondary)">
                    <a
                      href="tel:8587551161"
                      className="text-teal-600 hover:text-terra-400 underline transition-colors"
                    >
                      {t('spokes.animals.destinations.site_delmar_phone')}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4 align-top font-medium text-(--text-primary)">
                    {t('spokes.animals.destinations.site_sdhs_name')}
                  </td>
                  <td className="px-4 py-4 align-top text-(--text-secondary)">
                    —
                  </td>
                  <td className="px-4 py-4 align-top text-(--text-secondary)">
                    {t('spokes.animals.destinations.site_sdhs_notes')}
                  </td>
                  <td className="px-4 py-4 align-top text-(--text-secondary)">
                    <a
                      href="tel:6192362341"
                      className="text-teal-600 hover:text-terra-400 underline transition-colors"
                    >
                      {t('spokes.animals.destinations.site_sdhs_phone')}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4 align-top font-medium text-(--text-primary)">
                    {t('spokes.animals.destinations.info_line_label')}
                  </td>
                  <td className="px-4 py-4 align-top text-(--text-secondary)">
                    —
                  </td>
                  <td className="px-4 py-4 align-top text-(--text-secondary)">
                    {t('spokes.animals.destinations.info_line_notes')}
                  </td>
                  <td className="px-4 py-4 align-top text-(--text-secondary)">
                    <a
                      href="tel:211"
                      className="text-teal-600 hover:text-terra-400 underline transition-colors"
                    >
                      {t('spokes.animals.destinations.info_line_value')}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <TipCallout title={t('spokes.animals.destinations.tip_title')}>
            <p>{t('spokes.animals.destinations.tip_body')}</p>
          </TipCallout>
        </section>

        {/* Trailer practice / Insurance / Hay storage / Water dual-use */}
        <section className="pb-10">
          <div className="space-y-8">
            {(
              [
                'trailer_practice',
                'insurance',
                'hay_storage',
                'water_dual_use',
              ] as const
            ).map((slug) => (
              <div key={slug}>
                <h2 className="text-2xl md:text-3xl font-bold text-(--text-primary) mb-3">
                  {t(`spokes.animals.${slug}.heading`)}
                </h2>
                <p className="text-(--text-secondary) leading-relaxed">
                  {t(`spokes.animals.${slug}.body`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Trigger */}
        <section className="pb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-(--text-primary) mb-4">
            {t('spokes.animals.trigger.heading')}
          </h2>
          <CriticalCallout title={t('spokes.animals.trigger.critical_title')}>
            <p>{t('spokes.animals.trigger.critical_body')}</p>
          </CriticalCallout>
        </section>

        {/* Printable animals checklist */}
        <section className="pb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-(--text-primary) mb-3">
            {t('spokes.animals.checklist.heading')}
          </h2>
          <p className="text-(--text-secondary) leading-relaxed mb-6">
            {t('spokes.animals.checklist.lead')}
          </p>
          <div className="rounded-xl border border-stone-200 bg-white p-6 md:p-8 print:border-0 print:p-0">
            <ChecklistGroup
              heading={t('spokes.animals.checklist.daily_heading')}
              items={[
                'Trailer hitched and accessible during fire season',
                'Trailer fueled (vehicle full tank during Santa Ana watches)',
                'Halters/leads in known-accessible location',
                'Water containers (non-combustible) available',
              ]}
            />
            <ChecklistGroup
              heading={t('spokes.animals.checklist.kit_heading')}
              items={[
                '7 days of food per animal',
                '7 days of water per animal (per gallons/day requirements)',
                'Medications (1 week + written prescriptions)',
                'Records (vaccination, microchip, photos)',
                'ID (collar tag, microchip current, paint markings ready for livestock)',
              ]}
            />
            <ChecklistGroup
              heading={t('spokes.animals.checklist.quarterly_heading')}
              items={[
                'Trailer practice — load every animal you would evacuate',
                'Refresh photos in records',
                'Confirm destination phone numbers',
                'Check water-source markings for fire crews',
              ]}
            />
            <ChecklistGroup
              heading={t('spokes.animals.checklist.annual_heading')}
              items={[
                'Veterinary check-up + records updated',
                'Insurance documentation refresh',
              ]}
            />
            <ChecklistGroup
              heading={t('spokes.animals.checklist.redflag_heading')}
              items={[
                'Vehicle full tank, trailer hitched',
                'Go-kit in vehicle or staged at door',
                'Animals identifiable (ID applied, paint marks if livestock)',
                'Water containers filled',
                'Confirmed Genasys Protect zone for property',
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
