"use server";

import { internshipSchema, projectSchema, toFieldErrors, waitlistSchema, type FormState } from "@/lib/validators";
import { clientIp, isConfigured, notify, rateLimited, saveLead, uploadResume, verifyTurnstile, type LeadType } from "@/lib/leads";
import type { z } from "zod";
import { site } from "@/lib/site";

const GENERIC_ERROR = "Something went wrong on our side. Please try again, or WhatsApp us.";

async function handle<S extends z.ZodTypeAny>(
  type: LeadType,
  schema: S,
  formData: FormData,
  extra?: (data: z.infer<S>) => Promise<Record<string, unknown>>,
): Promise<FormState> {
  // Honeypot: real people never fill this hidden field
  if (formData.get("website")) return { status: "success" };

  const ip = await clientIp();
  if (rateLimited(ip)) return { status: "error", message: "Too many attempts. Please wait a few minutes and try again." };
  if (!(await verifyTurnstile(formData.get("cf-turnstile-response"), ip))) {
    return { status: "error", message: "We could not verify you are human. Please try again." };
  }

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", message: "Please check the highlighted fields.", fieldErrors: toFieldErrors(parsed.error) };
  }

  // Never accept a lead in production that would go nowhere
  if (process.env.NODE_ENV === "production" && !isConfigured() && process.env.ALLOW_UNCONFIGURED_LEADS !== "1") {
    console.error("[leads] No Supabase or Resend configured; refusing to drop a lead");
    return { status: "error", message: GENERIC_ERROR };
  }

  try {
    const data = { ...(parsed.data as Record<string, unknown>), ...(extra ? await extra(parsed.data) : {}) };
    delete data.consent;
    const saved = await saveLead(type, data);
    try {
      await notify(type, data);
    } catch (err) {
      // the lead is safe in the database; an email hiccup should not show the visitor an error
      if (!saved) throw err;
      console.error(`[leads] ${type} saved but email failed`, err);
    }
    return { status: "success" };
  } catch (err) {
    console.error(`[leads] ${type} failed`, err);
    return { status: "error", message: GENERIC_ERROR };
  }
}

export async function submitProject(_: FormState, formData: FormData) {
  return handle("project", projectSchema, formData);
}

export async function joinWaitlist(_: FormState, formData: FormData) {
  return handle("waitlist", waitlistSchema, formData);
}

const MAX_RESUME = 5 * 1024 * 1024;

export async function applyInternship(_: FormState, formData: FormData) {
  if (!site.internshipsOpen) {
    return { status: "error", message: "Internship applications are closed right now. Please check back soon." } satisfies FormState;
  }
  const file = formData.get("resume");
  if (file instanceof File && file.size > 0) {
    if (file.type !== "application/pdf") return { status: "error", message: "Please check the highlighted fields.", fieldErrors: { resume: "Please upload a PDF" } } satisfies FormState;
    if (file.size > MAX_RESUME) return { status: "error", message: "Please check the highlighted fields.", fieldErrors: { resume: "PDF must be under 5 MB" } } satisfies FormState;
  }
  formData.delete("resume");
  return handle("internship", internshipSchema, formData, async (data) => {
    if (file instanceof File && file.size > 0) {
      const path = await uploadResume(file, data.email);
      return path ? { resume: path } : {};
    }
    return {};
  });
}
