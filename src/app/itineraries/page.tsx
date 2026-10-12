"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { GuideExplorer } from "@/components/itineraries/guide-explorer";
import { getPublishedItineraries } from "@/lib/firestore";
import type { Itinerary } from "@/types";

function LoadingSkeleton() {
  return (
    <div className="grid animate-pulse gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading guides">
      {[0, 1, 2].map((i) => (
        <div key={i}>
          <div className="aspect-[4/3] rounded-xl bg-mist" />
          <div className="mt-4 h-4 w-1/3 rounded bg-mist" />
          <div className="mt-2 h-6 w-3/4 rounded bg-mist" />
        </div>
      ))}
    </div>
  );
}

export default function ItinerariesPage() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    getPublishedItineraries()
      .then((data) => {
        setItineraries(data);
        setLoadError(null);
      })
      .catch((err) => {
        setLoadError(err instanceof Error ? err.message : "Could not load trip guides.");
        setItineraries([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="text-ink">
      <section className="pb-8 pt-[calc(var(--nav-height)+2.5rem)] sm:pt-[calc(var(--nav-height)+3.5rem)]">
        <div className="wrap grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="kicker">I&apos;ll do it myself</p>
            <h1 className="t-h1 mt-2">Self-guided trip guides</h1>
            <p className="t-lead mt-4 max-w-xl text-dust">
              Day-by-day plans written from real trips. Brazil first, with Argentina, Peru, Chile, Colombia and Australia alongside. Read the first days of any guide free.
            </p>
          </div>
          <div className="rounded-xl bg-mist p-5">
            <p className="text-[15px] font-semibold">Rather have it all booked for you?</p>
            <p className="mt-1 text-[14px] leading-6 text-dust">Vanessa can turn any route into a tailored trip with stays, transfers and support.</p>
            <Link href="/trips" className="mt-3 inline-block text-[15px] font-semibold text-mar hover:underline">See signature trips</Link>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="wrap">
          {loadError ? (
            <div className="mb-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-800" role="alert">
              Guides couldn&apos;t load: {loadError}. Refresh the page to try again.
            </div>
          ) : null}
          {loading ? (
            <LoadingSkeleton />
          ) : itineraries.length === 0 && !loadError ? (
            <div className="rounded-xl bg-mist px-6 py-16 text-center">
              <MapPin className="mx-auto size-8 text-mata/50" aria-hidden />
              <h2 className="t-h3 mt-4">The first guides are on their way</h2>
              <p className="mx-auto mt-2 max-w-md text-[15px] text-dust">In the meantime, Vanessa can plan your trip for you.</p>
              <Link href="/plan" className="mt-4 inline-block text-[15px] font-semibold text-mar hover:underline">Plan a trip</Link>
            </div>
          ) : (
            <GuideExplorer itineraries={itineraries} />
          )}
        </div>
      </section>
    </main>
  );
}
