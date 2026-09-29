import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/url";

export const dynamic = "force-static";

// Note: on a GitHub project site (<user>.github.io/<repo>/) crawlers only read
// robots.txt from the domain root, so this file matters once a custom domain
// is used. The sitemap can still be submitted directly in Search Console.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
