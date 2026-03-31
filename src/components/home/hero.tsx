import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export function Hero() {
  const t = useTranslations('home');

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-(--color-bg-hero) text-white overflow-hidden">
      <Image
        src="/images/ranchita/hero-big-sky.jpg"
        alt="Big sky over Ranchita mountains and chaparral"
        fill
        priority
        className="object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-(--color-bg-hero)/70 to-(--color-bg-hero)/90" />
      <div className="relative z-10 max-w-4xl mx-auto px-(--container-padding) text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-dusk-100">
          {t('hero_title')}
        </h1>
        <p className="text-lg sm:text-xl text-gold-200 mb-8 max-w-2xl mx-auto">
          {t('hero_subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/donate"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-gold-400 text-white font-semibold hover:bg-gold-500 transition-colors"
          >
            {t('hero_cta_donate')}
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg border-2 border-stone-200 text-gold-200 font-semibold hover:bg-(--gold-200)/10 transition-colors"
          >
            {t('hero_cta_volunteer')}
          </Link>
        </div>
      </div>
    </section>
  );
}
