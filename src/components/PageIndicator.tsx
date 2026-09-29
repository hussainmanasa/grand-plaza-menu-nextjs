"use client";

import { useEffect, useState } from "react";

/**
 * Floating "Page 2 / 4" pill that follows scroll position. Purely visual:
 * each page image already announces "page x of y" to screen readers.
 */
export function PageIndicator({ total }: { total: number }) {
  const [current, setCurrent] = useState<number | null>(null);
  const [pastEnd, setPastEnd] = useState(false);

  useEffect(() => {
    const pages = document.querySelectorAll<HTMLElement>("[data-menu-page]");
    const end = document.querySelector("[data-menu-end]");
    const ratios = new Map<number, number>();
    // Hide once the actions below the menu are on screen, so the pill never covers them or the footer.
    const endObserver = new IntersectionObserver(([entry]) => setPastEnd(entry.isIntersecting || entry.boundingClientRect.top < 0));
    if (end) endObserver.observe(end);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(Number((entry.target as HTMLElement).dataset.menuPage), entry.intersectionRatio);
        }
        let best: number | null = null;
        let bestRatio = 0;
        for (const [page, ratio] of ratios) {
          if (ratio > bestRatio) [best, bestRatio] = [page, ratio];
        }
        setCurrent(best);
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );
    pages.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      endObserver.disconnect();
    };
  }, []);

  if (total < 2) return null;

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-x-0 bottom-5 z-10 flex justify-center transition-opacity duration-300 ${
        current && !pastEnd ? "opacity-100" : "opacity-0"
      }`}
    >
      <span className="rounded-full border border-border bg-surface/90 px-3.5 py-1.5 text-xs font-medium tabular-nums text-foreground shadow-lg backdrop-blur">
        Page {current ?? 1} / {total}
      </span>
    </div>
  );
}
