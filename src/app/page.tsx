import { JsonLd } from "@/components/JsonLd";
import { Ornament } from "@/components/Ornament";
import { SiteFooter } from "@/components/SiteFooter";
import { VenueCard } from "@/components/VenueCard";
import { Wordmark } from "@/components/Wordmark";
import { site } from "@/config/site";
import { venues } from "@/config/venues";
import { organizationLd, venueLd } from "@/lib/structured-data";

export default function Home() {
  return (
    <>
      <main className="relative isolate overflow-hidden">
        {/* Glow behind the logo; it fades out before the top edge so the phone's status-bar area blends in. */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(ellipse_at_50%_55%,color-mix(in_oklab,var(--accent)_16%,transparent),transparent_60%)] [mask-image:linear-gradient(to_bottom,transparent,black_7rem)]"
        />
        <header className="px-6 pb-12 pt-16 text-center sm:pb-16 sm:pt-24">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-muted">Welcome to</p>
          <h1 className="mt-4 text-5xl leading-none sm:text-7xl">
            <Wordmark
              name={site.name}
              logo={site.logo}
              theme={site.theme}
              className="mx-auto"
              logoClassName="w-[min(100%,20rem)] sm:w-[26rem]"
            />
          </h1>
          <p className="mt-4 text-base text-muted sm:text-lg">{site.tagline}</p>
          <Ornament className="mt-8" />
        </header>

        <section aria-labelledby="venues-heading" className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
          <h2 id="venues-heading" className="mb-6 text-center text-xs font-medium uppercase tracking-[0.3em] text-muted">
            Choose a menu
          </h2>
          <ul className="grid gap-5 md:grid-cols-2 md:gap-6">
            {venues.map((venue) => (
              <li key={venue.slug}>
                <VenueCard venue={venue} headingLevel="h3" />
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
      <JsonLd data={[organizationLd(), ...venues.map(venueLd)]} />
    </>
  );
}
