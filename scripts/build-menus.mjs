#!/usr/bin/env node
/**
 * Menu pipeline: menus/*.pdf  ->  public/menus/<name>/<hash>/  +  src/generated/menus.json
 *
 * For every PDF it:
 *   1. renders each page to WebP at several widths (responsive `srcset`),
 *   2. extracts the page text (indexed by search engines, read by screen readers),
 *   3. copies the PDF for the "Download PDF" button.
 *
 * Wide pages (e.g. landscape spreads) listed in a menu's `splitPages` setting
 * in src/config/venues.ts are cut into their columns, so each column fills a
 * phone screen instead of the whole spread shrinking to an unreadable size.
 *
 * Output folders are named after a hash of the PDF contents, so replacing a
 * PDF produces new URLs and phones never show a cached, outdated menu.
 * Unchanged PDFs are skipped, which keeps `npm run dev` restarts fast.
 *
 * Runs automatically before `dev` and `build` (see package.json).
 */
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { venues } from "../src/config/venues.ts";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC_DIR = path.join(ROOT, "menus");
const OUT_DIR = path.join(ROOT, "public", "menus");
const MANIFEST = path.join(ROOT, "src", "generated", "menus.json");

/** Rendered widths in px. The largest also sets the render resolution. */
const WIDTHS = [800, 1200, 1800];
const WEBP_QUALITY = 82;
/** Bump to force every menu to re-render after changing the settings above. */
const PIPELINE_VERSION = 3;
/** How far (fraction of page width) either side of an even split to look for a blank gutter. */
const GUTTER_SEARCH = 0.08;

const STANDARD_FONTS = pathToFileURL(
  path.join(ROOT, "node_modules", "pdfjs-dist", "standard_fonts") + path.sep,
).href;

const log = (...args) => console.log("[menus]", ...args);

const MENUS = venues.flatMap((v) => v.menus);
/** `splitPages` from the venue config, keyed by PDF file name. */
const SPLITS = Object.fromEntries(MENUS.map((m) => [m.file, m.splitPages ?? {}]));
/** PDFs whose menus use `pdfLink`; these aren't copied into the site. */
const LINKED = new Set(MENUS.filter((m) => m.pdfLink).map((m) => m.file));

const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/\.pdf$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * Turns pdf.js text items into readable lines.
 *
 * Design tools (CorelDRAW, Illustrator…) often store a menu's dish names,
 * headings and prices as separate blocks, so reading items in file order gives
 * "name, name, name … price, price, price". Instead, items are regrouped by
 * where they sit on the page: same baseline = same line, left to right.
 */
function textItems(content) {
  return content.items
    .filter((item) => "str" in item && item.str.trim())
    .map((item) => ({
      str: item.str.trim(),
      x: item.transform[4],
      y: item.transform[5],
      w: item.width,
      h: item.height || Math.abs(item.transform[3]) || 10,
    }));
}

function textFromItems(unsorted) {
  const items = [...unsorted].sort((a, b) => b.y - a.y || a.x - b.x);

  const lines = [];
  for (const item of items) {
    const line = lines.at(-1);
    if (line && Math.abs(line.y - item.y) <= Math.max(2, item.h * 0.45)) line.items.push(item);
    else lines.push({ y: item.y, items: [item] });
  }

  return lines
    .map(({ items: row }) => {
      row.sort((a, b) => a.x - b.x);
      let text = row[0].str;
      for (let i = 1; i < row.length; i++) {
        const gap = row[i].x - (row[i - 1].x + row[i - 1].w);
        // A wide gap is a column break (e.g. dish -> price); mark it so the line stays readable.
        text += gap > row[i].h * 1.5 ? " · " : " ";
        text += row[i].str;
      }
      return text.replace(/\s+/g, " ").trim();
    })
    .filter(Boolean)
    .join("\n");
}

/**
 * Where to cut a page into `columns` pieces, as fractions of its width.
 * Each cut goes in the middle of the blank vertical strip closest to an even
 * division (1/2, or 1/3 and 2/3, ...), so text is never sliced. If no blank
 * strip is found nearby, the even division is used and a warning is printed.
 */
async function findGutters(png, columns, file, pageNumber) {
  const { data, info } = await sharp(png).resize({ width: 1800 }).greyscale().raw().toBuffer({ resolveWithObject: true });
  const ink = new Uint32Array(info.width);
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) if (data[y * info.width + x] < 170) ink[x]++;
  }
  const blankLimit = Math.max(2, Math.round(info.height * 0.002));
  const runs = [];
  let start = -1;
  for (let x = 0; x <= info.width; x++) {
    const blank = x < info.width && ink[x] <= blankLimit;
    if (blank && start < 0) start = x;
    if (!blank && start >= 0) {
      runs.push({ center: (start + x) / 2 / info.width, width: x - start });
      start = -1;
    }
  }

  const cuts = [];
  for (let k = 1; k < columns; k++) {
    const target = k / columns;
    const near = runs
      .filter((r) => r.width >= 6 && Math.abs(r.center - target) <= GUTTER_SEARCH)
      .sort((a, b) => Math.abs(a.center - target) - Math.abs(b.center - target));
    if (near.length) {
      cuts.push(near[0].center);
    } else {
      log(`warning ${file} page ${pageNumber}: no blank gutter near ${Math.round(target * 100)}% of the width; cutting there anyway. Check the column images.`);
      cuts.push(target);
    }
  }
  return cuts;
}

async function renderPdf(file, bytes, hash) {
  const name = slugify(file);
  const relDir = `/menus/${name}/${hash}`;
  const absDir = path.join(OUT_DIR, name, hash);
  await fs.mkdir(absDir, { recursive: true });

  const loadingTask = getDocument({
    data: new Uint8Array(bytes),
    standardFontDataUrl: STANDARD_FONTS,
    isEvalSupported: false,
    verbosity: 0,
  });
  const pdf = await loadingTask.promise;

  const pages = [];
  const maxWidth = Math.max(...WIDTHS);
  const splits = SPLITS[file] ?? {};

  for (let n = 1; n <= pdf.numPages; n++) {
    const page = await pdf.getPage(n);
    const columns = Math.max(1, Math.floor(splits[n] ?? 1));
    const base = page.getViewport({ scale: 1 });
    // Render wide enough that each column still comes out at full resolution.
    const viewport = page.getViewport({ scale: (maxWidth * columns) / base.width });
    const { canvas } = pdf.canvasFactory.create(Math.ceil(viewport.width), Math.ceil(viewport.height));
    await page.render({ canvas, viewport }).promise;
    const png = canvas.toBuffer("image/png");
    const items = textItems(await page.getTextContent());

    const cuts = columns > 1 ? await findGutters(png, columns, file, n) : [];
    const edges = [0, ...cuts, 1];
    const pageLeft = page.view[0];
    const pageWidth = page.view[2] - page.view[0];

    for (let c = 0; c < columns; c++) {
      const [from, to] = [edges[c], edges[c + 1]];
      const left = Math.round(from * canvas.width);
      const cropWidth = Math.round(to * canvas.width) - left;
      const label = columns > 1 ? `${n}-${c + 1}` : `${n}`;

      const sources = [];
      let height = 0;
      for (const width of WIDTHS) {
        const out = `page-${label}-${width}.webp`;
        const info = await sharp(png)
          .extract({ left, top: 0, width: cropWidth, height: canvas.height })
          .resize({ width, withoutEnlargement: true })
          .webp({ quality: WEBP_QUALITY, effort: 5 })
          .toFile(path.join(absDir, out));
        // Skip a size that came out identical to the previous one (narrow column, no upscaling).
        if (sources.at(-1)?.width === info.width) continue;
        sources.push({ src: `${relDir}/${out}`, width: info.width });
        height = info.height;
      }

      const inColumn = items.filter((item) => {
        const x = (item.x - pageLeft) / pageWidth;
        return x >= from && x < to;
      });
      pages.push({
        pdfPage: n,
        ...(columns > 1 ? { part: c + 1 } : {}),
        width: sources.at(-1).width,
        height,
        sources,
        text: textFromItems(inColumn),
      });
    }
    page.cleanup();
  }
  await loadingTask.destroy();

  const pdfName = `${name}.pdf`;
  const publishPdf = !LINKED.has(file);
  if (publishPdf) await fs.writeFile(path.join(absDir, pdfName), bytes);

  const entry = {
    file,
    hash,
    pageCount: pdf.numPages,
    pdf: { src: publishPdf ? `${relDir}/${pdfName}` : null, bytes: bytes.length },
    pages,
  };
  await fs.writeFile(path.join(absDir, "meta.json"), JSON.stringify(entry));
  return entry;
}

async function main() {
  const files = (await fs.readdir(SRC_DIR).catch(() => []))
    .filter((f) => f.toLowerCase().endsWith(".pdf"))
    .sort();

  if (files.length === 0) {
    log(`No PDFs found in ${path.relative(ROOT, SRC_DIR)}/. Run \`npm run menus:placeholder\` or add the menu PDFs.`);
  }

  const manifest = {};
  const keep = new Map(); // name -> hash

  for (const file of files) {
    const bytes = await fs.readFile(path.join(SRC_DIR, file));
    const hash = createHash("sha256")
      .update(`v${PIPELINE_VERSION}:${WIDTHS.join(",")}:${WEBP_QUALITY}:${JSON.stringify(SPLITS[file] ?? {})}:${LINKED.has(file) ? "linked" : "hosted"}:`)
      .update(bytes)
      .digest("hex")
      .slice(0, 10);
    const name = slugify(file);
    keep.set(name, hash);

    const metaPath = path.join(OUT_DIR, name, hash, "meta.json");
    const cached = await fs.readFile(metaPath, "utf8").then(JSON.parse, () => null);
    if (cached) {
      manifest[file] = cached;
      log(`cached  ${file} (${cached.pageCount} pages)`);
      continue;
    }

    const started = Date.now();
    manifest[file] = await renderPdf(file, bytes, hash);
    const entry = manifest[file];
    const chars = entry.pages.reduce((sum, p) => sum + p.text.length, 0);
    const parts = entry.pages.length === entry.pageCount ? "" : `, shown as ${entry.pages.length} images`;
    log(`built   ${file} (${entry.pageCount} pages${parts}, ${Date.now() - started} ms)`);
    if (chars === 0) {
      log(`warning ${file} has no extractable text (scanned or outlined?). It will display fine but search engines can't read the dishes.`);
    }
  }

  // Remove renders of PDFs that were replaced or deleted.
  for (const name of await fs.readdir(OUT_DIR).catch(() => [])) {
    const dir = path.join(OUT_DIR, name);
    if (!keep.has(name)) {
      await fs.rm(dir, { recursive: true, force: true });
      continue;
    }
    for (const hash of await fs.readdir(dir)) {
      if (hash !== keep.get(name)) await fs.rm(path.join(dir, hash), { recursive: true, force: true });
    }
  }

  await fs.mkdir(path.dirname(MANIFEST), { recursive: true });
  await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  log(`manifest ${path.relative(ROOT, MANIFEST)} (${files.length} menus)`);
}

main().catch((err) => {
  console.error("[menus] failed:", err);
  process.exit(1);
});
