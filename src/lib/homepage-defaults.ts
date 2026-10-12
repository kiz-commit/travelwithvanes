import type { HomePageSettings } from "@/types";

export const DEFAULT_HOME_PAGE_SETTINGS: HomePageSettings = {
  hero: {
    mode: "gradient",
    mediaUrl: "",
    videoUrl: "",
    title: "Brazil, planned by a Brazilian.",
    subtitleMobile:
      "Tailored trips to Rio and beyond from Vanessa, who grew up there. Stays, transfers and local experiences, all sorted.",
    subtitleDesktop:
      "Tailored trips to Rio and beyond from Vanessa, who grew up there. The right neighbourhoods, stays, transfers and local experiences — all sorted before you land.",
    primaryCtaLabel: "Plan a trip",
    primaryCtaHref: "/plan",
    secondaryCtaLabel: "Browse trips",
    secondaryCtaHref: "/trips",
    profileName: "Vanessa",
    profileRole: "Brazilian trip planner & travel creator",
    nicheTags: ["Rio de Janeiro", "Brazil", "South America", "Australia"],
    hookCardLabel: "Now planning",
    hookCardText: "Rio in the dry season — May to October.",
    placeholderBadge: "Sugarloaf Mountain, Rio de Janeiro",
    placeholderBrand: "Travelwithvanes",
    placeholderHeadline: "Brazil, the way locals love it",
  },
  stats: [
    { value: "Brazilian", label: "born and raised" },
    { value: "PT + EN", label: "fluent in both" },
    { value: "1:1", label: "every trip personally planned" },
    { value: "WhatsApp", label: "support while you travel" },
  ],
  ugc: {
    label: "Creator work",
    title: "Travel content that feels lived in.",
    viewAllLabel: "See the work",
    viewAllHref: "/ugc",
    items: [],
    fallbackTiles: [
      { tag: "Hotel stay", title: "First-person room reveal with voiceover", metric: "Hotels and pousadas", className: "bg-clay", height: "h-80" },
      { tag: "Destination", title: "Local POV reels from Brazil and Australia", metric: "Tourism and experiences", className: "bg-ocean", height: "h-72" },
    ],
  },
  services: {
    label: "Work with me",
    title: "Creator work for travel brands.",
    body: "Hotels, tourism boards and travel brands get native, creator-led content from someone who actually travels the routes.",
    items: [
      { icon: "clapperboard", title: "UGC video packages", copy: "Short-form videos with hooks, scripts, raw clips, captions and usage-ready edits." },
      { icon: "camera", title: "Lifestyle photo sets", copy: "Natural travel and product imagery for social, web and email." },
      { icon: "plane", title: "Travel storytelling", copy: "Hotel, tourism and experience content built around real trips." },
      { icon: "sparkles", title: "Creative strategy", copy: "Hook angles, briefs and shot lists for campaign testing." },
    ],
  },
  travel: {
    label: "Self-guided trip guides",
    title: "Rather go it alone?",
    body: "Day-by-day guides written from real trips — Brazil first, with Argentina, Peru, Chile, Colombia and Australia alongside. Read the first days free, then unlock the full plan.",
    ctaLabel: "Browse all guides",
    ctaHref: "/itineraries",
    links: [
      { label: "Brazil guides", href: "/itineraries?country=Brazil" },
      { label: "South America guides", href: "/itineraries" },
      { label: "Australia guides", href: "/itineraries?country=Australia" },
      { label: "Meet Vanessa", href: "/about" },
    ],
  },
  courses: {
    label: "Courses",
    title: "Build a course worth buying — while taking this one.",
    body: "The Course Course is a practical build sprint for turning something useful you know into a focused course you can test, sell, and improve.",
    ctaLabel: "See the course",
    ctaHref: "/courses",
    highlights: [
      { title: "One useful output per lesson", copy: "Build your idea, student, promise, curriculum, offer, and launch plan as you learn." },
      { title: "Practical, not guru talk", copy: "Test demand first, build the smallest version that works, then improve it with real feedback." },
      { title: "A course business, not content", copy: "Finish with a focused product and a simple system for finding and helping customers." },
    ],
  },
  testimonial: {
    quote:
      "I want you to leave Brazil feeling like you were let in on something — not like you followed a checklist.",
    chips: ["Rio de Janeiro", "Brazil", "South America", "Australia"],
  },
  finalCta: {
    label: "Plan with Vanessa",
    title: "Let's plan your Brazil.",
    body: "Tell me where you're dreaming of and how you like to travel. I'll come back with a route, the right stays, and an honest quote.",
    ctaLabel: "Start planning",
    ctaHref: "/plan",
  },
  hookMoment: {
    line1: "Content people",
    line2: "can feel.",
    line3: "Work with me.",
    backgroundVideoUrl: "/hook-moment-bg.mp4",
  },
};

const BLOG_ERA_HOME_PAGE_SETTINGS: HomePageSettings = {
  hero: {
    mode: "gradient",
    mediaUrl: "",
    videoUrl: "",
    title: "I travel because I love it.",
    subtitleMobile:
      "Travelling is the only thing you spend money on and somehow end up richer.\n\nEvery time we travel, we transform a little. Discovering new places, connecting with different cultures and hearing stories from around the world gives us new perspectives on life, history and ourselves.",
    subtitleDesktop:
      "Travelling is the only thing you spend money on and somehow end up richer.\n\nEvery time we travel, we transform a little. Discovering new places, connecting with different cultures and hearing stories from around the world gives us new perspectives on life, history and ourselves.",
    primaryCtaLabel: "Explore the guides",
    primaryCtaHref: "/itineraries",
    secondaryCtaLabel: "How I fund it",
    secondaryCtaHref: "/ugc",
    profileName: "Vanessa",
    profileRole: "Traveler · creator · always packing",
    nicheTags: ["Travel", "Guides", "UGC", "Courses"],
    hookCardLabel: "Now",
    hookCardText: "Passport out. Next stop TBD.",
    placeholderBadge: "Brazil POV",
    placeholderBrand: "TravelwithVanes",
    placeholderHeadline: "sun-bleached notes from the road",
  },
  stats: [
    { value: "2", label: "home bases" },
    { value: "BR + AU", label: "always in motion" },
    { value: "Guides", label: "from real trips" },
    { value: "UGC", label: "funds the flights" },
  ],
  ugc: {
    label: "How I fund it",
    title: "UGC is how the trips stay possible.",
    viewAllLabel: "See the work",
    viewAllHref: "/ugc",
    items: [
      {
        tag: "UGC",
        title: "Hotel room reveal with natural voiceover",
        gradient: "from-espresso to-cobalt",
        aspect: "aspect-[3/4]",
        href: "/ugc",
      },
      {
        tag: "Brand",
        title: "Travel essential packed into a real day",
        gradient: "from-cobalt to-olive",
        aspect: "aspect-[4/5]",
        href: "/ugc",
      },
      {
        tag: "Australia",
        title: "Coastal experience reel from Bondi",
        gradient: "from-cobalt to-sun",
        aspect: "aspect-[3/4]",
        href: "/ugc",
      },
      {
        tag: "Food",
        title: "Restaurant story in São Paulo",
        gradient: "from-olive to-cobalt",
        aspect: "aspect-[4/3]",
        href: "/ugc",
      },
      {
        tag: "Tourism",
        title: "Destination guide with creator-led tips",
        gradient: "from-cobalt to-olive",
        aspect: "aspect-[3/4]",
        href: "/ugc",
      },
      {
        tag: "Lifestyle",
        title: "Road trip content for travel brands",
        gradient: "from-clay to-cobalt",
        aspect: "aspect-[4/5]",
        href: "/ugc",
      },
    ],
    fallbackTiles: [
      {
        tag: "Hotel stay",
        title: "First-person room reveal with voiceover",
        metric: "The kind of work that funds the next booking",
        className: "bg-clay",
        height: "h-80",
      },
      {
        tag: "Travel product",
        title: "Pack-with-me product placement",
        metric: "Real use, on real trips",
        className: "bg-olive",
        height: "h-64",
      },
      {
        tag: "Destination",
        title: "Brazil and Australia local POV reels",
        metric: "Proof of the life, not just the pitch",
        className: "bg-ocean",
        height: "h-72",
      },
      {
        tag: "Food & lifestyle",
        title: "Day-in-the-life brand integration",
        metric: "Natural, useful, and still very me",
        className: "bg-ochre",
        height: "h-60",
      },
    ],
  },
  services: {
    label: "Work with me",
    title: "Brands help keep the suitcase packed.",
    body: "Hotels, tourism boards, travel essentials, and lifestyle brands get native UGC. I get to keep going. That is the deal.",
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
    label: "Travel",
    title: "The going is the point.",
    body: "I do not travel as a content strategy. I travel because it makes me feel alive — Brazil colour, Australian coast, and every extra stop worth taking. The guides exist because that love came first.",
    ctaLabel: "Browse the guides",
    ctaHref: "/itineraries",
    links: [
      { label: "Brazil itineraries", href: "/itineraries" },
      { label: "Australia travel notes", href: "/itineraries" },
      { label: "All trip guides", href: "/itineraries" },
      { label: "The story behind the trips", href: "/about" },
    ],
  },
  courses: {
    label: "Courses",
    title: "Build a course worth buying — while taking this one.",
    body: "The Course Course is a practical build sprint for turning something useful you know into a focused course you can test, sell, and improve. Every lesson moves your own product forward.",
    ctaLabel: "See the course",
    ctaHref: "/courses",
    highlights: [
      {
        title: "One useful output per lesson",
        copy: "Build your idea, student, promise, curriculum, offer, and launch plan as you learn.",
      },
      {
        title: "Practical, not guru talk",
        copy: "Test demand first, build the smallest version that works, then improve it with real feedback.",
      },
      {
        title: "A course business, not content",
        copy: "Finish with a focused product and a simple system for finding and helping customers.",
      },
    ],
  },
  testimonial: {
    quote:
      "The best travel content still starts with actually wanting to be there.",
    chips: ["Brazil", "Australia", "Guides", "UGC", "Courses"],
  },
  finalCta: {
    label: "Three ways in",
    title: "Travel with me — or learn how to fund your own.",
    body: "Guides for the trip, UGC for the brands, a course for the freedom. Same suitcase, three doors.",
    ctaLabel: "Explore the guides",
    ctaHref: "/itineraries",
  },
  hookMoment: {
    line1: "Content people",
    line2: "can feel.",
    line3: "Work with me.",
    backgroundVideoUrl: "/hook-moment-bg.mp4",
  },
};

/** UGC-era homepage copy, used to upgrade unchanged Firestore fields. */
const PREVIOUS_HOME_PAGE_SETTINGS: Pick<
  HomePageSettings,
  | "hero"
  | "stats"
  | "ugc"
  | "services"
  | "travel"
  | "testimonial"
  | "finalCta"
> = {
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
    items: [],
    fallbackTiles: [
      {
        tag: "Hotel stay",
        title: "First-person room reveal with voiceover",
        metric: "Room tour / amenities / experience",
        className: "bg-clay",
        height: "h-80",
      },
      {
        tag: "Travel product",
        title: "Pack-with-me product placement",
        metric: "Problem / demo / lifestyle proof",
        className: "bg-olive",
        height: "h-64",
      },
      {
        tag: "Destination",
        title: "Brazil and Australia local POV reels",
        metric: "Narrative hook / saved tips / CTA",
        className: "bg-cobalt",
        height: "h-72",
      },
      {
        tag: "Food & lifestyle",
        title: "Day-in-the-life brand integration",
        metric: "Natural use / story / conversion angle",
        className: "bg-sun",
        height: "h-60",
      },
    ],
  },
  services: {
    label: "What brands get",
    title: "Useful content, not just pretty clips.",
    body: "The best UGC portfolios make buying easy: clear niches, obvious formats, visible taste, and a contact path with no hunting.",
    items: [],
  },
  travel: {
    label: "Still keeping the travel engine",
    title: "Guides and UGC can work together.",
    body: "The audience-facing travel content stays alive as proof of niche, taste, and authority. Brands see creator fit; travelers still get itineraries, recommendations, and destination notes.",
    ctaLabel: "",
    ctaHref: "",
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
};

/**
 * Copy that shipped as a default in an earlier version of the site. If a saved
 * Firestore value still equals one of these, it was never customised, so we
 * upgrade it to the current default. Anything Vanessa edited is left alone.
 */
const LEGACY_VERSIONS: unknown[] = [PREVIOUS_HOME_PAGE_SETTINGS, BLOG_ERA_HOME_PAGE_SETTINGS];

/** Extra one-off legacy strings by path (copy that lived in older builds). */
const LEGACY_STRINGS: Record<string, string[]> = {
  "hero.subtitleMobile": [
    "Brazil-born, Australia-connected, always packing. Honest guides from the road, UGC that funds the next flight, and a course on building a life that can actually go.",
  ],
  "hero.subtitleDesktop": [
    "Brazil-born, Australia-connected, always packing. Honest guides from the road. UGC that funds the next flight. A course on building a life that can actually go.",
  ],
  "testimonial.quote": [
    "Vanessa's guide made our Brazil trip absolutely magical. The preview gave us confidence, and the full guide had every detail we needed.",
  ],
  "travel.title": ["Guides and UGC can work together."],
  "ugc.viewAllLabel": ["View UGC"],
  "ugc.label": ["UGC portfolio"],
  "finalCta.label": ["Start planning"],
  "finalCta.body": [
    "Preview Brazil and Australia guides, compare routes, and unlock the full plan when you find the trip that fits.",
  ],
  "finalCta.ctaLabel": ["Explore Trip Guides"],
  "hookMoment.line1": [],
};

function valueAt(source: unknown, path: string[]): unknown {
  return path.reduce<unknown>(
    (node, key) => (node && typeof node === "object" ? (node as Record<string, unknown>)[key] : undefined),
    source
  );
}

/** JSON with sorted keys — Firestore doesn't preserve object key order. */
function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => a.localeCompare(b));
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`).join(",")}}`;
  }
  return JSON.stringify(value) ?? "undefined";
}

function isLegacy(value: unknown, path: string[]): boolean {
  if (value === undefined) return false;
  const serialized = stableStringify(value);
  if (LEGACY_VERSIONS.some((version) => stableStringify(valueAt(version, path)) === serialized)) {
    return true;
  }
  return typeof value === "string" && (LEGACY_STRINGS[path.join(".")] ?? []).includes(value);
}

/** Never migrate media or links Vanessa set herself. */
const KEEP_PATHS = new Set(["hero.mode", "hero.mediaUrl", "hero.videoUrl", "hookMoment.backgroundVideoUrl", "ugc.items"]);

function migrateNode(current: unknown, next: unknown, path: string[]): unknown {
  if (KEEP_PATHS.has(path.join("."))) return current;
  if (Array.isArray(next) || typeof next !== "object" || next === null) {
    return isLegacy(current, path) ? structuredClone(next) : current;
  }
  if (typeof current !== "object" || current === null || Array.isArray(current)) return current;
  const out: Record<string, unknown> = { ...(current as Record<string, unknown>) };
  for (const key of Object.keys(next as Record<string, unknown>)) {
    out[key] = migrateNode(out[key], (next as Record<string, unknown>)[key], [...path, key]);
  }
  return out;
}

function migrateHomePageCopy(settings: HomePageSettings): HomePageSettings {
  return migrateNode(settings, DEFAULT_HOME_PAGE_SETTINGS, []) as HomePageSettings;
}

export function mergeWithHomePageDefaults(
  fromDb: HomePageSettings | null
): HomePageSettings {
  if (!fromDb) return structuredClone(DEFAULT_HOME_PAGE_SETTINGS);
  const base = structuredClone(DEFAULT_HOME_PAGE_SETTINGS);
  const patch = fromDb as Partial<HomePageSettings> & Record<string, unknown>;
  const merged: HomePageSettings = {
    hero: deepMerge(base.hero, patch.hero) as HomePageSettings["hero"],
    stats: Array.isArray(patch.stats) ? patch.stats : base.stats,
    ugc: deepMerge(base.ugc, patch.ugc) as HomePageSettings["ugc"],
    services: deepMerge(
      base.services,
      patch.services
    ) as HomePageSettings["services"],
    travel: deepMerge(base.travel, patch.travel) as HomePageSettings["travel"],
    courses: deepMerge(
      base.courses,
      patch.courses
    ) as HomePageSettings["courses"],
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
  return migrateHomePageCopy(merged);
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
