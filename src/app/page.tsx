"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Clapperboard,
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
import { getHomePageSettings, getSiteSettings } from "@/lib/firestore";
import {
  DEFAULT_HOME_PAGE_SETTINGS,
  mergeWithHomePageDefaults,
} from "@/lib/homepage-defaults";
import {
  DEFAULT_SITE_SETTINGS,
  mergeWithSiteDefaults,
} from "@/lib/site-defaults";
import { hasDisplayableMedia } from "@/lib/media-utils";
import type { HomePageSettings, HomeServiceIcon } from "@/types";

const SERVICE_ICONS: Record<
  HomeServiceIcon,
  typeof Clapperboard
> = {
  clapperboard: Clapperboard,
  camera: Camera,
  plane: Plane,
  sparkles: Sparkles,
};

const TAG_COLORS = [
  "bg-[#dff3ff]",
  "bg-[#fee2e2]",
  "bg-[#dcfce7]",
  "bg-[#fef3c7]",
];

function CtaLink({
  href,
  children,
  className,
  variant = "default",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "creator" | "creator-outline";
}) {
  const external =
    href.startsWith("mailto:") ||
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("tel:");

  const buttonVariant =
    variant === "outline"
      ? "outline"
      : variant === "creator"
        ? "creator"
        : variant === "creator-outline"
          ? "creator-outline"
          : "default";

  return (
    <Button
      variant={buttonVariant}
      size="cta"
      className={className}
      render={external ? <a href={href} /> : <Link href={href} />}
    >
      {children}
    </Button>
  );
}

function HeroCtaButtons({
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  showSecondary = true,
  className,
}: {
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  showSecondary?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <CtaLink href={primaryHref} variant="creator">
        {primaryLabel}
      </CtaLink>
      {showSecondary ? (
        <CtaLink href={secondaryHref} variant="creator-outline">
          {secondaryLabel}
        </CtaLink>
      ) : null}
    </div>
  );
}

export default function Home() {
  const [settings, setSettings] = useState<HomePageSettings>(
    DEFAULT_HOME_PAGE_SETTINGS
  );
  const [email, setEmail] = useState(DEFAULT_SITE_SETTINGS.email);

  useEffect(() => {
    getHomePageSettings()
      .then((raw) => setSettings(mergeWithHomePageDefaults(raw)))
      .catch(() => setSettings(mergeWithHomePageDefaults(null)));
  }, []);

  useEffect(() => {
    getSiteSettings()
      .then((raw) => setEmail(mergeWithSiteDefaults(raw).email))
      .catch(() => undefined);
  }, []);

  const hero = settings.hero;
  const heroMedia = hero.mediaUrl;
  const heroVideo = hero.videoUrl;
  const showHeroMedia =
    hero.mode !== "gradient" &&
    ((hero.mode === "both" &&
      hasDisplayableMedia(heroMedia) &&
      hasDisplayableMedia(heroVideo)) ||
      (hero.mode !== "both" &&
        heroMedia &&
        hasDisplayableMedia(heroMedia)));
  const ugcTiles = settings.ugc.items;
  const mediaTiles = ugcTiles.filter(
    (t) => t.mediaUrl && hasDisplayableMedia(t.mediaUrl)
  );
  const hookVideo =
    settings.hookMoment.backgroundVideoUrl || "/hook-moment-bg.mp4";

  return (
    <>
      <div className="homepage-hook-stage">
        <section className="relative overflow-hidden bg-[#fffaf4] px-5 pb-4 pt-[6.5rem] sm:pb-14 sm:pt-28 lg:flex lg:h-[100svh] lg:max-h-[100svh] lg:flex-col lg:justify-center lg:pb-8 lg:pt-24">
          <div className="relative mx-auto w-full max-w-7xl max-lg:flex max-lg:min-h-[calc(100svh-6.5rem)] max-lg:flex-col max-lg:gap-3 lg:grid lg:grid-cols-[1fr_1.02fr] lg:items-center lg:gap-6 xl:gap-8">
            <div className="order-2 flex flex-col justify-center lg:order-1">
              <h1 className="max-w-[11ch] font-heading text-[clamp(1.85rem,7.5vw,2.55rem)] font-semibold leading-[0.9] tracking-[-0.03em] text-[#111827] lg:max-w-none lg:text-[clamp(3.6rem,6.8vw,6.6rem)] lg:leading-[0.88]">
                {hero.title}
              </h1>

              <p className="mt-4 hidden max-w-xl text-[16px] leading-7 text-[#4b5563] lg:mt-5 lg:block lg:text-[17px]">
                {hero.subtitleDesktop}
              </p>

              <HeroCtaButtons
                primaryHref={hero.primaryCtaHref}
                primaryLabel={hero.primaryCtaLabel}
                secondaryHref={hero.secondaryCtaHref}
                secondaryLabel={hero.secondaryCtaLabel}
                className="mt-5 hidden flex-col gap-3 lg:mt-6 lg:flex lg:flex-row"
              />
            </div>

            <div className="relative order-1 mx-auto w-full max-w-[420px] max-lg:flex max-lg:shrink max-lg:justify-center lg:order-2 lg:mx-0 lg:flex lg:h-[min(80svh,720px)] lg:max-w-none lg:items-center lg:justify-end">
              <div className="relative mx-auto w-[min(68vw,240px)] sm:w-[min(62vw,280px)] lg:mx-0 lg:aspect-[9/16] lg:h-full lg:w-auto lg:max-w-[430px]">
                <div className="absolute -left-28 top-10 z-10 hidden w-44 rounded-[2rem] bg-white p-3 shadow-[0_24px_80px_rgba(17,24,39,0.16)] lg:block xl:-left-32">
                  <div className="aspect-[9/16] rounded-[1.45rem] bg-[#2563eb] p-4 text-white">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/70">
                      {hero.hookCardLabel}
                    </p>
                    <p className="mt-20 text-2xl font-semibold leading-none">
                      {hero.hookCardText}
                    </p>
                  </div>
                </div>
                <div className="h-full rounded-[2.4rem] bg-[#111827] p-3 shadow-[0_30px_100px_rgba(17,24,39,0.26)] sm:p-4">
                  <div className="aspect-[9/16] h-full overflow-hidden rounded-[1.8rem] bg-[#f97316] lg:aspect-auto">
                    {showHeroMedia && hero.mode === "both" ? (
                      <VideoTile
                        url={heroVideo}
                        posterUrl={heroMedia}
                        aspectClassName="h-full min-h-0 aspect-auto"
                        className="h-full w-full rounded-none"
                        showOverlayText={false}
                      />
                    ) : showHeroMedia && hero.mode === "video" ? (
                      <MediaDisplay
                        url={heroMedia}
                        alt="Hero video"
                        className="h-full w-full"
                        muted
                        loop
                        autoPlay
                        playsInline
                      />
                    ) : showHeroMedia && hero.mode === "image" ? (
                      <MediaDisplay
                        url={heroMedia}
                        alt="Hero image"
                        className="h-full w-full"
                      />
                    ) : (
                      <div className="flex h-full flex-col justify-between p-5 text-white sm:p-6">
                        <div className="flex items-center justify-between">
                          <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] backdrop-blur">
                            {hero.placeholderBadge}
                          </span>
                          <Play className="size-9 fill-white rounded-full bg-white/20 p-2" />
                        </div>
                        <div>
                          <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-white/70">
                            {hero.placeholderBrand}
                          </p>
                          <h2 className="mt-3 text-4xl font-semibold leading-[0.92] sm:text-5xl">
                            {hero.placeholderHeadline}
                          </h2>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute -bottom-3 right-[-4%] z-20 grid w-[72%] max-w-[260px] gap-2.5 rounded-2xl bg-white p-3 shadow-[0_20px_70px_rgba(17,24,39,0.14)] sm:bottom-3 sm:right-[-6%] sm:w-[68%] sm:max-w-none sm:gap-3 sm:p-4 lg:bottom-[3%] lg:left-[-18%] lg:right-auto lg:w-72">
                  <div className="flex items-center gap-3">
                    <div className="grid size-11 place-items-center rounded-full bg-[#0f766e] text-lg font-bold text-white sm:size-12">
                      V
                    </div>
                    <div>
                      <p className="font-semibold text-[#111827]">
                        {hero.profileName}
                      </p>
                      <p className="text-sm text-[#6b7280]">
                        {hero.profileRole}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                    {hero.nicheTags.map((tag, i) => (
                      <span
                        key={tag}
                        className={`rounded-xl px-2 py-1.5 text-center text-[11px] font-medium leading-tight sm:px-3 sm:py-2 sm:text-sm ${TAG_COLORS[i % TAG_COLORS.length]}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <HeroCtaButtons
              primaryHref={`mailto:${email}`}
              primaryLabel="Work With Me"
              secondaryHref={hero.secondaryCtaHref}
              secondaryLabel={hero.secondaryCtaLabel}
              showSecondary={false}
              className="order-3 mt-auto flex flex-col gap-3 pb-1 pt-2 lg:hidden"
            />
          </div>

          <div className="mx-auto w-full max-w-7xl pb-8 pt-2 lg:hidden">
            <p className="max-w-xl text-[15px] leading-6 text-[#4b5563]">
              {hero.subtitleMobile}
            </p>
          </div>
        </section>

        <section className="border-y border-[#111827]/10 bg-white px-5 py-8">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 md:grid-cols-4">
            {settings.stats.map((item) => (
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
                  {settings.ugc.label}
                </p>
                <h2 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-[#111827] sm:text-5xl">
                  {settings.ugc.title}
                </h2>
              </div>
              <Link
                href={settings.ugc.viewAllHref}
                className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#2563eb]"
              >
                {settings.ugc.viewAllLabel}
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="columns-1 gap-5 sm:columns-2 lg:columns-4">
              {mediaTiles.length > 0
                ? mediaTiles.map((tile) => (
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
                  ))
                : settings.ugc.fallbackTiles.map((tile) => (
                    <Link
                      key={tile.title}
                      href={settings.ugc.viewAllHref}
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
                  {settings.services.label}
                </p>
                <h2 className="mt-3 text-4xl font-semibold tracking-tight text-[#111827] sm:text-5xl">
                  {settings.services.title}
                </h2>
                <p className="mt-5 text-lg leading-8 text-[#4b5563]">
                  {settings.services.body}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {settings.services.items.map((service) => {
                  const Icon = SERVICE_ICONS[service.icon] ?? Sparkles;
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
                {settings.travel.label}
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                {settings.travel.title}
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/65">
                {settings.travel.body}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {settings.travel.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center justify-between rounded-2xl bg-white/10 p-5 font-semibold transition hover:bg-white/15"
                >
                  {link.label}
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
                <Star
                  key={i}
                  className="size-5 fill-[#facc15] text-[#facc15]"
                />
              ))}
            </div>
            <blockquote className="text-3xl font-semibold leading-tight tracking-tight text-[#111827] sm:text-5xl">
              {settings.testimonial.quote}
            </blockquote>
            <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-semibold text-[#31516f]">
              {settings.testimonial.chips.map((chip) => {
                const Icon =
                  /english|portuguese|language/i.test(chip)
                    ? MessageCircle
                    : MapPin;
                return (
                  <span
                    key={chip}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2"
                  >
                    <Icon className="size-4" />
                    {chip}
                  </span>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-5 py-24">
          <div className="mx-auto max-w-5xl rounded-[2rem] bg-[#2563eb] p-8 text-white sm:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-white/65">
                  {settings.finalCta.label}
                </p>
                <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                  {settings.finalCta.title}
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
                  {settings.finalCta.body}
                </p>
              </div>
              <CtaLink
                href={settings.finalCta.ctaHref}
                variant="default"
                className="bg-white text-[#111827] shadow-[0_16px_40px_rgba(255,255,255,0.2)] hover:bg-[#fef3c7] hover:text-[#111827]"
              >
                {settings.finalCta.ctaLabel}
              </CtaLink>
            </div>
          </div>
        </section>
      </div>

      <div
        className="homepage-attention-hook fixed inset-0 z-[80] flex items-center justify-center overflow-hidden bg-[#111827] px-5 text-center text-white"
        aria-hidden="true"
      >
        <div className="hook-moment-bg absolute inset-0">
          <video
            src={hookVideo}
            className="hook-moment-bg-image"
            muted
            loop
            autoPlay
            playsInline
            preload="auto"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-black/15" />
        </div>
        <div className="homepage-attention-ring absolute size-[34rem] rounded-full border border-white/10" />
        <div className="homepage-attention-ring homepage-attention-ring-two absolute size-[22rem] rounded-full border border-[#facc15]/20" />
        <div className="hook-moment hook-moment-one relative z-10 mx-auto max-w-5xl">
          <p className="hook-line text-[clamp(3.5rem,13vw,10rem)] font-black uppercase leading-[0.82] tracking-normal drop-shadow-[0_4px_28px_rgba(0,0,0,0.85)]">
            {settings.hookMoment.line1}
          </p>
        </div>
        <div className="hook-moment hook-moment-two absolute inset-x-5 mx-auto max-w-5xl">
          <p className="hook-line text-[clamp(2.7rem,9vw,7rem)] font-black uppercase leading-[0.86] tracking-normal text-[#facc15]">
            {settings.hookMoment.line2}
          </p>
        </div>
        <div className="hook-moment hook-moment-three absolute inset-x-5 mx-auto max-w-5xl">
          <p className="hook-line hook-line-small mx-auto max-w-3xl text-[clamp(2.8rem,10vw,7rem)] font-black uppercase leading-[0.86] tracking-normal text-[#facc15]">
            {settings.hookMoment.line3}
          </p>
        </div>
      </div>
    </>
  );
}
