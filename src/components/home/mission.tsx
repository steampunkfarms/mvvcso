import { useTranslations } from 'next-intl';

export function Mission() {
  const t = useTranslations('home');

  return (
    <section className="py-(--section-padding) bg-stone-50">
      <div className="max-w-(--container-max) mx-auto px-(--container-padding) text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-(--text-primary)">
          {t('mission_title')}
        </h2>
        <p className="text-lg text-(--text-secondary) max-w-3xl mx-auto leading-relaxed">
          {t('mission_text')}
        </p>
      </div>
    </section>
  );
}
