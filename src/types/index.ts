export type ItineraryBlockType =
  | "day"
  | "morning"
  | "afternoon"
  | "evening"
  | "night"
  | "time"
  | "custom";

export interface Itinerary {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  duration: number;
  destinations: string[];
  /** Rich text (Tiptap HTML). */
  highlights: string;
  coverImage: string;
  gallery: string[];
  days: ItineraryDay[];
  /** Rich text (Tiptap HTML). */
  included: string;
  /** Rich text (Tiptap HTML). */
  excluded: string;
  published: boolean;
  createdAt: Date;
}

export interface ItineraryDay {
  /** Order in the timeline (1, 2, 3, …), shown in the badge when `blockType` is `day`. */
  day: number;
  /**
   * How this block appears in the public timeline. Use "day" for multi-day plans,
   * or time-of-day / time range / custom for single-day or hourly breakdowns.
   */
  blockType: ItineraryBlockType;
  /** When `blockType` is "time" (e.g. "9:00 am – 12:00 pm"). */
  timeRange?: string;
  /** When `blockType` is "custom" — short text in the timeline badge. */
  customLabel?: string;
  /** Rich text (Tiptap HTML). */
  title: string;
  /** Rich text (Tiptap HTML). */
  description: string;
  image?: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stripeProductId?: string;
  published: boolean;
  createdAt: Date;
}

export interface UGCPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  mediaUrls: string[];
  tags: string[];
  coverImage: string;
  publishedAt: Date;
}

export type MediaAssetKind = "image" | "video";

export interface MediaAsset {
  id: string;
  url: string;
  storagePath: string;
  filename: string;
  mimeType: string;
  kind: MediaAssetKind;
  sizeBytes: number;
  label: string;
  uploadedAt: Date;
}

export interface Order {
  id: string;
  stripeSessionId: string;
  customerEmail: string;
  itemType: "itinerary" | "product";
  itemId: string;
  itemTitle: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  createdAt: Date;
}

export type HeroMode = "gradient" | "image" | "video" | "both";

export type HomeServiceIcon = "clapperboard" | "camera" | "plane" | "sparkles";

export interface HomePageHero {
  mode: HeroMode;
  /** Image URL for image/both modes, or video URL for video mode. */
  mediaUrl: string;
  /** Video URL when mode is "both" (play on click over the poster image). */
  videoUrl: string;
  title: string;
  subtitleMobile: string;
  subtitleDesktop: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  profileName: string;
  profileRole: string;
  nicheTags: string[];
  hookCardLabel: string;
  hookCardText: string;
  placeholderBadge: string;
  placeholderBrand: string;
  placeholderHeadline: string;
}

export interface HomeStat {
  value: string;
  label: string;
}

export interface HomeFallbackTile {
  tag: string;
  title: string;
  metric: string;
  /** Tailwind background class, e.g. bg-[#f97316] */
  className: string;
  /** Tailwind height class, e.g. h-80 */
  height: string;
}

export interface HomeUgcCard {
  tag: string;
  title: string;
  aspect: string;
  href: string;
  mediaUrl?: string;
  gradient?: string;
}

export interface HomeUgcBlock {
  label: string;
  title: string;
  viewAllLabel: string;
  viewAllHref: string;
  items: HomeUgcCard[];
  fallbackTiles: HomeFallbackTile[];
}

export interface HomeService {
  icon: HomeServiceIcon;
  title: string;
  copy: string;
}

export interface HomeServicesBlock {
  label: string;
  title: string;
  body: string;
  items: HomeService[];
}

export interface HomeGuideLink {
  label: string;
  href: string;
}

export interface HomeTravelBlock {
  label: string;
  title: string;
  body: string;
  links: HomeGuideLink[];
}

export interface HomeTestimonial {
  quote: string;
  chips: string[];
}

export interface HomeFinalCta {
  label: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface HomeHookMoment {
  line1: string;
  line2: string;
  line3: string;
  backgroundVideoUrl: string;
}

export interface HomePageSettings {
  hero: HomePageHero;
  stats: HomeStat[];
  ugc: HomeUgcBlock;
  services: HomeServicesBlock;
  travel: HomeTravelBlock;
  testimonial: HomeTestimonial;
  finalCta: HomeFinalCta;
  hookMoment: HomeHookMoment;
}

export interface AboutSocialLink {
  label: string;
  href: string;
}

export interface AboutPageSettings {
  heroTitle: string;
  name: string;
  roles: string;
  avatarUrl: string;
  bio: string[];
  socials: AboutSocialLink[];
  stats: HomeStat[];
  highlightsLabel: string;
  highlightsTitle: string;
  highlightsIntro: string;
  highlights: string[];
  highlightsOutro: string;
  highlightsCtaLabel: string;
  highlightsCtaHref: string;
  ctaTitle: string;
  ctaBody: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface SiteSettings {
  email: string;
  footerTagline: string;
  footerBlurb: string;
  socials: AboutSocialLink[];
}
