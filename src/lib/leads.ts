import "server-only";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { site } from "./site";

export type LeadType = "project" | "waitlist" | "internship";

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
// Best effort on serverless (per instance); Turnstile is the real gate
const hits = new Map<string, number[]>();

export async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

export function rateLimited(ip: string) {
  if (process.env.DISABLE_RATE_LIMIT === "1") return false; // e2e runs submit from one IP
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_MAX;
}

/** Cloudflare Turnstile. Skipped when no secret is configured (local dev). */
export async function verifyTurnstile(token: FormDataEntryValue | null, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (typeof token !== "string" || !token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  });
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

function supabase() {
  const raw = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!raw || !key) return null;
  // Keep only the project origin: a pasted ".../rest/v1/" or trailing "/" breaks every request
  let url: string;
  try {
    url = new URL(raw).origin;
  } catch {
    console.error("[leads] SUPABASE_URL is not a valid URL");
    return null;
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

export function isConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) || Boolean(process.env.RESEND_API_KEY);
}

export async function uploadResume(file: File, email: string) {
  const db = supabase();
  if (!db) return null;
  const safe = email.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const path = `${Date.now()}-${safe}.pdf`;
  const { error } = await db.storage.from("resumes").upload(path, file, { contentType: "application/pdf" });
  if (error) {
    console.error("[leads] resume upload failed", error.message);
    return null;
  }
  return path;
}

export async function saveLead(type: LeadType, data: Record<string, unknown>) {
  const db = supabase();
  if (!db) {
    console.info(`[leads] Supabase not configured. ${type} lead:`, data);
    return false;
  }
  const { name, email, phone, ...rest } = data as { name?: string; email: string; phone?: string };
  const { error } = await db.from("leads").insert({ type, name: name ?? null, email, phone: phone ?? null, data: rest });
  if (error) throw new Error(`Supabase insert failed: ${error.message}`);
  return true;
}

const SUBJECTS: Record<LeadType, (d: Record<string, unknown>) => string> = {
  project: (d) => `New project enquiry: ${d.service} from ${d.name}`,
  waitlist: (d) => `Waitlist signup${d.product ? ` for ${d.product}` : ""}: ${d.email}`,
  internship: (d) => `Internship application: ${d.track} from ${d.name}`,
};

const LABELS: Record<string, string> = {
  service: "Service",
  budget: "Budget",
  timeline: "Timeline",
  details: "Details",
  name: "Name",
  email: "Email",
  phone: "Phone",
  company: "Company",
  product: "Product",
  track: "Track",
  college: "College",
  portfolio: "Portfolio",
  about: "About",
  resume: "Resume file",
};

function escape(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** Branded wrapper for every email: logo on a white card (safe in dark-mode mail apps), content, footer. */
function shell(inner: string) {
  const logo = `${site.url}/brand/email-logo.png`;
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f7f7f5">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7f5;padding:24px 12px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e4e4e0;border-radius:16px">
<tr><td style="padding:24px 28px 8px"><img src="${logo}" width="150" height="52" alt="NexArc Technologies" style="display:block;border:0;outline:none"/></td></tr>
<tr><td style="padding:8px 28px 24px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:15px;line-height:1.6;color:#141416">${inner}</td></tr>
<tr><td style="padding:16px 28px 22px;border-top:1px solid #efefeb;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:12px;color:#66666e">
${site.name} &middot; ${site.locality} &middot; <a href="${site.url}" style="color:#bf4410;text-decoration:none">nexarctechnologies.com</a></td></tr>
</table></td></tr></table></body></html>`;
}

function table(data: Record<string, unknown>) {
  const rows = Object.entries(data)
    .filter(([k, v]) => v && k !== "consent")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;color:#66666e;vertical-align:top;white-space:nowrap">${LABELS[k] ?? k}</td><td style="padding:8px 12px;color:#141416;white-space:pre-wrap">${escape(String(v))}</td></tr>`,
    )
    .join("");
  return `<table style="border-collapse:collapse;font-family:system-ui,sans-serif;font-size:15px">${rows}</table>`;
}

export async function notify(type: LeadType, data: Record<string, unknown>) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info(`[leads] Resend not configured, skipping email for ${type}`);
    return;
  }
  const resend = new Resend(key);
  const from = process.env.LEADS_FROM_EMAIL ?? `NexArc Technologies <hello@nexarctechnologies.com>`;
  const to = process.env.LEADS_TO_EMAIL ?? site.email;
  const email = String(data.email);

  // the SDK returns errors rather than throwing
  const sent = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: SUBJECTS[type](data),
    html: shell(`<h2 style="margin:0 0 12px;font-size:18px;color:#141416">${escape(SUBJECTS[type](data))}</h2>${table(data)}`),
  });
  if (sent.error) throw new Error(`Resend: ${sent.error.message}`);

  if (type !== "waitlist") {
    const firstName = String(data.name ?? "").split(" ")[0] || "there";
    const body =
      type === "project"
        ? `Thanks for telling us about your project. We read every brief ourselves and will reply within one working day with next steps and a rough budget range.`
        : `Thanks for applying for an internship at NexArc. We review applications every week and will get back to you by email.`;
    const reply = await resend.emails.send({
      from,
      to: email,
      replyTo: to,
      subject: type === "project" ? "We got your project brief" : "We got your internship application",
      html: shell(
        `<p style="margin:0 0 14px">Hi ${escape(firstName)},</p><p style="margin:0 0 14px">${body}</p><p style="margin:0 0 14px">If it is urgent, WhatsApp us on <a href="${site.whatsappHref}" style="color:#bf4410">${site.phone}</a>.</p><p style="margin:0">${site.founder}<br/><span style="color:#66666e">${site.name}</span></p>`,
      ),
    });
    // the owner already has the lead; a failed auto-reply is only logged
    if (reply.error) console.error("[leads] auto-reply failed", reply.error.message);
  }
}
