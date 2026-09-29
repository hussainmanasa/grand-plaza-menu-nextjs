import { site } from "@/config/site";
import type { MenuConfig, VenueConfig } from "@/config/types";
import { venues } from "@/config/venues";
import manifest from "@/generated/menus.json";

export type MenuPageImage = {
  width: number;
  height: number;
  sources: { src: string; width: number }[];
};

/** Rendered PDF, produced by scripts/build-menus.mjs. */
export type MenuAsset = {
  file: string;
  hash: string;
  pageCount: number;
  pdf: { src: string; bytes: number };
  pages: MenuPageImage[];
  text: string[];
};

const assets = manifest as Record<string, MenuAsset>;

export function getMenuAsset(menu: MenuConfig): MenuAsset {
  const asset = assets[menu.file];
  if (!asset) {
    throw new Error(
      `Menu PDF "${menu.file}" is not in menus/. Add the file (or fix "file" in src/config/venues.ts), then run \`npm run menus\`.`,
    );
  }
  return asset;
}

/** A PDF page as shown on the site, after `hiddenPages` is applied. */
export type VisiblePage = {
  /** Page number in the original PDF (1-based). */
  pdfPage: number;
  image: MenuPageImage;
  text: string;
};

export function getVisiblePages(menu: MenuConfig): VisiblePage[] {
  const asset = getMenuAsset(menu);
  const hidden = new Set(menu.hiddenPages ?? []);
  for (const n of hidden) {
    if (n < 1 || n > asset.pageCount) {
      throw new Error(`hiddenPages for "${menu.file}" lists page ${n}, but the PDF has ${asset.pageCount} pages.`);
    }
  }
  return asset.pages
    .map((image, i) => ({ pdfPage: i + 1, image, text: asset.text[i] ?? "" }))
    .filter((page) => !hidden.has(page.pdfPage));
}

export function getVenue(slug: string): VenueConfig | undefined {
  return venues.find((v) => v.slug === slug);
}

export function getMenu(venue: VenueConfig, slug: string): MenuConfig | undefined {
  return venue.menus.find((m) => m.slug === slug);
}

/** "Golden Ember Food Menu", "Throttle Up Cocktails & Bar menu": adds "menu" only when the title lacks it. */
export function menuName(venue: VenueConfig, menu: MenuConfig) {
  const name = `${venue.name} ${menu.title}`;
  return /\bmenu$/i.test(menu.title) ? name : `${name} menu`;
}

export const venueAddress = (venue: VenueConfig) => venue.address ?? site.address;

export function formatAddress(venue?: VenueConfig) {
  const a = venue ? venueAddress(venue) : site.address;
  return `${a.streetAddress}, ${a.addressLocality}, ${a.addressRegion} ${a.postalCode}`;
}

/** "19:00" -> "7:00 pm" */
export function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 && h < 24 ? "pm" : "am";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/** ["Monday", ..., "Sunday"] -> "Daily"; consecutive days -> "Mon – Thu". */
export function formatDays(days: string[]) {
  if (days.length === 7) return "Daily";
  const sorted = [...days].sort((a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b));
  const idx = sorted.map((d) => DAY_ORDER.indexOf(d));
  const consecutive = idx.every((d, i) => i === 0 || d === idx[i - 1] + 1);
  const short = (d: string) => d.slice(0, 3);
  if (consecutive && sorted.length > 2) return `${short(sorted[0])} – ${short(sorted.at(-1)!)}`;
  return sorted.map(short).join(", ");
}

export function formatBytes(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
