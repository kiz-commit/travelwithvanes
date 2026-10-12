import type { MetadataRoute } from "next";
import { getPublishedItineraries } from "@/lib/firestore";
import { loadPublicTrips } from "@/lib/trips-data";

export const revalidate = 3600;

const SITE = process.env.NEXT_PUBLIC_BASE_URL?.startsWith("http")
  ? process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "")
  : "https://travelwithvanes.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [trips, guides] = await Promise.all([
    loadPublicTrips(),
    getPublishedItineraries().catch(() => []),
  ]);
  const staticRoutes = ["", "/trips", "/itineraries", "/plan", "/about", "/blog", "/ugc", "/courses"];
  return [
    ...staticRoutes.map((path) => ({ url: `${SITE}${path}`, changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.8 })),
    ...trips.map((trip) => ({ url: `${SITE}/trips/${trip.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...guides.map((guide) => ({ url: `${SITE}/itineraries/${guide.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
