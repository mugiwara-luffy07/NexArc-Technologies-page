import type { Metadata } from "next";
import Link from "next/link";
import { HeroArc } from "@/components/brand/HeroArc";
import { Logo } from "@/components/brand/Logo";
import { buttonClass } from "@/components/ui/Button";
import { CTA_LABEL } from "@/lib/site";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

const links = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: CTA_LABEL },
];

/** Full-screen 404, outside the site chrome. Always brand-dark, in both themes. */
export default function NotFound() {
  return (
    <main className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-brand-ink text-brand-paper">
      {/* light dots on the dark ground, fading out from the centre */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(#2e2e34 1.2px, transparent 1.3px)",
          backgroundSize: "22px 22px",
          maskImage: "radial-gradient(ellipse 60% 55% at 50% 45%, #000 25%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 55% at 50% 45%, #000 25%, transparent 75%)",
        }}
      />

      <div className="gutter relative mx-auto flex w-full max-w-[1320px] items-center py-5 sm:py-6">
        <Logo tone="paper" />
      </div>

      <div className="gutter relative mx-auto flex w-full max-w-[1320px] flex-1 flex-col items-center justify-center pb-16 text-center">
        <h1 className="sr-only">Page not found</h1>
        {/* the 0 is the mark */}
        <p
          aria-hidden
          className="flex items-center gap-[0.08em] font-display font-bold leading-none tracking-[-0.04em]"
          style={{ fontSize: "clamp(6rem, 3rem + 16vw, 15rem)" }}
        >
          <span>4</span>
          <HeroArc tone="paper" className="h-[0.64em] w-[0.64em] translate-y-[0.125em] drop-shadow-[0_20px_40px_rgb(0_0_0/0.5)]" />
          <span>4</span>
        </p>

        <p className="mt-8 font-display text-[clamp(1.35rem,1.15rem+0.8vw,1.85rem)] font-bold tracking-tight">This page is off the arc.</p>
        <p className="mt-3 max-w-[40ch] text-white/65">The link may be old or mistyped. Let us get you back on track.</p>

        <Link href="/" className={buttonClass("inverse", "lg", "mt-8")}>
          Go home
        </Link>

        <nav aria-label="Helpful links" className="mt-6">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-block py-2 text-white/70 underline decoration-white/20 underline-offset-4 transition-colors hover:text-brand-paper hover:decoration-brand-orange-dark"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
}
