import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Mdx } from "@/components/content/Mdx";
import { Shot } from "@/components/ui/Shot";
import { CtaBand } from "@/components/sections/CtaBand";
import { getWork, getWorkItem } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getWork().map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Props) {
  const w = getWorkItem((await params).slug);
  if (!w) return {};
  return pageMeta({ title: `${w.client}: ${w.title}`, description: w.summary, path: `/work/${w.slug}` });
}

export default async function CaseStudy({ params }: Props) {
  const w = getWorkItem((await params).slug);
  if (!w) notFound();
  const all = getWork();
  const next = all[(all.findIndex((x) => x.slug === w.slug) + 1) % all.length];

  const meta = [
    { label: "Client", value: w.client },
    { label: "Services", value: w.services.join(", ") },
    { label: "Year", value: w.year },
  ];

  return (
    <>
      <article>
        <header className="gutter mx-auto max-w-[1320px] pb-10 pt-10 sm:pt-14 md:pt-20">
          <nav aria-label="Breadcrumb" className="text-sm text-subtle">
            <Link href="/work" className="py-2 hover:text-ink">
              Work
            </Link>
            <span aria-hidden className="mx-2">/</span>
            <span className="text-ink">{w.client}</span>
          </nav>
          <h1 className="text-display-xl mt-6 max-w-[18ch] text-balance">{w.title}</h1>
          <p className="mt-6 max-w-[52ch] text-lg text-muted sm:text-xl">{w.summary}</p>

          <dl className="mt-10 grid gap-6 border-t border-line pt-6 sm:grid-cols-2 lg:grid-cols-4">
            {meta.map((m) => (
              <div key={m.label}>
                <dt className="font-mono text-xs text-subtle">{m.label}</dt>
                <dd className="mt-1.5">{m.value}</dd>
              </div>
            ))}
            {w.url && (
              <div>
                <dt className="font-mono text-xs text-subtle">Live site</dt>
                <dd className="mt-1.5">
                  <a href={w.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline decoration-accent underline-offset-4 hover:text-accent-text">
                    {w.url.replace(/^https?:\/\//, "")}
                    <ArrowUpRight size={16} aria-hidden />
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </header>

        <div className="gutter mx-auto max-w-[1320px]">
          <Shot src={w.cover} alt={`${w.client} project screenshot`} ratio="16/9" priority sizes="(min-width: 1320px) 1240px, 100vw" />
        </div>

        <div className="gutter mx-auto grid max-w-[1320px] gap-12 py-14 md:py-20 lg:grid-cols-12">
          <div className="lg:col-span-7 lg:col-start-3">
            <Mdx source={w.body} />
            <div className="mt-12">
              <h2 className="font-mono text-xs text-subtle">Built with</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {w.stack.map((t) => (
                  <li key={t} className="rounded-[var(--radius-control)] border border-line px-3 py-1.5 text-sm">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </article>

      {next && next.slug !== w.slug && (
        <section className="border-t border-line">
          <Link href={`/work/${next.slug}`} className="group gutter mx-auto flex max-w-[1320px] flex-col gap-2 py-12 md:py-16">
            <span className="font-mono text-xs text-subtle">Next project</span>
            <span className="text-display-md inline-flex items-center gap-3 group-hover:text-accent-text">
              {next.title}
              <ArrowUpRight size={28} aria-hidden className="shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </span>
          </Link>
        </section>
      )}

      <CtaBand />
    </>
  );
}
