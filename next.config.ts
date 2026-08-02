import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

    // developmentta optimization kapalı
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;