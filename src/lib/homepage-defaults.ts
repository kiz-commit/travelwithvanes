import type { HomePageSettings } from "@/types";

export const DEFAULT_HOME_PAGE_SETTINGS: HomePageSettings = {
  hero: {
    mode: "gradient",
    mediaUrl: "",
    eyebrow: "Brazil & Australia",
    titleLine1: "Discover your",
    titleItalic: "next",
    titleLine2: "adventure",
    subtitle:
      "Curated trip guides, local travel notes, and authentic stories from a creator who calls both countries home.",
    primaryCtaLabel: "Preview Trip Guides",
    primaryCtaHref: "/itineraries",
    secondaryCtaLabel: "Browse Itineraries",
    secondaryCtaHref: "/itineraries",
  },
  whereWeGo: {
    label: "Where we go",
    titleLine1: "Two countries,",
    titleItalic: "endless",
    titleLine2: "stories",
    brazil: {
      region: "South America",
      title: "Brazil",
      blurb: "Rio de Janeiro, São Paulo, Florianópolis, Salvador",
      href: "/itineraries",
    },
    australia: {
      region: "Oceania",
      title: "Australia",
      blurb: "Sydney, Melbourne, Gold Coast, Byron Bay",
      href: "/itineraries",
    },
  },
  featured: {
    label: "Curated for you",
    titleLine1: "Featured",
    titleItalic: "trip guides",
    viewAllLabel: "View all guides",
    viewAllHref: "/itineraries",
    items: [
      {
        title: "7-Day Rio & São Paulo Guide",
        description:
          "Preview Copacabana sunsets, São Paulo food stops, and the route details you can unlock in the full guide.",
        duration: "7 Days",
        price: "$29",
        gradient: "from-[#0c4a3a] via-[#1a6b4a] to-[#2d8a5e]",
        location: "Brazil",
        href: "/itineraries",
      },
      {
        title: "10-Day Australian Coast Guide",
        description:
          "Get a taste of Sydney Harbour, the Great Ocean Road, and the coastal notes inside the full guide.",
        duration: "10 Days",
        price: "$39",
        gradient: "from-[#8B5E3C] via-[#C1440E] to-[#d4764a]",
        location: "Australia",
        href: "/itineraries",
      },
      {
        title: "14-Day Brazil & Australia Guide",
        description:
          "Sample the two-country route, then unlock the complete plan with hidden gems and local favourites.",
        duration: "14 Days",
        price: "$49",
        gradient: "from-[#1a3a5c] via-[#2d5a8a] to-[#4DACD4]",
        location: "Both",
        href: "/itineraries",
      },
    ],
  },
  ugc: {
    label: "UGC portfolio",
    titleLine1: "Content made for",
    titleItalic: "brands",
    viewAllLabel: "View UGC",
    viewAllHref: "/ugc",
    items: [
      { tag: "UGC", title: "Hotel room reveal with natural voiceover", gradient: "from-[#0a3d2e] to-[#1a6b4a]", aspect: "aspect-[3/4]", href: "/ugc" },
      { tag: "Brand", title: "Travel essential packed into a real day", gradient: "from-[#C1440E] to-[#d4764a]", aspect: "aspect-[4/5]", href: "/ugc" },
      { tag: "Australia", title: "Coastal experience reel from Bondi", gradient: "from-[#1a3a5c] to-[#4DACD4]", aspect: "aspect-[3/4]", href: "/ugc" },
      { tag: "Food", title: "Restaurant story in São Paulo", gradient: "from-[#8B5E3C] to-[#C1440E]", aspect: "aspect-[4/3]", href: "/ugc" },
      { tag: "Tourism", title: "Destination guide with creator-led tips", gradient: "from-[#2d5a8a] to-[#0a3d2e]", aspect: "aspect-[3/4]", href: "/ugc" },
      { tag: "Lifestyle", title: "Road trip content for travel brands", gradient: "from-[#C1440E] to-[#d4764a]", aspect: "aspect-[4/5]", href: "/ugc" },
    ],
  },
  partnerships: {
    label: "Potential partnerships",
    titleLine1: "Ways we can",
    titleItalic: "work together",
    workWithLabel: "Work with me",
    workWithHref: "/about",
    services: [
      {
        name: "UGC Video Packages",
        description: "Short-form videos, hooks, voiceovers, and product-in-use storytelling.",
        gradient: "from-[#e8ddd0] to-[#d4c4b0]",
      },
      {
        name: "Hotel & Stay Features",
        description: "Room tours, experience reels, amenities, and destination-led stay content.",
        gradient: "from-[#d4c4b0] to-[#c4b4a0]",
      },
      {
        name: "Tourism Partnerships",
        description: "Brazil and Australia guides, local recommendations, and itinerary content.",
        gradient: "from-[#c4d4d0] to-[#a4c4c0]",
      },
      {
        name: "Travel Brand Content",
        description: "Lifestyle photos and reels that show products in real travel moments.",
        gradient: "from-[#d0c8c0] to-[#c0b8b0]",
      },
    ],
  },
  testimonial: {
    quote:
      "Vanessa's guide made our Brazil trip absolutely magical. The preview gave us confidence, and the full guide had every detail we needed.",
    attribution: "Sarah & Mike - 7 Day Brazil Trip",
  },
  finalCta: {
    label: "Start planning",
    titleLine1: "Find your",
    titleItalic: "next guide",
    body: "Preview Brazil and Australia guides, compare routes, and unlock the full plan when you find the trip that fits.",
    ctaLabel: "Explore Trip Guides",
    ctaHref: "/itineraries",
  },
};

export function mergeWithHomePageDefaults(
  fromDb: HomePageSettings | null
): HomePageSettings {
  if (!fromDb) return DEFAULT_HOME_PAGE_SETTINGS;
  return deepMerge(
    DEFAULT_HOME_PAGE_SETTINGS,
    fromDb
  ) as HomePageSettings;
}

function deepMerge(base: unknown, patch: unknown): unknown {
  if (patch === undefined) return base;
  if (patch === null) return base;
  if (Array.isArray(patch)) return patch;
  if (
    typeof patch === "object" &&
    typeof base === "object" &&
    base !== null &&
    !Array.isArray(base)
  ) {
    const b = base as Record<string, unknown>;
    const p = patch as Record<string, unknown>;
    const keys = new Set([...Object.keys(b), ...Object.keys(p)]);
    const out: Record<string, unknown> = {};
    for (const k of keys) {
      if (k in p) {
        out[k] = k in b ? deepMerge(b[k], p[k]) : p[k];
      } else {
        out[k] = b[k];
      }
    }
    return out;
  }
  return patch;
}
