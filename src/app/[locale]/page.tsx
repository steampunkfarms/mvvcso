import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-[var(--charcoal-earth)] text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: "url('/images/ranchita/hero-placeholder.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--mountain-shadow)]/60 to-[var(--charcoal-earth)]/80" />
        <div className="relative z-10 max-w-4xl mx-auto px-[var(--container-padding)] text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            {t('hero_title')}
          </h1>
          <p className="text-lg sm:text-xl text-[var(--deep-sandstone)] mb-8 max-w-2xl mx-auto">
            {t('hero_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/donate"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-[var(--sunset-gold)] text-[var(--charcoal-earth)] font-semibold hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              {t('hero_cta_donate')}
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg border-2 border-white text-white font-semibold hover:bg-white/10 transition-colors"
            >
              {t('hero_cta_volunteer')}
            </a>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-[var(--section-padding)] bg-[var(--color-bg-page)]">
        <div className="max-w-[var(--container-max)] mx-auto px-[var(--container-padding)] text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[var(--color-text-primary)]">
            {t('mission_title')}
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-3xl mx-auto leading-relaxed">
            {t('mission_text')}
          </p>
        </div>
      </section>

      {/* Programs Preview */}
      <section className="py-[var(--section-padding)] bg-[var(--color-bg-surface)]">
        <div className="max-w-[var(--container-max)] mx-auto px-[var(--container-padding)]">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            {t('programs_title')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Program cards will be componentized in Phase 1b */}
            <ProgramCard title="CERT Training" icon="shield" />
            <ProgramCard title="Food Security" icon="heart" />
            <ProgramCard title="Senior Support" icon="users" />
            <ProgramCard title="Youth Programs" icon="graduation-cap" />
            <ProgramCard title="Emergency Preparedness" icon="alert-triangle" />
            <ProgramCard title="Volunteer Services" icon="hand-helping" />
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-[var(--section-padding)] bg-[var(--charcoal-earth)] text-white">
        <div className="max-w-[var(--container-max)] mx-auto px-[var(--container-padding)]">
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

      {/* Newsletter CTA */}
      <section className="py-[var(--section-padding)] bg-[var(--sunset-gold)]">
        <div className="max-w-2xl mx-auto px-[var(--container-padding)] text-center">
          <h2 className="text-3xl font-bold mb-2 text-[var(--charcoal-earth)]">
            {t('newsletter_title')}
          </h2>
          <p className="text-[var(--charcoal-earth)]/80 mb-6">
            {t('newsletter_subtitle')}
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder={t('newsletter_placeholder')}
              className="flex-1 px-4 py-3 rounded-lg border-0 text-[var(--charcoal-earth)] placeholder:text-[var(--color-text-muted)]"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-[var(--charcoal-earth)] text-white font-semibold hover:bg-[var(--mountain-shadow)] transition-colors"
            >
              {t('newsletter_button')}
            </button>
          </form>
        </div>
      </section>

      {/* Donate CTA */}
      <section className="py-[var(--section-padding)] bg-[var(--color-bg-page)]">
        <div className="max-w-3xl mx-auto px-[var(--container-padding)] text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('donate_cta_title')}
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] mb-8 max-w-2xl mx-auto">
            {t('donate_cta_text')}
          </p>
          <a
            href="/donate"
            className="inline-flex items-center justify-center px-10 py-4 rounded-lg bg-[var(--desert-coral)] text-white font-semibold text-lg hover:bg-[var(--color-accent-hover)] transition-colors"
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
    <div className="bg-[var(--color-bg-card)] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-[var(--color-border-light)]">
      <div className="w-12 h-12 rounded-lg bg-[var(--sunset-gold)]/10 flex items-center justify-center mb-4">
        <span className="text-2xl text-[var(--sunset-gold)]" aria-hidden="true">
          {icon === 'shield' && '🛡️'}
          {icon === 'heart' && '❤️'}
          {icon === 'users' && '👥'}
          {icon === 'graduation-cap' && '🎓'}
          {icon === 'alert-triangle' && '⚠️'}
          {icon === 'hand-helping' && '🤝'}
        </span>
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-4xl md:text-5xl font-bold text-[var(--sunset-gold)] mb-2">
        {value}
      </div>
      <div className="text-sm text-[var(--deep-sandstone)]">{label}</div>
    </div>
  );
}
