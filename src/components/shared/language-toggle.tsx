'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';

export function LanguageToggle() {
  const locale = useLocale();
  const t = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();

  const otherLocale = locale === 'en' ? 'es' : 'en';
  const label = locale === 'en' ? t('spanish') : t('english');

  function switchLocale() {
    router.replace(pathname, { locale: otherLocale });
  }

  return (
    <button
      onClick={switchLocale}
      className="px-3 py-1.5 text-sm font-medium rounded-md border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface)] transition-colors"
      aria-label={`Switch to ${label}`}
    >
      {label}
    </button>
  );
}
