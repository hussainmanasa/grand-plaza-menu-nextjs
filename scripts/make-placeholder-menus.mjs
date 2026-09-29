#!/usr/bin/env node
/**
 * Generates placeholder menu PDFs in `menus/` so the site can be built and
 * reviewed before the real menus arrive. Existing files are never overwritten,
 * and `--force` only regenerates files that are themselves placeholders, so a
 * real menu can't be replaced by accident.
 *
 *   npm run menus:placeholder            # create any missing placeholders
 *   npm run menus:placeholder -- --force # also regenerate existing placeholders
 */
import fs from "node:fs/promises";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const ROOT = path.resolve(import.meta.dirname, "..");
const MENUS_DIR = path.join(ROOT, "menus");
const force = process.argv.includes("--force");

const hex = (h) => {
  const n = parseInt(h.replace("#", ""), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
};

const item = (name, desc, price) => ({ name, desc, price });

const MENUS = [
  {
    file: "golden-ember-food.pdf",
    venue: "GOLDEN EMBER",
    title: "A la carte",
    paper: "#f7f0e4",
    ink: "#2a1d12",
    accent: "#b3741f",
    serif: true,
    sections: [
      ["Amuse & Starters", [
        item("Ember-roasted beetroot", "Goat cheese mousse, candied walnut, smoked honey", "845"),
        item("Tandoori scallops", "Cauliflower silk, curry leaf butter, lime pearls", "1,450"),
        item("Charred corn soup", "Brown butter, chilli oil, sourdough crumb", "625"),
        item("Lamb seekh tartlet", "Mint labneh, pickled shallot, pomegranate", "975"),
        item("Burrata & heirloom tomato", "Basil oil, aged balsamic, grilled focaccia", "1,150"),
      ]],
      ["From the Hearth", [
        item("Wood-fired lamb rack", "Rogan jus, smoked aubergine, saffron potato", "2,650"),
        item("Butter-poached lobster", "Coconut moilee, curry leaf, red rice", "3,400"),
        item("Charcoal chicken supreme", "Makhani velouté, charred leek, kasoori methi", "1,850"),
        item("Wild mushroom risotto", "Truffle, parmesan crisp, chive oil", "1,650"),
        item("Grilled seabass", "Kokum beurre blanc, fennel, samphire", "2,250"),
        item("Paneer tikka roulade", "Tomato kasundi, pickled onion, garlic naan", "1,450"),
      ]],
    ],
    page2: [
      ["Accompaniments", [
        item("Truffle naan", "Brushed with black truffle butter", "425"),
        item("Dal Golden Ember", "Black lentils slow-cooked for 24 hours", "695"),
        item("Saffron pulao", "Aged basmati, fried onion, rose water", "495"),
        item("Charred greens", "Garlic, lemon, toasted seeds", "450"),
      ]],
      ["Desserts", [
        item("Ember chocolate", "Dark chocolate cremeux, smoked salt, cocoa nib", "795"),
        item("Gulab jamun cheesecake", "Cardamom crumb, rose gel, pistachio", "745"),
        item("Mango & passion fruit", "Coconut sorbet, meringue shards", "695"),
        item("Kulfi trio", "Pistachio, saffron, salted caramel", "650"),
      ]],
    ],
  },
  {
    file: "golden-ember-beverages.pdf",
    venue: "GOLDEN EMBER",
    title: "Wine & Beverages",
    paper: "#f7f0e4",
    ink: "#2a1d12",
    accent: "#b3741f",
    serif: true,
    sections: [
      ["Signature Cocktails", [
        item("Golden Hour", "Aged rum, saffron honey, lemon, egg white", "1,150"),
        item("Smoke & Ember", "Mezcal, smoked pineapple, chilli agave", "1,250"),
        item("The Maharaja Old Fashioned", "Bourbon, jaggery, cardamom bitters", "1,350"),
        item("Garden Spritz", "Gin, elderflower, cucumber, prosecco", "1,050"),
      ]],
      ["Wines by the Glass", [
        item("Prosecco DOC, Veneto", "Crisp apple and pear", "950"),
        item("Sauvignon Blanc, Marlborough", "Passion fruit, cut grass", "1,100"),
        item("Pinot Noir, Burgundy", "Red cherry, forest floor", "1,450"),
        item("Malbec, Mendoza", "Plum, violet, cocoa", "1,200"),
      ]],
    ],
    page2: [
      ["Zero Proof", [
        item("Kokum Cooler", "Kokum, ginger, soda", "450"),
        item("Virgin Ember", "Smoked pineapple, lime, chilli", "475"),
        item("Cold-brew tonic", "Single-origin coffee, tonic, orange", "425"),
      ]],
      ["Coffee & Tea", [
        item("Espresso / Americano", "", "325"),
        item("Cappuccino / Latte", "", "375"),
        item("Masala chai", "Brewed with whole spices", "295"),
        item("Darjeeling first flush", "", "345"),
      ]],
    ],
  },
  {
    file: "throttle-up-food.pdf",
    venue: "THROTTLE UP",
    title: "Food & Bites",
    paper: "#14171b",
    ink: "#eef1f4",
    accent: "#ff6a2b",
    serif: false,
    sections: [
      ["Small Plates", [
        item("Loaded nachos", "Cheese sauce, jalapeño, pico, sour cream", "545"),
        item("Korean fried chicken", "Gochujang glaze, sesame, scallion", "695"),
        item("Truffle fries", "Parmesan, truffle oil, garlic aioli", "445"),
        item("Chilli garlic prawns", "Butter, bird's-eye chilli, toast", "845"),
        item("Crispy corn chaat", "Chaat masala, lime, onion", "395"),
      ]],
      ["Sliders & Bao", [
        item("Classic smash slider", "Double patty, cheddar, pickles", "595"),
        item("Pulled jackfruit bao", "Hoisin, slaw, peanut", "525"),
        item("Pork belly bao", "Char siu, cucumber, chilli mayo", "645"),
        item("Paneer tikka slider", "Mint mayo, onion, brioche", "545"),
      ]],
    ],
    page2: [
      ["Sharing Platters", [
        item("Pit Stop platter", "Wings, fries, sliders, nachos (serves 4)", "1,895"),
        item("Veggie Grid platter", "Corn chaat, bao, fries, dips (serves 4)", "1,595"),
      ]],
      ["Sweet Finish", [
        item("Churros", "Cinnamon sugar, dark chocolate dip", "445"),
        item("Brownie sundae", "Vanilla ice cream, fudge, nuts", "495"),
      ]],
    ],
  },
  {
    file: "throttle-up-drinks.pdf",
    venue: "THROTTLE UP",
    title: "Cocktails & Bar",
    paper: "#14171b",
    ink: "#eef1f4",
    accent: "#ff6a2b",
    serif: false,
    sections: [
      ["Signature Cocktails", [
        item("Full Throttle", "Vodka, passion fruit, vanilla, prosecco", "895"),
        item("Redline", "Tequila, blood orange, chilli, lime", "925"),
        item("Nitro Negroni", "Gin, Campari, sweet vermouth, cold smoke", "975"),
        item("Pit Lane Punch", "Spiced rum, pineapple, falernum", "875"),
        item("Checkered Flag", "Whisky, honey, ginger, lemon", "895"),
      ]],
      ["Beer on Tap", [
        item("Craft lager", "330 ml / 500 ml", "395 / 545"),
        item("Belgian wit", "330 ml / 500 ml", "425 / 595"),
        item("IPA", "330 ml / 500 ml", "445 / 625"),
      ]],
    ],
    page2: [
      ["Spirits (30 ml)", [
        item("Single malt, 12 yr", "", "895"),
        item("Blended Scotch", "", "595"),
        item("Premium vodka", "", "545"),
        item("Reposado tequila", "", "745"),
        item("London dry gin", "", "595"),
      ]],
      ["Zero Proof", [
        item("Zero Lap", "Seedlip, citrus, tonic", "425"),
        item("Cool Down", "Watermelon, mint, lime", "395"),
        item("Red Bull", "Regular / sugar-free", "345"),
      ]],
    ],
  },
];

const PLACEHOLDER_SUBJECT = "Placeholder menu, replace with the final PDF";

async function isPlaceholder(file) {
  try {
    const doc = await PDFDocument.load(await fs.readFile(file), { updateMetadata: false });
    return doc.getSubject() === PLACEHOLDER_SUBJECT;
  } catch {
    return false;
  }
}

const PAGE_W = 595.28; // A4 in points
const PAGE_H = 841.89;
const MARGIN = 56;

async function buildMenu(spec) {
  const doc = await PDFDocument.create();
  doc.setTitle(`${spec.venue} — ${spec.title} (placeholder)`);
  doc.setAuthor("Grand Plaza");
  doc.setSubject(PLACEHOLDER_SUBJECT);

  const display = await doc.embedFont(spec.serif ? StandardFonts.TimesRomanBold : StandardFonts.HelveticaBold);
  const body = await doc.embedFont(spec.serif ? StandardFonts.TimesRoman : StandardFonts.Helvetica);
  const italic = await doc.embedFont(spec.serif ? StandardFonts.TimesRomanItalic : StandardFonts.HelveticaOblique);
  const paper = hex(spec.paper);
  const ink = hex(spec.ink);
  const accent = hex(spec.accent);
  const mutedInk = spec.serif ? hex("#6d5a47") : hex("#9aa3ad");

  const pages = [spec.sections, spec.page2];
  pages.forEach((sections, pageIndex) => {
    const page = doc.addPage([PAGE_W, PAGE_H]);
    page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: paper });
    page.drawRectangle({
      x: 24, y: 24, width: PAGE_W - 48, height: PAGE_H - 48,
      borderColor: accent, borderWidth: 0.8,
    });

    const centered = (text, font, size, y, color) => {
      const w = font.widthOfTextAtSize(text, size);
      page.drawText(text, { x: (PAGE_W - w) / 2, y, size, font, color });
    };

    let y = PAGE_H - 96;
    centered(spec.venue, display, 30, y, accent);
    y -= 28;
    centered(spec.title.toUpperCase(), body, 12, y, ink);
    y -= 14;
    page.drawLine({ start: { x: PAGE_W / 2 - 40, y }, end: { x: PAGE_W / 2 + 40, y }, color: accent, thickness: 0.8 });
    y -= 40;

    for (const [heading, items] of sections) {
      centered(heading.toUpperCase(), display, 15, y, accent);
      y -= 30;
      for (const it of items) {
        page.drawText(it.name, { x: MARGIN, y, size: 12.5, font: display, color: ink });
        const pw = display.widthOfTextAtSize(it.price, 12.5);
        page.drawText(it.price, { x: PAGE_W - MARGIN - pw, y, size: 12.5, font: display, color: ink });
        // Dotted leader between name and price.
        const startX = MARGIN + display.widthOfTextAtSize(it.name, 12.5) + 8;
        for (let x = startX; x < PAGE_W - MARGIN - pw - 8; x += 5) {
          page.drawCircle({ x, y: y + 3, size: 0.5, color: mutedInk });
        }
        y -= 15;
        if (it.desc) {
          page.drawText(it.desc, { x: MARGIN, y, size: 10, font: italic, color: mutedInk });
          y -= 12;
        }
        y -= 12;
      }
      y -= 16;
    }

    const footer = `SAMPLE MENU · PLACEHOLDER CONTENT · PRICES IN INR, EXCLUSIVE OF TAXES · PAGE ${pageIndex + 1} OF ${pages.length}`;
    centered(footer, body, 7.5, 44, mutedInk);
  });

  return doc.save();
}

await fs.mkdir(MENUS_DIR, { recursive: true });
for (const spec of MENUS) {
  const out = path.join(MENUS_DIR, spec.file);
  const exists = await fs.stat(out).then(() => true, () => false);
  if (exists && !force) {
    console.log(`skip   ${spec.file} (exists)`);
    continue;
  }
  if (exists && !(await isPlaceholder(out))) {
    console.log(`skip   ${spec.file} (real menu, not overwriting)`);
    continue;
  }
  await fs.writeFile(out, await buildMenu(spec));
  console.log(`wrote  ${spec.file}`);
}
