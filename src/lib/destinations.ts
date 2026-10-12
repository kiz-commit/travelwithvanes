/**
 * Countries the site covers. Guides (itineraries) and signature trips both
 * reference a country by its `name`, so adding a new destination is:
 *   1. add it here, 2. set `country` on the guide/trip in the admin.
 */

export type DestinationRegion = "South America" | "Australia & Pacific" | "Elsewhere";

export interface Destination {
  slug: string;
  name: string;
  region: DestinationRegion;
  /** Short line for cards. */
  tagline: string;
  image: string;
  /** `home` = Vanessa's speciality (Brazil). */
  focus?: "home";
}

/** Unsplash (free licence) image helper — swap for your own photos any time. */
export function unsplash(id: string, width = 1600): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=75`;
}

export const DESTINATIONS: Destination[] = [
  {
    slug: "brazil",
    name: "Brazil",
    region: "South America",
    tagline: "Rio, the green coast, Bahia and beyond — Vanessa's home.",
    image: unsplash("photo-1518639192441-8fce0a366e2e"),
    focus: "home",
  },
  {
    slug: "argentina",
    name: "Argentina",
    region: "South America",
    tagline: "Buenos Aires evenings and Patagonia's granite peaks.",
    image: unsplash("photo-1637580980556-085dee659c7e"),
  },
  {
    slug: "peru",
    name: "Peru",
    region: "South America",
    tagline: "Cusco, the Sacred Valley and Machu Picchu.",
    image: unsplash("photo-1587595431973-160d0d94add1"),
  },
  {
    slug: "chile",
    name: "Chile",
    region: "South America",
    tagline: "Santiago, the Atacama and Torres del Paine.",
    image: unsplash("photo-1558517286-6b7b81953cb5"),
  },
  {
    slug: "colombia",
    name: "Colombia",
    region: "South America",
    tagline: "Cartagena's walled city and Caribbean islands.",
    image: unsplash("photo-1536308037887-165852797016"),
  },
  {
    slug: "australia",
    name: "Australia",
    region: "Australia & Pacific",
    tagline: "Harbour cities, road trips, reef and rainforest.",
    image: unsplash("photo-1624138784614-87fd1b6528f8"),
  },
];

export function getDestination(nameOrSlug: string | undefined | null): Destination | undefined {
  if (!nameOrSlug) return undefined;
  const key = nameOrSlug.trim().toLowerCase();
  return DESTINATIONS.find(
    (destination) => destination.slug === key || destination.name.toLowerCase() === key
  );
}

export const COUNTRY_OPTIONS = DESTINATIONS.map((destination) => destination.name);
