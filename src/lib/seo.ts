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

const areaServed = [
  { "@type": "State", name: "Tamil Nadu" },
  { "@type": "Country", name: "India" },
  ...site.areas.map((name) => ({ "@type": "City", name })),
];

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": `${site.url}/#organization`,
    name: site.name,
    alternateName: ["NexArc", "Nexarc Technologies"],
    description: site.description,
    url: site.url,
    logo: `${site.url}/brand/nexarc-app-icon-512.png`,
    email: site.email,
    telephone: site.phone,
    slogan: site.tagline,
    founder: { "@type": "Person", name: site.founder, jobTitle: "Founder", image: `${site.url}/team/sri-akash.jpg` },
    address: { "@type": "PostalAddress", addressLocality: site.legal.city, addressRegion: "Tamil Nadu", addressCountry: "IN" },
    identifier: { "@type": "PropertyValue", propertyID: "Udyam", value: site.legal.udyam },
    areaServed,
    knowsAbout: ["Website development", "Web design", "CRM development", "E-commerce development", "Mobile app development", "SaaS development", "Custom software development"],
    sameAs: Object.values(site.social).filter(Boolean),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    alternateName: "NexArc",
    url: site.url,
    inLanguage: "en-IN",
    publisher: { "@id": `${site.url}/#organization` },
  };
}

export function faqJsonLd(faq: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${site.url}${it.path}` })),
  };
}

export function serviceJsonLd(s: { title: string; summary: string; slug: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    description: s.summary,
    url: `${site.url}/services/${s.slug}`,
    serviceType: s.title,
    provider: { "@id": `${site.url}/#organization` },
    areaServed,
  };
}
