import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { themeStyle } from "@/lib/theme";
import { getVenue } from "@/lib/venues";

/** Applies the venue's theme to its hub page and all of its menu pages. */
export default async function VenueLayout({ children, params }: LayoutProps<"/[venue]">) {
  const { venue: slug } = await params;
  const venue = getVenue(slug);
  if (!venue) notFound();

  return (
    <div style={themeStyle(venue.theme)} className="flex min-h-dvh flex-col bg-background text-foreground">
      <div className="flex-1">{children}</div>
      <SiteFooter currentVenue={venue.slug} />
    </div>
  );
}
