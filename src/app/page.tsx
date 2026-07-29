"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  Clapperboard,
  Mail,
  MapPin,
  MessageCircle,
  Plane,
  Play,
  Sparkles,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaDisplay } from "@/components/media/media-display";
import { VideoTile } from "@/components/media/video-tile";
import { getHomePageSettings } from "@/lib/firestore";
import { mergeWithHomePageDefaults } from "@/lib/homepage-defaults";
import { hasDisplayableMedia } from "@/lib/media-utils";
import type { HomePageSettings } from "@/types";

const stats = [
  { value: "2", label: "home markets" },
  { value: "48h", label: "hook concepts" },
  { value: "9:16", label: "short-form native" },
  { value: "4+", label: "content formats" },
];

const contentTiles = [
  {
    tag: "Hotel stay",
    title: "First-person room reveal with voiceover",
    metric: "Room tour / amenities / experience",
    className: "bg-[#f97316]",
    height: "h-80",
  },
  {
    tag: "Travel product",
    title: "Pack-with-me product placement",
    metric: "Problem / demo / lifestyle proof",
    className: "bg-[#0f766e]",
    height: "h-64",
  },
  {
    tag: "Destination",
    title: "Brazil and Australia local POV reels",
    metric: "Narrative hook / saved tips / CTA",
    className: "bg-[#2563eb]",
    height: "h-72",
  },
  {
    tag: "Food & lifestyle",
    title: "Day-in-the-life brand integration",
    metric: "Natural use / story / conversion angle",
    className: "bg-[#eab308]",
    height: "h-60",
  },
];

const services = [
  {
    icon: Clapperboard,
    title: "UGC video packages",
    copy: "Short-form videos with hooks, scripts, raw clips, captions, voiceover, and usage-ready edits.",
  },
  {
    icon: Camera,
    title: "Lifestyle photo sets",
    copy: "Natural product and travel imagery for paid social, web, email, and creator whitelisting.",
  },
  {
    icon: Plane,
    title: "Travel brand storytelling",
    copy: "Hotel, tourism, experience, and travel essential content built around real movement.",
  },
  {
    icon: Sparkles,
    title: "Creative strategy",
    copy: "Hook angles, content briefs, shot lists, and repeatable concepts for campaign testing.",
  },
];

const guideLinks = [
  "Brazil itineraries",
  "Australia travel notes",
  "Creator shop",
  "Destination guides",
];

export default function Home() {
  const [settings, setSettings] = useState<HomePageSettings | null>(null);

  useEffect(() => {
    getHomePageSettings()
      .then((raw) => setSettings(mergeWithHomePageDefaults(raw)))
      .catch(() => setSettings(mergeWithHomePageDefaults(null)));
  }, []);

  const hero = settings?.hero;
  const heroMedia = hero?.mediaUrl;
  const showHeroMedia =
    hero &&
    hero.mode !== "gradient" &&
    heroMedia &&
    hasDisplayableMedia(heroMedia);
  const ugcTiles = settings?.ugc.items ?? [];

  return (
    <>
      <div className="homepage-hook-stage">
      <section className="relative overflow-hidden bg-[#fffaf4] px-5 pb-20 pt-36 sm:pt-40">
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.94fr_1.06fr] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#111827]/10 bg-white px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#31516f] shadow-sm">
              <BadgeCheck className="size-4 text-[#0f766e]" />
              UGC creator for travel, stay, and lifestyle brands
            </div>
            <h1 className="max-w-3xl font-heading text-[clamp(3rem,8vw,6.8rem)] font-semibold leading-[0.9] text-[#111827]">
              Vanessa creates content that feels already saved.
            </h1>
            <p className="mt-7 max-w-xl text-[18px] leading-8 text-[#4b5563]">
              Brazil-born, Australia-connected creator making native UGC for
              hotels, tourism boards, travel essentials, food, and lifestyle
              brands that need warm, practical, scroll-stopping proof.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                className="h-12 rounded-full bg-[#111827] px-6 text-[14px] font-semibold text-white hover:bg-[#2563eb]"
                render={<Link href="/ugc" />}
              >
                View UGC portfolio
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="h-12 rounded-full border-[#111827]/15 bg-white px-6 text-[14px] font-semibold"
                render={<a href="mailto:hello@travelwithvanes.com" />}
              >
                <Mail className="size-4" />
                Request rates
              </Button>
            </div>
          </div>

          <div className="relative min-h-[620px]">
            <div className="absolute left-0 top-8 hidden w-44 rounded-[2rem] bg-white p-3 shadow-[0_24px_80px_rgba(17,24,39,0.16)] sm:block">
              <div className="aspect-[9/16] rounded-[1.45rem] bg-[#2563eb] p-4 text-white">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/70">
                  Hook
                </p>
                <p className="mt-20 text-2xl font-semibold leading-none">
                  I wish I knew this before booking...
                </p>
              </div>
            </div>
            <div className="absolute right-0 top-0 w-[78%] max-w-[430px] rounded-[2.4rem] bg-[#111827] p-4 shadow-[0_30px_100px_rgba(17,24,39,0.26)] sm:right-10">
              <div className="aspect-[9/16] overflow-hidden rounded-[1.8rem] bg-[#f97316]">
                {showHeroMedia && hero?.mode === "video" ? (
                  <MediaDisplay
                    url={heroMedia!}
                    alt="Hero video"
                    className="h-full w-full"
                    muted
                    loop
                    autoPlay
                    playsInline
                  />
                ) : showHeroMedia && hero?.mode === "image" ? (
                  <MediaDisplay
                    url={heroMedia!}
                    alt="Hero image"
                    className="h-full w-full"
                  />
                ) : (
                  <div className="flex h-full flex-col justify-between p-6 text-white">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] backdrop-blur">
                        Brazil POV
                      </span>
                      <Play className="size-9 fill-white rounded-full bg-white/20 p-2" />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-white/70">
                        TravelwithVanes
                      </p>
                      <h2 className="mt-3 text-5xl font-semibold leading-[0.92]">
                        real travel, clean edits, useful angles
                      </h2>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="absolute bottom-4 left-4 grid w-[64%] gap-3 rounded-2xl bg-white p-4 shadow-[0_20px_70px_rgba(17,24,39,0.14)] sm:left-16 sm:w-72">
              <div className="flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-full bg-[#0f766e] text-lg font-bold text-white">
                  V
                </div>
                <div>
                  <p className="font-semibold text-[#111827]">Vanessa</p>
                  <p className="text-sm text-[#6b7280]">Travel UGC creator</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="rounded-xl bg-[#dff3ff] px-3 py-2 font-medium">
                  Hotels
                </span>
                <span className="rounded-xl bg-[#fee2e2] px-3 py-2 font-medium">
                  Tourism
                </span>
                <span className="rounded-xl bg-[#dcfce7] px-3 py-2 font-medium">
                  Products
                </span>
                <span className="rounded-xl bg-[#fef3c7] px-3 py-2 font-medium">
                  Lifestyle
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#111827]/10 bg-white px-5 py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label}>
              <p className="text-3xl font-semibold text-[#111827]">
                {item.value}
              </p>
              <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#f6fbfe] px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#f97316]">
                Selected concepts
              </p>
              <h2 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-[#111827] sm:text-5xl">
                A portfolio that brands can scan in seconds.
              </h2>
            </div>
            <Link
              href="/ugc"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#2563eb]"
            >
              Full media kit
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-4">
            {(ugcTiles.some((t) => t.mediaUrl && hasDisplayableMedia(t.mediaUrl))
              ? ugcTiles.filter((t) => t.mediaUrl && hasDisplayableMedia(t.mediaUrl))
              : null
            )?.map((tile) => (
              <Link
                key={tile.title}
                href={tile.href}
                className="mb-5 block break-inside-avoid transition hover:-translate-y-1"
              >
                <VideoTile
                  url={tile.mediaUrl!}
                  tag={tile.tag}
                  title={tile.title}
                  aspectClassName={tile.aspect || "aspect-[9/16]"}
                  className="shadow-sm"
                />
              </Link>
            )) ??
              contentTiles.map((tile) => (
                <Link
                  key={tile.title}
                  href="/ugc"
                  className={`mb-5 block break-inside-avoid overflow-hidden rounded-2xl ${tile.className} ${tile.height} p-5 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl`}
                >
                  <div className="flex h-full flex-col justify-between">
                    <span className="w-fit rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] backdrop-blur">
                      {tile.tag}
                    </span>
                    <div>
                      <h3 className="text-2xl font-semibold leading-tight">
                        {tile.title}
                      </h3>
                      <p className="mt-3 text-sm font-medium text-white/75">
                        {tile.metric}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#0f766e]">
                What brands get
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight text-[#111827] sm:text-5xl">
                Useful content, not just pretty clips.
              </h2>
              <p className="mt-5 text-lg leading-8 text-[#4b5563]">
                The best UGC portfolios make buying easy: clear niches, obvious
                formats, visible taste, and a contact path with no hunting.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <div
                    key={service.title}
                    className="rounded-2xl border border-[#111827]/10 bg-[#fffaf4] p-6"
                  >
                    <Icon className="size-7 text-[#2563eb]" />
                    <h3 className="mt-5 text-xl font-semibold text-[#111827]">
                      {service.title}
                    </h3>
                    <p className="mt-3 leading-7 text-[#4b5563]">
                      {service.copy}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#111827] px-5 py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#facc15]">
              Still keeping the travel engine
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Guides, shop, and UGC can work together.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/65">
              The audience-facing travel content stays alive as proof of niche,
              taste, and authority. Brands see creator fit; travelers still get
              itineraries, recommendations, and shop links.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {guideLinks.map((link, index) => (
              <Link
                key={link}
                href={index === 2 ? "/shop" : "/itineraries"}
                className="flex items-center justify-between rounded-2xl bg-white/10 p-5 font-semibold transition hover:bg-white/15"
              >
                {link}
                <ArrowRight className="size-4" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf4] px-5 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="size-5 fill-[#facc15] text-[#facc15]" />
            ))}
          </div>
          <blockquote className="text-3xl font-semibold leading-tight tracking-tight text-[#111827] sm:text-5xl">
            Creator-led travel content works best when it feels like a trusted
            recommendation, not a scripted ad.
          </blockquote>
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-semibold text-[#31516f]">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2">
              <MapPin className="size-4" />
              Brazil
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2">
              <MapPin className="size-4" />
              Australia
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2">
              <MessageCircle className="size-4" />
              English + Portuguese perspective
            </span>
          </div>
        </div>
      </section>

      <section className="px-5 py-24">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-[#2563eb] p-8 text-white sm:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-white/65">
                Brand enquiries
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                Need travel UGC that already feels native?
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
                Send the product, stay, destination, or campaign goal. I will
                come back with angles, deliverables, and next steps.
              </p>
            </div>
            <Button
              className="h-12 rounded-full bg-white px-6 text-[14px] font-semibold text-[#111827] hover:bg-[#fef3c7]"
              render={<a href="mailto:hello@travelwithvanes.com" />}
            >
              <Mail className="size-4" />
              hello@travelwithvanes.com
            </Button>
          </div>
        </div>
      </section>
      </div>

      <div
        className="homepage-attention-hook fixed inset-0 z-[80] flex items-center justify-center overflow-hidden bg-[#111827] px-5 text-center text-white"
        aria-hidden="true"
      >
        <div className="hook-moment-bg absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hook-moment-bg.png"
            alt=""
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="homepage-attention-ring absolute size-[34rem] rounded-full border border-white/10" />
        <div className="homepage-attention-ring homepage-attention-ring-two absolute size-[22rem] rounded-full border border-[#facc15]/20" />
        <div className="hook-moment hook-moment-one relative z-10 mx-auto max-w-5xl">
          <p className="hook-line text-[clamp(3.5rem,13vw,10rem)] font-black uppercase leading-[0.82] tracking-normal drop-shadow-[0_4px_28px_rgba(0,0,0,0.85)]">
            This is a hook
          </p>
        </div>
        <div className="hook-moment hook-moment-two absolute inset-x-5 mx-auto max-w-5xl">
          <p className="hook-line text-[clamp(2.7rem,9vw,7rem)] font-black uppercase leading-[0.86] tracking-normal text-[#facc15]">
            Have I got your attention?
          </p>
        </div>
        <div className="hook-moment hook-moment-three absolute inset-x-5 mx-auto max-w-5xl">
          <p className="hook-line hook-line-small mx-auto max-w-3xl text-[clamp(2.8rem,10vw,7rem)] font-black uppercase leading-[0.86] tracking-normal text-[#facc15]">
            Work with me.
          </p>
        </div>
      </div>
    </>
  );
}
