import Link from "next/link";
import { site } from "@/config/site";
import { venues } from "@/config/venues";
import { venuePath, withBasePath } from "@/lib/url";
import { formatAddress } from "@/lib/venues";

/** Shared footer. Links every venue so each page cross-links the others. */
export function SiteFooter({ currentVenue }: { currentVenue?: string }) {
  return (
    <footer className="border-t border-border px-6 py-10 text-center text-sm text-muted">
      {site.logo ? (
        // eslint-disable-next-line @next/next/no-img-element -- static export; logo is already optimised
        <img
          src={withBasePath(site.logo.src)}
          width={site.logo.width}
          height={site.logo.height}
          alt={site.name}
          loading="lazy"
          className="mx-auto block h-auto w-40"
        />
      ) : (
        <p className="font-[family-name:var(--font-serif)] text-xl font-semibold tracking-wide text-foreground">{site.name}</p>
      )}
      <nav aria-label="Venues" className="mt-4">
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {venues.map((v) => (
            <li key={v.slug}>
              <Link
                href={venuePath(v.slug)}
                aria-current={v.slug === currentVenue ? "page" : undefined}
                className="underline-offset-4 hover:text-foreground hover:underline aria-[current=page]:text-accent-text"
              >
                {v.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <address className="mt-4 not-italic leading-relaxed">
        {formatAddress()}
        {(site.telephone || site.email) && (
          <>
            <br />
            {site.telephone && (
              <a href={`tel:${site.telephone.replace(/\s/g, "")}`} className="hover:text-foreground">
                {site.telephone}
              </a>
            )}
            {site.telephone && site.email && " · "}
            {site.email && (
              <a href={`mailto:${site.email}`} className="hover:text-foreground">
                {site.email}
              </a>
            )}
          </>
        )}
      </address>
      <p className="mt-6 text-xs opacity-70">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </p>
    </footer>
  );
}
