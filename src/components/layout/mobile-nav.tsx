'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';

interface NavItem {
  key: string;
  href: string;
}

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  items: readonly NavItem[];
}

export function MobileNav({ open, onClose, items }: MobileNavProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="absolute right-0 top-0 bottom-0 w-72 bg-desert-cream shadow-xl flex flex-col">
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="p-2 text-(--text-primary)"
            aria-label="Close menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4">
          <ul className="space-y-1">
            {items.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive
                        ? 'text-terra-cotta bg-terra-cotta/5'
                        : 'text-(--text-secondary) hover:text-(--text-primary) hover:bg-sandy-gold/20'
                    }`}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Donate CTA */}
        <div className="p-4 border-t border-sandy-gold">
          <Link
            href="/donate"
            className="block w-full text-center px-4 py-3 rounded-lg bg-terra-cotta text-white font-semibold hover:bg-terra-cotta-hover transition-colors"
          >
            {t('donate')}
          </Link>
        </div>
      </div>
    </div>
  );
}
