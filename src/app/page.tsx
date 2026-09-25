import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { HeroArc } from "@/components/brand/HeroArc";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { WorkTile } from "@/components/sections/WorkTile";
import { Process } from "@/components/sections/Process";
import { CtaBand } from "@/components/sections/CtaBand";
import { CornerArc } from "@/components/ui/CornerArc";
import { getProducts, getServices, getWork } from "@/lib/content";
import { CTA_LABEL, site } from "@/lib/site";

export default function Home() {
  const services = getServices();
  const work = getWork().filter((w) => w.featured).slice(0, 2);
  const products = getProducts();
  const live = products.find((p) => p.status === "live");
  const soon = products.filter((p) => p.status === "soon");

  return (
    <>
      {/* Hero: asymmetric split, text left, animated mark right */}
      <section className="gutter mx-auto grid max-w-[1320px] items-center gap-10 pb-16 pt-10 sm:pt-16 lg:min-h-[calc(100dvh-72px)] lg:grid-cols-12 lg:gap-8 lg:py-12">
        <div className="lg:col-span-8">
          <h1 className="text-display-hero max-w-[20ch] text-balance">
            Software, apps and SaaS products, <span className="text-accent-text">built to ship.</span>
          </h1>
          <p className="mt-6 max-w-[46ch] text-lg text-muted sm:text-xl">
            We design and build websites, CRMs, e-commerce stores and custom platforms for businesses across Tamil Nadu and India.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact" size="lg">
              {CTA_LABEL}
            </ButtonLink>
            <ButtonLink href="/work" variant="secondary" size="lg">
              See our work
            </ButtonLink>
          </div>
        </div>
        <div className="flex justify-start lg:col-span-4 lg:justify-end">
          <HeroArc className="w-[min(40vw,10rem)] drop-shadow-[0_30px_40px_rgb(20_20_22/0.18)] sm:w-[12rem] lg:w-[min(100%,20rem)]" />
        </div>
      </section>

      {/* Services: sticky heading with an indexed list */}
      <section className="border-t border-line">
        <div className="gutter mx-auto grid max-w-[1320px] gap-10 py-14 md:py-20 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <h2 className="text-display-lg">What we build</h2>
              <p className="mt-4 max-w-[36ch] text-muted">
                Five kinds of work, one team. Strategy, design and engineering under one roof.
              </p>
            </div>
          </div>
          <ul className="lg:col-span-8">
            {services.map((s) => (
              <li key={s.slug} className="border-b border-line first:border-t">
                <Link
                  href={`/services/${s.slug}`}
                  className="group grid grid-cols-[1fr_auto] items-start gap-x-6 gap-y-2 py-5 sm:py-6 md:grid-cols-[minmax(0,13rem)_1fr_auto]"
                >
                  <span className="font-display text-[clamp(1.2rem,1.05rem+0.6vw,1.5rem)] leading-tight font-bold tracking-tight transition-colors group-hover:text-accent-text">
                    {s.short}
                  </span>
                  <span className="col-span-2 row-start-2 max-w-[48ch] text-muted md:col-span-1 md:row-start-1 md:col-start-2 md:pt-1.5">
                    {s.summary}
                  </span>
                  <ArrowUpRight
                    size={24}
                    aria-hidden
                    className="mt-1.5 text-subtle transition-transform duration-300 ease-[var(--ease-arc)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink md:col-start-3"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Selected work: uneven two-up */}
      <section className="gutter mx-auto max-w-[1320px] py-14 md:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-display-lg max-w-[16ch]">Recent work, running in the real world</h2>
          <Link href="/work" className="w-fit py-2 font-medium underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-text">
            See our work
          </Link>
        </div>
        <div className="mt-10 grid gap-12 md:mt-14 md:grid-cols-12 md:gap-8">
          {work.length === 1 ? (
            <Reveal className="md:col-span-12">
              <WorkTile item={work[0]} compact />
            </Reveal>
          ) : (
            work.map((w, i) => (
              <Reveal key={w.slug} index={i} className={i === 0 ? "md:col-span-7" : "md:col-span-5 md:mt-24"}>
                <WorkTile
                  item={w}
                  size={i === 0 ? "lg" : "md"}
                  ratio={i === 0 ? "16/11" : "4/5"}
                  sizes={i === 0 ? "(min-width: 768px) 58vw, 100vw" : "(min-width: 768px) 42vw, 100vw"}
                />
              </Reveal>
            ))
          )}
        </div>
      </section>

      {/* Process: full-bleed tinted band with progress arcs */}
      <section className="bg-canvas">
        <div className="gutter mx-auto max-w-[1320px] py-14 md:py-20">
          <h2 className="text-display-lg max-w-[18ch]">How a project moves</h2>
          <div className="mt-12">
            <Process />
          </div>
        </div>
      </section>

      {/* Products: one live product, a short list of what is next */}
      {live && (
        <section className="gutter mx-auto max-w-[1320px] py-14 md:py-20">
          <h2 className="text-display-lg">Our own products</h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-12">
            <Link
              href={`/products/${live.slug}`}
              className="group relative flex flex-col justify-between gap-10 rounded-[var(--radius-card)] bg-surface p-7 ring-1 ring-line transition-shadow hover:shadow-[0_20px_50px_-30px_rgb(20_20_22/0.35)] sm:p-8 lg:col-span-7"
            >
              <CornerArc className="-left-2 -top-2" />
              <div>
                <p className="font-mono text-xs text-accent-text">Live now</p>
                <h3 className="mt-3 font-display text-[clamp(1.5rem,1.3rem+0.8vw,2rem)] leading-tight font-bold tracking-tight">
                  {live.name}
                </h3>
                <p className="mt-2 text-lg text-ink">{live.tagline}</p>
                <p className="mt-4 max-w-[52ch] text-muted">{live.summary}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 font-medium">
                Explore {live.name}
                <ArrowUpRight size={18} aria-hidden className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
            <div className="flex flex-col rounded-[var(--radius-card)] p-7 ring-1 ring-line sm:p-8 lg:col-span-5">
              <p className="font-mono text-xs text-subtle">Coming soon</p>
              <ul className="mt-4 flex flex-1 flex-col divide-y divide-line">
                {soon.map((p) => (
                  <li key={p.slug} className="py-5 first:pt-2">
                    <p className="font-display text-xl font-bold tracking-tight">{p.name}</p>
                    <p className="mt-1 text-muted">{p.tagline}</p>
                  </li>
                ))}
              </ul>
              <Link href="/products#waitlist" className="mt-4 w-fit py-2 font-medium underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-text">
                Join the waitlist
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Founder note: narrow editorial column */}
      <section className="border-t border-line">
        <figure className="gutter mx-auto max-w-[1320px] py-14 md:py-20">
          <div className="max-w-3xl md:ml-[16.66%]">
            {/* TODO(content): founder to confirm or rewrite this note */}
            <blockquote className="font-display text-[clamp(1.3rem,1.1rem+0.8vw,1.75rem)] leading-[1.25] font-bold tracking-tight text-balance">
              “Most businesses do not need more software. They need software that fits the way they already work. That is what we build.”
            </blockquote>
            <figcaption className="mt-6 text-muted">
              <span className="font-medium text-ink">{site.founder}</span>, Founder, {site.name}
            </figcaption>
          </div>
        </figure>
      </section>

      <CtaBand />
    </>
  );
}
