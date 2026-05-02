import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';

export interface JumpItem {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
}

interface TopicJumpGridProps {
  items: JumpItem[];
  ariaLabel?: string;
}

export function TopicJumpGrid({ items, ariaLabel = 'Topic navigation' }: TopicJumpGridProps) {
  return (
    <nav aria-label={ariaLabel}>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className="group block h-full rounded-xl border border-stone-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-terra-50 text-terra-400">
                {item.icon}
              </div>
              <h3 className="mb-1 text-lg font-semibold text-(--text-primary) group-hover:text-gold-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-(--text-secondary)">{item.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
