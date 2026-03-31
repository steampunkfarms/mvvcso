import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export function Footer() {
  const t = useTranslations('footer');
  const navT = useTranslations('nav');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-(--text-primary) text-dusk-100">
      {/* Terra cotta accent line */}
      <div className="h-1 bg-gold-400" />

      <div className="max-w-(--container-max) mx-auto px-(--container-padding) py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About column */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3">MVVCSO</h3>
            <p className="text-sm text-gold-200 mb-3">
              {t('tagline')}
            </p>
            <p className="text-sm text-(--text-muted)">
              {t('address')}
            </p>
            <p className="text-sm text-(--text-muted)">
              {t('phone')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3">
              {t('quick_links')}
            </h3>
            <ul className="space-y-2">
              {(['about', 'programs', 'blog', 'events', 'resources', 'donate', 'contact'] as const).map((key) => (
                <li key={key}>
                  <Link
                    href={`/${key}`}
                    className="text-sm text-gold-200 hover:text-gold-400 transition-colors"
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
            <p className="text-sm text-gold-200 mb-4">
              {t('newsletter_subtitle')}
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="email@example.com"
                className="flex-1 px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-gold-400"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-gold-400 text-white text-sm font-semibold hover:bg-gold-500 transition-colors"
              >
                OK
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-4">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding) flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-(--text-muted)">
          <p>{t('copyright', { year: String(year) })}</p>
          <p>{t('nonprofit')}</p>
        </div>
      </div>
    </footer>
  );
}
