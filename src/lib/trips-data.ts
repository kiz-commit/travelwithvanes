import { getAllTripPackages } from "@/lib/firestore";
import {
  DEFAULT_TRIP_RECORDS,
  type TripPackageRecord,
} from "@/lib/trip-packages";

/**
 * Published signature trips for the public site.
 * Until any trip exists in Firestore, the built-in starter set is shown so the
 * site never looks empty.
 */
export async function loadPublicTrips(): Promise<TripPackageRecord[]> {
  try {
    const all = await getAllTripPackages();
    if (all.length === 0) return DEFAULT_TRIP_RECORDS;
    return all.filter((trip) => trip.published);
  } catch {
    return DEFAULT_TRIP_RECORDS;
  }
}

export async function loadPublicTrip(
  slug: string
): Promise<{ trip: TripPackageRecord | undefined; all: TripPackageRecord[] }> {
  const all = await loadPublicTrips();
  return { trip: all.find((item) => item.slug === slug), all };
}
