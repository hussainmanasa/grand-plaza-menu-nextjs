import type { MetadataRoute } from "next";
import { venues } from "@/config/venues";
import { absoluteUrl, menuPath, venuePath } from "@/lib/url";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "monthly", priority: 1 },
    ...venues.flatMap((v) => [
      { url: absoluteUrl(venuePath(v.slug)), lastModified, changeFrequency: "monthly" as const, priority: 0.9 },
      ...v.menus.map((m) => ({
        url: absoluteUrl(menuPath(v.slug, m.slug)),
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ]),
  ];
}
