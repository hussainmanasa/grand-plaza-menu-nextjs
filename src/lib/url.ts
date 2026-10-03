/**
 * URL helpers.
 *
 * The site URL comes from `url` in src/config/site.ts. NEXT_PUBLIC_SITE_URL
 * overrides it if set (e.g. to test a different domain).
 *
 * NEXT_PUBLIC_BASE_PATH is only needed when hosting under a sub-path
 * (https://example.com/menu/); every hand-written asset URL is then prefixed
 * with it. `next/link` and metadata icons do this on their own; plain
 * <img>/<a download> tags and JSON-LD use these helpers.
 */
import { site } from "@/config/site";

/** "" normally; "/<sub-path>" only when hosted under a sub-path. */
export const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

/** Public origin plus base path, without a trailing slash. Only used in server-rendered code. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || site.url).replace(/\/$/, "");

/** "/menus/x.webp" -> "/<repo>/menus/x.webp" */
export const withBasePath = (path: string) => `${basePath}${path}`;

/** "/golden-ember/" -> "https://grand-plaza-panvel.vercel.app/golden-ember/" */
export const absoluteUrl = (path = "/") => `${siteUrl}${path}`;

export const venuePath = (venue: string) => `/${venue}/`;
export const menuPath = (venue: string, menu: string) => `/${venue}/${menu}/`;
