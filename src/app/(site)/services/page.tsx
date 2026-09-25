import Link from "next/link";
import { AddressBook, ArrowUpRight, DeviceMobile, Globe, Stack, Storefront } from "@phosphor-icons/react/dist/ssr";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
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

const ICONS: Record<string, PhosphorIcon> = {
  websites: Globe,
  crm: AddressBook,
  ecommerce: Storefront,
  "custom-platforms": Stack,
  "mobile-apps": DeviceMobile,
};

export default function ServicesPage() {
  const services = getServices();
  return (
    <>
      <PageIntro title="Software for businesses that are ready to grow">
        We take a project from the first conversation to launch and keep improving it after. Pick what you need, or tell us the problem and we will
        suggest the right fit.
      </PageIntro>

      <section className="gutter mx-auto max-w-[1320px] pb-14 md:pb-20">
        {/* 5 across on desktop; 3, 2 and 1 across as the screen narrows */}
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {services.map((s) => {
            const Icon = ICONS[s.slug] ?? Stack;
            return (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="group flex h-full flex-col gap-4 rounded-[var(--radius-card)] bg-surface p-6 ring-1 ring-line transition-[box-shadow,transform] duration-300 ease-[var(--ease-arc)] hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-28px_rgb(20_20_22/0.45)]"
                >
                  <div className="flex items-start justify-between">
                    <Icon size={28} weight="light" aria-hidden className="text-accent-text" />
                    <ArrowUpRight size={18} aria-hidden className="text-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink" />
                  </div>
                  <h2 className="font-display text-[1.15rem] leading-snug font-bold tracking-tight text-balance">{s.title}</h2>
                  <p className="text-[0.95rem] leading-relaxed text-muted">{s.summary}</p>
                  <p className="mt-auto pt-2 font-mono text-[0.7rem] text-subtle">{s.stack.slice(0, 3).join(" / ")}</p>
                </Link>
              </li>
            );
          })}
        </ul>
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
