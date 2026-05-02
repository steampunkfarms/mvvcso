import type { ReactNode } from 'react';
import { AlertTriangle, Ban, CheckCircle2, Info } from 'lucide-react';

interface CalloutProps {
  title?: string;
  children: ReactNode;
}

export function CriticalCallout({ title = 'Critical', children }: CalloutProps) {
  return (
    <div
      role="note"
      aria-label={title}
      className="my-6 rounded-xl border-l-4 p-5"
      style={{
        borderLeftColor: 'var(--color-danger)',
        backgroundColor: 'var(--color-danger-bg)',
      }}
    >
      <p className="mb-2 flex items-center gap-2 font-semibold" style={{ color: 'var(--color-danger)' }}>
        <AlertTriangle className="h-5 w-5" aria-hidden="true" />
        {title}
      </p>
      <div className="text-(--text-primary) leading-relaxed">{children}</div>
    </div>
  );
}

export function RequiredAction({ title = 'Required', children }: CalloutProps) {
  return (
    <div
      role="note"
      aria-label={title}
      className="my-6 rounded-xl border-l-4 p-5"
      style={{
        borderLeftColor: 'var(--color-warning)',
        backgroundColor: 'var(--color-warning-bg)',
      }}
    >
      <p className="mb-2 flex items-center gap-2 font-semibold" style={{ color: 'var(--color-warning)' }}>
        <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
        {title}
      </p>
      <div className="text-(--text-primary) leading-relaxed">{children}</div>
    </div>
  );
}

export function TipCallout({ title = 'Tip', children }: CalloutProps) {
  return (
    <div
      role="note"
      aria-label={title}
      className="my-6 rounded-xl border-l-4 p-5"
      style={{
        borderLeftColor: 'var(--color-info)',
        backgroundColor: 'var(--color-info-bg)',
      }}
    >
      <p className="mb-2 flex items-center gap-2 font-semibold" style={{ color: 'var(--color-info)' }}>
        <Info className="h-5 w-5" aria-hidden="true" />
        {title}
      </p>
      <div className="text-(--text-primary) leading-relaxed">{children}</div>
    </div>
  );
}

export function NeverRule({ title = 'Never', children }: CalloutProps) {
  return (
    <div
      role="note"
      aria-label={title}
      className="my-6 rounded-xl border-l-4 p-5"
      style={{
        borderLeftColor: 'var(--color-danger)',
        backgroundColor: 'var(--color-danger-bg)',
      }}
    >
      <p className="mb-2 flex items-center gap-2 font-semibold" style={{ color: 'var(--color-danger)' }}>
        <Ban className="h-5 w-5" aria-hidden="true" />
        {title}
      </p>
      <div className="text-(--text-primary) leading-relaxed">{children}</div>
    </div>
  );
}
