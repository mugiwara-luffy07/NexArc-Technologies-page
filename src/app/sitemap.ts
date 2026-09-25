import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getProducts, getServices, getWork } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/services", "/work", "/products", "/about", "/internships", "/contact", "/privacy", "/terms"];
  return [
    ...staticRoutes.map((p) => ({ url: `${site.url}${p}`, lastModified: now, priority: p === "" ? 1 : 0.7 })),
    ...getServices().map((s) => ({ url: `${site.url}/services/${s.slug}`, lastModified: now, priority: 0.8 })),
    ...getWork().map((w) => ({ url: `${site.url}/work/${w.slug}`, lastModified: now, priority: 0.6 })),
    ...getProducts()
      .filter((p) => p.status === "live")
      .map((p) => ({ url: `${site.url}/products/${p.slug}`, lastModified: now, priority: 0.6 })),
  ];
}
