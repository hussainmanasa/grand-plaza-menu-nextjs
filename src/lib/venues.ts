import { site } from "@/config/site";
import type { MenuConfig, VenueConfig } from "@/config/types";
import { venues } from "@/config/venues";
import manifest from "@/generated/menus.json";
import { absoluteUrl, withBasePath } from "@/lib/url";

/** One image shown on the site: a whole PDF page, or one column of a split page. */
export type MenuPageImage = {
  /** Page number in the original PDF (1-based). */
  pdfPage: number;
  /** Column number (1-based) when the page was split via `splitPages`. */
  part?: number;
  width: number;
  height: number;
  sources: { src: string; width: number }[];
  text: string;
};

/** Rendered PDF, produced by scripts/build-menus.mjs. */
export type MenuAsset = {
  file: string;
  hash: string;
  pageCount: number;
  /** `src` is null when the menu uses `pdfLink`, so the PDF isn't published with the site. */
  pdf: { src: string | null; bytes: number };
  pages: MenuPageImage[];
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

/** The images shown on the site for a menu, after `hiddenPages` is applied. */
export function getVisiblePages(menu: MenuConfig): MenuPageImage[] {
  const asset = getMenuAsset(menu);
  const hidden = new Set(menu.hiddenPages ?? []);
  for (const n of [...hidden, ...Object.keys(menu.splitPages ?? {}).map(Number)]) {
    if (!Number.isInteger(n) || n < 1 || n > asset.pageCount) {
      throw new Error(`"${menu.file}" config refers to page ${n}, but the PDF has ${asset.pageCount} pages.`);
    }
  }
  return asset.pages.filter((page) => !hidden.has(page.pdfPage));
}

/** Where the menu's PDF buttons point: the configured `pdfLink`, or the copy published with the site. */
export type PdfTarget =
  | { kind: "link"; href: string; absolute: string; host: string }
  | { kind: "download"; href: string; absolute: string; bytes: number };

export function getPdfTarget(menu: MenuConfig): PdfTarget {
  if (menu.pdfLink) {
    let url: URL;
    try {
      url = new URL(menu.pdfLink);
    } catch {
      throw new Error(`pdfLink for "${menu.file}" is not a valid URL: ${menu.pdfLink}`);
    }
    if (url.protocol !== "https:") throw new Error(`pdfLink for "${menu.file}" must start with https://`);
    return { kind: "link", href: url.href, absolute: url.href, host: url.hostname };
  }
  const { pdf } = getMenuAsset(menu);
  if (!pdf.src) throw new Error(`"${menu.file}" has no published PDF; run \`npm run menus\` again.`);
  return { kind: "download", href: withBasePath(pdf.src), absolute: absoluteUrl(pdf.src), bytes: pdf.bytes };
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

/** "https://www.instagram.com/goldenemberrestaurant/" -> "@goldenemberrestaurant" */
export function instagramHandle(url: string) {
  const handle = new URL(url).pathname.split("/").filter(Boolean)[0];
  return handle ? `@${handle}` : url;
}

/** Google Maps URLs for a venue: an embeddable map, a directions link and a plain "view" link. */
export function mapLinks(venue: VenueConfig) {
  const target =
    venue.map && "lat" in venue.map
      ? `${venue.map.lat},${venue.map.lng}`
      : (venue.map?.query ?? `${venue.name}, ${formatAddress(venue)}`);
  const q = encodeURIComponent(target);
  return {
    embed: `https://maps.google.com/maps?q=${q}&z=17&output=embed`,
    directions: `https://www.google.com/maps/dir/?api=1&destination=${q}`,
    view: `https://www.google.com/maps/search/?api=1&query=${q}`,
  };
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
