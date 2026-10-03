# Grand Plaza: Menus

Menu website for **Grand Plaza** and its two venues, **Golden Ember** (fine dining) and **Throttle Up** (premium lounge). Guests scan a QR code, choose a venue and menu, and see the full menu on their phone.

Built with Next.js (App Router, static export) and hosted on Vercel at **https://grand-plaza-panvel.vercel.app**.

```
/                         Grand Plaza: choose a venue / menu
/golden-ember/            Venue page: menus, hours, contact
/golden-ember/food/       Menu viewer (every PDF page, Download PDF)
/golden-ember/bar/
/throttle-up/
/throttle-up/food/
/throttle-up/drinks/
```

## How it works

PDFs don't display reliably inside web pages on phones (Android downloads them; iOS often shows only page 1). So during the build, `scripts/build-menus.mjs` turns every page of every PDF in `menus/` into sharp, compressed WebP images at three sizes and pulls out the text. The site then shows the pages as images, which load quickly and pinch-zoom on any phone. The original PDF is still offered through **Download PDF**, and the extracted text sits in a "Text version" section so Google can index the dishes.

Generated files get a content hash in their URL, so replacing a PDF produces new URLs and guests never see a cached, outdated menu.

## Everyday tasks

### Replace a menu PDF

1. Save the new PDF over the old one in `menus/`, **keeping the same file name** (e.g. `menus/golden-ember-food.pdf`).
2. Commit and push to `master`. The site redeploys in about 2 minutes, and the QR codes don't change.

For the best result, export PDFs from the design tool (Canva, Illustrator, InDesign…) with real text, not scans. A4 or any portrait size works.

### Change names, copy, hours, phone numbers

- Grand Plaza details: `src/config/site.ts`
- Venue details and menu list: `src/config/venues.ts`

Items marked `TODO(client)` are placeholders.

> ⚠️ Changing a venue or menu `slug` changes its URL and **breaks QR codes that are already printed**.

### Change colours / fonts

Each venue (and Grand Plaza itself) has a `theme` in the same config files:

```ts
theme: {
  displayFont: "serif",          // "serif" (Cormorant Garamond) or "condensed" (Oswald)
  colors: {
    background: "#120c08",       // page background + mobile browser bar
    surface: "#1e150f",          // cards, header
    foreground: "#f6ecdf",       // main text
    muted: "#bba898",            // secondary text
    accent: "#e0a13a",           // buttons, highlights
    accentForeground: "#1a0f06", // text on accent buttons
    border: "rgba(224, 161, 58, 0.24)",
  },
},
```

Share images (WhatsApp previews, etc.) are generated from the same theme, so they update automatically.

### Add a logo

Put the file in `public/brand/` and set `logo` on the venue (or on `site`) with its pixel size:

```ts
logo: { src: "/brand/golden-ember-logo.png", width: 722, height: 1058 },
```

The logo appears on the landing-page card and at the top of the venue page, and is included in Google's business data. Without a logo the name is set as a text wordmark. Use a transparent PNG or SVG that reads well on the venue's background colour; around 1000–1500px on the long side is plenty.

### Instagram

Set `instagram: "https://www.instagram.com/<handle>/"` on a venue. It shows as a link in the venue page's "Visit us" section and is added to Google's business data.

### Hide pages from the on-screen menu

Blank or print-only pages (inside covers, spacer pages) can be left out of the viewer without editing the PDF. Set `hiddenPages` (1-based PDF page numbers) on the menu in `src/config/venues.ts`:

```ts
{ slug: "bar", file: "golden-ember-beverages.pdf", hiddenPages: [2, 7], ... }
```

The Download PDF button still gives the complete file. After replacing a PDF, check that the numbers still point at the right pages.

### Link the PDF to Google Drive instead of hosting it

By default, the menu's PDF button downloads a copy published with the site. To point it at a shared file instead (handy for very large PDFs), set `pdfLink` on the menu in `src/config/venues.ts`:

```ts
{ slug: "drinks", file: "throttle-up-drinks.pdf", pdfLink: "https://drive.google.com/file/d/<FILE_ID>/view?usp=sharing", ... }
```

- In Drive, set the file to **Share → General access → Anyone with the link (Viewer)**, or guests will see a sign-in page.
- The button changes to **Open PDF (Google Drive)** and opens in a new tab, and the PDF is no longer published with the site.
- Keep the PDF in `menus/`, because the on-screen pages are still rendered from it. When the menu changes, update **both** the file in `menus/` and the file in Drive. In Drive, use *Manage versions → Upload new version* so the link stays the same.

### Add or remove a menu

Add an entry to the venue's `menus` array in `src/config/venues.ts` and drop the matching PDF into `menus/`. Tabs, pages, sitemap and share images are generated for it.

## Development

Requires Node.js 22.18 or newer.

```bash
npm install
npm run dev          # http://localhost:3000 (renders menus first)
npm run build        # static site in out/
npm run preview      # serve out/ locally
npm run lint
npm run typecheck
```

Other scripts:

| Script | What it does |
|---|---|
| `npm run menus` | Re-render `menus/*.pdf` (runs automatically before `dev` / `build`) |
| `npm run menus:placeholder` | Create sample PDFs for any missing menu (`-- --force` to overwrite) |
| `npm run qr` | Generate QR codes for print (see below) |

## Deploying to Vercel

1. Sign in at [vercel.com](https://vercel.com) with GitHub, then **Add New… → Project** and import this repository.
2. Keep the detected settings: Framework **Next.js**, Build Command `npm run build`, Output Directory left as default, Node.js **22.x** (or newer).
3. No environment variables are needed. The live address comes from `url` in `src/config/site.ts`, which is used for canonical links, share images, the sitemap and the QR codes.
4. **Deploy.** Every push to `master` then redeploys production; other branches get preview URLs.

**Custom domain:** add it under **Settings → Domains**, then change `url` in `src/config/site.ts` to the new address, push, and run `npm run qr` again. Changing the address changes the QR codes, so reprint them.

## QR codes

After the site is live:

```bash
npm run qr                                       # codes for `url` in src/config/site.ts
npm run qr -- --url https://another-address.com  # or for a different address
```

This writes to `qr/` (not deployed):

| File | Points to | Suggested use |
|---|---|---|
| `grand-plaza.svg/png` | Landing page | Lobby, reception, website |
| `golden-ember.svg/png` | Golden Ember page | Golden Ember tables |
| `throttle-up.svg/png` | Throttle Up page | Throttle Up tables |
| `<venue>-<menu>.svg/png` | One specific menu | Bar counter, wine list stand |

Open `qr/index.html` to review them all. Give the **SVG** files to the printer. Print at least **3 × 3 cm**, keep the white border, and test-scan the printed proof with both an iPhone and an Android phone under restaurant lighting.

## SEO checklist after launch

- Submit `https://<site>/sitemap.xml` in [Google Search Console](https://search.google.com/search-console). To verify via HTML tag, set `googleSiteVerification` in `src/config/site.ts`.
- Check structured data with the [Rich Results Test](https://search.google.com/test/rich-results).
- Replace every placeholder in `src/config/*.ts` (address, phone, hours) with real details. Google compares them with the Google Business Profile.

## Project layout

```
menus/                    ← menu PDFs (source of truth)
scripts/
  build-menus.mjs         PDF → WebP pages + text + manifest
  make-placeholder-menus.mjs
  generate-qr.mjs
src/
  config/                 ← everything editable: site, venues, themes
  app/
    page.tsx              landing page
    [venue]/page.tsx      venue page
    [venue]/[menu]/       menu viewer
    og/[image]/           share images (.png)
    sitemap.ts, robots.ts, manifest.ts, not-found.tsx
  components/             UI pieces (VenueCard, MenuPages, MenuTabs, …)
  lib/                    URLs, metadata, structured data, theme helpers
```
