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
/* Auth: optional. With ADMIN_PASSWORD set, a password and a signed    */
/* session cookie guard the dashboard. Without it, the owner chose to   */
/* leave /s3cret open (unlisted and noindex only).                      */
/* ------------------------------------------------------------------ */

const COOKIE = "nx_admin";
const SESSION_HOURS = 12;

/** The dashboard route exists. */
export const adminEnabled = () => true;
/** A password lock is configured. */
export const passwordRequired = () => Boolean(process.env.ADMIN_PASSWORD);

const sign = (value: string) => createHmac("sha256", `nexarc-admin:${process.env.ADMIN_PASSWORD}`).update(value).digest("hex");

function safeEqual(a: string, b: string) {
  // hash first so lengths always match and timing leaks nothing
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export const passwordMatches = (input: string) => passwordRequired() && safeEqual(input, process.env.ADMIN_PASSWORD!);

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
  if (!passwordRequired()) return true;
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
    resumePath: resume.endsWith(".pdf") ? resume : null,
    stage: isStage(d.stage) ? d.stage : "applied",
    scores,
    score: vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10 : 0,
    notes: r.notes ?? "",
    history: Array.isArray(d.history) ? (d.history as HistoryItem[]) : [],
  };
}

export const dataReady = () => Boolean(supabase());

export async function listApplications(): Promise<Application[]> {
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
  const { error } = await supabase()!.from("leads").update({ data, notes }).eq("id", id);
  if (error) throw new Error(error.message);
}

/** Short-lived link to the private resume PDF. */
export async function resumeUrl(path: string | null) {
  if (!path) return null;
  const { data } = await supabase()!.storage.from("resumes").createSignedUrl(path, 15 * 60);
  return data?.signedUrl ?? null;
}
