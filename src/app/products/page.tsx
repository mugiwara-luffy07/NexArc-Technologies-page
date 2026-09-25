import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { PageIntro } from "@/components/content/PageIntro";
import { Shot } from "@/components/ui/Shot";
import { WaitlistForm } from "@/components/forms/WaitlistForm";
import { getProducts } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Products",
  description: "Software products built by NexArc Technologies for small and growing businesses.",
  path: "/products",
});

export default function ProductsPage() {
  const products = getProducts();
  const live = products.filter((p) => p.status === "live");
  const soon = products.filter((p) => p.status === "soon");

  return (
    <>
      <PageIntro title="Products we build for ourselves">
        Client work shows us the same problems again and again. When a problem keeps coming back, we turn the solution into a product.
      </PageIntro>

      {live.map((p) => (
        <section key={p.slug} className="gutter mx-auto max-w-[1320px] pb-14 md:pb-20">
          <Link href={`/products/${p.slug}`} className="group grid items-center gap-8 rounded-[var(--radius-card)] bg-surface p-5 ring-1 ring-line sm:p-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <Shot src={p.cover} alt={`${p.name} screenshot`} ratio="16/10" sizes="(min-width: 1024px) 55vw, 100vw" />
            </div>
            <div className="lg:col-span-5">
              <p className="font-mono text-xs text-accent-text">Live now</p>
              <h2 className="mt-3 text-display-lg">{p.name}</h2>
              <p className="mt-3 text-lg">{p.tagline}</p>
              <p className="mt-4 max-w-[46ch] text-muted">{p.summary}</p>
              <span className="mt-8 inline-flex items-center gap-1.5 font-medium">
                See how it works
                <ArrowUpRight size={18} aria-hidden className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </Link>
        </section>
      ))}

      <section id="waitlist" className="scroll-mt-24 bg-canvas">
        <div className="gutter mx-auto grid max-w-[1320px] gap-12 py-14 md:py-20 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="text-display-lg">Coming soon</h2>
            <ul className="mt-8 flex flex-col gap-8">
              {soon.map((p) => (
                <li key={p.slug}>
                  <p className="font-display text-2xl font-bold tracking-tight">{p.name}</p>
                  <p className="mt-1 text-ink">{p.tagline}</p>
                  <p className="mt-2 max-w-[44ch] text-muted">{p.summary}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="rounded-[var(--radius-card)] bg-paper p-6 ring-1 ring-line sm:p-9">
              <h3 className="font-display text-2xl font-bold tracking-tight">Get told when they launch</h3>
              <p className="mt-2 mb-7 text-muted">One email when a product is ready. Early users get launch pricing.</p>
              <WaitlistForm products={soon.map((p) => p.name)} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
