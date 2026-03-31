import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export function DonateCta() {
  const t = useTranslations('home');

  return (
    <section className="py-(--section-padding) bg-desert-cream">
      <div className="max-w-3xl mx-auto px-(--container-padding) text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-(--text-primary)">
          {t('donate_cta_title')}
        </h2>
        <p className="text-lg text-(--text-secondary) mb-8 max-w-2xl mx-auto">
          {t('donate_cta_text')}
        </p>
        <Link
          href="/donate"
          className="inline-flex items-center justify-center px-10 py-4 rounded-lg bg-terra-cotta text-white font-semibold text-lg hover:bg-terra-cotta-hover transition-colors"
        >
          {t('donate_cta_button')}
        </Link>
      </div>
    </section>
  );
}
