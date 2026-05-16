import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "karenalexandra.com",
      },
      {
        protocol: "http",
        hostname: "karenalexandra.com",
      },
    ],
  },
};

export default nextConfig;
