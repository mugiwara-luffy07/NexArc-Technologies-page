import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // A stray lockfile in the home directory confuses workspace-root detection
  outputFileTracingRoot: path.join(__dirname),
  experimental: {
    // internship resumes are up to 5 MB
    serverActions: { bodySizeLimit: "6mb" },
  },
  // one canonical host for search engines
  async redirects() {
    return [
      // case study removed from the site
      { source: "/work/kids-world-foundation", destination: "/work", permanent: true },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.nexarctechnologies.com" }],
        destination: "https://nexarctechnologies.com/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
