import type { Metadata } from "next";
import { site } from "@/config/site";
import { ogImage } from "@/lib/og";

type PageMeta = {
  /** Page title; the root layout appends " | Grand Plaza". Pass `absolute` to skip that. */
  title: string | { absolute: string };
  description: string;
  /** Root-relative path with trailing slash, e.g. "/golden-ember/". */
  path: string;
  /** Share card id from `ogEntries()` in src/lib/og.tsx. */
  image: string;
  keywords?: string[];
};

/**
 * Full metadata for a page. Next.js replaces (not merges) nested objects such
 * as `openGraph` from parent layouts, so every page sets them completely here.
 */
export function pageMetadata({ title, description, path, image, keywords }: PageMeta): Metadata {
  const plainTitle = typeof title === "string" ? `${title} | ${site.name}` : title.absolute;
  const images = ogImage(image);
  return {
    title,
    description,
    keywords: keywords ?? site.keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: site.locale,
      url: path,
      title: plainTitle,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: plainTitle,
      description,
      images,
    },
  };
}
