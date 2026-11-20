import Link from "next/link";
import { notFound } from "next/navigation";
import { clsx } from "clsx";
import { adminEnabled, dataReady, isAdmin, isStage, listApplications, STAGES, type Application } from "@/lib/admin";
import { AdminBar, fmtDate, LoginScreen, Notice, Score, StagePill } from "./shell";

export const dynamic = "force-dynamic";

const OPENINGS = 3;
type Search = Promise<{ stage?: string; q?: string; sort?: string }>;

export default async function Dashboard({ searchParams }: { searchParams: Search }) {
  if (!adminEnabled()) notFound();
  if (!(await isAdmin())) return <LoginScreen />;

  if (!dataReady()) {
    return (
      <>
        <AdminBar />
        <Notice title="Database not connected">Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel to load applications.</Notice>
      </>
    );
  }

  let all: Application[];
  try {
    all = await listApplications();
  } catch (err) {
    console.error("[admin] list failed", err);
    return (
      <>
        <AdminBar />
        <Notice title="Could not reach the database">
          Supabase did not respond. If the project is paused, open supabase.com and click Restore project, then refresh. New applications still
          arrive by email in the meantime.
        </Notice>
      </>
    );
  }

  const { stage, q = "", sort = "newest" } = await searchParams;
  const term = q.trim().toLowerCase();
  const rows = all
    .filter((a) => (isStage(stage) ? a.stage === stage : true))
    .filter((a) => !term || [a.name, a.email, a.college, a.github, a.phone].some((v) => v.toLowerCase().includes(term)))
    .sort((a, b) =>
      sort === "score" ? b.score - a.score || +new Date(b.createdAt) - +new Date(a.createdAt) : sort === "oldest" ? +new Date(a.createdAt) - +new Date(b.createdAt) : +new Date(b.createdAt) - +new Date(a.createdAt),
    );

  const count = (s: string) => all.filter((a) => a.stage === s).length;
  const weekAgo = Date.now() - 7 * 86400_000;
  const stats = [
    { label: "Applications", value: all.length },
    { label: "New this week", value: all.filter((a) => +new Date(a.createdAt) > weekAgo).length },
    { label: "Waiting for review", value: count("applied"), hot: count("applied") > 0 },
    { label: "Seats filled", value: `${count("selected")} / ${OPENINGS}` },
  ];
  const href = (p: Record<string, string | undefined>) => {
    const sp = new URLSearchParams();
    const next = { stage, q: q || undefined, sort: sort === "newest" ? undefined : sort, ...p };
    for (const [k, v] of Object.entries(next)) if (v) sp.set(k, v);
    const s = sp.toString();
    return s ? `/s3cret?${s}` : "/s3cret";
  };

  return (
    <>
      <AdminBar />
      <main className="mx-auto w-full max-w-[1320px] flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <p className="font-mono text-xs text-accent-text">Internship · Engineering</p>
        <h1 className="mt-2 font-display text-[clamp(1.6rem,1.3rem+1.2vw,2.3rem)] leading-tight font-bold tracking-tight">Full-Stack Engineer Intern</h1>

        <dl className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className={clsx(
                "relative overflow-hidden rounded-[var(--radius-card)] bg-surface p-5 ring-1",
                "hot" in s && s.hot ? "ring-accent" : "ring-line",
              )}
            >
              <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-accent" />
              <dt className="flex items-center gap-2 text-sm text-muted">
                {"hot" in s && s.hot && (
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
                    <span className="relative inline-flex size-2 rounded-full bg-accent" />
                  </span>
                )}
                {s.label}
              </dt>
              <dd className={clsx("mt-1 font-display text-3xl font-bold tracking-tight", "hot" in s && s.hot && "text-accent-text")}>{s.value}</dd>
            </div>
          ))}
        </dl>

        {/* Pipeline tabs */}
        <nav aria-label="Stages" className="mt-8 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <ul className="flex min-w-max gap-1.5">
            {[{ id: undefined, label: "All" }, ...STAGES].map((s) => {
              const active = s.id === (isStage(stage) ? stage : undefined);
              return (
                <li key={s.label}>
                  <Link
                    href={href({ stage: s.id })}
                    aria-current={active ? "page" : undefined}
                    className={clsx(
                      "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm ring-1 ring-inset transition-colors",
                      active ? "bg-accent text-on-accent ring-accent" : "bg-surface text-muted ring-line hover:text-ink hover:ring-accent",
                    )}
                  >
                    {s.label}
                    <span className={clsx("font-mono text-xs", active ? "text-on-accent/70" : "text-subtle")}>{s.id ? count(s.id) : all.length}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Search and sort */}
        <form className="mt-4 flex flex-col gap-2 sm:flex-row" action="/s3cret">
          {isStage(stage) && <input type="hidden" name="stage" value={stage} />}
          <input
            name="q"
            defaultValue={q}
            placeholder="Search name, email, college or GitHub"
            aria-label="Search applications"
            className="h-11 flex-1 rounded-[var(--radius-control)] border border-line bg-surface px-3.5 text-base outline-none focus-visible:border-accent sm:text-sm"
          />
          <select
            name="sort"
            defaultValue={sort}
            aria-label="Sort"
            className="h-11 rounded-[var(--radius-control)] border border-line bg-surface px-3 text-base sm:text-sm"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="score">Highest score</option>
          </select>
          <button type="submit" className="h-11 rounded-[var(--radius-control)] bg-accent px-4 text-sm font-medium text-on-accent hover:opacity-90">
            Apply
          </button>
        </form>

        {/* Candidates */}
        <div className="mt-4 overflow-hidden rounded-[var(--radius-card)] bg-surface ring-1 ring-line">
          <div className="hidden grid-cols-[minmax(0,2.2fr)_minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-4 border-b border-line px-5 py-3 font-mono text-xs text-subtle md:grid">
            <span>Candidate</span>
            <span>College</span>
            <span>Applied</span>
            <span>Score</span>
            <span>Stage</span>
          </div>
          {rows.length === 0 ? (
            <p className="px-5 py-12 text-center text-muted">{all.length ? "No applications match." : "No applications yet. They will show up here as soon as someone applies."}</p>
          ) : (
            <ul className="divide-y divide-line">
              {rows.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/s3cret/${a.id}`}
                    className="group relative grid gap-2 px-5 py-4 transition-colors hover:bg-canvas before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-accent before:opacity-0 before:transition-opacity hover:before:opacity-100 md:grid-cols-[minmax(0,2.2fr)_minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] md:items-center md:gap-4"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium transition-colors group-hover:text-accent-text">{a.name}</span>
                      <span className="block truncate text-sm text-muted">{a.email}</span>
                    </span>
                    <span className="truncate text-sm text-muted">{a.college}</span>
                    <span className="text-sm text-muted">{fmtDate(a.createdAt)}</span>
                    <span className="flex items-center gap-3 md:block">
                      <Score value={a.score} />
                    </span>
                    <span>
                      <StagePill stage={a.stage} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <p className="mt-3 text-sm text-subtle">
          Showing <span className="text-accent-text">{rows.length}</span> of {all.length}
        </p>
      </main>
    </>
  );
}
