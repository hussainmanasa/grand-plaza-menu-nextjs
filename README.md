# Grand Plaza: Menus

Menu website for **Grand Plaza** and its two venues, **Golden Ember** (fine dining) and **Throttle Up** (premium lounge). Guests scan a QR code, choose a venue and menu, and see the full menu on their phone.

Built with Next.js (App Router, static export) and hosted free on GitHub Pages.

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

Put the file in `public/brand/` and set `logo: "/brand/golden-ember.svg"` on the venue (or on `site`). Without a logo the name is set as a text wordmark.

### Hide pages from the on-screen menu

Blank or print-only pages (inside covers, spacer pages) can be left out of the viewer without editing the PDF. Set `hiddenPages` (1-based PDF page numbers) on the menu in `src/config/venues.ts`:

```ts
{ slug: "bar", file: "golden-ember-beverages.pdf", hiddenPages: [2, 7], ... }
```

The Download PDF button still gives the complete file. After replacing a PDF, check that the numbers still point at the right pages.

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

## Deploying to GitHub Pages

1. Create a GitHub repository and push this project to its `master` branch.
2. In the repo, go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` builds and publishes on every push to `master` (or run it manually from the **Actions** tab).

The site will be at `https://<user>.github.io/<repo>/`. The workflow reads that sub-path from GitHub, so no config change is needed.

### Custom domain (optional, recommended)

Printed QR codes are permanent, and a custom domain (e.g. `menu.grandplaza.in`) means they keep working even if hosting changes later.

1. Add the domain under **Settings → Pages → Custom domain** and create the DNS record GitHub shows.
2. Add a file `public/CNAME` containing just the domain name.
3. Push. The workflow switches to the root path automatically. Then **regenerate the QR codes**.

## QR codes

After the site is live:

```bash
npm run qr                                            # uses public/CNAME or the git remote
npm run qr -- --url https://<user>.github.io/<repo>   # or set the URL explicitly
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
- On a `github.io` project site, crawlers only read `robots.txt` from the domain root, which is one more reason to use a custom domain.

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
.github/workflows/deploy.yml
```
