import { useTranslations } from 'next-intl';
import { db, schema } from '@/lib/db';

const { blogPosts } = schema;
import { desc, eq } from 'drizzle-orm';
import { PostCard } from '@/components/blog/post-card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'News, stories, and resources from the Ranchita community.',
};

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const t = useTranslations('blog');

  const posts = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.published, true))
    .orderBy(desc(blogPosts.publishedAt));

  return (
    <div>
      {/* Hero */}
      <section className="py-(--section-padding) bg-stone-200/20">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding) text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-(--text-primary)">
            {t('title')}
          </h1>
          <p className="text-lg text-(--text-secondary) max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="py-(--section-padding) bg-stone-50">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding)">
          {posts.length === 0 ? (
            <p className="text-center text-(--text-muted) py-12">{t('no_posts')}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  slug={post.slug}
                  titleEn={post.titleEn}
                  titleEs={post.titleEs}
                  excerptEn={post.excerptEn}
                  excerptEs={post.excerptEs}
                  category={post.category}
                  author={post.author}
                  publishedAt={post.publishedAt}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
