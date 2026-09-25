import Link from "next/link";
import { HeroArc } from "@/components/brand/HeroArc";
import { ButtonLink } from "@/components/ui/Button";
import { CTA_LABEL } from "@/lib/site";

const links = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
];

export default function NotFound() {
  return (
    <section className="relative">
      <div aria-hidden className="bg-dots pointer-events-none absolute inset-0" />
      <div className="gutter relative mx-auto grid max-w-[1320px] items-center gap-10 py-16 md:grid-cols-12 md:py-24">
        <div className="md:col-span-8">
          <p className="font-mono text-sm text-subtle">404</p>
          <h1 className="text-display-xl mt-3 max-w-[16ch] text-balance">This page is off the arc.</h1>
          <p className="mt-5 max-w-[42ch] text-lg text-muted">The link may be old or mistyped. Here is where you can go instead.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/" size="lg">
              Go home
            </ButtonLink>
            <ul className="flex flex-wrap gap-x-6 gap-y-1 sm:ml-4">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-block py-2 font-medium underline decoration-line decoration-2 underline-offset-4 hover:decoration-accent">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/contact" className="inline-block py-2 font-medium underline decoration-line decoration-2 underline-offset-4 hover:decoration-accent">
                  {CTA_LABEL}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="hidden justify-end md:col-span-4 md:flex">
          <HeroArc className="w-40 drop-shadow-[0_24px_32px_rgb(20_20_22/0.16)] lg:w-48" />
        </div>
      </div>
    </section>
  );
}
