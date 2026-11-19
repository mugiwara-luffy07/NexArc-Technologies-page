"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CRITERIA, endSession, isAdmin, isDemo, setDemo, isStage, passwordMatches, stageLabel, startSession, updateApplication } from "@/lib/admin";
import { clientIp, rateLimited } from "@/lib/leads";

export async function login(_: { error?: string }, formData: FormData): Promise<{ error?: string }> {
  const ip = await clientIp();
  if (rateLimited(`admin:${ip}`)) return { error: "Too many attempts. Wait 10 minutes and try again." };
  if (!passwordMatches(String(formData.get("password") ?? ""))) return { error: "Wrong password." };
  await startSession();
  redirect("/s3cret");
}

export async function logout() {
  await endSession();
  redirect("/s3cret");
}

const UUID = /^[0-9a-f-]{36}$/i;

async function guard(id: unknown) {
  if (!(await isAdmin())) throw new Error("Not signed in");
  if (typeof id !== "string" || !UUID.test(id)) throw new Error("Bad id");
  return id;
}

export async function setStage(formData: FormData) {
  const id = await guard(formData.get("id"));
  const stage = formData.get("stage");
  if (!isStage(stage)) throw new Error("Bad stage");
  await updateApplication(id, { data: { stage }, log: `Moved to ${stageLabel(stage)}` });
  revalidatePath("/s3cret", "layout");
}

export async function saveReview(formData: FormData) {
  const id = await guard(formData.get("id"));
  const scores: Record<string, number> = {};
  for (const c of CRITERIA) {
    const n = Number(formData.get(`score_${c.id}`));
    if (n >= 1 && n <= 5) scores[c.id] = n;
  }
  const notes = String(formData.get("notes") ?? "").slice(0, 5000);
  await updateApplication(id, { data: { scores }, notes, log: "Scorecard and notes updated" });
  revalidatePath("/s3cret", "layout");
}

// DEMO MODE (temporary): switch sample data on or off for this browser
export async function toggleDemo() {
  if (!(await isAdmin())) throw new Error("Not signed in");
  await setDemo(!(await isDemo()));
  redirect("/s3cret");
}
