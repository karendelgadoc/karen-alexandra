import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://assets.calendly.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://assets.calendly.com",
      "img-src 'self' data: blob: https://*.insforge.app https://*.insforge.dev https://karenalexandra.com https://i.ytimg.com https://*.ytimg.com https://assets.calendly.com https://www.dior.com https://*.dior.com https://cdn.mos.cms.futurecdn.net https://www.businesstoday.com.my https://api.factmagazines.com https://cms.factmagazines.com",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://*.insforge.app https://accounts.google.com https://calendly.com https://api.calendly.com",
      "frame-src https://calendly.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/blog", destination: "/journal", permanent: true },
      { source: "/blog/:slug", destination: "/journal/:slug", permanent: true },
      { source: "/about", destination: "/portfolio", permanent: true },
    ];
  },

  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "karenalexandra.com" },
      { protocol: "https", hostname: "*.insforge.app" },
      { protocol: "https", hostname: "*.insforge.dev" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "*.ytimg.com" },
      { protocol: "https", hostname: "www.dior.com" },
      { protocol: "https", hostname: "api.factmagazines.com" },
      { protocol: "https", hostname: "cdn.mos.cms.futurecdn.net" },
    ],
  },
};

export default nextConfig;
