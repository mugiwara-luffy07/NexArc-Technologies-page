import { notFound } from "next/navigation";
import Link from "next/link";
import { Mdx } from "@/components/content/Mdx";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/sections/CtaBand";
import { getService, getServices } from "@/lib/content";
import { breadcrumbJsonLd, faqJsonLd, pageMeta, serviceJsonLd } from "@/lib/seo";
import { CTA_LABEL } from "@/lib/site";

// Pre-selects the matching option in the contact brief
const FORM_OPTION: Record<string, string> = {
  websites: "Website",
  crm: "CRM / business software",
  ecommerce: "E-commerce",
  "custom-platforms": "Custom platform / SaaS",
  "mobile-apps": "Mobile app",
};

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getServices().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const s = getService((await params).slug);
  if (!s) return {};
  return pageMeta({ title: s.seoTitle ?? s.title, description: s.seoDescription ?? s.summary, path: `/services/${s.slug}` });
}

export default async function ServicePage({ params }: Props) {
  const s = getService((await params).slug);
  if (!s) notFound();
  const others = getServices().filter((o) => o.slug !== s.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            serviceJsonLd(s),
            breadcrumbJsonLd([
              { name: "Services", path: "/services" },
              { name: s.title, path: `/services/${s.slug}` },
            ]),
            ...(s.faq.length ? [faqJsonLd(s.faq)] : []),
          ]),
        }}
      />

      <section className="gutter mx-auto max-w-[1320px] pb-12 pt-10 sm:pt-14 md:pb-16 md:pt-20">
        <nav aria-label="Breadcrumb" className="text-sm text-subtle">
          <Link href="/services" className="py-2 hover:text-ink">
            Services
          </Link>
          <span aria-hidden className="mx-2">/</span>
          <span className="text-ink">{s.short}</span>
        </nav>
        <h1 className="text-display-xl mt-6 max-w-[16ch] text-balance">{s.title}</h1>
        <p className="mt-6 max-w-[48ch] text-lg text-muted sm:text-xl">{s.summary}</p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <ButtonLink href={FORM_OPTION[s.slug] ? `/contact?service=${encodeURIComponent(FORM_OPTION[s.slug])}` : "/contact"} size="lg">
            {CTA_LABEL}
          </ButtonLink>
          {s.startingFrom && <p className="text-muted">Projects typically start from {s.startingFrom}</p>}
        </div>
      </section>

      <section className="border-t border-line">
        <div className="gutter mx-auto grid max-w-[1320px] gap-12 py-14 md:py-20 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Mdx source={s.body} />
          </div>
          <aside className="flex flex-col gap-10 lg:col-span-4 lg:col-start-9">
            <div className="rounded-[var(--radius-card)] bg-surface p-7 ring-1 ring-line">
              <h2 className="font-display text-xl font-bold tracking-tight">What you get</h2>
              <ul className="mt-5 flex flex-col gap-3">
                {s.deliverables.map((d) => (
                  <li key={d} className="flex gap-3 text-muted">
                    <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-accent" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {s.faq.length > 0 && (
        <section className="bg-canvas">
          <div className="gutter mx-auto grid max-w-[1320px] gap-10 py-14 md:py-20 lg:grid-cols-12">
            <h2 className="text-display-lg lg:col-span-4">Questions we get asked</h2>
            <div className="divide-y divide-line border-y border-line lg:col-span-8">
              {s.faq.map((f) => (
                <details key={f.q} className="group py-2">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-3 text-lg font-medium [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span aria-hidden className="relative size-4 shrink-0">
                      <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-ink" />
                      <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-ink transition-transform duration-300 group-open:scale-y-0" />
                    </span>
                  </summary>
                  <p className="max-w-[62ch] pb-5 text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="gutter mx-auto max-w-[1320px] py-14 md:py-20">
        <h2 className="font-mono text-xs text-subtle">Other services</h2>
        <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/services/${o.slug}`} className="inline-block py-2 font-display text-xl font-bold tracking-tight hover:text-accent-text">
                {o.short}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand />
    </>
  );
}
