import { EnvelopeSimple, Phone, WhatsappLogo, CalendarBlank } from "@phosphor-icons/react/dist/ssr";
import { ProjectForm } from "@/components/forms/ProjectForm";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: "Start a project",
  description: "Tell NexArc Technologies about your website, CRM, e-commerce or software project. We reply within one working day.",
  path: "/contact",
});

const next = [
  "We read your brief and reply within one working day.",
  "A 30 minute call to understand the business and the goal.",
  "A written proposal with scope, timeline and cost.",
];

export default function ContactPage() {
  const cal = process.env.NEXT_PUBLIC_CAL_LINK;

  const channels = [
    { icon: WhatsappLogo, label: "WhatsApp us", value: site.phone, href: site.whatsappHref, external: true },
    { icon: EnvelopeSimple, label: "Email", value: site.email, href: `mailto:${site.email}` },
    { icon: Phone, label: "Call", value: site.phone, href: site.phoneHref },
    ...(cal ? [{ icon: CalendarBlank, label: "Book a 20 minute call", value: "Pick a time that suits you", href: cal, external: true }] : []),
  ];

  return (
    <section className="gutter mx-auto max-w-[1320px] pb-16 pt-10 sm:pt-14 md:pb-20 md:pt-20">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h1 className="text-display-xl max-w-[14ch]">Tell us about your project</h1>
          <p className="mt-5 mb-12 max-w-[46ch] text-lg text-muted">Four short steps. It takes about two minutes.</p>
          <ProjectForm />
        </div>

        <aside className="flex flex-col gap-10 lg:col-span-4 lg:col-start-9 lg:pt-4">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight">Prefer to talk?</h2>
            <ul className="mt-5 flex flex-col gap-2">
              {channels.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="flex items-center gap-4 rounded-[var(--radius-control)] p-3 -mx-3 transition-colors hover:bg-canvas"
                  >
                    <c.icon size={24} aria-hidden className="shrink-0 text-accent-text" />
                    <span className="min-w-0">
                      <span className="block font-medium">{c.label}</span>
                      <span className="block break-all text-muted">{c.value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[var(--radius-card)] bg-canvas p-7">
            <h2 className="font-display text-xl font-bold tracking-tight">What happens next</h2>
            <ol className="mt-5 flex flex-col gap-4">
              {next.map((n, i) => (
                <li key={n} className="flex gap-4 text-muted">
                  <span className="font-mono text-sm text-ink">{i + 1}</span>
                  {n}
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </section>
  );
}
