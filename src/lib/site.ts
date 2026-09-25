export const site = {
  name: "NexArc Technologies",
  shortName: "NexArc",
  tagline: "The Next Arc of Growth.",
  description:
    "NexArc Technologies builds websites, CRMs, e-commerce stores and custom SaaS platforms for growing businesses in India.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexarctechnologies.com",
  email: "sriakash@nexarctechnologies.com",
  phone: "+91 9994155580",
  phoneHref: "tel:+919994155580",
  whatsappHref:
    "https://wa.me/919994155580?text=Hi%20NexArc%2C%20I%27d%20like%20to%20talk%20about%20a%20project.",
  founder: "Sri Akash",
  // TODO(content): confirm city/region for local SEO and footer
  locality: "Tamil Nadu, India",
  social: {
    linkedin: "", // TODO(content): add LinkedIn URL
    instagram: "", // TODO(content): add Instagram URL
  },
} as const;

export const nav = [
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
] as const;

/** The single contact CTA label used everywhere (CTA intent lock). */
export const CTA_LABEL = "Start a project";
