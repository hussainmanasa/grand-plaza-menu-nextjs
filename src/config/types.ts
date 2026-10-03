/**
 * Shared shapes for the site configuration.
 *
 * Everything the client may want to change (names, copy, contact details,
 * colours, menus) lives in `src/config/*.ts` and is typed here, so a typo in
 * the config fails the build instead of shipping a broken page.
 */

/** Colour tokens applied as CSS variables. Any valid CSS colour works. */
export type ThemeColors = {
  /** Page background. Also used as the mobile browser toolbar colour. */
  background: string;
  /** Cards, header, raised surfaces. */
  surface: string;
  /** Primary text. */
  foreground: string;
  /** Secondary text (descriptions, captions). */
  muted: string;
  /** Brand highlight: buttons, rules, active tab. */
  accent: string;
  /** Text drawn on top of `accent`. */
  accentForeground: string;
  /**
   * Optional accent for small text and icons on the background, when `accent`
   * is too dark to read at small sizes. Defaults to `accent`.
   */
  accentText?: string;
  /** Hairlines and card outlines. */
  border: string;
};

/**
 * Display (heading) typeface. Fonts are self-hosted via `next/font`, so the
 * available options are fixed in `src/app/fonts.ts`; add one there to extend.
 */
export type DisplayFont = "serif" | "condensed";

export type Theme = {
  colors: ThemeColors;
  displayFont: DisplayFont;
};

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type OpeningHours = {
  days: DayOfWeek[];
  /** 24h "HH:MM". */
  opens: string;
  /** 24h "HH:MM". Use a time after midnight (e.g. "01:00") for late close. */
  closes: string;
};

export type PostalAddress = {
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  /** ISO 3166-1 alpha-2, e.g. "IN". */
  addressCountry: string;
};

/** A logo image in `public/`. Width and height are its pixel size, used to reserve space while it loads. */
export type Logo = {
  /** e.g. "/brand/golden-ember-logo.png" */
  src: string;
  width: number;
  height: number;
};

export type MenuConfig = {
  /** URL segment: /<venue>/<slug>/ */
  slug: string;
  /** Short label for tabs and buttons, e.g. "Food". */
  label: string;
  /** Full title used in headings and SEO, e.g. "À la carte". */
  title: string;
  /** One-line summary for the menu card and meta description. */
  description: string;
  /** PDF file name inside the top-level `menus/` folder. */
  file: string;
  /**
   * PDF page numbers (1-based) to leave out of the on-screen viewer, e.g. blank
   * pages that exist only for print layout. The downloadable PDF is unchanged.
   */
  hiddenPages?: number[];
  /**
   * Wide pages to cut into columns for phones, as { pdfPage: columnCount },
   * e.g. { 1: 2, 2: 3 } for landscape spreads. Cuts are placed in the blank
   * gutters between columns. The downloadable PDF is unchanged.
   */
  splitPages?: Record<number, number>;
  /**
   * Optional shared link to the PDF (e.g. Google Drive, shared as "Anyone with
   * the link"). When set, the PDF buttons open this link in a new tab and the
   * PDF itself is not published with the site. The PDF must still be in menus/,
   * because the on-screen pages are rendered from it.
   */
  pdfLink?: string;
};

export type VenueConfig = {
  /** URL segment: /<slug>/ */
  slug: string;
  name: string;
  /** schema.org type used for structured data. */
  schemaType: "Restaurant" | "BarOrPub";
  /** Human label, e.g. "Fine Dining". */
  category: string;
  tagline: string;
  description: string;
  cuisine: string[];
  /** schema.org priceRange, e.g. "₹₹₹₹". */
  priceRange: string;
  telephone: string;
  email?: string;
  /** Falls back to the Grand Plaza address when omitted. */
  address?: PostalAddress;
  openingHours: OpeningHours[];
  /** Optional logo, shown on the landing card and venue page. Text wordmark is used when omitted. */
  logo?: Logo;
  /** Full Instagram profile URL, e.g. "https://www.instagram.com/goldenemberrestaurant/". */
  instagram?: string;
  map?: { lat: number; lng: number } | { query: string };
  keywords: string[];
  theme: Theme;
  menus: MenuConfig[];
};

export type SiteConfig = {
  name: string;
  tagline: string;
  description: string;
  /** BCP 47 language tag for <html lang>. */
  language: string;
  /** Open Graph locale, e.g. "en_IN". */
  locale: string;
  address: PostalAddress;
  /** Optional; hidden from the footer and structured data when omitted. */
  telephone?: string;
  /** Optional; hidden from the footer and structured data when omitted. */
  email?: string;
  /** Full profile URLs; used for schema.org `sameAs`. */
  social: string[];
  /** Optional logo. Text wordmark is used when omitted. */
  logo?: Logo;
  keywords: string[];
  /** Google Search Console "HTML tag" verification token (content value only). */
  googleSiteVerification?: string;
  theme: Theme;
};
