import { Link } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';

interface PostCardProps {
  slug: string;
  titleEn: string;
  titleEs: string | null;
  excerptEn: string | null;
  excerptEs: string | null;
  category: string | null;
  author: string | null;
  publishedAt: Date | null;
}

export function PostCard({
  slug,
  titleEn,
  titleEs,
  excerptEn,
  excerptEs,
  category,
  author,
  publishedAt,
}: PostCardProps) {
  const locale = useLocale();
  const t = useTranslations('blog');

  const title = locale === 'es' && titleEs ? titleEs : titleEn;
  const excerpt = locale === 'es' && excerptEs ? excerptEs : excerptEn;

  return (
    <Link
      href={`/blog/${slug}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-stone-200"
    >
      {/* Placeholder cover */}
      <div className="h-40 bg-stone-200/20 flex items-center justify-center">
        <span className="text-4xl text-dusk-500/40">MVVCSO</span>
      </div>

      <div className="p-5">
        {category && (
          <span className="inline-block text-xs font-semibold text-terra-400 bg-terra-50/10 px-2 py-0.5 rounded mb-2">
            {category}
          </span>
        )}
        <h3 className="text-lg font-semibold text-(--text-primary) mb-2 group-hover:text-gold-400 transition-colors">
          {title}
        </h3>
        {excerpt && (
          <p className="text-sm text-(--text-secondary) line-clamp-2 mb-3">{excerpt}</p>
        )}
        <div className="flex items-center justify-between text-xs text-(--text-muted)">
          {author && <span>{t('by', { author })}</span>}
          {publishedAt && (
            <span>
              {publishedAt.toLocaleDateString(locale === 'es' ? 'es-US' : 'en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
