"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { clsx } from "clsx";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { ThemeToggle } from "./ThemeToggle";
import { CTA_LABEL, nav, site } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const toggleBtn = useRef<HTMLButtonElement>(null);

  // Header elevation after scroll, via IntersectionObserver (no scroll listener)
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setScrolled(!e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Close the sheet on navigation
  useEffect(() => setOpen(false), [pathname]);

  // Scroll lock, Esc to close, focus trap while the sheet is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () =>
      Array.from(sheet.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    focusables()[0]?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        toggleBtn.current?.focus();
      }
      if (e.key === "Tab") {
        const items = [toggleBtn.current!, ...focusables()];
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <div ref={sentinel} aria-hidden className="absolute top-0 h-px w-full" />
      <header
        className={clsx(
          "sticky top-0 z-40 border-b bg-paper/95 transition-[border-color,box-shadow] duration-300",
          "supports-[backdrop-filter]:bg-paper/85 supports-[backdrop-filter]:backdrop-blur-md",
          scrolled ? "border-line shadow-[0_6px_24px_-12px_rgb(20_20_22/0.18)]" : "border-transparent",
        )}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div
          className={clsx(
            "gutter mx-auto flex h-16 max-w-[1320px] items-center gap-4 transition-[height] duration-300 ease-[var(--ease-arc)]",
            // compacts a little once the page has scrolled (desktop only; the mobile sheet is anchored to 4rem)
            scrolled ? "lg:h-16" : "lg:h-[72px]",
          )}
        >
          <Logo />

          <nav aria-label="Primary" className="ml-auto hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="group/nav relative inline-flex h-11 items-center rounded-[var(--radius-control)] px-3.5 text-[0.95rem] text-muted transition-colors hover:text-ink aria-[current=page]:text-ink"
                  >
                    {item.label}
                    {/* hover underline grows from the centre; the active page shows the dot instead */}
                    {!isActive(item.href) && (
                      <span
                        aria-hidden
                        className="absolute inset-x-3.5 bottom-2 h-px origin-center scale-x-0 bg-accent transition-transform duration-300 ease-[var(--ease-arc)] group-hover/nav:scale-x-100"
                      />
                    )}
                    {/* the dot from the mark marks the active page */}
                    <span
                      aria-hidden
                      className={clsx(
                        "absolute bottom-1.5 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-accent transition-transform duration-300",
                        isActive(item.href) ? "scale-100" : "scale-0",
                      )}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1.5 lg:ml-2">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            <ButtonLink href="/contact" className="h-10 px-3.5 text-sm sm:h-11 sm:px-4 sm:text-[0.95rem]">
              {CTA_LABEL}
            </ButtonLink>
            <button
              ref={toggleBtn}
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-[var(--radius-control)] text-ink hover:bg-canvas lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={22} aria-hidden /> : <List size={22} aria-hidden />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sheet */}
      <div
        id="mobile-menu"
        ref={sheet}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[calc(4rem+env(safe-area-inset-top))] z-30 overflow-y-auto bg-paper lg:hidden"
      >
        <nav aria-label="Mobile" className="gutter flex min-h-full flex-col pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6">
          <ul className="flex flex-col">
            {[{ href: "/", label: "Home" }, ...nav, { href: "/internships", label: "Internships" }].map((item) => (
              <li key={item.href} className="border-b border-line">
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="flex min-h-14 items-center justify-between py-3 font-display text-2xl font-bold tracking-tight aria-[current=page]:text-accent-text"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-3 pt-10 text-muted">
            <a href={`mailto:${site.email}`} className="py-2 break-all hover:text-ink">
              {site.email}
            </a>
            <a href={site.phoneHref} className="py-2 hover:text-ink">
              {site.phone}
            </a>
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
