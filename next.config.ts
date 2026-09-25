import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // A stray lockfile in the home directory confuses workspace-root detection
  outputFileTracingRoot: path.join(__dirname),
  experimental: {
    // internship resumes are up to 5 MB
    serverActions: { bodySizeLimit: "6mb" },
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
