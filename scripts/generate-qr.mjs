#!/usr/bin/env node
/**
 * Print-ready QR codes for the live site, written to qr/:
 *   grand-plaza.(svg|png)            -> landing page (lobby, reception)
 *   <venue>.(svg|png)                -> venue page (table tents, entrance)
 *   <venue>-<menu>.(svg|png)         -> straight to one menu (bar counter, etc.)
 *   index.html                       -> proof sheet to review/print them all
 *
 * The base URL is taken from, in order:
 *   --url https://example.com/repo   (or SITE_URL env var)
 *   public/CNAME                      (custom domain)
 *   git remote "origin"               (https://<user>.github.io/<repo>)
 *
 * Always scan the printed codes with a couple of phones before a print run.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import QRCode from "qrcode";
import { site } from "../src/config/site.ts";
import { venues } from "../src/config/venues.ts";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "qr");
const PNG_SIZE = 2048;
// "Q" survives ~25% damage: smudges, glare, a small logo sticker on top.
const ERROR_CORRECTION = "Q";

async function resolveBaseUrl() {
  const flag = process.argv.indexOf("--url");
  const explicit = flag > -1 ? process.argv[flag + 1] : process.env.SITE_URL;
  if (explicit) return explicit;

  const cname = await fs.readFile(path.join(ROOT, "public", "CNAME"), "utf8").catch(() => "");
  if (cname.trim()) return `https://${cname.trim()}`;

  try {
    const remote = execFileSync("git", ["remote", "get-url", "origin"], { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    const match = remote.match(/github\.com[:/]([^/]+)\/(.+?)(?:\.git)?$/);
    if (match) {
      const [, owner, repo] = match;
      const user = owner.toLowerCase();
      return repo.toLowerCase() === `${user}.github.io` ? `https://${user}.github.io` : `https://${user}.github.io/${repo}`;
    }
  } catch {
    // no git remote yet
  }
  console.error("[qr] Could not work out the site URL. Pass it explicitly:\n     npm run qr -- --url https://<user>.github.io/<repo>");
  process.exit(1);
}

const base = (await resolveBaseUrl()).replace(/\/$/, "");
if (!/^https:\/\//.test(base)) console.warn(`[qr] warning: ${base} is not https. Printed codes should point at the live site.`);

const targets = [
  { id: "grand-plaza", label: site.name, path: "/" },
  ...venues.flatMap((v) => [
    { id: v.slug, label: v.name, path: `/${v.slug}/` },
    ...v.menus.map((m) => ({ id: `${v.slug}-${m.slug}`, label: `${v.name} · ${m.title}`, path: `/${v.slug}/${m.slug}/` })),
  ]),
];

await fs.rm(OUT, { recursive: true, force: true });
await fs.mkdir(OUT, { recursive: true });

const options = { errorCorrectionLevel: ERROR_CORRECTION, margin: 4, color: { dark: "#000000", light: "#ffffff" } };
const cards = [];
for (const t of targets) {
  const url = `${base}${t.path}`;
  const svg = await QRCode.toString(url, { ...options, type: "svg" });
  await fs.writeFile(path.join(OUT, `${t.id}.svg`), svg);
  await QRCode.toFile(path.join(OUT, `${t.id}.png`), url, { ...options, width: PNG_SIZE });
  cards.push({ ...t, url, svg });
  console.log(`[qr] ${t.id.padEnd(26)} ${url}`);
}

const escape = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const sheet = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escape(site.name)} QR codes</title>
<style>
  body{font-family:system-ui,sans-serif;margin:24px;color:#111;background:#fff}
  h1{font-size:20px} p.note{color:#555;font-size:14px}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:20px;margin-top:20px}
  figure{margin:0;border:1px solid #ddd;border-radius:12px;padding:16px;text-align:center;break-inside:avoid}
  figure svg{width:100%;height:auto} figcaption{font-weight:600;margin-top:8px}
  code{display:block;font-size:11px;color:#555;word-break:break-all;margin-top:4px}
  a{color:inherit}
</style></head><body>
<h1>${escape(site.name)}: menu QR codes</h1>
<p class="note">Generated for <strong>${escape(base)}</strong>. Use the SVG files for print (they scale without blurring). Print at least 3 × 3 cm and keep the white border.</p>
<div class="grid">
${cards.map((c) => `<figure>${c.svg}<figcaption>${escape(c.label)}</figcaption><code><a href="${escape(c.url)}">${escape(c.url)}</a></code><code>${c.id}.svg · ${c.id}.png</code></figure>`).join("\n")}
</div></body></html>
`;
await fs.writeFile(path.join(OUT, "index.html"), sheet);
console.log(`[qr] wrote ${targets.length} codes to qr/ (open qr/index.html to review)`);
