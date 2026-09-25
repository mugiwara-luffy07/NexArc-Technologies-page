import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { site } from "@/lib/site";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import "./globals.css";
import "./fonts.css";

const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });
// mono is only used for small labels below the fold: no preload
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["400"], variable: "--font-jetbrains", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Web Development and Software Company in Tamil Nadu, India`,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_IN",
    url: site.url,
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7f5" },
    { media: "(prefers-color-scheme: dark)", color: "#141416" },
  ],
};

// Runs before paint so there is no flash of the wrong theme
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='light'}})()`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" data-theme="light" suppressHydrationWarning className={`${grotesk.variable} ${jetbrains.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationJsonLd(), websiteJsonLd()]) }} />
      </head>
      <body className="relative flex min-h-[100dvh] flex-col">
        {children}
        {/* only served on Vercel; elsewhere the scripts 404 */}
        {process.env.VERCEL && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}
