/**
 * schema.org structured data. Lets Google show the venues as businesses with
 * hours, phone and a "Menu" link. Validate with
 * https://search.google.com/test/rich-results after deploying.
 */
import { site } from "@/config/site";
import type { MenuConfig, PostalAddress, VenueConfig } from "@/config/types";
import { ogImagePath } from "@/lib/og";
import { absoluteUrl, menuPath, venuePath } from "@/lib/url";
import { venueAddress } from "@/lib/venues";

const ORG_ID = absoluteUrl("/#organization");
const venueId = (v: VenueConfig) => absoluteUrl(`${venuePath(v.slug)}#venue`);

const postalAddress = (a: PostalAddress) => ({ "@type": "PostalAddress", ...a });

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.name,
    url: absoluteUrl("/"),
    description: site.description,
    telephone: site.telephone,
    email: site.email,
    address: postalAddress(site.address),
    ...(site.social.length ? { sameAs: site.social } : {}),
  };
}

export function venueLd(venue: VenueConfig) {
  return {
    "@context": "https://schema.org",
    "@type": venue.schemaType,
    "@id": venueId(venue),
    name: venue.name,
    description: venue.description,
    url: absoluteUrl(venuePath(venue.slug)),
    image: absoluteUrl(ogImagePath(venue.slug)),
    telephone: venue.telephone,
    ...(venue.email ? { email: venue.email } : {}),
    priceRange: venue.priceRange,
    servesCuisine: venue.cuisine,
    address: postalAddress(venueAddress(venue)),
    openingHoursSpecification: venue.openingHours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    hasMenu: venue.menus.map((m) => ({
      "@type": "Menu",
      name: `${venue.name} ${m.title}`,
      url: absoluteUrl(menuPath(venue.slug, m.slug)),
    })),
    parentOrganization: { "@id": ORG_ID },
  };
}

export function menuLd(venue: VenueConfig, menu: MenuConfig, pdfUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: `${venue.name} ${menu.title}`,
    description: menu.description,
    url: absoluteUrl(menuPath(venue.slug, menu.slug)),
    inLanguage: site.language,
    associatedMedia: { "@type": "MediaObject", contentUrl: pdfUrl, encodingFormat: "application/pdf" },
    isPartOf: { "@id": venueId(venue) },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
