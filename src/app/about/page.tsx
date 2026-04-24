"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Camera, Video, MapPin, Globe } from "lucide-react";

const stats = [
  { label: "Home bases", value: "2" },
  { label: "Focus", value: "BR + AU" },
  { label: "Style", value: "Local" },
];

const aboutHighlights = [
  "Brazil is where I find colour, energy, beach days, and food spots I always want to share.",
  "Australia is where I slow down into coastal walks, coffee culture, road trips, and laid-back weekends.",
  "I love turning real travel moments into practical guides, honest tips, and easy inspiration.",
  "My content is for people who want trips that feel beautiful, useful, and a little more local.",
];

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative flex h-[45vh] min-h-[320px] items-center justify-center overflow-hidden bg-gradient-to-br from-brazil-green to-brazil-blue pt-24">
        <div className="absolute inset-0 bg-black/30" />
        <h1 className="relative z-10 font-heading text-5xl font-bold text-white sm:text-6xl">
          About Vanessa
        </h1>
      </section>

      {/* Profile */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <div className="flex flex-col items-center gap-12 md:flex-row md:items-start">
          {/* Avatar placeholder */}
          <div className="h-[200px] w-[200px] shrink-0 rounded-full bg-gradient-to-br from-gold to-ochre" />

          {/* Bio */}
          <div className="flex flex-col gap-4 text-center md:text-left">
            <h2 className="font-heading text-3xl font-bold">Vanessa</h2>
            <p className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground md:justify-start">
              <MapPin className="size-4" />
              Travel Blogger
              <span className="text-muted-foreground/50">|</span>
              Content Creator
              <span className="text-muted-foreground/50">|</span>
              Brazil &amp; Australia
            </p>
            <Separator />
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Hey! I&apos;m Vanessa, most people call me Vanes. I&apos;m a
                travel creator who splits her time between Brazil and
                Australia, two places that feel like home in completely
                different ways.
              </p>
              <p>
                I started Travel with Vanessa to share the kind of travel
                advice I always look for: where to go, what is worth your time,
                how to plan without overthinking it, and the little local
                details that make a trip feel special.
              </p>
              <p>
                When I&apos;m not filming or building guides, you&apos;ll find
                me hunting for the best acai bowl in Rio, saving cafe spots in
                Melbourne, or planning the next beach escape.
              </p>
            </div>

            {/* Social links */}
            <div className="mt-2 flex items-center justify-center gap-3 md:justify-start">
              <Button
                size="sm"
                variant="outline"
                render={<a href="#" target="_blank" rel="noopener noreferrer" />}
              >
                <Camera className="size-4" />
                Instagram
              </Button>
              <Button
                size="sm"
                variant="outline"
                render={<a href="#" target="_blank" rel="noopener noreferrer" />}
              >
                <Video className="size-4" />
                YouTube
              </Button>
              <Button
                size="sm"
                variant="outline"
                render={<a href="#" target="_blank" rel="noopener noreferrer" />}
              >
                <Video className="size-4" />
                TikTok
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-muted/40 py-16 px-4">
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center">
              <CardContent className="flex flex-col items-center gap-1 py-2">
                <span className="font-heading text-4xl font-bold text-gold">
                  {stat.value}
                </span>
                <span className="text-sm text-muted-foreground">
                  {stat.label}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* About Me */}
      <section className="bg-sand py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ochre mb-3">
              About me
            </p>
            <h2 className="font-heading text-3xl font-bold tracking-tight">
              A little more about Vanes
            </h2>
            <p className="mt-4 text-muted-foreground">
              This space is part travel diary, part practical guide. It is
              where I collect my favourite places, honest recommendations, and
              the small details I wish I knew before visiting.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {aboutHighlights.map((highlight) => (
              <Card key={highlight} className="bg-white/70">
                <CardContent className="py-5 text-sm leading-relaxed text-muted-foreground">
                  {highlight}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="mx-auto max-w-xl text-sm text-muted-foreground">
              Follow along for Brazil and Australia travel ideas, guide
              previews, behind-the-scenes moments, and the occasional personal
              favourite.
            </p>
            <Button
              size="lg"
              className="mt-8 h-12 rounded-full px-8 text-base"
              render={<Link href="/itineraries" />}
            >
              Preview Trip Guides
            </Button>
          </div>
        </div>
      </section>

      {/* CTA to itineraries */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-2xl text-center">
          <Globe className="mx-auto size-10 text-brazil-green" />
          <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight">
            Ready to explore?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Preview curated trip guides for Brazil and Australia, then unlock
            the full plan when you find the route that fits your trip.
          </p>
          <Button
            size="lg"
            className="mt-8 h-12 rounded-full px-8 text-base"
            render={<Link href="/itineraries" />}
          >
            Preview Trip Guides
          </Button>
        </div>
      </section>
    </main>
  );
}
