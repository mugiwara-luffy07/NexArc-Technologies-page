import { ImageResponse } from "next/og";
import fs from "node:fs/promises";
import path from "node:path";
import { site } from "@/lib/site";

export const alt = `${site.name}. ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  // The exported logo PNG already has the Syne wordmark baked in
  const logo = await fs.readFile(path.join(process.cwd(), "public/brand/nexarc-logo-light.png"));
  const src = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F7F7F5",
          padding: "72px 80px",
        }}
      >
        <img src={src} width={520} height={205} alt="" style={{ marginLeft: -36 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 58, fontWeight: 700, color: "#141416", letterSpacing: -1.5, lineHeight: 1.1 }}>
            Websites, CRMs, e-commerce and SaaS, built to ship.
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#BF4410" }}>{site.tagline}</div>
        </div>
      </div>
    ),
    size,
  );
}
