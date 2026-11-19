import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { supabase } from "./leads";

/* ------------------------------------------------------------------ */
/* Pipeline                                                            */
/* ------------------------------------------------------------------ */

export const STAGES = [
  { id: "applied", label: "Applied" },
  { id: "shortlisted", label: "Shortlisted" },
  { id: "assessment", label: "Assessment" },
  { id: "interview", label: "Interview" },
  { id: "selected", label: "Selected" },
  { id: "on_hold", label: "On hold" },
  { id: "rejected", label: "Rejected" },
] as const;
export type Stage = (typeof STAGES)[number]["id"];
export const stageLabel = (s: Stage) => STAGES.find((x) => x.id === s)?.label ?? s;
export const isStage = (s: unknown): s is Stage => STAGES.some((x) => x.id === s);

export const CRITERIA = [
  { id: "technical", label: "Technical skills" },
  { id: "projects", label: "Project quality" },
  { id: "problem", label: "Problem solving" },
  { id: "communication", label: "Communication" },
] as const;
export type Criterion = (typeof CRITERIA)[number]["id"];

export type HistoryItem = { at: string; text: string };

export type Application = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  github: string;
  portfolio: string;
  about: string;
  role: string;
  /** storage path in the private "resumes" bucket, when the upload worked */
  resumePath: string | null;
  stage: Stage;
  scores: Partial<Record<Criterion, number>>;
  /** average of the scorecard, 0 when not reviewed */
  score: number;
  notes: string;
  history: HistoryItem[];
};

/* ------------------------------------------------------------------ */
/* Auth: one password from ADMIN_PASSWORD, signed session cookie       */
/* ------------------------------------------------------------------ */

const COOKIE = "nx_admin";
const SESSION_HOURS = 12;

export const adminEnabled = () => Boolean(process.env.ADMIN_PASSWORD);

const sign = (value: string) => createHmac("sha256", `nexarc-admin:${process.env.ADMIN_PASSWORD}`).update(value).digest("hex");

function safeEqual(a: string, b: string) {
  // hash first so lengths always match and timing leaks nothing
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export const passwordMatches = (input: string) => adminEnabled() && safeEqual(input, process.env.ADMIN_PASSWORD!);

export async function startSession() {
  const expires = Date.now() + SESSION_HOURS * 3600_000;
  const value = `${expires}.${sign(String(expires))}`;
  (await cookies()).set(COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/s3cret",
    maxAge: SESSION_HOURS * 3600,
  });
}

export async function endSession() {
  (await cookies()).delete({ name: COOKIE, path: "/s3cret" });
}

export async function isAdmin() {
  if (!adminEnabled()) return false;
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return false;
  const [expires, sig] = raw.split(".");
  if (!expires || !sig || Number(expires) < Date.now()) return false;
  return safeEqual(sig, sign(expires));
}

/* ------------------------------------------------------------------ */
/* Data: leads table rows of type "internship"                         */
/* ------------------------------------------------------------------ */

type Row = { id: string; created_at: string; name: string | null; email: string; phone: string | null; data: Record<string, unknown>; notes: string | null };

const str = (v: unknown) => (typeof v === "string" ? v : "");
/** Only plain web links reach an href, never javascript: or data: */
const link = (v: unknown) => (/^https?:\/\//i.test(str(v)) ? str(v) : "");

function toApplication(r: Row): Application {
  const d = r.data ?? {};
  const scores = (d.scores ?? {}) as Partial<Record<Criterion, number>>;
  const vals = Object.values(scores).filter((n): n is number => typeof n === "number" && n > 0);
  const resume = str(d.resume);
  return {
    id: r.id,
    createdAt: r.created_at,
    name: r.name ?? "",
    email: r.email,
    phone: r.phone ?? "",
    college: str(d.college),
    github: link(d.github) || link(d.portfolio),
    portfolio: link(d.github) ? link(d.portfolio) : "",
    about: str(d.about),
    role: str(d.role) || str(d.track) || "Internship",
    resumePath: resume.endsWith(".pdf") || resume === DEMO_RESUME ? resume : null,
    stage: isStage(d.stage) ? d.stage : "applied",
    scores,
    score: vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10 : 0,
    notes: r.notes ?? "",
    history: Array.isArray(d.history) ? (d.history as HistoryItem[]) : [],
  };
}

/* ------------------------------------------------------------------ */
/* DEMO MODE (temporary, remove after testing): sample candidates       */
/* Switched on per browser from the dashboard, or by ADMIN_DEMO=1 in    */
/* local dev and e2e. Edits live in a cookie, never in the database.    */
/* ------------------------------------------------------------------ */

const DEMO_COOKIE = "nx_demo";
const DEMO_EDITS = "nx_demo_edits";
export const DEMO_RESUME = "demo";

const demoBase: Row[] = [
  ["Priya Raman", "priya@example.com", "B.E. CSE, 3rd year, Kongu Engineering College", "github.com/priya-builds", "A hostel mess booking app in Next.js and Supabase with auth, a REST API for meal slots and an admin view. Deployed on Vercel and used by 120 students."],
  ["Arun Kumar", "arun@example.com", "B.Tech IT, final year, PSG Tech", "github.com/arunk", "Inventory tracker for my uncle's hardware shop. Node.js API, PostgreSQL, React front end, barcode scanning from the phone camera."],
  ["Divya S", "divya@example.com", "MCA, 1st year, Anna University", "github.com/divyas", "Built a college event portal with registrations and QR check-in using Next.js and Prisma."],
  ["Karthik M", "karthik@example.com", "B.Sc Computer Science, 3rd year", "github.com/karthik-m", "A Telegram bot that tracks expenses, written in TypeScript with a Supabase database and charts in a small React dashboard."],
  ["Meena Lakshmi", "meena@example.com", "B.E. ECE, final year", "github.com/meenal", "Clinic appointment booking site with OTP login, doctor slots and WhatsApp reminders through a third-party API."],
].map(([name, email, college, github, about], i) => ({
  id: `00000000-0000-4000-8000-00000000000${i + 1}`,
  created_at: new Date(Date.UTC(2026, 10, 18 - i * 2, 5 + i, 30)).toISOString(),
  name,
  email,
  phone: `+91 98765 4321${i}`,
  data: { role: "Full-Stack Engineer Intern", college, github: `https://${github}`, portfolio: i % 2 ? "" : `https://${name.split(" ")[0].toLowerCase()}.vercel.app`, about, resume: DEMO_RESUME },
  notes: null,
}));

type DemoEdits = Record<string, { data?: Record<string, unknown>; notes?: string | null }>;

export async function isDemo() {
  if (process.env.ADMIN_DEMO === "1" && process.env.VERCEL !== "1") return true;
  return (await cookies()).get(DEMO_COOKIE)?.value === "1";
}

export async function setDemo(on: boolean) {
  const jar = await cookies();
  const opts = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" as const, path: "/s3cret" };
  if (on) jar.set(DEMO_COOKIE, "1", { ...opts, maxAge: 7 * 86400 });
  else jar.delete({ name: DEMO_COOKIE, path: "/s3cret" });
  jar.delete({ name: DEMO_EDITS, path: "/s3cret" });
}

async function demoRows(): Promise<Row[]> {
  let edits: DemoEdits = {};
  try {
    edits = JSON.parse((await cookies()).get(DEMO_EDITS)?.value ?? "{}");
  } catch {}
  return demoBase.map((r) => (edits[r.id] ? { ...r, data: { ...r.data, ...edits[r.id].data }, notes: edits[r.id].notes ?? r.notes } : r));
}

async function saveDemoEdit(id: string, data: Record<string, unknown>, notes: string | null) {
  const jar = await cookies();
  let edits: DemoEdits = {};
  try {
    edits = JSON.parse(jar.get(DEMO_EDITS)?.value ?? "{}");
  } catch {}
  // keep the cookie small: short notes, last few activity entries
  const { history, ...rest } = data;
  edits[id] = { data: { ...rest, history: Array.isArray(history) ? history.slice(0, 4) : [] }, notes: notes ? notes.slice(0, 280) : notes };
  jar.set(DEMO_EDITS, JSON.stringify(edits), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/s3cret", maxAge: 7 * 86400 });
}

/* ------------------------------------------------------------------ */

export const dataReady = async () => (await isDemo()) || Boolean(supabase());

export async function listApplications(): Promise<Application[]> {
  if (await isDemo()) return (await demoRows()).map(toApplication);
  const db = supabase();
  if (!db) throw new Error("Supabase is not configured");
  const { data, error } = await db
    .from("leads")
    .select("id, created_at, name, email, phone, data, notes")
    .eq("type", "internship")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as Row[]).map(toApplication);
}

async function getRow(id: string): Promise<Row | null> {
  if (await isDemo()) return (await demoRows()).find((r) => r.id === id) ?? null;
  const db = supabase();
  if (!db) throw new Error("Supabase is not configured");
  const { data, error } = await db.from("leads").select("id, created_at, name, email, phone, data, notes").eq("type", "internship").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data as Row | null;
}

export async function getApplication(id: string) {
  const row = await getRow(id);
  return row ? toApplication(row) : null;
}

export async function updateApplication(id: string, patch: { data?: Record<string, unknown>; notes?: string; log?: string }) {
  const row = await getRow(id);
  if (!row) throw new Error("Application not found");
  const history = Array.isArray(row.data?.history) ? [...(row.data.history as HistoryItem[])] : [];
  if (patch.log) history.unshift({ at: new Date().toISOString(), text: patch.log });
  const data = { ...row.data, ...patch.data, history: history.slice(0, 50) };
  const notes = patch.notes ?? row.notes;
  if (await isDemo()) return saveDemoEdit(id, data, notes);
  const { error } = await supabase()!.from("leads").update({ data, notes }).eq("id", id);
  if (error) throw new Error(error.message);
}

/** Short-lived link to the private resume PDF. */
export async function resumeUrl(path: string | null) {
  if (!path) return null;
  if (path === DEMO_RESUME) return "/s3cret/demo-resume";
  if (await isDemo()) return null;
  const { data } = await supabase()!.storage.from("resumes").createSignedUrl(path, 15 * 60);
  return data?.signedUrl ?? null;
}
