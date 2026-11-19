import Link from "next/link";
import { notFound } from "next/navigation";
import { clsx } from "clsx";
import { ArrowLeft, ArrowRight, ArrowUpRight, Envelope, FilePdf, GithubLogo, Globe, Phone, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { adminEnabled, CRITERIA, isAdmin, listApplications, resumeUrl, STAGES, type Application } from "@/lib/admin";
import { site } from "@/lib/site";
import { saveReview, setStage } from "../actions";
import { AdminBar, fmtDate, fmtDateTime, LoginScreen, Notice, Score, StagePill } from "../shell";
import { SubmitButton } from "../ui";

export const dynamic = "force-dynamic";

/** Ready-to-send emails for each step; they open in your mail app so you can edit before sending. */
function templates(a: Application) {
  const first = a.name.split(" ")[0] || "there";
  const sign = `\n\nRegards,\n${site.founder}\n${site.name}\n${site.url}`;
  const role = "Full-Stack Engineer Intern";
  return [
    {
      label: "Send assessment",
      subject: `${role} at NexArc: next step`,
      body: `Hi ${first},\n\nThanks for applying for the ${role} role at NexArc Technologies. We liked your application and would like to move you to the practical technical assessment.\n\n[Add the assessment link, what to build and the deadline here.]\n\nPlease reply to this email if you have any questions.${sign}`,
    },
    {
      label: "Invite to interview",
      subject: `${role} at NexArc: code walkthrough`,
      body: `Hi ${first},\n\nThanks for completing the assessment. We would like to schedule a code walkthrough and technical discussion with you.\n\nPlease share two or three time slots that work for you this week.${sign}`,
    },
    {
      label: "Send offer",
      subject: `${role} at NexArc: you are selected`,
      body: `Hi ${first},\n\nCongratulations! We are happy to offer you the ${role} position at NexArc Technologies. The internship is hybrid (online and offline) and runs for 12 weeks or until project completion, whichever is earlier.\n\n[Add the start date, onboarding details and what to prepare here.]\n\nPlease reply to confirm.${sign}`,
    },
    {
      label: "Send rejection",
      subject: `Your application to NexArc`,
      body: `Hi ${first},\n\nThank you for your interest in the ${role} role and for the time you put into your application. After careful review, we will not be moving forward this time.\n\nWe encourage you to keep building and to apply again for future openings.${sign}`,
    },
  ].map((t) => ({ ...t, href: `mailto:${a.email}?subject=${encodeURIComponent(t.subject)}&body=${encodeURIComponent(t.body)}` }));
}

const waNumber = (phone: string) => {
  const d = phone.replace(/\D/g, "");
  return d.length === 10 ? `91${d}` : d;
};

export default async function CandidatePage({ params }: { params: Promise<{ id: string }> }) {
  if (!adminEnabled()) notFound();
  if (!(await isAdmin())) return <LoginScreen />;

  const { id } = await params;
  let list: Application[];
  try {
    list = await listApplications();
  } catch {
    return (
      <>
        <AdminBar />
        <Notice title="Could not reach the database">Supabase did not respond. If the project is paused, restore it on supabase.com and refresh.</Notice>
      </>
    );
  }
  const i = list.findIndex((x) => x.id === id);
  if (i === -1) notFound();
  const a = list[i];
  const prev = list[i - 1];
  const next = list[i + 1];
  const pdf = await resumeUrl(a.resumePath);

  return (
    <>
      <AdminBar />
      <main className="mx-auto w-full max-w-[1320px] flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <Link href="/s3cret" className="inline-flex items-center gap-1.5 py-2 text-muted hover:text-ink">
            <ArrowLeft size={16} aria-hidden /> All applications
          </Link>
          <div className="flex items-center gap-1">
            <span className="mr-2 font-mono text-xs text-subtle">
              {i + 1} of {list.length}
            </span>
            {prev ? (
              <Link href={`/s3cret/${prev.id}`} aria-label="Previous candidate" className="rounded-[var(--radius-control)] p-2 ring-1 ring-line hover:bg-surface">
                <ArrowLeft size={16} aria-hidden />
              </Link>
            ) : null}
            {next ? (
              <Link href={`/s3cret/${next.id}`} aria-label="Next candidate" className="rounded-[var(--radius-control)] p-2 ring-1 ring-line hover:bg-surface">
                <ArrowRight size={16} aria-hidden />
              </Link>
            ) : null}
          </div>
        </div>

        {/* Header */}
        <section className="mt-4 rounded-[var(--radius-card)] bg-surface p-6 ring-1 ring-line sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-[clamp(1.5rem,1.3rem+1vw,2.1rem)] leading-tight font-bold tracking-tight">{a.name}</h1>
                <StagePill stage={a.stage} />
              </div>
              <p className="mt-1.5 text-muted">
                {a.role} · applied {fmtDate(a.createdAt)}
              </p>
            </div>
            <Score value={a.score} />
          </div>
          <ul className="mt-6 flex flex-wrap gap-2 text-sm">
            <Chip href={`mailto:${a.email}`} icon={<Envelope size={16} aria-hidden />}>
              {a.email}
            </Chip>
            {a.phone && (
              <Chip href={`tel:${a.phone.replace(/\s/g, "")}`} icon={<Phone size={16} aria-hidden />}>
                {a.phone}
              </Chip>
            )}
            {a.phone && (
              <Chip href={`https://wa.me/${waNumber(a.phone)}`} icon={<WhatsappLogo size={16} aria-hidden />} external>
                WhatsApp
              </Chip>
            )}
            {a.github && (
              <Chip href={a.github} icon={<GithubLogo size={16} aria-hidden />} external>
                {a.github.replace(/^https?:\/\/(www\.)?/, "")}
              </Chip>
            )}
            {a.portfolio && (
              <Chip href={a.portfolio} icon={<Globe size={16} aria-hidden />} external>
                {a.portfolio.replace(/^https?:\/\/(www\.)?/, "")}
              </Chip>
            )}
          </ul>
        </section>

        <div className="mt-4 grid gap-4 lg:grid-cols-12">
          {/* Left: application and resume */}
          <div className="flex min-w-0 flex-col gap-4 lg:col-span-7">
            <Card title="Application">
              <dl className="grid gap-4 sm:grid-cols-2">
                <Field label="College">{a.college || "Not given"}</Field>
                <Field label="Role">{a.role}</Field>
              </dl>
              <h3 className="mt-6 font-mono text-xs text-subtle">What they built</h3>
              <p className="mt-2 whitespace-pre-wrap">{a.about || "Not given"}</p>
            </Card>

            <Card
              title="Resume"
              action={
                pdf ? (
                  <a href={pdf} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
                    Open <ArrowUpRight size={14} aria-hidden />
                  </a>
                ) : null
              }
            >
              {pdf ? (
                <iframe src={pdf} title={`${a.name} resume`} className="h-[70vh] min-h-[480px] w-full rounded-[var(--radius-control)] bg-canvas ring-1 ring-line" />
              ) : (
                <div className="flex items-center gap-3 rounded-[var(--radius-control)] bg-canvas p-4 text-muted">
                  <FilePdf size={24} aria-hidden className="shrink-0" />
                  <p className="text-sm">The resume was not stored in the database. It is attached to the application email sent to {site.email}.</p>
                </div>
              )}
            </Card>
          </div>

          {/* Right: decision tools */}
          <div className="flex min-w-0 flex-col gap-4 lg:col-span-5">
            <Card title="Stage">
              <div className="flex flex-wrap gap-2">
                {STAGES.map((s) => (
                  <form key={s.id} action={setStage}>
                    <input type="hidden" name="id" value={a.id} />
                    <input type="hidden" name="stage" value={s.id} />
                    <button
                      type="submit"
                      disabled={a.stage === s.id}
                      aria-pressed={a.stage === s.id}
                      className={clsx(
                        "rounded-full px-3.5 py-2 text-sm ring-1 ring-inset transition-colors",
                        a.stage === s.id ? "bg-ink text-paper ring-ink" : "text-muted ring-line hover:text-ink hover:ring-ink",
                      )}
                    >
                      {s.label}
                    </button>
                  </form>
                ))}
              </div>
            </Card>

            <Card title="Scorecard">
              <form action={saveReview} className="flex flex-col gap-5">
                <input type="hidden" name="id" value={a.id} />
                {CRITERIA.map((c) => (
                  <fieldset key={c.id}>
                    <legend className="text-sm font-medium">{c.label}</legend>
                    <div className="mt-2 flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <label key={n} className="cursor-pointer">
                          <input type="radio" name={`score_${c.id}`} value={n} defaultChecked={a.scores[c.id] === n} className="peer sr-only" />
                          <span className="grid size-10 place-items-center rounded-[var(--radius-control)] text-sm ring-1 ring-line transition-colors peer-checked:bg-accent peer-checked:text-on-accent peer-checked:ring-accent peer-focus-visible:shadow-[0_0_0_3px_var(--accent)] hover:ring-ink">
                            {n}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ))}
                <div className="flex flex-col gap-2">
                  <label htmlFor="notes" className="text-sm font-medium">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    defaultValue={a.notes}
                    rows={5}
                    placeholder="Strengths, concerns, questions for the walkthrough"
                    className="rounded-[var(--radius-control)] border border-line bg-paper p-3 text-base outline-none focus-visible:border-ink sm:text-sm"
                  />
                </div>
                <SubmitButton className="self-start">Save review</SubmitButton>
              </form>
            </Card>

            <Card title="Email the candidate">
              <p className="text-sm text-muted">Opens a ready draft in your mail app. Edit, then send.</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {templates(a).map((t) => (
                  <a
                    key={t.label}
                    href={t.href}
                    className="inline-flex h-10 items-center justify-center rounded-[var(--radius-control)] px-3 text-sm ring-1 ring-line hover:bg-canvas hover:ring-ink"
                  >
                    {t.label}
                  </a>
                ))}
              </div>
            </Card>

            <Card title="Activity">
              <ol className="flex flex-col gap-3 text-sm">
                {a.history.map((h, k) => (
                  <li key={k} className="flex gap-3">
                    <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                    <span>
                      {h.text}
                      <span className="block text-xs text-subtle">{fmtDateTime(h.at)}</span>
                    </span>
                  </li>
                ))}
                <li className="flex gap-3">
                  <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-line" />
                  <span>
                    Applied
                    <span className="block text-xs text-subtle">{fmtDateTime(a.createdAt)}</span>
                  </span>
                </li>
              </ol>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}

function Card({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-[var(--radius-card)] bg-surface p-6 ring-1 ring-line">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-display text-lg font-bold tracking-tight">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="font-mono text-xs text-subtle">{label}</dt>
      <dd className="mt-1">{children}</dd>
    </div>
  );
}

function Chip({ href, icon, external, children }: { href: string; icon: React.ReactNode; external?: boolean; children: React.ReactNode }) {
  return (
    <li>
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="inline-flex max-w-full items-center gap-2 rounded-full bg-canvas px-3.5 py-2 ring-1 ring-line hover:ring-ink"
      >
        {icon}
        <span className="truncate">{children}</span>
      </a>
    </li>
  );
}
