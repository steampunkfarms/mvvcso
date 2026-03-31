import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://mvvcso.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/about', '/programs', '/blog', '/donate', '/contact', '/pct'];

  return pages.flatMap((page) => [
    {
      url: `${BASE_URL}${page}`,
      lastModified: new Date(),
      changeFrequency: page === '/blog' ? 'weekly' : 'monthly',
      priority: page === '' ? 1 : 0.8,
    },
    {
      url: `${BASE_URL}/es${page}`,
      lastModified: new Date(),
      changeFrequency: page === '/blog' ? 'weekly' : 'monthly',
      priority: page === '' ? 0.9 : 0.7,
    },
  ]);
}
