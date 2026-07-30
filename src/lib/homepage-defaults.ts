import type { HomePageSettings } from "@/types";

export const DEFAULT_HOME_PAGE_SETTINGS: HomePageSettings = {
  hero: {
    mode: "gradient",
    mediaUrl: "",
    videoUrl: "",
    title: "Vanessa creates content that feels already saved.",
    subtitleMobile:
      "Brazil-born, Australia-connected creator making native UGC for hotels, tourism, travel essentials, and lifestyle brands.",
    subtitleDesktop:
      "Brazil-born, Australia-connected creator making native UGC for hotels, tourism boards, travel essentials, food, and lifestyle brands that need warm, practical, scroll-stopping proof.",
    primaryCtaLabel: "See the work",
    primaryCtaHref: "/ugc",
    secondaryCtaLabel: "View packages",
    secondaryCtaHref: "/ugc#pricing",
    profileName: "Vanessa",
    profileRole: "Lifestyle UGC creator",
    nicheTags: ["Hotels", "Tourism", "Products", "Lifestyle"],
    hookCardLabel: "Hook",
    hookCardText: "I wish I knew this before booking...",
    placeholderBadge: "Brazil POV",
    placeholderBrand: "TravelwithVanes",
    placeholderHeadline: "real travel, clean edits, useful angles",
  },
  stats: [
    { value: "2", label: "home markets" },
    { value: "48h", label: "hook concepts" },
    { value: "9:16", label: "short-form native" },
    { value: "4+", label: "content formats" },
  ],
  ugc: {
    label: "Selected concepts",
    title: "A portfolio that brands can scan in seconds.",
    viewAllLabel: "Full media kit",
    viewAllHref: "/ugc",
    items: [
      {
        tag: "UGC",
        title: "Hotel room reveal with natural voiceover",
        gradient: "from-[#071f3d] to-[#0f4c81]",
        aspect: "aspect-[3/4]",
        href: "/ugc",
      },
      {
        tag: "Brand",
        title: "Travel essential packed into a real day",
        gradient: "from-[#2563eb] to-[#38bdf8]",
        aspect: "aspect-[4/5]",
        href: "/ugc",
      },
      {
        tag: "Australia",
        title: "Coastal experience reel from Bondi",
        gradient: "from-[#123b6d] to-[#38bdf8]",
        aspect: "aspect-[3/4]",
        href: "/ugc",
      },
      {
        tag: "Food",
        title: "Restaurant story in São Paulo",
        gradient: "from-[#31516f] to-[#0f4c81]",
        aspect: "aspect-[4/3]",
        href: "/ugc",
      },
      {
        tag: "Tourism",
        title: "Destination guide with creator-led tips",
        gradient: "from-[#2563eb] to-[#0f766e]",
        aspect: "aspect-[3/4]",
        href: "/ugc",
      },
      {
        tag: "Lifestyle",
        title: "Road trip content for travel brands",
        gradient: "from-[#0f4c81] to-[#38bdf8]",
        aspect: "aspect-[4/5]",
        href: "/ugc",
      },
    ],
    fallbackTiles: [
      {
        tag: "Hotel stay",
        title: "First-person room reveal with voiceover",
        metric: "Room tour / amenities / experience",
        className: "bg-[#f97316]",
        height: "h-80",
      },
      {
        tag: "Travel product",
        title: "Pack-with-me product placement",
        metric: "Problem / demo / lifestyle proof",
        className: "bg-[#0f766e]",
        height: "h-64",
      },
      {
        tag: "Destination",
        title: "Brazil and Australia local POV reels",
        metric: "Narrative hook / saved tips / CTA",
        className: "bg-[#2563eb]",
        height: "h-72",
      },
      {
        tag: "Food & lifestyle",
        title: "Day-in-the-life brand integration",
        metric: "Natural use / story / conversion angle",
        className: "bg-[#eab308]",
        height: "h-60",
      },
    ],
  },
  services: {
    label: "What brands get",
    title: "Useful content, not just pretty clips.",
    body: "The best UGC portfolios make buying easy: clear niches, obvious formats, visible taste, and a contact path with no hunting.",
    items: [
      {
        icon: "clapperboard",
        title: "UGC video packages",
        copy: "Short-form videos with hooks, scripts, raw clips, captions, voiceover, and usage-ready edits.",
      },
      {
        icon: "camera",
        title: "Lifestyle photo sets",
        copy: "Natural product and travel imagery for paid social, web, email, and creator whitelisting.",
      },
      {
        icon: "plane",
        title: "Travel brand storytelling",
        copy: "Hotel, tourism, experience, and travel essential content built around real movement.",
      },
      {
        icon: "sparkles",
        title: "Creative strategy",
        copy: "Hook angles, content briefs, shot lists, and repeatable concepts for campaign testing.",
      },
    ],
  },
  travel: {
    label: "Still keeping the travel engine",
    title: "Guides and UGC can work together.",
    body: "The audience-facing travel content stays alive as proof of niche, taste, and authority. Brands see creator fit; travelers still get itineraries, recommendations, and destination notes.",
    links: [
      { label: "Brazil itineraries", href: "/itineraries" },
      { label: "Australia travel notes", href: "/itineraries" },
      { label: "UGC portfolio", href: "/ugc" },
      { label: "Destination guides", href: "/itineraries" },
    ],
  },
  testimonial: {
    quote:
      "Creator-led travel content works best when it feels like a trusted recommendation, not a scripted ad.",
    chips: ["Brazil", "Australia", "English + Portuguese perspective"],
  },
  finalCta: {
    label: "Brand enquiries",
    title: "Need travel UGC that already feels native?",
    body: "Send the product, stay, destination, or campaign goal. I will come back with angles, deliverables, and next steps.",
    ctaLabel: "hello@travelwithvanes.com",
    ctaHref: "mailto:hello@travelwithvanes.com",
  },
  hookMoment: {
    line1: "This is a hook",
    line2: "Have I got your attention?",
    line3: "Work with me.",
    backgroundVideoUrl: "/hook-moment-bg.mp4",
  },
};

const STALE_HERO_CTA_LABELS =
  /trip guide|itinerar|preview trip|browse itiner/i;

function isStaleHeroCta(href: string, label: string): boolean {
  return href.startsWith("/itineraries") || STALE_HERO_CTA_LABELS.test(label);
}

function normalizeHeroCtas(
  hero: HomePageSettings["hero"]
): HomePageSettings["hero"] {
  const defaults = DEFAULT_HOME_PAGE_SETTINGS.hero;
  return {
    ...hero,
    ...(isStaleHeroCta(hero.primaryCtaHref, hero.primaryCtaLabel)
      ? {
          primaryCtaLabel: defaults.primaryCtaLabel,
          primaryCtaHref: defaults.primaryCtaHref,
        }
      : {}),
    ...(isStaleHeroCta(hero.secondaryCtaHref, hero.secondaryCtaLabel)
      ? {
          secondaryCtaLabel: defaults.secondaryCtaLabel,
          secondaryCtaHref: defaults.secondaryCtaHref,
        }
      : {}),
  };
}

export function mergeWithHomePageDefaults(
  fromDb: HomePageSettings | null
): HomePageSettings {
  if (!fromDb) return structuredClone(DEFAULT_HOME_PAGE_SETTINGS);
  const base = structuredClone(DEFAULT_HOME_PAGE_SETTINGS);
  const patch = fromDb as Partial<HomePageSettings> & Record<string, unknown>;
  return {
    hero: normalizeHeroCtas(
      deepMerge(base.hero, patch.hero) as HomePageSettings["hero"]
    ),
    stats: Array.isArray(patch.stats) ? patch.stats : base.stats,
    ugc: deepMerge(base.ugc, patch.ugc) as HomePageSettings["ugc"],
    services: deepMerge(
      base.services,
      patch.services
    ) as HomePageSettings["services"],
    travel: deepMerge(base.travel, patch.travel) as HomePageSettings["travel"],
    testimonial: deepMerge(
      base.testimonial,
      patch.testimonial
    ) as HomePageSettings["testimonial"],
    finalCta: deepMerge(
      base.finalCta,
      patch.finalCta
    ) as HomePageSettings["finalCta"],
    hookMoment: deepMerge(
      base.hookMoment,
      patch.hookMoment
    ) as HomePageSettings["hookMoment"],
  };
}

function deepMerge(base: unknown, patch: unknown): unknown {
  if (patch === undefined || patch === null) return base;
  if (Array.isArray(patch)) return patch;
  if (
    typeof patch === "object" &&
    typeof base === "object" &&
    base !== null &&
    !Array.isArray(base)
  ) {
    const b = base as Record<string, unknown>;
    const p = patch as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(b)) {
      out[k] = k in p ? deepMerge(b[k], p[k]) : b[k];
    }
    return out;
  }
  return patch;
}
