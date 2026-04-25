"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MapPin, Clock, Calendar, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getItineraryBySlug } from "@/lib/firestore";
import { hasRichListContent } from "@/lib/itinerary-migrate";
import {
  segmentTimelineLabel,
  segmentUsesDayCircle,
} from "@/lib/itinerary-segment";
import { isRichTextEmpty } from "@/lib/rich-text";
import { SanitizedHtml } from "@/components/sanitized-html";
import type { Itinerary } from "@/types";

const galleryGradients = [
  "from-brazil-blue to-sky",
  "from-ochre to-brazil-blue",
  "from-sky to-brazil-green",
  "from-sky to-brazil-blue",
  "from-brazil-blue to-brazil-green",
  "from-ochre to-sky",
];

function LoadingState() {
  return (
    <main className="pt-32 pb-20">
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
    <main className="flex min-h-screen flex-col items-center justify-center pt-32 pb-20">
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
  const lockedSectionCount = Math.max(
    itinerary.days.length - previewDays.length,
    0
  );

  return (
    <main className="pb-20">
      {/* Hero */}
      <section className="relative flex min-h-[340px] flex-col justify-end bg-gradient-to-br from-[#071f3d] via-brazil-blue to-sky pt-24 pb-10">
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
              <div className="mt-4 leading-relaxed text-muted-foreground">
                <SanitizedHtml
                  html={itinerary.description}
                  className="text-muted-foreground [&_a]:text-brazil-blue"
                />
              </div>
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
                  A quick taste of the full guide before you buy.
                </p>
                <div className="mt-6 space-y-0">
                  {previewDays.map((day, index) => {
                    const useCircle = segmentUsesDayCircle(day);
                    const badge = segmentTimelineLabel(day);
                    return (
                      <div
                        key={`${index}-${day.day}`}
                        className="relative flex gap-4 pb-8"
                      >
                        <div className="flex flex-col items-center">
                          <div
                            className={
                              useCircle
                                ? "flex size-10 shrink-0 items-center justify-center rounded-full bg-brazil-blue text-sm font-bold text-white"
                                : "flex min-h-10 min-w-10 max-w-[7.5rem] shrink-0 items-center justify-center rounded-xl bg-brazil-blue px-1.5 text-center text-[11px] font-semibold leading-tight text-white"
                            }
                          >
                            {useCircle ? day.day : badge}
                          </div>
                          {index < previewDays.length - 1 && (
                            <div className="w-0.5 flex-1 bg-brazil-blue/20" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1 pt-1">
                          {!isRichTextEmpty(day.title) && (
                            <div className="font-heading text-lg font-semibold text-foreground">
                              <SanitizedHtml
                                html={day.title}
                                className="prose-p:my-0 [&_h1]:text-lg [&_h2]:text-base [&_h3]:text-base"
                              />
                            </div>
                          )}
                          <div className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            <SanitizedHtml
                              html={day.description}
                              className="text-muted-foreground [&_a]:text-brazil-blue"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {lockedSectionCount > 0 && (
                  <div className="rounded-xl border border-dashed bg-muted/40 p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background">
                        <Lock className="size-4 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-heading text-lg font-semibold">
                          {lockedSectionCount} more{" "}
                          {lockedSectionCount === 1
                            ? "section"
                            : "sections"}{" "}
                          in the full guide
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
            {hasRichListContent(itinerary.included) && (
              <section>
                <h2 className="font-heading text-2xl font-bold">
                  Inside the Full Guide
                </h2>
                <div className="mt-4 text-muted-foreground">
                  <SanitizedHtml
                    html={itinerary.included}
                    className="text-muted-foreground [&_a]:text-brazil-blue [&_ul]:my-0"
                  />
                </div>
              </section>
            )}

            {/* Excluded */}
            {hasRichListContent(itinerary.excluded) && (
              <section>
                <h2 className="font-heading text-2xl font-bold">
                  Not Covered in This Guide
                </h2>
                <div className="mt-4 text-muted-foreground">
                  <SanitizedHtml
                    html={itinerary.excluded}
                    className="text-destructive/90 [&_a]:text-brazil-blue"
                  />
                </div>
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
                  <p className="font-heading text-4xl font-bold text-brazil-blue">
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

                {hasRichListContent(itinerary.highlights) && (
                  <>
                    <Separator />
                    <div>
                      <p className="mb-2 text-sm font-semibold">Highlights</p>
                      <div className="text-sm text-muted-foreground">
                        <SanitizedHtml
                          html={itinerary.highlights}
                          className="prose-p:text-sm [&_a]:text-brazil-blue"
                        />
                      </div>
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
