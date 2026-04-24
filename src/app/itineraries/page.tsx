"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPublishedItineraries } from "@/lib/firestore";
import type { Itinerary } from "@/types";

const gradients = [
  "from-brazil-green to-brazil-blue",
  "from-ochre to-sky",
  "from-gold to-brazil-green",
  "from-sky to-brazil-blue",
  "from-brazil-green to-gold",
  "from-ochre to-gold",
];

function LoadingSkeleton() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10"
        >
          <div className="h-48 bg-muted" />
          <div className="flex flex-col gap-3 p-4">
            <div className="h-5 w-3/4 rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-2/3 rounded bg-muted" />
            <div className="flex gap-2">
              <div className="h-5 w-16 rounded-full bg-muted" />
              <div className="h-5 w-20 rounded-full bg-muted" />
            </div>
            <div className="h-8 w-full rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ItinerariesPage() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublishedItineraries()
      .then(setItineraries)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            Explore Trip Guides
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Get a free taste of each Brazil and Australia guide, then unlock the
            full route, local tips, and day-by-day plan when you are ready.
          </p>
        </div>

        <div className="mt-14">
          {loading ? (
            <LoadingSkeleton />
          ) : itineraries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <MapPin className="size-12 text-muted-foreground/50" />
              <h2 className="mt-4 font-heading text-xl font-semibold">
                No trip guides available yet
              </h2>
              <p className="mt-2 text-muted-foreground">
                Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {itineraries.map((itinerary, i) => (
                <Card key={itinerary.id} className="overflow-hidden">
                  <div
                    className={`h-48 bg-gradient-to-br ${gradients[i % gradients.length]} flex items-end p-4`}
                  >
                    <div className="flex flex-wrap gap-1.5">
                      {itinerary.destinations.map((dest) => (
                        <Badge
                          key={dest}
                          className="bg-white/90 text-foreground"
                        >
                          <MapPin className="size-3" />
                          {dest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <CardContent className="flex flex-col gap-3 pt-2">
                    <h3 className="font-heading text-lg font-semibold">
                      {itinerary.title}
                    </h3>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {itinerary.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        <Clock className="size-3" />
                        {itinerary.duration} Days
                      </Badge>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <span className="text-base font-bold text-brazil-green">
                        Full guide ${itinerary.price}
                      </span>
                      <Button
                        size="sm"
                        render={
                          <Link href={`/itineraries/${itinerary.slug}`} />
                        }
                      >
                        Preview Guide
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
