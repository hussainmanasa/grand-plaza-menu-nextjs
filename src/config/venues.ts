import type { VenueConfig } from "./types";

/**
 * The venues under Grand Plaza, in display order.
 *
 * - Each venue gets /<slug>/ and each of its menus /<slug>/<menu.slug>/.
 * - `menu.file` must match a PDF in the top-level `menus/` folder.
 * - Changing a `slug` changes the URL, which breaks QR codes already printed.
 */
// TODO(client): the Throttle Up tagline is a placeholder.
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
    // Full-name logo; the client's file had a white background, converted to transparent.
    logo: { src: "/brand/golden-ember-logo.png", width: 772, height: 147 },
    instagram: "https://www.instagram.com/goldenemberrestaurant/",
    telephone: "+91 96557 99050",
    // The venue's own name is left out of the street line; pages and structured data already name it.
    address: {
      streetAddress: "1st Floor, Grand Plaza, Takka Rd, near Municipal Water Tank, Sector 21",
      addressLocality: "Panvel",
      addressRegion: "Maharashtra",
      postalCode: "410206",
      addressCountry: "IN",
    },
    openingHours: [
      { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "12:00", closes: "16:00" },
      { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "19:00", closes: "23:00" },
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
        pdfLink: "https://drive.google.com/file/d/13NfGXTnrs9xY9iC-tp1P6dxv3TH2slOj/view",
      },
      {
        slug: "bar",
        label: "Bar",
        title: "Bar Menu",
        description: "Cocktails, whisky and spirits, wine and beer, mocktails and soft beverages.",
        file: "golden-ember-beverages.pdf",
        pdfLink: "https://drive.google.com/file/d/1DKhWqjcr9qUtfFlYrAtzSuGwLBqHlQxh/view",
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
    // TODO(client): tagline is a placeholder; the menus don't include one.
    tagline: "Where the night picks up speed",
    // Description and cuisines are based on the Throttle Up food and bar menus.
    description:
      "A premium lounge in Panvel with signature cocktails, an extensive whisky list and a global kitchen: Indian fusion, Pan-Asian dim sum and bao, wood-fired pizza, Mediterranean grills and American comfort food.",
    cuisine: ["Indian Fusion", "Pan-Asian", "Italian", "Mediterranean", "American", "Chinese"],
    priceRange: "₹₹₹",
    // Cropped from the client's 4K banner (throttle-up-banner-4K-3840x2160.png).
    logo: { src: "/brand/throttle-up-logo.png", width: 1400, height: 381 },
    instagram: "https://www.instagram.com/throttleup_lounge_/",
    telephone: "+91 80975 29050",
    address: {
      streetAddress: "2nd Floor, Grand Plaza, near Municipal Water Tank, Sector 21, Takka Colony",
      addressLocality: "Panvel",
      addressRegion: "Maharashtra",
      postalCode: "410206",
      addressCountry: "IN",
    },
    // Closes after midnight: "01:00" is 1 am the next day.
    openingHours: [{ days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "12:00", closes: "01:00" }],
    keywords: [
      "Throttle Up",
      "Throttle Up Panvel",
      "lounge Panvel",
      "cocktail bar Panvel",
      "bar menu",
    ],
    // Accent is the exact red of the Throttle Up logo. accentText is the same hue made
    // lighter so small red text stays readable on the dark background.
    theme: {
      displayFont: "condensed",
      colors: {
        background: "#111111",
        surface: "#1c1c1c",
        foreground: "#f5f5f4",
        muted: "#aaa6a2",
        accent: "#c82127",
        accentForeground: "#ffffff",
        accentText: "#e3555a",
        border: "rgba(200, 33, 39, 0.32)",
      },
    },
    menus: [
      {
        slug: "food",
        label: "Food",
        title: "Food Menu",
        description:
          "Indian fusion, Pan-Asian dim sum and bao, pizza and pasta, Mediterranean grills, burgers, sandwiches and desserts.",
        file: "throttle-up-food.pdf",
        pdfLink: "https://drive.google.com/file/d/12wy47G8hn4ofhQ_sTtONyS2OMluxzXRR/view",
        // Both pages are landscape spreads; show each column full width on phones.
        splitPages: { 1: 2, 2: 3 },
      },
      {
        // Slug kept as "drinks" so existing QR codes keep working.
        slug: "drinks",
        label: "Bar",
        title: "Bar Menu",
        description: "Cocktails, single malts and whiskies, vodka, rum, gin, tequila, beer, wine and mocktails.",
        file: "throttle-up-drinks.pdf",
        pdfLink: "https://drive.google.com/file/d/1mFFABN1fTUaanUUEexEPfhfsw4Lt3-u6/view",
        // Even pages are blank print backs.
        hiddenPages: [2, 4, 6, 8, 10, 12, 14, 16],
      },
    ],
  },
];
