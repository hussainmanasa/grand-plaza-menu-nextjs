import Link from "next/link";
import type { VenueConfig } from "@/config/types";
import { displayClass, themeStyle } from "@/lib/theme";
import { menuPath, venuePath } from "@/lib/url";
import { menuName } from "@/lib/venues";
import { ArrowRightIcon } from "./icons";

/** Landing-page card, rendered in the venue's own theme, with a button per menu. */
export function VenueCard({ venue, headingLevel = "h2" }: { venue: VenueConfig; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <article
      style={themeStyle(venue.theme)}
      className="relative isolate flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface p-7 text-foreground shadow-2xl shadow-black/40 sm:p-9"
    >
      {/* Soft glow of the accent colour behind the heading. */}
      <div
        aria-hidden
        className="absolute inset-x-0 -top-24 -z-10 h-64 bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_22%,transparent),transparent)]"
      />
      <p className="text-xs font-medium uppercase tracking-[0.28em] text-accent">{venue.category}</p>
      <Heading className={`mt-3 text-4xl leading-none sm:text-5xl ${displayClass(venue.theme)}`}>
        <Link href={venuePath(venue.slug)} className="hover:text-accent">
          {venue.name}
        </Link>
      </Heading>
      <p className="mt-3 text-muted">{venue.tagline}</p>

      <ul className="mt-8 grid grid-cols-2 gap-3" aria-label={`${venue.name} menus`}>
        {venue.menus.map((menu, i) => (
          <li key={menu.slug}>
            <Link
              href={menuPath(venue.slug, menu.slug)}
              aria-label={menuName(venue, menu)}
              className={
                "flex min-h-12 items-center justify-center rounded-full px-4 text-sm font-semibold transition-colors " +
                (i === 0
                  ? "bg-accent text-accent-foreground hover:bg-accent/85"
                  : "border border-accent/60 text-foreground hover:bg-accent/10")
              }
            >
              {menu.label}
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href={venuePath(venue.slug)}
        className="mt-auto inline-flex items-center gap-2 self-start pt-6 text-sm text-muted hover:text-foreground"
      >
        Hours & details <ArrowRightIcon width={16} height={16} />
      </Link>
    </article>
  );
}
