import type { Metadata } from "next";
import { site } from "./site";

export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    name: site.name,
    url: site.url,
    logo: `${site.url}/brand/nexarc-app-icon-512.png`,
    email: site.email,
    telephone: site.phone,
    slogan: site.tagline,
    founder: { "@type": "Person", name: site.founder },
    address: { "@type": "PostalAddress", addressRegion: "Tamil Nadu", addressCountry: "IN" },
    areaServed: "IN",
    sameAs: Object.values(site.social).filter(Boolean),
  };
}

export function serviceJsonLd(s: { title: string; summary: string; slug: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    description: s.summary,
    url: `${site.url}/services/${s.slug}`,
    provider: { "@type": "Organization", name: site.name, url: site.url },
    areaServed: "IN",
  };
}
