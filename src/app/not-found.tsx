import type { Metadata } from "next";
import Link from "next/link";
import { Ornament } from "@/components/Ornament";
import { site } from "@/config/site";
import { venues } from "@/config/venues";
import { venuePath } from "@/lib/url";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.35em] text-muted">{site.name}</p>
      <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">This page isn&apos;t on the menu</h1>
      <Ornament className="mt-7" />
      <p className="mt-7 max-w-sm text-muted">The link may be out of date. Pick a venue below to see its latest menus.</p>
      <ul className="mt-8 flex flex-col gap-3 sm:flex-row">
        {venues.map((v) => (
          <li key={v.slug}>
            <Link
              href={venuePath(v.slug)}
              className="inline-flex min-h-12 min-w-44 items-center justify-center rounded-full border border-accent/60 px-6 text-sm font-semibold hover:bg-accent/10"
            >
              {v.name}
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/" className="mt-6 text-sm text-muted underline-offset-4 hover:text-foreground hover:underline">
        Back to {site.name}
      </Link>
    </main>
  );
}
