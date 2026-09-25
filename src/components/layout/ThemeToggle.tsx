"use client";

import { Moon, Sun } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme((document.documentElement.dataset.theme as Theme) ?? "light");
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setTheme(next);
  }

  const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={
        "inline-flex size-11 items-center justify-center rounded-[var(--radius-control)] text-muted " +
        "transition-colors hover:bg-canvas hover:text-ink " +
        (className ?? "")
      }
    >
      {/* Render both, swap by theme attribute so SSR markup matches */}
      <Moon size={20} className="dark:hidden" aria-hidden />
      <Sun size={20} className="hidden dark:block" aria-hidden />
    </button>
  );
}
