import { Cormorant_Garamond, Manrope, Oswald } from "next/font/google";

// Downloaded at build time and served from the site itself.
// To offer another display font, add it here and to `DisplayFont` in src/config/types.ts.

export const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const serifFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-serif",
  display: "swap",
});

export const condensedFont = Oswald({
  subsets: ["latin"],
  variable: "--font-condensed",
  display: "swap",
});
