// DEMO MODE (temporary): a sample resume PDF for the demo candidates. Remove after testing.
import { notFound } from "next/navigation";
import { adminEnabled, isAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

const lines: [number, number, string][] = [
  [22, 760, "Sample Candidate"],
  [11, 738, "Full-Stack Engineer Intern applicant  |  sample@example.com  |  +91 98765 43210"],
  [13, 700, "Education"],
  [11, 682, "B.E. Computer Science and Engineering, 3rd year. CGPA 8.4"],
  [13, 646, "Projects"],
  [11, 628, "Hostel mess booking app: Next.js, Supabase, REST API, auth, deployed on Vercel."],
  [11, 610, "Shop inventory tracker: Node.js, PostgreSQL, React, barcode scanning."],
  [13, 574, "Skills"],
  [11, 556, "TypeScript, React, Next.js, Node.js, PostgreSQL, Supabase, Git, Tailwind CSS, Playwright"],
  [10, 500, "This is a sample resume used by the hiring dashboard demo mode."],
];

function pdf() {
  const esc = (t: string) => t.replace(/[\\()]/g, (c) => `\\${c}`);
  const stream = lines.map(([size, y, t]) => `BT /F1 ${size} Tf 56 ${y} Td (${esc(t)}) Tj ET`).join("\n");
  const objs = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  let out = "%PDF-1.4\n";
  const offsets: number[] = [];
  objs.forEach((o, i) => {
    offsets.push(out.length);
    out += `${i + 1} 0 obj\n${o}\nendobj\n`;
  });
  const xref = out.length;
  out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${offsets.map((n) => `${String(n).padStart(10, "0")} 00000 n \n`).join("")}`;
  out += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return out;
}

export async function GET() {
  if (!adminEnabled()) notFound();
  if (!(await isAdmin())) return new Response("Sign in first", { status: 401 });
  return new Response(pdf(), {
    headers: { "Content-Type": "application/pdf", "Content-Disposition": 'inline; filename="sample-resume.pdf"', "X-Robots-Tag": "noindex" },
  });
}
