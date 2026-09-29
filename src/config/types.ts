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
  /** Optional logo in `public/`, e.g. "/brand/golden-ember.svg". Text wordmark is used when omitted. */
  logo?: string;
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
  telephone: string;
  email: string;
  /** Full profile URLs; used for schema.org `sameAs`. */
  social: string[];
  /** Optional logo in `public/`. Text wordmark is used when omitted. */
  logo?: string;
  keywords: string[];
  /** Google Search Console "HTML tag" verification token (content value only). */
  googleSiteVerification?: string;
  theme: Theme;
};
