// Sitenin canonical domaini. robots.ts, sitemap.ts ve layout metadata'sında
// tek kaynaktan kullanılır; taşınma/domain değişikliği olursa sadece burası güncellenir.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://mimozabotanik.com';

export const SITE_NAME = 'Mimoza Botanik';
