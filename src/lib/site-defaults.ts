import type { AboutPageSettings, SiteSettings } from "@/types";

export const DEFAULT_ABOUT_PAGE_SETTINGS: AboutPageSettings = {
  heroTitle: "Oi, I'm Vanessa.",
  name: "Vanessa",
  roles: "Trip planner · Travel creator · Brazil & Australia",
  avatarUrl: "",
  bio: [
    "Hey! I'm Vanessa, most people call me Vanes. I'm a travel creator who splits her time between Brazil and Australia, two places that feel like home in completely different ways.",
    "I started Travelwithvanes to share the kind of travel advice I always look for: where to go, what is worth your time, how to plan without overthinking it, and the little local details that make a trip feel special. Now I also plan trips to Brazil for people who want all of that handled for them.",
    "When I'm not filming or building guides, you'll find me hunting for the best acai bowl in Rio, saving cafe spots in Melbourne, or planning the next beach escape.",
  ],
  socials: [
    { label: "Instagram", href: "#" },
    { label: "YouTube", href: "#" },
    { label: "TikTok", href: "#" },
  ],
  stats: [
    { label: "Home bases", value: "2" },
    { label: "Focus", value: "BR + AU" },
    { label: "Style", value: "Local" },
  ],
  highlightsLabel: "About me",
  highlightsTitle: "A little more about me",
  highlightsIntro:
    "This space is part travel diary, part practical guide. It is where I collect my favourite places, honest recommendations, and the small details I wish I knew before visiting.",
  highlights: [
    "Brazil is where I find colour, energy, beach days, and food spots I always want to share.",
    "Australia is where I slow down into coastal walks, coffee culture, road trips, and laid-back weekends.",
    "I love turning real travel moments into practical guides, honest tips, and easy inspiration.",
    "My content is for people who want trips that feel beautiful, useful, and a little more local.",
  ],
  highlightsOutro:
    "Follow along for Brazil and Australia travel ideas, guide previews, behind-the-scenes moments, and the occasional personal favourite.",
  highlightsCtaLabel: "See signature trips",
  highlightsCtaHref: "/trips",
  ctaTitle: "Let's plan your Brazil.",
  ctaBody:
    "Tell me where you're dreaming of and how you like to travel. I'll come back with a route, the right stays, and an honest quote.",
  ctaLabel: "Plan my trip",
  ctaHref: "/plan",
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  email: "hello@travelwithvanes.com",
  footerTagline: "It's all about the Journey",
  footerBlurb:
    "Tailored Rio and Brazil trips, plus self-guided guides for South America and Australia — planned by Vanessa, who grew up in Brazil.",
  socials: [
    { label: "Instagram", href: "#" },
    { label: "YouTube", href: "#" },
    { label: "TikTok", href: "#" },
  ],
};

export function mergeWithAboutDefaults(
  fromDb: AboutPageSettings | null
): AboutPageSettings {
  if (!fromDb) return structuredClone(DEFAULT_ABOUT_PAGE_SETTINGS);
  const base = structuredClone(DEFAULT_ABOUT_PAGE_SETTINGS);
  const patch = fromDb as Partial<AboutPageSettings>;
  return {
    ...base,
    ...patch,
    bio: Array.isArray(patch.bio) ? patch.bio : base.bio,
    socials: Array.isArray(patch.socials) ? patch.socials : base.socials,
    stats: Array.isArray(patch.stats) ? patch.stats : base.stats,
    highlights: Array.isArray(patch.highlights)
      ? patch.highlights
      : base.highlights,
  };
}

const LEGACY_FOOTER_BLURBS = [
  "Guides from real trips, UGC that funds the next flight, and a course on building a life that can actually go.",
];

/** Social links still pointing at "#" are placeholders — hide them on the site. */
export function realSocialLinks<T extends { href: string }>(links: T[]): T[] {
  return links.filter((link) => /^(https?:|mailto:)/.test(link.href.trim()));
}

export function mergeWithSiteDefaults(
  fromDb: SiteSettings | null
): SiteSettings {
  if (!fromDb) return structuredClone(DEFAULT_SITE_SETTINGS);
  const base = structuredClone(DEFAULT_SITE_SETTINGS);
  const patch = fromDb as Partial<SiteSettings>;
  const merged = {
    ...base,
    ...patch,
    socials: Array.isArray(patch.socials) ? patch.socials : base.socials,
  };
  if (LEGACY_FOOTER_BLURBS.includes(merged.footerBlurb)) merged.footerBlurb = base.footerBlurb;
  return merged;
}
