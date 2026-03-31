import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <div>
      {/* Hero Section — the one dark section, dramatic contrast */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-(--color-bg-hero) text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: "url('/images/ranchita/hero-placeholder.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-(--color-bg-hero)/70 to-(--color-bg-hero)/90" />
        <div className="relative z-10 max-w-4xl mx-auto px-(--container-padding) text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-desert-cream">
            {t('hero_title')}
          </h1>
          <p className="text-lg sm:text-xl text-sandy-gold mb-8 max-w-2xl mx-auto">
            {t('hero_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/donate"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-terra-cotta text-white font-semibold hover:bg-terra-cotta-hover transition-colors"
            >
              {t('hero_cta_donate')}
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg border-2 border-sandy-gold text-sandy-gold font-semibold hover:bg-(--sandy-gold)/10 transition-colors"
            >
              {t('hero_cta_volunteer')}
            </a>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-(--section-padding) bg-desert-cream">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding) text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-(--text-primary)">
            {t('mission_title')}
          </h2>
          <p className="text-lg text-(--text-secondary) max-w-3xl mx-auto leading-relaxed">
            {t('mission_text')}
          </p>
        </div>
      </section>

      {/* Programs Preview — slightly lighter surface */}
      <section className="py-(--section-padding) bg-cream-light">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding)">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-(--text-primary)">
            {t('programs_title')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProgramCard title="CERT Training" icon="shield" />
            <ProgramCard title="Food Security" icon="heart" />
            <ProgramCard title="Senior Support" icon="users" />
            <ProgramCard title="Youth Programs" icon="graduation-cap" />
            <ProgramCard title="Emergency Preparedness" icon="alert-triangle" />
            <ProgramCard title="Volunteer Services" icon="hand-helping" />
          </div>
        </div>
      </section>

      {/* Impact Stats — warm terra cotta band */}
      <section className="py-(--section-padding) bg-terra-cotta text-white">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding)">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            {t('impact_title')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatItem value={t('impact_years')} label={t('impact_years_label')} />
            <StatItem value={t('impact_residents')} label={t('impact_residents_label')} />
            <StatItem value={t('impact_board')} label={t('impact_board_label')} />
            <StatItem value={t('impact_volunteer')} label={t('impact_volunteer_label')} />
          </div>
        </div>
      </section>

      {/* Newsletter CTA — sunset peach band */}
      <section className="py-(--section-padding) bg-sunset-peach">
        <div className="max-w-2xl mx-auto px-(--container-padding) text-center">
          <h2 className="text-3xl font-bold mb-2 text-(--text-primary)">
            {t('newsletter_title')}
          </h2>
          <p className="text-(--text-secondary) mb-6">
            {t('newsletter_subtitle')}
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder={t('newsletter_placeholder')}
              className="flex-1 px-4 py-3 rounded-lg border border-terra-cotta/20 bg-white text-(--text-primary) placeholder:text-(--text-muted)"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-terra-cotta text-white font-semibold hover:bg-terra-cotta-hover transition-colors"
            >
              {t('newsletter_button')}
            </button>
          </form>
        </div>
      </section>

      {/* Donate CTA */}
      <section className="py-(--section-padding) bg-desert-cream">
        <div className="max-w-3xl mx-auto px-(--container-padding) text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-(--text-primary)">
            {t('donate_cta_title')}
          </h2>
          <p className="text-lg text-(--text-secondary) mb-8 max-w-2xl mx-auto">
            {t('donate_cta_text')}
          </p>
          <a
            href="/donate"
            className="inline-flex items-center justify-center px-10 py-4 rounded-lg bg-terra-cotta text-white font-semibold text-lg hover:bg-terra-cotta-hover transition-colors"
          >
            {t('donate_cta_button')}
          </a>
        </div>
      </section>
    </div>
  );
}

function ProgramCard({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-sandy-gold">
      <div className="w-12 h-12 rounded-lg bg-sunset-peach/15 flex items-center justify-center mb-4">
        <span className="text-2xl" aria-hidden="true">
          {icon === 'shield' && '\u{1F6E1}\u{FE0F}'}
          {icon === 'heart' && '\u{2764}\u{FE0F}'}
          {icon === 'users' && '\u{1F465}'}
          {icon === 'graduation-cap' && '\u{1F393}'}
          {icon === 'alert-triangle' && '\u{26A0}\u{FE0F}'}
          {icon === 'hand-helping' && '\u{1F91D}'}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-(--text-primary) mb-2">{title}</h3>
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-4xl md:text-5xl font-bold text-desert-cream mb-2">
        {value}
      </div>
      <div className="text-sm text-white/80">{label}</div>
    </div>
  );
}
