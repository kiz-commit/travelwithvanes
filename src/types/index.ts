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
