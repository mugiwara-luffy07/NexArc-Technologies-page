import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { nav, site } from "@/lib/site";
import { services } from "@/lib/services-index";

export function Footer() {
  const year = new Date().getFullYear();
  const social = Object.entries(site.social).filter(([, url]) => url);

  return (
    <footer className="border-t border-line">
      <div className="gutter mx-auto grid max-w-[1320px] gap-12 py-14 md:grid-cols-12 md:py-20">
        <div className="md:col-span-6">
          <Logo />
          <p className="mt-5 max-w-sm text-muted">
            Web development and software company in Tamil Nadu, India. Websites, CRMs, e-commerce, apps and SaaS for businesses across
            Tamil Nadu and India. {site.tagline}
          </p>
          <div className="mt-6 flex flex-col gap-1 text-[0.95rem]">
            <a href={`mailto:${site.email}`} className="w-fit break-all py-1.5 hover:text-accent-text">
              {site.email}
            </a>
            <a href={site.phoneHref} className="w-fit py-1.5 hover:text-accent-text">
              {site.phone}
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 md:col-span-6">
          <div>
            <h2 className="font-mono text-xs text-subtle">Services</h2>
            <ul className="mt-4 flex flex-col">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="inline-block py-1.5 text-muted hover:text-ink">
                    {s.short}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-mono text-xs text-subtle">Company</h2>
            <ul className="mt-4 flex flex-col">
              {[...nav.filter((n) => n.href !== "/services"), { href: "/internships", label: "Internships" }, { href: "/contact", label: "Contact" }].map(
                (n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="inline-block py-1.5 text-muted hover:text-ink">
                      {n.label}
                    </Link>
                  </li>
                ),
              )}
              {social.map(([name, url]) => (
                <li key={name}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="inline-block py-1.5 capitalize text-muted hover:text-ink">
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="gutter mx-auto flex max-w-[1320px] flex-col gap-2 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-sm text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. {site.locality}.
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" className="py-1 hover:text-ink">
              Privacy
            </Link>
            <Link href="/terms" className="py-1 hover:text-ink">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
