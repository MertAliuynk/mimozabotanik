import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

    // Resimler artık MinIO/CDN değil, yerel diskten (public/uploads) servis ediliyor.
    // Next.js'in /_next/image optimizasyonu, local dosyalar için kendi sunucusuna
    // geri bir loopback isteği atıyor; reverse proxy (nginx) arkasında bu istek
    // başarısız olup 400 dönebiliyor. Optimizasyonu kapatıp dosyayı doğrudan
    // /uploads/... üzerinden servis ediyoruz.
    unoptimized: true,
  },
};

export default nextConfig;