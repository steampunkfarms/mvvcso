import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { DonationForm } from '@/components/donate/donation-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Donate',
  description:
    'Support MVVCSO — every dollar builds a stronger Ranchita. Tax-deductible donations fund emergency preparedness, food security, and community programs.',
};

export default function DonatePage() {
  const t = useTranslations('donate');

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

      {/* Form + Impact */}
      <section className="py-(--section-padding) bg-desert-cream">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding)">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Donation form */}
            <div className="lg:col-span-3">
              <DonationForm />
            </div>

            {/* Impact sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-center">
                <Image
                  src="/images/ranchita/ranchita-roots-badge.png"
                  alt="Ranchita Roots campaign badge"
                  width={160}
                  height={160}
                  className="drop-shadow-md"
                />
              </div>
              <div className="bg-white rounded-xl p-6 border border-sandy-gold">
                <h3 className="text-lg font-bold text-(--text-primary) mb-4">
                  {t('impact_title')}
                </h3>
                <ul className="space-y-3 text-sm text-(--text-secondary)">
                  <li className="flex items-start gap-2">
                    <span className="text-terra-cotta font-bold shrink-0">$25</span>
                    <span>{t('impact_25').replace('$25 = ', '')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-cotta font-bold shrink-0">$50</span>
                    <span>{t('impact_50').replace('$50 = ', '')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-cotta font-bold shrink-0">$100</span>
                    <span>{t('impact_100').replace('$100 = ', '')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terra-cotta font-bold shrink-0">$250</span>
                    <span>{t('impact_250').replace('$250 = ', '')}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 border border-sandy-gold">
                <p className="text-sm text-(--text-secondary) leading-relaxed">
                  {t('tax_notice')}
                </p>
              </div>

              <div className="text-center">
                <p className="text-sm text-(--text-muted) mb-2">{t('zeffy_text')}</p>
                <a
                  href="https://www.zeffy.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-terra-cotta hover:text-terra-cotta-hover font-medium transition-colors"
                >
                  {t('zeffy_link')} &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
