"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calcadao } from "@/components/layout/calcadao";
import { SafeImage } from "@/components/media/safe-image";
import { TripCard } from "@/components/trips/trip-card";
import { HowItWorks, PlanTripBand, TripFaq } from "@/components/trips/planning-sections";
import { getHomePageSettings } from "@/lib/firestore";
import { mergeWithHomePageDefaults } from "@/lib/homepage-defaults";
import { hasDisplayableMedia, isImageUrl } from "@/lib/media-utils";
import { DESTINATIONS } from "@/lib/destinations";
import { formatGuidePrice } from "@/lib/pricing";
import type { TripPackageRecord } from "@/lib/trip-packages";
import type { HomePageSettings, Itinerary } from "@/types";

const HERO_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=2400&q=75";
const PORTRAIT_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1643400813604-b3877e0c4db9?auto=format&fit=crop&w=1200&q=75";

/** Older saved titles used *asterisks* for an accent — show them as plain text. */
const plain = (text: string) => text.replace(/\*/g, "");

/** Checks that an uploaded image actually loads (storage can be offline). */
function useImageOk(url: string | undefined): boolean | null {
  const [state, setState] = useState<{ url?: string; ok: boolean | null }>({ ok: null });
  useEffect(() => {
    if (!url) return;
    const probe = new Image();
    probe.onload = () => setState({ url, ok: true });
    probe.onerror = () => setState({ url, ok: false });
    probe.src = url;
  }, [url]);
  if (!url) return false;
  return state.url === url ? state.ok : null;
}

function CtaLink({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "creator" | "creator-outline" | "light" | "outline-light";
  className?: string;
}) {
  const external = /^(mailto:|tel:|https?:)/.test(href);
  return (
    <Button variant={variant} size="cta" className={className} render={external ? <a href={href} /> : <Link href={href} />}>
      {children}
    </Button>
  );
}

function SectionHeading({
  title,
  intro,
  action,
}: {
  title: string;
  intro?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-10">
      <div className="max-w-2xl">
        <h2 className="t-h2 text-ink">{title}</h2>
        {intro ? <p className="mt-3 text-[16px] leading-7 text-dust">{intro}</p> : null}
      </div>
      {action ? (
        <Link href={action.href} className="shrink-0 text-[15px] font-semibold text-mar underline-offset-4 hover:underline">
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}

export function HomePageClient({
  initialSettings,
  trips,
  guides,
  portraitUrl,
}: {
  initialSettings: HomePageSettings;
  trips: TripPackageRecord[];
  guides: Itinerary[];
  portraitUrl?: string;
}) {
  const [settings, setSettings] = useState(initialSettings);
  useEffect(() => {
    getHomePageSettings().then((raw) => setSettings(mergeWithHomePageDefaults(raw))).catch(() => undefined);
  }, []);

  const { hero } = settings;
  const ownHeroImage =
    hero.mode !== "gradient" && hero.mediaUrl && hasDisplayableMedia(hero.mediaUrl) && isImageUrl(hero.mediaUrl)
      ? hero.mediaUrl
      : undefined;
  const ownHeroOk = useImageOk(ownHeroImage);
  const heroImage = ownHeroImage && ownHeroOk ? ownHeroImage : HERO_FALLBACK_IMAGE;

  const featuredTrips = [
    ...trips.filter((trip) => trip.country === "Brazil"),
    ...trips.filter((trip) => trip.country !== "Brazil"),
  ].slice(0, 3);
  const cheapestGuide = guides.reduce<number | null>((min, guide) => (min === null || guide.price < min ? guide.price : min), null);
  const guideCount = (name: string) => guides.filter((guide) => guide.country === name).length;
  const portrait = portraitUrl || ownHeroImage || PORTRAIT_FALLBACK_IMAGE;

  return (
    <>
      {/* Hero — fits the first screen on a 13" laptop, button always visible */}
      <section className="relative mt-[var(--nav-height)] flex h-[calc(100svh-var(--nav-height)-3rem)] min-h-[28rem] max-h-[50rem] items-end overflow-hidden bg-floresta text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(11,42,32,0.88)_0%,rgba(11,42,32,0.45)_45%,rgba(11,42,32,0.05)_75%)]" />
        <div className="wrap relative pb-10 sm:pb-14">
          <div className="max-w-2xl">
            <h1 className="t-display">{plain(hero.title)}</h1>
            <p className="t-lead mt-4 max-w-xl text-white/85">
              <span className="sm:hidden">{hero.subtitleMobile.split("\n")[0]}</span>
              <span className="hidden sm:inline">{hero.subtitleDesktop.split("\n").filter(Boolean)[0]}</span>
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <CtaLink href={hero.primaryCtaHref || "/plan"}>{hero.primaryCtaLabel}</CtaLink>
              <CtaLink href={hero.secondaryCtaHref || "/trips"} variant="outline-light">{hero.secondaryCtaLabel}</CtaLink>
            </div>
          </div>
        </div>
        {heroImage === HERO_FALLBACK_IMAGE && hero.placeholderBadge ? (
          <p className="absolute bottom-3 right-4 hidden text-[12px] text-white/60 md:block">{hero.placeholderBadge}</p>
        ) : null}
      </section>
      <Calcadao />

      {/* Two ways to travel */}
      <section className="section pt-10 sm:pt-12">
        <div className="wrap">
          <h2 className="sr-only">Two ways to travel with Vanessa</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/trips" className="group flex flex-col rounded-xl bg-mata p-6 text-white transition-colors hover:bg-floresta sm:p-8">
              <p className="text-[14px] font-semibold text-maracuja">Plan it for me</p>
              <h3 className="t-h2 mt-2">Signature trips</h3>
              <p className="mt-3 max-w-md text-[15px] leading-6 text-white/75">
                A trip designed around you, with stays, transfers and guides booked, and Vanessa on WhatsApp while you travel.
              </p>
              <span className="mt-6 text-[15px] font-semibold underline-offset-4 group-hover:underline">
                See {trips.length} trips
              </span>
            </Link>
            <Link href="/itineraries" className="group flex flex-col rounded-xl bg-mist p-6 text-ink transition-colors hover:bg-[#e2ebe6] sm:p-8">
              <p className="text-[14px] font-semibold text-mar">I&apos;ll do it myself</p>
              <h3 className="t-h2 mt-2">Self-guided guides</h3>
              <p className="mt-3 max-w-md text-[15px] leading-6 text-dust">
                Day-by-day plans written from real trips, across Brazil, South America and Australia. Read the first days free.
              </p>
              <span className="mt-6 text-[15px] font-semibold text-mar underline-offset-4 group-hover:underline">
                Browse guides{cheapestGuide ? ` — from ${formatGuidePrice(cheapestGuide)}` : ""}
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Signature trips */}
      <section className="section pt-0">
        <div className="wrap">
          <SectionHeading
            title="Start from a route Vanessa loves"
            intro="Every trip is a starting point. Your dates, budget and pace shape the final plan."
            action={{ href: "/trips", label: `All ${trips.length} trips` }}
          />
          <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTrips.map((trip) => <TripCard key={trip.id} trip={trip} />)}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section bg-mist">
        <div className="wrap">
          <SectionHeading title="How planning with Vanessa works" />
          <HowItWorks className="mt-8" />
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <CtaLink href="/plan">Plan a trip</CtaLink>
            <p className="text-[14px] text-dust">Free to ask. No payment until you&apos;re happy with the plan.</p>
          </div>
        </div>
      </section>

      {/* Meet Vanessa */}
      <section className="section">
        <div className="wrap grid items-center gap-10 md:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SafeImage
            src={portrait}
            fallbackSrc={PORTRAIT_FALLBACK_IMAGE}
            alt=""
            loading="lazy"
            className="aspect-[4/5] max-h-[min(34rem,78vh)] w-full rounded-xl object-cover"
          />
          <div>
            <p className="kicker">Meet Vanessa</p>
            <h2 className="t-h2 mt-2 text-ink">“{plain(settings.testimonial.quote)}”</h2>
            <p className="mt-4 max-w-xl text-[16px] leading-7 text-dust">
              Vanessa grew up in Brazil and now splits her life between Brazil and Australia. She plans every trip
              herself, tests the routes, and only recommends places she&apos;d send her own family.
            </p>
            <ul className="mt-6 grid gap-3 text-[15px] text-ink sm:grid-cols-2">
              {[
                "Born and raised in Brazil",
                "Fluent Portuguese and English",
                "Every trip personally planned",
                "On WhatsApp while you travel",
              ].map((point) => (
                <li key={point} className="flex items-center gap-2.5">
                  <Check className="size-4 shrink-0 text-mata" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <CtaLink href="/about" variant="creator-outline">More about Vanessa</CtaLink>
              <CtaLink href="/plan" variant="creator">
                <MessageCircle className="size-4" aria-hidden /> Ask her about your trip
              </CtaLink>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="section bg-mist">
        <div className="wrap">
          <SectionHeading
            title="Where to go"
            intro="Brazil is home. Guides for the rest of South America and Australia are growing."
            action={{ href: "/itineraries", label: "All guides" }}
          />
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {DESTINATIONS.map((destination) => {
              const count = guideCount(destination.name);
              return (
                <Link
                  key={destination.slug}
                  href={`/itineraries?country=${encodeURIComponent(destination.name)}`}
                  className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-mata text-white sm:aspect-[16/10]"
                >
                  <SafeImage src={destination.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-floresta/80 via-floresta/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <p className="font-heading text-xl sm:text-2xl">{destination.name}</p>
                    <p className="mt-0.5 text-[13px] text-white/80">
                      {destination.focus === "home" ? "Vanessa's home" : destination.region}
                      {count > 0 ? `, ${count} ${count === 1 ? "guide" : "guides"}` : ""}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="wrap grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <h2 className="t-h2 text-ink">Questions people ask</h2>
            <p className="mt-3 max-w-sm text-[16px] leading-7 text-dust">
              Anything else? Ask it in the{" "}
              <Link href="/plan" className="font-semibold text-mar underline underline-offset-4">trip planner</Link>{" "}
              and Vanessa will answer personally.
            </p>
          </div>
          <TripFaq limit={4} />
        </div>
      </section>

      <PlanTripBand title={plain(settings.finalCta.title)} body={settings.finalCta.body} href={settings.finalCta.ctaHref || "/plan"} />
    </>
  );
}
