import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://mvvcso.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    '',
    '/about',
    '/programs',
    '/blog',
    '/donate',
    '/contact',
    '/pct',
    '/resources/wildfire-preparedness',
    '/resources/wildfire-preparedness/prepare',
    '/resources/wildfire-preparedness/animals-and-livestock',
    '/resources/wildfire-preparedness/evacuate',
    '/resources/wildfire-preparedness/mutual-aid',
  ];

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
