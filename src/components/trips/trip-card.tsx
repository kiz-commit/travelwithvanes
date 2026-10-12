import Link from "next/link";
import { TripCover } from "@/components/trips/trip-cover";
import { tripLengthLabel, type TripPackage } from "@/lib/trip-packages";
import { cn } from "@/lib/utils";

export function TripCard({
  trip,
  className,
}: {
  trip: TripPackage;
  /** Kept for backwards compatibility; cards are no longer numbered. */
  index?: number;
  className?: string;
}) {
  return (
    <Link href={`/trips/${trip.slug}`} className={cn("group flex flex-col rounded-xl", className)}>
      <div className="relative overflow-hidden rounded-xl">
        <TripCover trip={trip} className="aspect-[4/3] transition-transform duration-500 group-hover:scale-[1.03]" />
        {trip.badge ? (
          <span className="absolute left-3 top-3 rounded-md bg-maracuja px-2.5 py-1 text-[12px] font-semibold text-ink">
            {trip.badge}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <p className="text-[13px] text-dust">
          {trip.country} <span aria-hidden>/</span> {tripLengthLabel(trip)} <span aria-hidden>/</span> {trip.pace} pace
        </p>
        <h3 className="t-h3 mt-1.5 text-ink group-hover:text-mata">{trip.title}</h3>
        <p className="mt-2 line-clamp-2 text-[15px] leading-6 text-dust">{trip.kicker}</p>
        <p className="mt-auto pt-3 text-[14px] font-semibold text-mar">
          {trip.fromPrice ? `From ${trip.fromPrice}` : "Tailored quote"}
          <span className="font-normal text-dust"> — see the trip</span>
        </p>
      </div>
    </Link>
  );
}
