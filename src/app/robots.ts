import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // All standard crawlers
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/login", "/auth/"],
      },
      // Explicit allow for AI search/index crawlers (GEO)
      // — listing them by name in case site owners later add deny rules upstream
      { userAgent: "GPTBot",          allow: "/" },
      { userAgent: "ChatGPT-User",    allow: "/" },
      { userAgent: "OAI-SearchBot",   allow: "/" },
      { userAgent: "ClaudeBot",       allow: "/" },
      { userAgent: "Claude-Web",      allow: "/" },
      { userAgent: "anthropic-ai",    allow: "/" },
      { userAgent: "PerplexityBot",   allow: "/" },
      { userAgent: "Perplexity-User", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Googlebot",       allow: "/" },
      { userAgent: "Bingbot",         allow: "/" },
      { userAgent: "Applebot",        allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      { userAgent: "Meta-ExternalAgent", allow: "/" },
      { userAgent: "FacebookBot",     allow: "/" },
      { userAgent: "YouBot",          allow: "/" },
    ],
    sitemap: "https://karenalexandra.com/sitemap.xml",
    host: "https://karenalexandra.com",
  };
}
