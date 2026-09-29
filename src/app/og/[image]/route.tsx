import { ogEntries, renderOgImage } from "@/lib/og";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return ogEntries().map((e) => ({ image: `${e.id}.png` }));
}

export async function GET(_request: Request, { params }: RouteContext<"/og/[image]">) {
  const { image } = await params;
  const entry = ogEntries().find((e) => `${e.id}.png` === image);
  if (!entry) return new Response("Not found", { status: 404 });
  return renderOgImage(entry);
}
