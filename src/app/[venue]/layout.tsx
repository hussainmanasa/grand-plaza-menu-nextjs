import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { themeStyle } from "@/lib/theme";
import { getVenue } from "@/lib/venues";

/** Applies the venue's theme to its hub page and all of its menu pages. */
export default async function VenueLayout({ children, params }: LayoutProps<"/[venue]">) {
  const { venue: slug } = await params;
  const venue = getVenue(slug);
  if (!venue) notFound();

  // Give the page itself the venue's background, not just this wrapper. Phones
  // colour the notch / status-bar area and the overscroll "bounce" from the
  // page background, so without this they show Grand Plaza's near-black.
  const pageBackground = `html,body{background-color:${venue.theme.colors.background}}`;

  return (
    <div style={themeStyle(venue.theme)} className="flex min-h-dvh flex-col bg-background text-foreground">
      <style>{pageBackground}</style>
      <div className="flex-1">{children}</div>
      <SiteFooter currentVenue={venue.slug} />
    </div>
  );
}
