import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export function Hero() {
  const t = useTranslations('home');

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <Image
        src="/images/ranchita/hero-big-sky.jpg"
        alt="Big sky over Ranchita mountains and chaparral"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[#F8F4EE]/85" />
      <div className="relative z-10 max-w-4xl mx-auto px-(--container-padding) text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-(--text-primary)">
          {t('hero_title')}
        </h1>
        <p className="text-lg sm:text-xl text-(--text-secondary) mb-8 max-w-2xl mx-auto">
          {t('hero_subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/donate"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-gold-400 text-white font-semibold text-lg hover:bg-gold-500 transition-colors"
          >
            {t('hero_cta_donate')}
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg border-2 border-terra-400 text-terra-400 font-semibold text-lg hover:bg-terra-50 transition-colors"
          >
            {t('hero_cta_volunteer')}
          </Link>
        </div>
      </div>
    </section>
  );
}
