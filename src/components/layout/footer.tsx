import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export function Footer() {
  const t = useTranslations('footer');
  const navT = useTranslations('nav');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--charcoal-earth)] text-[var(--color-text-on-dark)]">
      {/* Gold accent line */}
      <div className="h-1 bg-[var(--sunset-gold)]" />

      <div className="max-w-[var(--container-max)] mx-auto px-[var(--container-padding)] py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About column */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3">MVVCSO</h3>
            <p className="text-sm text-[var(--deep-sandstone)] mb-3">
              {t('tagline')}
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">
              {t('address')}
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">
              {t('phone')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3">
              {t('quick_links')}
            </h3>
            <ul className="space-y-2">
              {(['about', 'programs', 'blog', 'donate', 'contact', 'pct'] as const).map((key) => (
                <li key={key}>
                  <Link
                    href={`/${key}`}
                    className="text-sm text-[var(--deep-sandstone)] hover:text-[var(--sunset-gold)] transition-colors"
                  >
                    {navT(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3">
              {t('newsletter_title')}
            </h3>
            <p className="text-sm text-[var(--deep-sandstone)] mb-4">
              {t('newsletter_subtitle')}
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="email@example.com"
                className="flex-1 px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-[var(--sunset-gold)]"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-[var(--sunset-gold)] text-[var(--charcoal-earth)] text-sm font-semibold hover:bg-[var(--color-primary-hover)] transition-colors"
              >
                OK
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-4">
        <div className="max-w-[var(--container-max)] mx-auto px-[var(--container-padding)] flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-[var(--color-text-muted)]">
          <p>{t('copyright', { year: String(year) })}</p>
          <p>{t('nonprofit')}</p>
        </div>
      </div>
    </footer>
  );
}
