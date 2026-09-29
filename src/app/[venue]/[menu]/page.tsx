import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon, DownloadIcon } from "@/components/icons";
import { JsonLd } from "@/components/JsonLd";
import { MenuPages } from "@/components/MenuPages";
import { MenuTabs } from "@/components/MenuTabs";
import { PageIndicator } from "@/components/PageIndicator";
import { site } from "@/config/site";
import { venues } from "@/config/venues";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbLd, menuLd } from "@/lib/structured-data";
import { absoluteUrl, menuPath, venuePath, withBasePath } from "@/lib/url";
import { formatBytes, getMenu, getMenuAsset, getVenue, getVisiblePages, menuName } from "@/lib/venues";

export const dynamicParams = false;

export function generateStaticParams() {
  return venues.flatMap((v) => v.menus.map((m) => ({ venue: v.slug, menu: m.slug })));
}

async function resolve(params: PageProps<"/[venue]/[menu]">["params"]) {
  const { venue: venueSlug, menu: menuSlug } = await params;
  const venue = getVenue(venueSlug);
  const menu = venue && getMenu(venue, menuSlug);
  return venue && menu ? { venue, menu } : null;
}

export async function generateMetadata({ params }: PageProps<"/[venue]/[menu]">): Promise<Metadata> {
  const found = await resolve(params);
  if (!found) return {};
  const { venue, menu } = found;
  return pageMetadata({
    title: `${menu.title} – ${venue.name}`,
    description: `${menu.description} View the ${menuName(venue, menu)} at ${site.name}.`,
    path: menuPath(venue.slug, menu.slug),
    image: `${venue.slug}-${menu.slug}`,
    keywords: [...venue.keywords, menu.title, `${venue.name} ${menu.label} menu`],
  });
}

export async function generateViewport({ params }: PageProps<"/[venue]/[menu]">): Promise<Viewport> {
  const found = await resolve(params);
  return { themeColor: found?.venue.theme.colors.background ?? site.theme.colors.background };
}

export default async function MenuPage({ params }: PageProps<"/[venue]/[menu]">) {
  const found = await resolve(params);
  if (!found) notFound();
  const { venue, menu } = found;

  const asset = getMenuAsset(menu);
  const pages = getVisiblePages(menu);
  const pdfHref = withBasePath(asset.pdf.src);
  const downloadName = `${venue.name} - ${menu.title}.pdf`;
  const others = venue.menus.filter((m) => m.slug !== menu.slug);
  const hasText = pages.some((p) => p.text);

  return (
    <>
      <a
        href="#menu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-foreground"
      >
        Skip to menu
      </a>

      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-3xl items-center gap-3 px-3 sm:px-4">
          <Link
            href={venuePath(venue.slug)}
            aria-label={`Back to ${venue.name}`}
            className="grid size-10 shrink-0 place-items-center rounded-full text-muted hover:bg-surface hover:text-foreground"
          >
            <ArrowLeftIcon />
          </Link>
          <MenuTabs venue={venue} current={menu.slug} />
          <a
            href={pdfHref}
            download={downloadName}
            aria-label={`Download ${menu.title} PDF`}
            className="grid size-10 shrink-0 place-items-center rounded-full text-muted hover:bg-surface hover:text-foreground"
          >
            <DownloadIcon />
          </a>
        </div>
      </header>

      <main id="menu" className="mx-auto max-w-3xl px-3 pb-24 pt-6 sm:px-4 sm:pt-8">
        <h1 className="mb-6 text-center">
          <span className="block text-xs font-medium uppercase tracking-[0.3em] text-accent">{venue.name}</span>
          <span className="mt-2 block font-display text-3xl font-semibold sm:text-4xl">{menu.title}</span>
        </h1>

        <MenuPages pages={pages} label={`${venue.name} ${menu.title}`} />

        <div data-menu-end className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
          <a
            href={pdfHref}
            download={downloadName}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground hover:bg-accent/85"
          >
            <DownloadIcon width={18} height={18} /> Download PDF
            <span className="font-normal opacity-75">({formatBytes(asset.pdf.bytes)})</span>
          </a>
          {others.map((other) => (
            <Link
              key={other.slug}
              href={menuPath(venue.slug, other.slug)}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-accent/60 px-6 text-sm font-semibold hover:bg-accent/10"
            >
              {other.title} <ArrowRightIcon width={18} height={18} />
            </Link>
          ))}
        </div>

        {hasText && (
          <details className="group mt-10 rounded-2xl border border-border bg-surface/60 p-5 text-sm">
            <summary className="cursor-pointer select-none font-semibold text-foreground marker:text-accent">
              Text version of this menu
            </summary>
            <div className="mt-4 space-y-6">
              {pages.map(({ pdfPage, text }, i) =>
                text ? (
                  <section key={pdfPage} aria-label={`Page ${i + 1}`}>
                    {pages.length > 1 && (
                      <h2 className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-accent">Page {i + 1}</h2>
                    )}
                    <p className="whitespace-pre-line leading-relaxed text-muted">{text}</p>
                  </section>
                ) : null,
              )}
            </div>
          </details>
        )}
      </main>

      <PageIndicator total={pages.length} />

      <JsonLd
        data={[
          menuLd(venue, menu, absoluteUrl(asset.pdf.src)),
          breadcrumbLd([
            { name: site.name, path: "/" },
            { name: venue.name, path: venuePath(venue.slug) },
            { name: menu.title, path: menuPath(venue.slug, menu.slug) },
          ]),
        ]}
      />
    </>
  );
}
