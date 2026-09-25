import { notFound } from "next/navigation";
import Link from "next/link";
import { Mdx } from "@/components/content/Mdx";
import { Shot } from "@/components/ui/Shot";
import { ButtonLink, buttonClass } from "@/components/ui/Button";
import { CtaBand } from "@/components/sections/CtaBand";
import { getProduct, getProducts } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProducts()
    .filter((p) => p.status === "live")
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const p = getProduct((await params).slug);
  if (!p || p.status !== "live") return {};
  return pageMeta({ title: p.name, description: `${p.tagline} ${p.summary}`, path: `/products/${p.slug}` });
}

export default async function ProductPage({ params }: Props) {
  const p = getProduct((await params).slug);
  if (!p || p.status !== "live") notFound();

  return (
    <>
      <section className="gutter mx-auto grid max-w-[1320px] items-center gap-10 pb-12 pt-10 sm:pt-14 md:pt-20 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <nav aria-label="Breadcrumb" className="text-sm text-subtle">
            <Link href="/products" className="py-2 hover:text-ink">
              Products
            </Link>
            <span aria-hidden className="mx-2">/</span>
            <span className="text-ink">{p.name}</span>
          </nav>
          <h1 className="text-display-xl mt-6">{p.name}</h1>
          <p className="mt-4 text-xl">{p.tagline}</p>
          <p className="mt-4 max-w-[46ch] text-lg text-muted">{p.summary}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {p.url ? (
              <ButtonLink href={p.url} size="lg" target="_blank" rel="noopener noreferrer">
                Try {p.name}
              </ButtonLink>
            ) : (
              <a
                href={`https://wa.me/919994155580?text=${encodeURIComponent(`Hi NexArc, I would like a demo of ${p.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass("primary", "lg")}
              >
                See a demo
              </a>
            )}
          </div>
        </div>
        <div className="lg:col-span-6">
          <Shot src={p.cover} alt={`${p.name} screenshot`} ratio="4/3" priority sizes="(min-width: 1024px) 50vw, 100vw" />
        </div>
      </section>
      <section className="border-t border-line">
        <div className="gutter mx-auto max-w-[1320px] py-14 md:py-20">
          <div className="max-w-[68ch] lg:ml-[16.66%]">
            <Mdx source={p.body} />
          </div>
        </div>
      </section>
      <CtaBand title="Want this set up for your business?" text="We help you get started, import your existing bookings and train your team." />
    </>
  );
}
