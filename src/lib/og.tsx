/**
 * Social share cards (WhatsApp, Instagram DMs, iMessage, Google Discover).
 * Rendered once at build time from the theme config, so they follow any
 * colour or name change automatically.
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/config/site";
import type { Theme } from "@/config/types";
import { venues } from "@/config/venues";
import { menuName } from "@/lib/venues";

export const ogSize = { width: 1200, height: 630 };

const font = (pkg: string, file: string) => readFile(join(process.cwd(), "node_modules", "@fontsource", pkg, "files", file));

async function loadFonts() {
  const [serif, condensed, body] = await Promise.all([
    font("cormorant-garamond", "cormorant-garamond-latin-600-normal.woff"),
    font("oswald", "oswald-latin-600-normal.woff"),
    font("manrope", "manrope-latin-500-normal.woff"),
  ]);
  return [
    { name: "Serif", data: serif, weight: 600 as const, style: "normal" as const },
    { name: "Condensed", data: condensed, weight: 600 as const, style: "normal" as const },
    { name: "Body", data: body, weight: 500 as const, style: "normal" as const },
  ];
}

type Card = {
  theme: Theme;
  eyebrow: string;
  title: string;
  subtitle: string;
  footer: string;
};

export async function renderOgImage({ theme, eyebrow, title, subtitle, footer }: Card) {
  const c = theme.colors;
  const condensed = theme.displayFont === "condensed";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `radial-gradient(ellipse at top, ${c.surface}, ${c.background} 70%)`,
          color: c.foreground,
          fontFamily: "Body",
          padding: 64,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 28,
            right: 28,
            bottom: 28,
            left: 28,
            border: `2px solid ${c.border}`,
            borderRadius: 24,
            display: "flex",
          }}
        />
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 8, textTransform: "uppercase", color: c.accent }}>
          {eyebrow}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontFamily: condensed ? "Condensed" : "Serif",
            fontSize: condensed ? 120 : 132,
            lineHeight: 1,
            letterSpacing: condensed ? 4 : 2,
            textTransform: condensed ? "uppercase" : "none",
            textAlign: "center",
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 36, color: c.accent }}>
          <div style={{ width: 90, height: 2, background: c.accent, display: "flex" }} />
          <div style={{ width: 12, height: 12, background: c.accent, transform: "rotate(45deg)", display: "flex" }} />
          <div style={{ width: 90, height: 2, background: c.accent, display: "flex" }} />
        </div>
        <div style={{ display: "flex", marginTop: 36, fontSize: 34, color: c.muted, textAlign: "center" }}>{subtitle}</div>
        <div style={{ display: "flex", position: "absolute", bottom: 56, fontSize: 22, letterSpacing: 6, color: c.muted, textTransform: "uppercase" }}>
          {footer}
        </div>
      </div>
    ),
    { ...ogSize, fonts: await loadFonts() },
  );
}

/**
 * Every share card on the site. Served by src/app/og/[image]/route.tsx as
 * real .png files (the `opengraph-image` file convention exports files with no
 * extension, which GitHub Pages serves with the wrong content type).
 */
type OgEntry = Card & { id: string; alt: string };

export function ogEntries(): OgEntry[] {
  return [
    {
      id: "grand-plaza",
      alt: `${site.name}: ${site.tagline}`,
      theme: site.theme,
      eyebrow: "Welcome to",
      title: site.name,
      subtitle: site.tagline,
      footer: venues.map((v) => v.name).join("  ·  "),
    },
    ...venues.flatMap((venue) => [
      {
        id: venue.slug,
        alt: `${venue.name}, ${venue.category} at ${site.name}`,
        theme: venue.theme,
        eyebrow: venue.category,
        title: venue.name,
        subtitle: venue.tagline,
        footer: `${site.name}  ·  Menus`,
      },
      ...venue.menus.map((menu) => ({
        id: `${venue.slug}-${menu.slug}`,
        alt: menuName(venue, menu),
        theme: venue.theme,
        eyebrow: venue.name,
        title: menu.title,
        subtitle: menu.description,
        footer: `${site.name}  ·  View the menu`,
      })),
    ]),
  ];
}

export const ogImagePath = (id: string) => `/og/${id}.png`;

/** `openGraph.images` / `twitter.images` entry for a card id. */
export function ogImage(id: string) {
  const entry = ogEntries().find((e) => e.id === id);
  return [{ url: ogImagePath(id), ...ogSize, alt: entry?.alt ?? site.name, type: "image/png" }];
}
