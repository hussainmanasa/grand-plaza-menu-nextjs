import type { SiteConfig } from "./types";

// Grand Plaza has no general phone or email yet; add `telephone` / `email` here to show them in the footer.
export const site: SiteConfig = {
  name: "Grand Plaza",
  tagline: "Fine dining & premium sports lounge",
  description:
    "Grand Plaza is home to Golden Ember, a fine-dining restaurant, and Throttle Up, a premium sports lounge. Browse the latest menus for both.",
  language: "en",
  locale: "en_IN",
  address: {
    // "Grand Plaza" itself is left out: pages already show the name above the address.
    streetAddress: "Takka Rd, near Municipal Water Tank, Sector 21",
    addressLocality: "Panvel",
    addressRegion: "Maharashtra",
    postalCode: "410206",
    addressCountry: "IN",
  },
  social: [],
  // Gold (#c8a868) on transparent; matches the site accent below.
  logo: { src: "/brand/grand-plaza-logo.png", width: 1600, height: 496 },
  keywords: [
    "Grand Plaza",
    "Grand Plaza Panvel",
    "fine dining Panvel",
    "lounge Panvel",
    "restaurant menu",
    "bar menu",
  ],
  theme: {
    displayFont: "serif",
    colors: {
      background: "#0c0b0a",
      surface: "#171512",
      foreground: "#f3ede2",
      muted: "#a79e8f",
      accent: "#c9a96e",
      accentForeground: "#16120b",
      border: "rgba(201, 169, 110, 0.22)",
    },
  },
};
