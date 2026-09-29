import Link from "next/link";
import type { VenueConfig } from "@/config/types";
import { menuPath } from "@/lib/url";

/** Segmented control switching between a venue's menus. Each tab is a real page for SEO. */
export function MenuTabs({ venue, current }: { venue: VenueConfig; current: string }) {
  return (
    <nav aria-label={`${venue.name} menus`} className="min-w-0 flex-1">
      <ul
        className="mx-auto grid max-w-xs gap-1 rounded-full border border-border bg-surface p-1"
        style={{ gridTemplateColumns: `repeat(${venue.menus.length}, minmax(0, 1fr))` }}
      >
        {venue.menus.map((menu) => {
          const active = menu.slug === current;
          return (
            <li key={menu.slug}>
              <Link
                href={menuPath(venue.slug, menu.slug)}
                aria-current={active ? "page" : undefined}
                scroll
                className={
                  "flex h-9 items-center justify-center truncate rounded-full px-3 text-sm font-semibold transition-colors " +
                  (active ? "bg-accent text-accent-foreground" : "text-muted hover:text-foreground")
                }
              >
                {menu.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
