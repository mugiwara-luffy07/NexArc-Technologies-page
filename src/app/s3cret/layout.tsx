import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hiring",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-[100dvh] flex-col bg-canvas">{children}</div>;
}
