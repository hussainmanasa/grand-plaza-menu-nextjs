import Link from "next/link";
import type { VenueConfig } from "@/config/types";
import { displayClass, themeStyle } from "@/lib/theme";
import { menuPath, venuePath } from "@/lib/url";
import { menuName } from "@/lib/venues";
import { ArrowRightIcon } from "./icons";
import { Wordmark } from "./Wordmark";

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
      <p className="text-xs font-medium uppercase tracking-[0.28em] text-accent-text">{venue.category}</p>
      {/*
        Fixed-size logo slot, identical in every card, so the tagline and buttons start at the
        same height side by side whatever the logo's proportions. The logo is scaled to fit,
        left-aligned and vertically centred; the space is reserved before the image loads.
      */}
      <Heading
        className={`mt-4 flex h-20 w-[min(100%,18rem)] items-center text-4xl leading-none sm:text-5xl ${venue.logo ? "" : displayClass(venue.theme)}`}
      >
        <Link href={venuePath(venue.slug)} className="block h-full w-full hover:text-accent-text hover:opacity-90">
          <Wordmark
            name={venue.name}
            logo={venue.logo}
            theme={venue.theme}
            className={venue.logo ? "" : "flex h-full items-center"}
            logoClassName="h-full w-full object-left"
          />
        </Link>
      </Heading>
      <p className="mt-4 text-muted">{venue.tagline}</p>

      {/* Pinned to the bottom (mt-auto) so the buttons line up across cards of equal height. */}
      <ul className="mt-auto grid grid-cols-2 gap-3 pt-8" aria-label={`${venue.name} menus`}>
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
        className="mt-6 inline-flex items-center gap-2 self-start text-sm text-muted hover:text-foreground"
      >
        Hours & details <ArrowRightIcon width={16} height={16} />
      </Link>
    </article>
  );
}
