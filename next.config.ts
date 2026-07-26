import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/**", // Allows all sub-paths under cdn.sanity.io
      },
    ],
  },
};

export default nextConfig;