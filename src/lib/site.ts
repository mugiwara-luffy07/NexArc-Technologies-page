export const site = {
  name: "NexArc Technologies",
  shortName: "NexArc",
  tagline: "The Next Arc of Growth.",
  description:
    "NexArc Technologies is a web development and software company in Tamil Nadu, India. We build websites, CRMs, e-commerce stores, mobile apps and SaaS platforms for businesses across Tamil Nadu and India.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexarctechnologies.com",
  email: "sriakash@nexarctechnologies.com",
  phone: "+91 9994155580",
  phoneHref: "tel:+919994155580",
  whatsappHref:
    "https://wa.me/919994155580?text=Hi%20NexArc%2C%20I%27d%20like%20to%20talk%20about%20a%20project.",
  founder: "Sri Akash",
  locality: "Tamil Nadu, India",
  /** Legal identity, shown on the legal pages and in the footer */
  legal: {
    entity: "a sole proprietorship owned by Sri Akash",
    udyam: "UDYAM-TN-07-0157133",
    city: "Chennai",
    grievanceOfficer: { name: "Sri Akash", role: "Founder and Proprietor", email: "sriakash@nexarctechnologies.com" },
  },
  /** Service area for local SEO. Remote-first: we work with clients anywhere in India. */
  areas: [
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Erode", "Tiruppur",
    "Gobichettipalayam", "Tirunelveli", "Thoothukudi", "Nagercoil", "Dindigul", "Karur",
    "Namakkal", "Thanjavur", "Vellore", "Hosur", "Pollachi", "Virudhunagar", "Sivakasi", "Kanyakumari", "Ramanathapuram",
  ],
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
