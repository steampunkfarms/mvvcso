import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function AnimalsAndLivestockPage() {
  const t = await getTranslations('wildfire_prep');
  return (
    <section className="py-(--section-padding)">
      <div className="max-w-(--container-max) mx-auto px-(--container-padding) text-center">
        <h1 className="text-3xl font-bold mb-4 text-(--text-primary)">
          {t('spokes.animals.title')}
        </h1>
        <p className="text-(--text-secondary) mb-6">{t('common.coming_soon')}</p>
        <Link
          href="/resources/wildfire-preparedness"
          className="text-teal-600 hover:text-terra-400 underline transition-colors"
        >
          {t('common.back_to_hub')}
        </Link>
      </div>
    </section>
  );
}
