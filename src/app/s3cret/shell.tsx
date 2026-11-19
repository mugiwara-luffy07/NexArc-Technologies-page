import Link from "next/link";
import { Mark } from "@/components/brand/Mark";
import { logout, toggleDemo } from "./actions";
import { LoginForm } from "./ui";
import { isDemo, passwordRequired, stageLabel, type Stage } from "@/lib/admin";
import { clsx } from "clsx";

export async function AdminBar() {
  const demo = await isDemo();
  return (
    <>
    <header className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1320px] items-center gap-3 px-4 sm:px-6">
        <Link href="/s3cret" className="flex items-center gap-2.5">
          <Mark className="size-7" />
          <span className="font-display text-lg font-bold tracking-tight">Hiring</span>
        </Link>
        <span className="hidden font-mono text-xs text-subtle lg:inline">NexArc Technologies · private</span>
        <nav className="ml-auto flex items-center gap-1 text-sm">
          {/* DEMO MODE (temporary): remove this switch after testing */}
          <form action={toggleDemo}>
            <button type="submit" role="switch" aria-checked={demo} className="flex items-center gap-2 rounded-[var(--radius-control)] px-3 py-2 text-muted hover:bg-canvas hover:text-ink">
              <span className={clsx("relative h-5 w-9 rounded-full transition-colors", demo ? "bg-accent" : "bg-line")} aria-hidden>
                <span className={clsx("absolute top-0.5 size-4 rounded-full bg-paper shadow transition-[left]", demo ? "left-[1.125rem]" : "left-0.5")} />
              </span>
              Demo data
            </button>
          </form>
          <Link href="/s3cret/export" prefetch={false} className="rounded-[var(--radius-control)] px-3 py-2 text-muted hover:bg-canvas hover:text-ink">
            Export CSV
          </Link>
          {passwordRequired() && (
            <form action={logout}>
              <button type="submit" className="rounded-[var(--radius-control)] px-3 py-2 text-muted hover:bg-canvas hover:text-ink">
                Sign out
              </button>
            </form>
          )}
        </nav>
      </div>
    </header>
    {demo && (
      <div role="status" className="border-b border-[#ffd6c2] bg-[#fff1e9] px-4 py-2 text-center text-sm text-[#9a3a0e] dark:border-[#5a3020] dark:bg-[#3a2117] dark:text-[#ffb08a]">
        Demo mode: sample candidates only. Changes stay in this browser and never touch real applications.
      </div>
    )}
    </>
  );
}

export function LoginScreen() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-[var(--radius-card)] bg-surface p-8 ring-1 ring-line">
        <Mark className="size-10" />
        <h1 className="mt-6 font-display text-2xl font-bold tracking-tight">Hiring dashboard</h1>
        <p className="mt-2 text-sm text-muted">Private. Sign in to review applications.</p>
        <LoginForm />
      </div>
    </main>
  );
}

export function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-16">
      <div className="rounded-[var(--radius-card)] bg-surface p-8 ring-1 ring-line">
        <h1 className="font-display text-xl font-bold tracking-tight">{title}</h1>
        <div className="mt-3 text-muted">{children}</div>
      </div>
    </main>
  );
}

const tone: Record<Stage, string> = {
  applied: "bg-canvas text-ink ring-line",
  shortlisted: "bg-[#fff1e9] text-[#9a3a0e] ring-[#ffd6c2] dark:bg-[#3a2117] dark:text-[#ffb08a] dark:ring-[#5a3020]",
  assessment: "bg-[#eef3ff] text-[#24408e] ring-[#d3defb] dark:bg-[#1c2540] dark:text-[#a9bdf5] dark:ring-[#2c3a63]",
  interview: "bg-[#f3eefe] text-[#5b3a9e] ring-[#e2d7fb] dark:bg-[#2a2140] dark:text-[#cbb6f7] dark:ring-[#3f3263]",
  selected: "bg-[#e9f7ef] text-[#1e6b3d] ring-[#c8ebd5] dark:bg-[#16301f] dark:text-[#8fdcae] dark:ring-[#24492f]",
  on_hold: "bg-[#fbf6e6] text-[#7a5b05] ring-[#f1e3b3] dark:bg-[#332a12] dark:text-[#e9cf7d] dark:ring-[#4d401b]",
  rejected: "bg-[#fdeceb] text-[#a5281b] ring-[#f6cfcb] dark:bg-[#3a1a17] dark:text-[#ff9b8f] dark:ring-[#5c2823]",
};

export function StagePill({ stage }: { stage: Stage }) {
  return <span className={clsx("inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset whitespace-nowrap", tone[stage])}>{stageLabel(stage)}</span>;
}

export function Score({ value }: { value: number }) {
  if (!value) return <span className="text-sm text-subtle">Not rated</span>;
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium" aria-label={`Score ${value} out of 5`}>
      <span className="flex gap-0.5" aria-hidden>
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className={clsx("size-1.5 rounded-full", n <= Math.round(value) ? "bg-accent" : "bg-line")} />
        ))}
      </span>
      {value.toFixed(1)}
    </span>
  );
}

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
export const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" });
