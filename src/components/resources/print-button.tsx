'use client';

import { Printer } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function PrintButton({ label }: { label?: string }) {
  const t = useTranslations('common');
  const buttonLabel = label ?? t('print');
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-lg border border-terra-400 px-4 py-2 text-(--text-primary) hover:bg-terra-50 transition-colors print:hidden"
    >
      <Printer className="h-4 w-4" aria-hidden="true" />
      {buttonLabel}
    </button>
  );
}
