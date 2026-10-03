/**
 * URL helpers.
 *
 * GitHub Pages serves a project site from a sub-path
 * (https://<user>.github.io/<repo>/), so every hand-written asset URL must be
 * prefixed with that path. `next/link` and metadata icons do this on their
 * own; plain <img>/<a download> tags and JSON-LD need these helpers.
 *
 * Where the values come from:
 * - GitHub Pages: the deploy workflow sets both (.github/workflows/deploy.yml).
 * - Vercel: no base path; the site URL defaults to the project's production
 *   domain, which Vercel provides at build time. Set NEXT_PUBLIC_SITE_URL in
 *   Vercel to override it (e.g. after adding a custom domain).
 */

/** "" locally or on a custom domain, "/<repo>" on a GitHub project site. */
export const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

/** Public origin plus base path, without a trailing slash. Only used in server-rendered code. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (vercelUrl ? `https://${vercelUrl}` : "") ||
  "http://localhost:3000"
).replace(/\/$/, "");

/** "/menus/x.webp" -> "/<repo>/menus/x.webp" */
export const withBasePath = (path: string) => `${basePath}${path}`;

/** "/golden-ember/" -> "https://<user>.github.io/<repo>/golden-ember/" */
export const absoluteUrl = (path = "/") => `${siteUrl}${path}`;

export const venuePath = (venue: string) => `/${venue}/`;
export const menuPath = (venue: string, menu: string) => `/${venue}/${menu}/`;
