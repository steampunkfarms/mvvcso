import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ShieldCheck, Heart, Siren, Users } from 'lucide-react';
import { CriticalCallout, TipCallout } from '@/components/resources/callouts';
import { TopicJumpGrid, type JumpItem } from '@/components/resources/topic-jump-grid';
import { PrintButton } from '@/components/resources/print-button';

export const metadata: Metadata = {
  title: 'Wildfire Preparedness for Ranchita',
  description:
    "Backcountry-tailored wildfire preparedness for Ranchita and the Montezuma Valley. Built on CAL FIRE's Ready for Wildfire program and San Diego County's Ready, Set, Go! framework, with Ranchita-specific guidance for defensible space, animals and livestock, evacuation, and mutual aid.",
};

export default async function WildfirePreparednessPage() {
  const t = await getTranslations('wildfire_prep');
  const tContact = await getTranslations('contact');

  const spokeItems: JumpItem[] = [
    {
      id: 'prepare',
      title: t('spokes.prepare.title'),
      description: t('spokes.prepare.description'),
      icon: <ShieldCheck className="h-6 w-6" aria-hidden="true" />,
      href: '/resources/wildfire-preparedness/prepare',
    },
    {
      id: 'animals',
      title: t('spokes.animals.title'),
      description: t('spokes.animals.description'),
      icon: <Heart className="h-6 w-6" aria-hidden="true" />,
      href: '/resources/wildfire-preparedness/animals-and-livestock',
    },
    {
      id: 'evacuate',
      title: t('spokes.evacuate.title'),
      description: t('spokes.evacuate.description'),
      icon: <Siren className="h-6 w-6" aria-hidden="true" />,
      href: '/resources/wildfire-preparedness/evacuate',
    },
    {
      id: 'mutual-aid',
      title: t('spokes.mutual_aid.title'),
      description: t('spokes.mutual_aid.description'),
      icon: <Users className="h-6 w-6" aria-hidden="true" />,
      href: '/resources/wildfire-preparedness/mutual-aid',
    },
  ];

  return (
    <main>
      {/* Hero band */}
      <section className="py-(--section-padding) bg-stone-200/20">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding) text-center">
          <div className="flex justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 64"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="w-16 h-16 text-terra-400"
            >
              <path d="M32 4 L56 14 L56 32 C56 46 44 56 32 60 C20 56 8 46 8 32 L8 14 Z" />
              <path d="M32 48 C26 48 22 44 22 38 C22 32 28 30 28 24 C28 24 30 28 30 30 C30 30 34 26 34 20 C34 20 42 28 42 38 C42 44 38 48 32 48 Z" />
              <path d="M32 44 C29 44 27 42 27 39 C27 36 30 34 30 34 C30 34 31 36 31 37 C31 37 34 34 35 31 C35 31 38 35 38 39 C38 42 35 44 32 44 Z" />
            </svg>
          </div>
          <span className="inline-block mb-4 px-3 py-1 rounded-full bg-gold-100 text-gold-600 text-sm font-medium">
            {t('hero.draft_badge')}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 text-(--text-primary)">
            {t('hero.title')}
          </h1>
          <p className="text-lg sm:text-xl text-(--text-secondary) max-w-2xl mx-auto mb-4">
            {t('hero.subtitle')}
          </p>
          <p className="text-sm text-(--text-secondary)">
            {t('hero.last_updated', { date: 'May 2026' })}
          </p>
        </div>
      </section>

      <div className="max-w-(--container-max) mx-auto px-(--container-padding)">
        {/* Why this matters in Ranchita */}
        <section className="py-10">
          <div className="bg-white rounded-xl border border-stone-200 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-(--text-primary) mb-4">
              {t('why.heading')}
            </h2>
            <p className="text-(--text-secondary) leading-relaxed mb-4">{t('why.para_1')}</p>
            <p className="text-(--text-secondary) leading-relaxed">{t('why.para_2')}</p>
          </div>
        </section>

        {/* Ready–Set–Go framework callout */}
        <TipCallout title={t('ready_set_go.tip_title')}>
          <p>{t('ready_set_go.tip_body')}</p>
        </TipCallout>

        {/* Print button (top) */}
        <div className="flex justify-end my-4">
          <PrintButton />
        </div>

        {/* Topic jump grid */}
        <section className="pb-10">
          <TopicJumpGrid items={spokeItems} ariaLabel="Wildfire preparedness topics" />
        </section>

        {/* Neighbor ethos */}
        <section className="pb-10">
          <h2 className="text-2xl font-bold text-(--text-primary) mb-4">
            {t('neighbor_ethos.heading')}
          </h2>
          <blockquote className="border-l-4 border-gold-300 bg-gold-50 rounded-r-xl pl-6 pr-6 py-5 text-(--text-secondary) leading-relaxed italic">
            {t('neighbor_ethos.body')}
          </blockquote>
        </section>

        {/* Local risk profile */}
        <section className="pb-10">
          <h2 className="text-2xl font-bold text-(--text-primary) mb-4">
            {t('risk.heading')}
          </h2>
          <div className="space-y-4">
            <p className="text-(--text-secondary) leading-relaxed">{t('risk.topography_para')}</p>
            <p className="text-(--text-secondary) leading-relaxed">{t('risk.fuels_para')}</p>
            <p className="text-(--text-secondary) leading-relaxed">{t('risk.winds_para')}</p>
            <p className="text-(--text-secondary) leading-relaxed">{t('risk.response_para')}</p>
          </div>
        </section>

        {/* Emergency contacts card */}
        <section className="pb-10">
          <div className="bg-white rounded-xl border border-stone-200 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-(--text-primary) mb-1">
              {t('contacts.heading')}
            </h2>
            <p className="text-(--text-secondary) mb-6 text-sm">{t('contacts.subhead')}</p>
            <div className="space-y-5">
              <div className="flex items-baseline gap-3">
                <a
                  href="tel:911"
                  className="text-3xl font-bold text-(--text-primary) hover:text-terra-400 transition-colors"
                >
                  {t('contacts.emergency_value')}
                </a>
                <span className="text-(--text-secondary) font-medium">{t('contacts.emergency_label')}</span>
              </div>
              <div className="border-t border-stone-100 pt-4">
                <div className="flex items-baseline gap-3 mb-1">
                  <a
                    href="tel:211"
                    className="text-xl font-semibold text-(--text-primary) hover:text-terra-400 transition-colors"
                  >
                    {t('contacts.info_value')}
                  </a>
                  <span className="text-(--text-secondary) font-medium">{t('contacts.info_label')}</span>
                </div>
                <p className="text-sm text-(--text-secondary)">{t('contacts.info_note')}</p>
              </div>
              <div className="border-t border-stone-100 pt-4">
                <p className="font-medium text-(--text-primary) mb-1">{t('contacts.genasys_label')}</p>
                <p className="text-sm text-(--text-secondary) mb-1">{t('contacts.genasys_note')}</p>
                <a
                  href="https://protect.genasys.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-teal-600 hover:text-terra-400 underline transition-colors"
                >
                  protect.genasys.com
                </a>
              </div>
              <div className="border-t border-stone-100 pt-4">
                <p className="font-medium text-(--text-primary) mb-1">{t('contacts.alert_label')}</p>
                <p className="text-sm text-(--text-secondary) mb-1">{t('contacts.alert_note')}</p>
                <a
                  href="https://www.alertsandiego.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-teal-600 hover:text-terra-400 underline transition-colors"
                >
                  alertsandiego.org
                </a>
              </div>
              <div className="border-t border-stone-100 pt-4">
                <p className="font-medium text-(--text-primary) mb-1">{t('contacts.watchduty_label')}</p>
                <p className="text-sm text-(--text-secondary)">{t('contacts.watchduty_note')}</p>
              </div>
              <div className="border-t border-stone-100 pt-4">
                <p className="font-medium text-(--text-primary) mb-1">{t('contacts.mvvcso_label')}</p>
                <a
                  href={`tel:${tContact('phone').replace(/\D/g, '')}`}
                  className="text-(--text-primary) hover:text-terra-400 transition-colors font-medium"
                >
                  {tContact('phone')}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* This guide does not replace official guidance */}
        <CriticalCallout title={t('not_replacement.title')}>
          <p>
            {t('not_replacement.body')}{' '}
            <a
              href="https://www.readyforwildfire.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-terra-400 transition-colors"
            >
              readyforwildfire.org
            </a>
            {' · '}
            <a
              href="https://www.sdcounty.ca.gov/oes"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-terra-400 transition-colors"
            >
              SD County OES
            </a>
          </p>
        </CriticalCallout>

        {/* Draft notice */}
        <section className="pb-10">
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-5">
            <p className="text-sm font-semibold text-(--text-primary) mb-1">{t('draft_notice.title')}</p>
            <p className="text-sm text-(--text-secondary)">{t('draft_notice.body')}</p>
          </div>
        </section>

        {/* Print button (bottom) */}
        <div className="flex justify-center pb-12">
          <PrintButton />
        </div>
      </div>
    </main>
  );
}
