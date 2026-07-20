import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
