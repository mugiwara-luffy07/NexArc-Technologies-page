import { notFound } from "next/navigation";
import { adminEnabled, isAdmin, listApplications, stageLabel } from "@/lib/admin";

export const dynamic = "force-dynamic";

// quote every cell, and stop spreadsheet apps from running cells that start like formulas
const cell = (v: unknown) => {
  const s = String(v ?? "");
  return `"${(/^[=+\-@\t\r]/.test(s) ? `'${s}` : s).replace(/"/g, '""')}"`;
};

export async function GET() {
  if (!adminEnabled()) notFound();
  if (!(await isAdmin())) return new Response("Sign in first", { status: 401 });
  const rows = await listApplications();
  const head = ["Applied", "Name", "Email", "Phone", "College", "GitHub", "Portfolio", "Stage", "Score", "Notes", "What they built"];
  const body = rows.map((a) =>
    [a.createdAt.slice(0, 10), a.name, a.email, a.phone, a.college, a.github, a.portfolio, stageLabel(a.stage), a.score || "", a.notes, a.about].map(cell).join(","),
  );
  const csv = "﻿" + [head.map(cell).join(","), ...body].join("\r\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="nexarc-applications-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
