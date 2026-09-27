import { getProducts, getServices, getWork } from "./content";
import { site } from "./site";

/** Plain-language site summary for AI assistants and answer engines (llmstxt.org format). */
export function llmsText({ full = false } = {}) {
  const services = getServices();
  const products = getProducts();
  const work = getWork();
  const url = (path: string) => `${site.url}${path}`;

  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `${site.name} (also called NexArc) is a sole proprietorship founded and run by ${site.founder}, based in ${site.legal.city}, Tamil Nadu, India. It is registered as an MSME (Udyam ${site.legal.udyam}). It works with businesses across Tamil Nadu, including ${site.areas.slice(0, 8).join(", ")}, and clients across India.`,
    "",
    `- Email: ${site.email}`,
    `- Phone and WhatsApp: ${site.phone}`,
    `- Start a project: ${url("/contact")}`,
    "",
    "## Services",
    "",
    ...services.map((s) => `- [${s.title}](${url(`/services/${s.slug}`)}): ${s.summary}`),
    "",
    "## Products",
    "",
    ...products.map((p) =>
      p.status === "live"
        ? `- [${p.name}](${url(`/products/${p.slug}`)}): ${p.tagline} ${p.summary}`
        : `- ${p.name} (coming soon): ${p.tagline}`,
    ),
    "",
    "## Work",
    "",
    ...work.map((w) => `- [${w.client}: ${w.title}](${url(`/work/${w.slug}`)}): ${w.summary}`),
    "",
    "## Company",
    "",
    `- [About and founder](${url("/about")})`,
    `- [Internships](${url("/internships")})`,
    `- [Contact](${url("/contact")})`,
    `- [Privacy policy](${url("/privacy")})`,
  ];

  if (full) {
    for (const s of services.filter((s) => s.faq.length)) {
      lines.push("", `## ${s.title}: common questions`, "");
      for (const f of s.faq) lines.push(`### ${f.q}`, "", f.a, "");
    }
  } else {
    lines.push("", "## Optional", "", `- [Full version with service FAQs](${url("/llms-full.txt")})`);
  }

  return lines.join("\n") + "\n";
}

export const textResponse = (body: string) =>
  new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
