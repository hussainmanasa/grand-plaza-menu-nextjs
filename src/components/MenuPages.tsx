import type { VisiblePage } from "@/lib/venues";
import { withBasePath } from "@/lib/url";

type Props = {
  pages: VisiblePage[];
  /** e.g. "Golden Ember Food Menu"; becomes "…, page 1 of 2" alt text. */
  label: string;
};

/**
 * The menu itself: one pre-rendered image per PDF page, stacked vertically.
 * Plain <img> with a hand-built srcset (next/image can't optimise in a static
 * export, and these are already resized WebP). Native pinch-zoom stays on.
 */
export function MenuPages({ pages, label }: Props) {
  return (
    <ol className="flex flex-col gap-4 sm:gap-6">
      {pages.map(({ pdfPage, image }, i) => {
        const srcSet = image.sources.map((s) => `${withBasePath(s.src)} ${s.width}w`).join(", ");
        const fallback = image.sources[Math.min(1, image.sources.length - 1)];
        const first = i === 0;
        return (
          <li key={pdfPage} data-menu-page={i + 1}>
            {/* eslint-disable-next-line @next/next/no-img-element -- see component comment */}
            <img
              src={withBasePath(fallback.src)}
              srcSet={srcSet}
              sizes="(min-width: 48rem) 48rem, 100vw"
              width={image.width}
              height={image.height}
              alt={`${label}, page ${i + 1} of ${pages.length}`}
              loading={first ? "eager" : "lazy"}
              fetchPriority={first ? "high" : "auto"}
              decoding={first ? "sync" : "async"}
              className="h-auto w-full rounded-md bg-surface shadow-2xl shadow-black/50"
            />
          </li>
        );
      })}
    </ol>
  );
}
