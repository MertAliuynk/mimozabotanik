import type { MetadataRoute } from 'next';
import { db } from '../lib/db';
import { SITE_URL } from '../lib/seo';

const STATIC_ROUTES = [
  { path: '', priority: 1, changeFrequency: 'weekly' as const },
  { path: '/urunler', priority: 0.9, changeFrequency: 'daily' as const },
  { path: '/blog', priority: 0.8, changeFrequency: 'daily' as const },
  { path: '/hizmetlerimiz', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/galeri', priority: 0.6, changeFrequency: 'monthly' as const },
  { path: '/referanslarimiz', priority: 0.6, changeFrequency: 'monthly' as const },
  { path: '/hakkimizda', priority: 0.5, changeFrequency: 'monthly' as const },
  { path: '/iletisim', priority: 0.5, changeFrequency: 'monthly' as const },
  { path: '/gizlilik-politikasi', priority: 0.2, changeFrequency: 'yearly' as const },
  { path: '/mesafeli-satis-sozlesmesi', priority: 0.2, changeFrequency: 'yearly' as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // DB bağlantısı yoksa (build/deploy anındaki edge case) sadece statik rotaları döndür
  if (!db) {
    return staticEntries;
  }

  try {
    const [products, posts] = await Promise.all([
      db.product.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
      db.post.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${SITE_URL}/urunler/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

    return [...staticEntries, ...productEntries, ...postEntries];
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return staticEntries;
  }
}
