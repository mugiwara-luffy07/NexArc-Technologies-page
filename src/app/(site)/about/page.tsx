import { PageIntro } from "@/components/content/PageIntro";
import { CtaBand } from "@/components/sections/CtaBand";
import Image from "next/image";
import { EnvelopeSimple, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { ARC_PATH, Mark } from "@/components/brand/Mark";
import { CornerArc } from "@/components/ui/CornerArc";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: "About",
  description: "NexArc Technologies is a web development and software company in Tamil Nadu, India, working with businesses from Chennai to Kanyakumari and across India.",
  path: "/about",
});

const principles = [
  { title: "Fit the business, not a template", text: "We learn how you already work and build around it. Software that fights your routine does not get used." },
  { title: "Ship small, ship often", text: "A useful first version in weeks, then steady improvements based on what real users do." },
  { title: "Phones first", text: "Your customers and staff are on their phones. Every screen is designed and tested there first." },
  { title: "You own everything", text: "Code, data, domain and accounts are yours. No lock-in, no surprises." },
];

const stack = ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "Flutter", "Vercel", "Razorpay", "Resend"];

export default function AboutPage() {
  return (
    <>
      <PageIntro title={<>The next arc of growth, built in software.</>}>
        NexArc Technologies is a software studio from {site.locality}. We build websites, business software and SaaS products for companies ready for
        their next stage.
      </PageIntro>

      {/* Story: narrow editorial column beside the mark */}
      <section className="border-t border-line">
        <div className="gutter mx-auto grid max-w-[1320px] gap-12 py-14 md:py-20 lg:grid-cols-12">
          <div className="hidden lg:col-span-3 lg:block">
            <Mark className="size-20" />
          </div>
          {/* TODO(content): founder to review and personalise this story */}
          <div className="prose-nexarc max-w-[62ch] lg:col-span-7">
            <h2 className="!mt-0">Why we started</h2>
            <p>
              Small and growing businesses run on phone calls, notebooks, WhatsApp groups and spreadsheets. The software built for them is usually either
              too generic to fit or too expensive to own.
            </p>
            <p>
              NexArc exists to close that gap. We sit with the people who will use the software, understand the way they already work, and build tools
              that feel obvious to them from the first day.
            </p>
            <p>
              The name says what we are after: the next arc of growth for every business we work with. The mark is that arc, with the dot as the
              business at its centre.
            </p>
          </div>
        </div>
      </section>

      {/* Principles: two-column typographic list */}
      <section className="bg-canvas">
        <div className="gutter mx-auto max-w-[1320px] py-14 md:py-20">
          <h2 className="text-display-lg max-w-[16ch]">How we work</h2>
          <dl className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {principles.map((p) => (
              <div key={p.title} className="border-t border-line pt-6">
                <dt className="font-display text-xl font-bold tracking-tight">{p.title}</dt>
                <dd className="mt-2 max-w-[46ch] text-muted">{p.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Founder: one card, slim photo column with brand treatment, details on the right */}
      <section className="gutter mx-auto max-w-[1320px] py-16 md:py-20">
        <div className="relative">
          <CornerArc always className="-left-2 -top-2 z-10" />
          <article className="grid overflow-hidden rounded-[var(--radius-card)] bg-surface ring-1 ring-line md:grid-cols-[17rem_1fr] lg:grid-cols-[19rem_1fr]">
            {/* photo: head-and-shoulders crop on phones, full-height column on desktop */}
            <div className="relative aspect-[4/3] md:aspect-auto md:min-h-full">
              <Image
                src="/team/sri-akash.jpg"
                alt={`${site.founder}, founder of ${site.name}`}
                fill
                sizes="(min-width: 1024px) 304px, (min-width: 768px) 272px, 100vw"
                className="object-cover object-[50%_15%]"
              />
              <div className="absolute bottom-4 left-4 rounded-[10px] shadow-[0_8px_24px_-8px_rgb(20_20_22/0.5)]">
                <Mark tone="ink" className="size-10" title="NexArc" />
              </div>
            </div>

            <div className="flex flex-col gap-6 p-7 sm:p-9 lg:p-12">
              <div>
                <p className="font-mono text-xs text-accent-text">Founder</p>
                <h2 className="text-display-lg mt-2">{site.founder}</h2>
                <p className="mt-1 text-muted">Founder, {site.name}</p>
              </div>

              <blockquote className="flex gap-4">
                <svg aria-hidden viewBox="8 8 34 34" className="mt-1 size-7 shrink-0">
                  <path d={ARC_PATH} fill="none" strokeWidth="5" strokeLinecap="round" className="stroke-accent" />
                </svg>
                <p className="font-display text-[clamp(1.15rem,1.05rem+0.5vw,1.4rem)] leading-snug font-bold tracking-tight text-balance">
                  Most businesses do not need more software. They need software that fits the way they already work.
                </p>
              </blockquote>

              <p className="max-w-[52ch] text-muted">
                Sri Akash leads design and engineering at NexArc, working directly with every client from the first call to launch.
              </p>

              <div>
                <h3 className="font-mono text-xs text-subtle">Tools we build with</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {stack.map((t) => (
                    <li key={t} className="rounded-[var(--radius-control)] border border-line px-3 py-1.5 text-sm">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-5">
                <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 py-1.5 font-medium hover:text-accent-text">
                  <EnvelopeSimple size={18} aria-hidden />
                  Email
                </a>
                <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 py-1.5 font-medium hover:text-accent-text">
                  <WhatsappLogo size={18} aria-hidden />
                  WhatsApp
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Service area: visible text, not just schema */}
      <section className="border-t border-line">
        <div className="gutter mx-auto grid max-w-[1320px] gap-8 py-14 md:py-20 lg:grid-cols-12">
          <h2 className="text-display-lg lg:col-span-4">Where we work</h2>
          <div className="lg:col-span-7 lg:col-start-6">
            <p className="text-lg text-muted">
              We work with businesses across Tamil Nadu, from Chennai to Kanyakumari, and with clients anywhere in India. Most projects run
              remotely over calls and WhatsApp, with in-person visits when a project needs them.
            </p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {site.areas.map((a) => (
                <li key={a} className="rounded-[var(--radius-control)] border border-line px-3 py-1.5 text-sm text-muted">
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
