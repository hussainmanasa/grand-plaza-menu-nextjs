import type { SiteConfig } from "./types";

// TODO(client): street address, PIN code, phone and email below are placeholders (city is from the Golden Ember menu).
export const site: SiteConfig = {
  name: "Grand Plaza",
  tagline: "Fine dining & premium lounge",
  description:
    "Grand Plaza is home to Golden Ember, a fine-dining restaurant, and Throttle Up, a premium lounge. Browse the latest menus for both.",
  language: "en",
  locale: "en_IN",
  address: {
    streetAddress: "123 Placeholder Avenue",
    addressLocality: "Panvel",
    addressRegion: "Maharashtra",
    postalCode: "000000",
    addressCountry: "IN",
  },
  telephone: "+91 00000 00000",
  email: "hello@example.com",
  social: [],
  keywords: ["Grand Plaza", "Grand Plaza Panvel", "fine dining Panvel", "lounge Panvel", "restaurant menu", "bar menu"],
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
