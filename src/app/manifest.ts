import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f7f7f5",
    theme_color: "#141416",
    icons: [
      { src: "/brand/nexarc-app-icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/brand/nexarc-app-icon-1024.png", sizes: "1024x1024", type: "image/png" },
    ],
  };
}
