import { useTranslations } from 'next-intl';

const partners = [
  { name: 'Feeding San Diego', url: 'https://feedingsandiego.org' },
  { name: 'CAL FIRE', url: 'https://www.fire.ca.gov' },
  { name: 'San Diego County', url: 'https://www.sandiegocounty.gov' },
];

export function Partners() {
  const t = useTranslations('home');

  return (
    <section className="py-12 bg-sandy-gold/30">
      <div className="max-w-(--container-max) mx-auto px-(--container-padding)">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-(--text-muted) text-center mb-6">
          {t('partners_title')}
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {partners.map((partner) => (
            <a
              key={partner.name}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-(--text-secondary) hover:text-terra-cotta transition-colors font-medium text-sm"
            >
              {partner.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
