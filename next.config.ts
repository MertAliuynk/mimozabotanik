import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/greenpark-images/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '9000',
        pathname: '/greenpark-images/**',
      },
      {
        protocol: 'https',
        hostname: 'minio.karadenizdis.com',
        pathname: '/uploads/**', // ✅ uploads bucket için düzeltildi
      },
    ],

    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

    // developmentta optimization kapalı
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;