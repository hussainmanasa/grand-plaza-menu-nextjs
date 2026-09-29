import Link from "next/link";
import { site } from "@/config/site";
import { venues } from "@/config/venues";
import { venuePath } from "@/lib/url";
import { formatAddress } from "@/lib/venues";

/** Shared footer. Links every venue so each page cross-links the others. */
export function SiteFooter({ currentVenue }: { currentVenue?: string }) {
  return (
    <footer className="border-t border-border px-6 py-10 text-center text-sm text-muted">
      <p className="font-[family-name:var(--font-serif)] text-xl font-semibold tracking-wide text-foreground">{site.name}</p>
      <nav aria-label="Venues" className="mt-4">
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {venues.map((v) => (
            <li key={v.slug}>
              <Link
                href={venuePath(v.slug)}
                aria-current={v.slug === currentVenue ? "page" : undefined}
                className="underline-offset-4 hover:text-foreground hover:underline aria-[current=page]:text-accent"
              >
                {v.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <address className="mt-4 not-italic leading-relaxed">
        {formatAddress()}
        <br />
        <a href={`tel:${site.telephone.replace(/\s/g, "")}`} className="hover:text-foreground">
          {site.telephone}
        </a>
        {" · "}
        <a href={`mailto:${site.email}`} className="hover:text-foreground">
          {site.email}
        </a>
      </address>
      <p className="mt-6 text-xs opacity-70">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </p>
    </footer>
  );
}
