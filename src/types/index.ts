export interface Itinerary {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  duration: number;
  destinations: string[];
  highlights: string[];
  coverImage: string;
  gallery: string[];
  days: ItineraryDay[];
  included: string[];
  excluded: string[];
  published: boolean;
  createdAt: Date;
}

export interface ItineraryDay {
  day: number;
  title: string;
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

export type HeroMode = "gradient" | "image" | "video";

export interface HomePageHero {
  mode: HeroMode;
  mediaUrl: string;
  eyebrow: string;
  titleLine1: string;
  titleItalic: string;
  titleLine2: string;
  subtitle: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
}

export interface HomeDestinationCard {
  region: string;
  title: string;
  blurb: string;
  href: string;
}

export interface HomeWhereWeGo {
  label: string;
  titleLine1: string;
  titleItalic: string;
  titleLine2: string;
  brazil: HomeDestinationCard;
  australia: HomeDestinationCard;
}

export interface HomeFeaturedItinerary {
  title: string;
  description: string;
  duration: string;
  price: string;
  gradient: string;
  location: string;
  href: string;
}

export interface HomeFeaturedBlock {
  label: string;
  titleLine1: string;
  titleItalic: string;
  viewAllLabel: string;
  viewAllHref: string;
  items: HomeFeaturedItinerary[];
}

export interface HomeUgcCard {
  tag: string;
  title: string;
  gradient: string;
  aspect: string;
  href: string;
}

export interface HomeUgcBlock {
  label: string;
  titleLine1: string;
  titleItalic: string;
  viewAllLabel: string;
  viewAllHref: string;
  items: HomeUgcCard[];
}

export interface HomePartnershipService {
  name: string;
  description: string;
  gradient: string;
}

export interface HomePartnershipsBlock {
  label: string;
  titleLine1: string;
  titleItalic: string;
  workWithLabel: string;
  workWithHref: string;
  services: HomePartnershipService[];
}

export interface HomeTestimonial {
  quote: string;
  attribution: string;
}

export interface HomeFinalCta {
  label: string;
  titleLine1: string;
  titleItalic: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface HomePageSettings {
  hero: HomePageHero;
  whereWeGo: HomeWhereWeGo;
  featured: HomeFeaturedBlock;
  ugc: HomeUgcBlock;
  partnerships: HomePartnershipsBlock;
  testimonial: HomeTestimonial;
  finalCta: HomeFinalCta;
}
