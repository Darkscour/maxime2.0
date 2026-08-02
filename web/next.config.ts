import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Persist Turbopack graph between restarts so warm boots stay fast.
    // scripts/dev.mjs prunes this cache if it grows past 500 MB.
    turbopackFileSystemCacheForDev: true,
  },
  async redirects() {
    return [
      { source: "/design", destination: "/", permanent: true },
      { source: "/design/:path*", destination: "/", permanent: true },
      { source: "/maxime-2", destination: "/", permanent: true },
      { source: "/maxime-2/:path*", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
