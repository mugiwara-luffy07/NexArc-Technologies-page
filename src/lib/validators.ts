import { z } from "zod";

export const SERVICE_OPTIONS = ["Website", "CRM / business software", "E-commerce", "Custom platform / SaaS", "Mobile app", "Not sure yet"] as const;
export const BUDGET_OPTIONS = ["Under ₹50k", "₹50k to ₹1.5L", "₹1.5L to ₹5L", "Above ₹5L", "Not sure yet"] as const;
export const TIMELINE_OPTIONS = ["As soon as possible", "Within 1 to 2 months", "In 3 months or more", "Flexible"] as const;
export const INTERNSHIP_ROLE = "Full-Stack Engineer Intern";

const name = z.string().trim().min(2, "Please enter your name").max(80);
const email = z.string().trim().email("Please enter a valid email").max(120);
const phone = z
  .string()
  .trim()
  .max(20)
  .regex(/^[+\d\s()-]{7,20}$/, "Please enter a valid phone number");
const consent = z.literal("on", { message: "Please agree so we can contact you" });

export const projectSchema = z.object({
  service: z.enum(SERVICE_OPTIONS, { message: "Pick the closest option" }),
  budget: z.enum(BUDGET_OPTIONS, { message: "Pick a budget range" }),
  timeline: z.enum(TIMELINE_OPTIONS, { message: "Pick a timeline" }),
  details: z.string().trim().min(20, "A couple of sentences helps us reply properly").max(3000),
  name,
  email,
  phone,
  company: z.string().trim().max(120).optional().or(z.literal("")),
  consent,
});

export const waitlistSchema = z.object({
  email,
  product: z.string().trim().max(60).optional().or(z.literal("")),
  consent,
});

/** Accepts "github.com/name", "www.site.com" or a bare GitHub username and turns it into a full https link. */
function normalizeLink(v: unknown, kind?: "github") {
  const s = String(v ?? "").trim();
  if (!s) return "";
  if (kind === "github" && /^@?[a-z0-9-]+$/i.test(s)) return `https://github.com/${s.replace(/^@/, "")}`;
  return /^https?:\/\//i.test(s) ? s : `https://${s}`;
}

export const internshipSchema = z.object({
  role: z.literal(INTERNSHIP_ROLE),
  name,
  email,
  phone,
  college: z.string().trim().min(2, "Please enter your college").max(160),
  github: z.preprocess(
    (v) => normalizeLink(v, "github"),
    z
      .string()
      .url("Please enter your GitHub profile link")
      .max(300)
      .refine((u) => /github\.com\/[^/]+/i.test(u), "Please share your GitHub profile link, like github.com/your-name"),
  ),
  portfolio: z.preprocess((v) => normalizeLink(v), z.string().url("Please enter a valid link").max(300).optional().or(z.literal(""))),
  about: z.string().trim().min(20, "Tell us a little more about what you built").max(2000),
  consent,
});

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
