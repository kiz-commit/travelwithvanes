"use client";

import { useMemo, useState } from "react";
import { TripCard } from "@/components/trips/trip-card";
import { DESTINATIONS } from "@/lib/destinations";
import type { TripPackageRecord } from "@/lib/trip-packages";
import { cn } from "@/lib/utils";

const ORDER = DESTINATIONS.map((d) => d.name);

export function TripsBrowser({ trips }: { trips: TripPackageRecord[] }) {
  const countries = useMemo(() => {
    const present = Array.from(new Set(trips.map((trip) => trip.country || "Brazil")));
    return present.sort((a, b) => (ORDER.indexOf(a) + 99) % 99 - (ORDER.indexOf(b) + 99) % 99);
  }, [trips]);
  const [country, setCountry] = useState<string>("All");
  const visible = country === "All" ? trips : trips.filter((trip) => (trip.country || "Brazil") === country);

  return (
    <div>
      {countries.length > 1 ? (
        <div role="group" aria-label="Filter trips by country" className="flex flex-wrap gap-2">
          {["All", ...countries].map((name) => {
            const count = name === "All" ? trips.length : trips.filter((t) => (t.country || "Brazil") === name).length;
            const active = country === name;
            return (
              <button
                key={name}
                type="button"
                aria-pressed={active}
                onClick={() => setCountry(name)}
                className={cn(
                  "rounded-lg border px-3.5 py-2 text-[14px] font-medium transition-colors",
                  active ? "border-mata bg-mata text-white" : "border-ink/15 bg-white text-ink hover:border-ink/40"
                )}
              >
                {name} <span className={active ? "text-white/70" : "text-dust"}>{count}</span>
              </button>
            );
          })}
        </div>
      ) : null}
      <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((trip) => <TripCard key={trip.id} trip={trip} />)}
      </div>
    </div>
  );
}
