import type { VenueConfig } from "./types";

/**
 * The venues under Grand Plaza, in display order.
 *
 * - Each venue gets /<slug>/ and each of its menus /<slug>/<menu.slug>/.
 * - `menu.file` must match a PDF in the top-level `menus/` folder.
 * - Changing a `slug` changes the URL, which breaks QR codes already printed.
 */
// TODO(client): Throttle Up copy, and hours/phone numbers for both venues, are placeholders.
export const venues: VenueConfig[] = [
  {
    slug: "golden-ember",
    name: "Golden Ember",
    schemaType: "Restaurant",
    category: "Fine Dining",
    // Tagline and description are taken from the introduction page of the Golden Ember food menu.
    tagline: "One Ember, Five Worlds",
    description:
      "Panvel's first multi-cuisine premium restaurant. Five cuisines, one kitchen: the spice of India, the fire of Mexico, the soul of Italy, the comfort of America and the balance of Pan-Asia.",
    cuisine: ["Indian", "Continental", "Pan-Asian", "Italian", "Mexican"],
    priceRange: "₹₹₹",
    // TODO(client): placeholder phone number and hours.
    telephone: "+91 00000 00001",
    openingHours: [
      {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "12:00",
        closes: "15:30",
      },
      {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "19:00",
        closes: "23:30",
      },
    ],
    keywords: [
      "Golden Ember",
      "Golden Ember Panvel",
      "fine dining Panvel",
      "multi-cuisine restaurant Panvel",
      "restaurant menu",
    ],
    // Navy, gold and cream sampled from the menu PDFs.
    theme: {
      displayFont: "serif",
      colors: {
        background: "#0b1733",
        surface: "#132550",
        foreground: "#fbf6e3",
        muted: "#c1b9a0",
        accent: "#c9a66b",
        accentForeground: "#0e1a33",
        border: "rgba(201, 166, 107, 0.28)",
      },
    },
    menus: [
      {
        slug: "food",
        label: "Food",
        title: "Food Menu",
        description:
          "Indian, Continental and Pan-Asian: soups, tandoor starters, curries, breads, biryani, pizza, pasta, ramen, sizzlers, dim sum and desserts.",
        file: "golden-ember-food.pdf",
      },
      {
        slug: "bar",
        label: "Bar",
        title: "Bar Menu",
        description: "Cocktails, whisky and spirits, wine and beer, mocktails and soft beverages.",
        file: "golden-ember-beverages.pdf",
        // Pages 2 and 7 are blank print pages.
        hiddenPages: [2, 7],
      },
    ],
  },
  {
    slug: "throttle-up",
    name: "Throttle Up",
    schemaType: "BarOrPub",
    category: "Premium Lounge",
    tagline: "Where the night picks up speed",
    description:
      "A premium lounge with signature cocktails, curated spirits and small plates made for sharing.",
    cuisine: ["Bar Bites", "Pan-Asian"],
    priceRange: "₹₹₹",
    telephone: "+91 00000 00002",
    openingHours: [
      {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Sunday"],
        opens: "17:00",
        closes: "00:30",
      },
      {
        days: ["Friday", "Saturday"],
        opens: "17:00",
        closes: "01:30",
      },
    ],
    keywords: ["Throttle Up", "lounge", "cocktail bar", "bar menu"],
    theme: {
      displayFont: "condensed",
      colors: {
        background: "#0c0e11",
        surface: "#161a1f",
        foreground: "#eef1f4",
        muted: "#9aa3ad",
        accent: "#ff6a2b",
        accentForeground: "#170904",
        border: "rgba(255, 106, 43, 0.24)",
      },
    },
    menus: [
      {
        slug: "food",
        label: "Food",
        title: "Food & Bites",
        description: "Small plates, sliders and sharing platters.",
        file: "throttle-up-food.pdf",
      },
      {
        slug: "drinks",
        label: "Drinks",
        title: "Cocktails & Bar",
        description: "Signature cocktails, spirits, beer and zero-proof drinks.",
        file: "throttle-up-drinks.pdf",
      },
    ],
  },
];
