import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.zerochan.net",
      },
    ],
  },
};

export default nextConfig;
