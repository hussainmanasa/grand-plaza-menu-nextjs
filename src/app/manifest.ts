import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { withBasePath } from "@/lib/url";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: site.description,
    start_url: withBasePath("/"),
    scope: withBasePath("/"),
    display: "standalone",
    background_color: site.theme.colors.background,
    theme_color: site.theme.colors.background,
    icons: [
      { src: withBasePath("/icon.png"), sizes: "512x512", type: "image/png" },
      { src: withBasePath("/touch-icon.png"), sizes: "180x180", type: "image/png" },
    ],
  };
}
