"use server";

import { internshipSchema, projectSchema, toFieldErrors, waitlistSchema, type FormState } from "@/lib/validators";
import { clientIp, isConfigured, notify, rateLimited, saveLead, uploadResume, verifyTurnstile, type Attachment, type LeadType } from "@/lib/leads";
import type { z } from "zod";
import { site } from "@/lib/site";

const GENERIC_ERROR = "Something went wrong on our side. Please try again, or WhatsApp us.";

async function handle<S extends z.ZodTypeAny>(
  type: LeadType,
  schema: S,
  formData: FormData,
  extra?: (data: z.infer<S>) => Promise<Record<string, unknown>>,
  attachments?: Attachment[],
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

  const data = { ...(parsed.data as Record<string, unknown>) };
  try {
    Object.assign(data, extra ? await extra(parsed.data) : {});
  } catch (err) {
    console.error(`[leads] ${type} extra step failed`, err);
  }
  delete data.consent;

  // Save and email independently: either one reaching us is enough, so an outage in one never loses a lead
  let saved = false;
  try {
    saved = await saveLead(type, data);
  } catch (err) {
    console.error(`[leads] ${type} save failed`, err);
  }
  try {
    const emailed = await notify(type, data, attachments);
    // with nothing configured (local dev and tests) the lead is only logged
    if (!saved && !emailed && isConfigured()) throw new Error("neither stored nor emailed");
  } catch (err) {
    if (!saved && isConfigured()) {
      console.error(`[leads] ${type} failed`, err);
      return { status: "error", message: GENERIC_ERROR };
    }
    console.error(`[leads] ${type} saved but email failed`, err);
  }
  return { status: "success" };
}

export async function submitProject(_: FormState, formData: FormData) {
  return handle("project", projectSchema, formData);
}

export async function joinWaitlist(_: FormState, formData: FormData) {
  return handle("waitlist", waitlistSchema, formData);
}

// Vercel caps request bodies at 4.5 MB, so keep resumes safely under it
const MAX_RESUME = 4 * 1024 * 1024;

export async function applyInternship(_: FormState, formData: FormData) {
  if (!site.internshipsOpen) {
    return { status: "error", message: "Internship applications are closed right now. Please check back soon." } satisfies FormState;
  }
  const file = formData.get("resume");
  const resumeError = (msg: string) =>
    ({ status: "error", message: "Please check the highlighted fields.", fieldErrors: { resume: msg } }) satisfies FormState;
  if (!(file instanceof File) || file.size === 0) return resumeError("Please attach your resume as a PDF");
  if (file.size > MAX_RESUME) return resumeError("PDF must be under 4 MB");
  const content = Buffer.from(await file.arrayBuffer());
  // some phones send PDFs without a type, so check the file itself
  if (content.subarray(0, 5).toString() !== "%PDF-") return resumeError("Please upload your resume as a PDF");
  formData.delete("resume");
  const pdf = new File([content], "resume.pdf", { type: "application/pdf" });
  const safeName = (String(formData.get("name") ?? "applicant").trim().replace(/[^a-z0-9]+/gi, "-") || "applicant").slice(0, 60);
  return handle(
    "internship",
    internshipSchema,
    formData,
    async (data) => {
      const path = await uploadResume(pdf, data.email);
      // the PDF is also attached to the notification email, so a failed upload is not fatal
      return { resume: path ?? "Not stored, see the email attachment" };
    },
    [{ filename: `${safeName}-resume.pdf`, content }],
  );
}
