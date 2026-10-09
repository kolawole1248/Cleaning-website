import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: false,
  images: {
    // Service images are links the owner pastes in the admin panel, so any
    // https host must be allowed (the previous whitelist crashed the site
    // whenever a new image domain was used). Next.js still optimises +
    // caches these images; only plain http:// links are rejected.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
