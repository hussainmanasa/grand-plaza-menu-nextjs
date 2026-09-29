import type { CSSProperties } from "react";
import type { Theme } from "@/config/types";

const DISPLAY_FONTS: Record<Theme["displayFont"], string> = {
  serif: "var(--font-serif)",
  condensed: "var(--font-condensed)",
};

/** Heading treatment that suits each display font. */
export function displayClass(theme: Theme) {
  return theme.displayFont === "condensed"
    ? "font-display font-semibold uppercase tracking-[0.06em]"
    : "font-display font-semibold tracking-wide";
}

/**
 * Turns a theme from the config into CSS variables. Apply it to any element
 * and every Tailwind colour utility inside (`bg-surface`, `text-accent`, ...)
 * picks up that theme; see the @theme block in globals.css.
 */
export function themeStyle(theme: Theme): CSSProperties {
  const c = theme.colors;
  return {
    "--background": c.background,
    "--surface": c.surface,
    "--foreground": c.foreground,
    "--muted": c.muted,
    "--accent": c.accent,
    "--accent-foreground": c.accentForeground,
    "--border": c.border,
    "--display": DISPLAY_FONTS[theme.displayFont],
  } as CSSProperties;
}
