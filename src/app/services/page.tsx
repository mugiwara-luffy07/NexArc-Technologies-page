import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { PageIntro } from "@/components/content/PageIntro";
import { Process } from "@/components/sections/Process";
import { CtaBand } from "@/components/sections/CtaBand";
import { getServices } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Web, App and Software Development Services in Tamil Nadu",
  description: "Website development, custom CRM, e-commerce, mobile apps and SaaS development for businesses across Tamil Nadu and India. Designed and built by NexArc Technologies.",
  path: "/services",
});

export default function ServicesPage() {
  const services = getServices();
  return (
    <>
      <PageIntro title="Software for businesses that are ready to grow">
        We take a project from the first conversation to launch and keep improving it after. Pick what you need, or tell us the problem and we will
        suggest the right fit.
      </PageIntro>

      <section className="gutter mx-auto max-w-[1320px] pb-14 md:pb-20">
        <div className="grid gap-4 md:grid-cols-2">
          {services.map((s, i) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className={
                "group flex flex-col justify-between gap-8 rounded-[var(--radius-card)] p-7 ring-1 ring-line transition-colors hover:bg-surface sm:p-8 " +
                (i === 0 ? "md:col-span-2 md:flex-row md:items-end" : "")
              }
            >
              <div className={i === 0 ? "max-w-2xl" : ""}>
                <h2 className="font-display text-[clamp(1.35rem,1.2rem+0.6vw,1.75rem)] leading-tight font-bold tracking-tight">{s.title}</h2>
                <p className="mt-3 max-w-[48ch] text-muted">{s.summary}</p>
              </div>
              <div className="flex items-end justify-between gap-6">
                <p className="font-mono text-xs text-subtle">{s.stack.slice(0, 3).join(" / ")}</p>
                <ArrowUpRight size={24} aria-hidden className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-canvas">
        <div className="gutter mx-auto max-w-[1320px] py-14 md:py-20">
          <h2 className="text-display-lg max-w-[18ch]">Same process, every project</h2>
          <div className="mt-12">
            <Process />
          </div>
        </div>
      </section>

      <div className="pt-16 md:pt-16">
        <CtaBand />
      </div>
    </>
  );
}
