import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// AI search and assistant crawlers, allowed explicitly so answer engines can cite the site
const aiBots = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }, { userAgent: aiBots, allow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
