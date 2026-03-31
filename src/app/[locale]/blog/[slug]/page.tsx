import { notFound } from 'next/navigation';
import { db, schema } from '@/lib/db';

const { blogPosts } = schema;
import { eq, and } from 'drizzle-orm';
import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [post] = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.slug, slug), eq(blogPosts.published, true)));

  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.titleEn,
    description: post.excerptEn || undefined,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations('blog');

  const [post] = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.slug, slug), eq(blogPosts.published, true)));

  if (!post) notFound();

  const title = locale === 'es' && post.titleEs ? post.titleEs : post.titleEn;
  const content = locale === 'es' && post.contentEs ? post.contentEs : post.contentEn;

  return (
    <div>
      <section className="py-(--section-padding) bg-stone-50">
        <div className="max-w-3xl mx-auto px-(--container-padding)">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-gold-400 hover:text-gold-500 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('back')}
          </Link>

          {/* Meta */}
          {post.category && (
            <span className="inline-block text-xs font-semibold text-terra-400 bg-terra-50/10 px-2 py-0.5 rounded mb-3">
              {post.category}
            </span>
          )}

          <h1 className="text-3xl md:text-4xl font-bold text-(--text-primary) mb-4">
            {title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-(--text-muted) mb-8">
            {post.author && <span>{t('by', { author: post.author })}</span>}
            {post.publishedAt && (
              <span>
                {post.publishedAt.toLocaleDateString(
                  locale === 'es' ? 'es-US' : 'en-US',
                  { year: 'numeric', month: 'long', day: 'numeric' }
                )}
              </span>
            )}
          </div>

          {/* Content — rendered as plain text paragraphs for now */}
          <div className="prose prose-lg max-w-none">
            {content.split('\n\n').map((paragraph: string, i: number) => (
              <p key={i} className="text-(--text-secondary) leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
