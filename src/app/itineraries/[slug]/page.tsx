"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  MapPin,
  Clock,
  Calendar,
  Loader2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getItineraryBySlug } from "@/lib/firestore";
import type { Itinerary } from "@/types";

const galleryGradients = [
  "from-brazil-green to-brazil-blue",
  "from-ochre to-sky",
  "from-gold to-brazil-green",
  "from-sky to-brazil-blue",
  "from-brazil-green to-gold",
  "from-ochre to-gold",
];

function LoadingState() {
  return (
    <main className="pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="animate-pulse">
          <div className="h-64 rounded-2xl bg-muted" />
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <div className="h-6 w-1/3 rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-2/3 rounded bg-muted" />
            </div>
            <div className="h-72 rounded-xl bg-muted" />
          </div>
        </div>
      </div>
    </main>
  );
}

function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center pt-24 pb-20">
      <MapPin className="size-16 text-muted-foreground/40" />
      <h1 className="mt-6 font-heading text-3xl font-bold">
        Trip Guide Not Found
      </h1>
      <p className="mt-3 text-muted-foreground">
        We couldn&apos;t find the trip guide you&apos;re looking for.
      </p>
      <Button className="mt-8" render={<Link href="/itineraries" />}>
        Back to Guides
      </Button>
    </main>
  );
}

export default function ItineraryDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (!slug) return;
    getItineraryBySlug(slug)
      .then((data) => {
        if (!data) setNotFound(true);
        else setItinerary(data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleBooking() {
    if (!itinerary) return;
    setBooking(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemType: "itinerary",
          itemId: itinerary.id,
          title: itinerary.title,
          price: itinerary.price,
        }),
      });
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      setBooking(false);
    }
  }

  if (loading) return <LoadingState />;
  if (notFound || !itinerary) return <NotFound />;

  const previewDays = itinerary.days.slice(0, Math.min(2, itinerary.days.length));
  const lockedDaysCount = Math.max(itinerary.days.length - previewDays.length, 0);

  return (
    <main className="pb-20">
      {/* Hero */}
      <section className="relative flex min-h-[340px] flex-col justify-end bg-gradient-to-br from-brazil-green via-brazil-blue to-gold pt-24 pb-10">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-white/20 text-white backdrop-blur-sm">
              <Clock className="size-3" />
              {itinerary.duration} Days
            </Badge>
            {itinerary.destinations.map((dest) => (
              <Badge
                key={dest}
                className="bg-white/20 text-white backdrop-blur-sm"
              >
                <MapPin className="size-3" />
                {dest}
              </Badge>
            ))}
          </div>
          <h1 className="mt-4 font-heading text-4xl font-bold text-white sm:text-5xl">
            {itinerary.title}
          </h1>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 pt-10">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Main */}
          <div className="space-y-10 lg:col-span-2">
            {/* Description */}
            <section>
              <h2 className="font-heading text-2xl font-bold">
                About This Guide
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                {itinerary.description}
              </p>
              <p className="mt-4 rounded-xl bg-sand/60 p-4 text-sm leading-relaxed text-muted-foreground">
                This is the free preview. Unlock the full guide for the complete
                route, day-by-day plan, local tips, and planning details.
              </p>
            </section>

            <Separator />

            {/* Day by Day */}
            {itinerary.days.length > 0 && (
              <section>
                <h2 className="font-heading text-2xl font-bold">
                  Free Guide Preview
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  A quick taste of the full day-by-day guide before you buy.
                </p>
                <div className="mt-6 space-y-0">
                  {previewDays.map((day, index) => (
                    <div key={day.day} className="relative flex gap-4 pb-8">
                      <div className="flex flex-col items-center">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brazil-green text-sm font-bold text-white">
                          {day.day}
                        </div>
                        {index < previewDays.length - 1 && (
                          <div className="w-0.5 flex-1 bg-brazil-green/20" />
                        )}
                      </div>
                      <div className="pt-1">
                        <h3 className="font-heading text-lg font-semibold">
                          {day.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {day.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {lockedDaysCount > 0 && (
                  <div className="rounded-xl border border-dashed bg-muted/40 p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background">
                        <Lock className="size-4 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-heading text-lg font-semibold">
                          {lockedDaysCount} more{" "}
                          {lockedDaysCount === 1 ? "day" : "days"} in the full
                          guide
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          Buy the full guide to unlock the complete itinerary,
                          practical planning notes, and Vanessa&apos;s extra
                          local recommendations.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )}

            <Separator />

            {/* Included */}
            {itinerary.included.length > 0 && (
              <section>
                <h2 className="font-heading text-2xl font-bold">
                  Inside the Full Guide
                </h2>
                <ul className="mt-4 space-y-2">
                  {itinerary.included.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brazil-green" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Excluded */}
            {itinerary.excluded.length > 0 && (
              <section>
                <h2 className="font-heading text-2xl font-bold">
                  Not Covered in This Guide
                </h2>
                <ul className="mt-4 space-y-2">
                  {itinerary.excluded.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <XCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Gallery */}
            {itinerary.gallery.length > 0 && (
              <>
                <Separator />
                <section>
                  <h2 className="font-heading text-2xl font-bold">Gallery</h2>
                  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {itinerary.gallery.map((_, i) => (
                      <div
                        key={i}
                        className={`h-40 rounded-xl bg-gradient-to-br ${galleryGradients[i % galleryGradients.length]}`}
                      />
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Card>
              <CardContent className="flex flex-col gap-5">
                <div>
                  <p className="text-sm text-muted-foreground">Full guide</p>
                  <p className="font-heading text-4xl font-bold text-brazil-green">
                    ${itinerary.price}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    one-time purchase
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="size-4 text-muted-foreground" />
                    <span>{itinerary.duration} Days</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="size-4 text-muted-foreground" />
                    <span>{itinerary.destinations.join(", ")}</span>
                  </div>
                </div>

                {itinerary.highlights.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="mb-2 text-sm font-semibold">Highlights</p>
                      <ul className="space-y-1.5">
                        {itinerary.highlights.map((h) => (
                          <li
                            key={h}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brazil-green" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                <Button
                  size="lg"
                  className="mt-2 h-12 w-full text-base font-semibold"
                  disabled={booking}
                  onClick={handleBooking}
                >
                  {booking ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Processing…
                    </>
                  ) : (
                    "Buy the Full Guide"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
