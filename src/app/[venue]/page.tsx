import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ClockIcon,
  DirectionsIcon,
  InstagramIcon,
  PhoneIcon,
  PinIcon,
} from "@/components/icons";
import { JsonLd } from "@/components/JsonLd";
import { Ornament } from "@/components/Ornament";
import { Wordmark } from "@/components/Wordmark";
import { site } from "@/config/site";
import { venues } from "@/config/venues";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbLd, venueLd } from "@/lib/structured-data";
import { menuPath, venuePath } from "@/lib/url";
import {
  formatAddress,
  formatDays,
  formatTime,
  getVenue,
  getVisiblePages,
  instagramHandle,
  mapLinks,
} from "@/lib/venues";

export const dynamicParams = false;

export function generateStaticParams() {
  return venues.map((v) => ({ venue: v.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[venue]">): Promise<Metadata> {
  const venue = getVenue((await params).venue);
  if (!venue) return {};
  return pageMetadata({
    title: `${venue.name} – ${venue.category} Menu`,
    description: `${venue.description} ${venue.name} at ${site.name}.`,
    path: venuePath(venue.slug),
    image: venue.slug,
    keywords: venue.keywords,
  });
}

export async function generateViewport({ params }: PageProps<"/[venue]">): Promise<Viewport> {
  const venue = getVenue((await params).venue);
  return { themeColor: venue?.theme.colors.background ?? site.theme.colors.background };
}

export default async function VenuePage({ params }: PageProps<"/[venue]">) {
  const venue = getVenue((await params).venue);
  if (!venue) notFound();

  const tel = venue.telephone.replace(/\s/g, "");
  const maps = mapLinks(venue);

  return (
    <>
      <div className="mx-auto flex h-14 max-w-3xl items-center px-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground">
          <ArrowLeftIcon width={18} height={18} /> {site.name}
        </Link>
      </div>

      <main className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <header className="pb-10 pt-6 text-center sm:pt-10">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent-text">{venue.category}</p>
          <h1 className="mt-4 text-5xl leading-none sm:text-7xl">
            <Wordmark
              name={venue.name}
              logo={venue.logo}
              theme={venue.theme}
              className="mx-auto"
              logoClassName="w-[min(100%,22rem)] max-h-44"
            />
          </h1>
          <p className="mt-4 text-lg text-muted">{venue.tagline}</p>
          <Ornament className="mt-7" />
          <p className="mx-auto mt-7 max-w-xl leading-relaxed text-muted">{venue.description}</p>
        </header>

        <section aria-labelledby="menus-heading">
          <h2 id="menus-heading" className="sr-only">
            Menus
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {venue.menus.map((menu) => {
              const pageCount = getVisiblePages(menu).length;
              return (
                <li key={menu.slug}>
                  <Link
                    href={menuPath(venue.slug, menu.slug)}
                    className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent/70"
                  >
                    <span className="text-xs font-medium uppercase tracking-[0.25em] text-accent-text">{menu.label}</span>
                    <span className="mt-2 font-display text-3xl font-semibold">{menu.title}</span>
                    <span className="mt-2 text-sm leading-relaxed text-muted">{menu.description}</span>
                    <span className="mt-auto flex items-center justify-between pt-6 text-sm">
                      <span className="text-muted">
                        {pageCount} {pageCount === 1 ? "page" : "pages"}
                      </span>
                      <span className="inline-flex items-center gap-2 font-semibold text-accent-text">
                        View menu
                        <ArrowRightIcon width={16} height={16} className="transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="info-heading" className="mt-12 rounded-2xl border border-border p-6 sm:p-8">
          <h2 id="info-heading" className="font-display text-2xl font-semibold">
            Visit us
          </h2>
          <dl className="mt-5 grid gap-5 text-sm sm:grid-cols-2">
            <div className="flex gap-3">
              <dt>
                <ClockIcon className="mt-0.5 text-accent-text" />
                <span className="sr-only">Opening hours</span>
              </dt>
              <dd className="space-y-1 text-muted">
                {venue.openingHours.map((h, i) => (
                  <p key={i}>
                    <span className="text-foreground">{formatDays(h.days)}</span>
                    <br />
                    {formatTime(h.opens)} – {formatTime(h.closes)}
                  </p>
                ))}
              </dd>
            </div>
            <div className="flex gap-3">
              <dt>
                <PhoneIcon className="mt-0.5 text-accent-text" />
                <span className="sr-only">Reservations</span>
              </dt>
              <dd className="text-muted">
                <span className="text-foreground">Reservations</span>
                <br />
                <a href={`tel:${tel}`} className="underline-offset-4 hover:text-foreground hover:underline">
                  {venue.telephone}
                </a>
              </dd>
            </div>
            <div className="flex gap-3">
              <dt>
                <PinIcon className="mt-0.5 text-accent-text" />
                <span className="sr-only">Address</span>
              </dt>
              <dd className="text-muted">
                <span className="text-foreground">Address</span>
                <br />
                {formatAddress(venue)}
              </dd>
            </div>
            {venue.instagram && (
              <div className="flex gap-3">
                <dt>
                  <InstagramIcon className="mt-0.5 text-accent-text" />
                  <span className="sr-only">Instagram</span>
                </dt>
                <dd className="text-muted">
                  <span className="text-foreground">Instagram</span>
                  <br />
                  <a
                    href={venue.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-4 hover:text-foreground hover:underline"
                  >
                    {instagramHandle(venue.instagram)}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </dd>
              </div>
            )}
          </dl>

          {/* Loaded only when scrolled near, so it doesn't slow the page; Google Maps' embed needs no API key. */}
          <div className="mt-6 overflow-hidden rounded-xl border border-border bg-background">
            <iframe
              src={maps.embed}
              title={`Map showing the location of ${venue.name}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block aspect-[4/3] w-full border-0 sm:aspect-[16/9]"
            />
          </div>
          <a
            href={maps.directions}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground hover:bg-accent/85"
          >
            <DirectionsIcon width={18} height={18} /> Get directions
            <span className="sr-only">(opens Google Maps in a new tab)</span>
          </a>
        </section>
      </main>

      <JsonLd
        data={[
          venueLd(venue),
          breadcrumbLd([
            { name: site.name, path: "/" },
            { name: venue.name, path: venuePath(venue.slug) },
          ]),
        ]}
      />
    </>
  );
}
