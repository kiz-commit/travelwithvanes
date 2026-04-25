"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getHomePageSettings } from "@/lib/firestore";
import {
  mergeWithHomePageDefaults,
} from "@/lib/homepage-defaults";
import type { HomePageSettings } from "@/types";

export default function Home() {
  const [settings, setSettings] = useState<HomePageSettings>(() =>
    mergeWithHomePageDefaults(null)
  );

  useEffect(() => {
    getHomePageSettings()
      .then((raw) => {
        setSettings(mergeWithHomePageDefaults(raw));
      })
      .catch(() => {
        setSettings(mergeWithHomePageDefaults(null));
      });
  }, []);

  const h = settings.hero;
  const hasHeroMedia = Boolean(h.mediaUrl) && h.mode !== "gradient";

  return (
    <>
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
        {h.mode === "video" && hasHeroMedia && (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={h.mediaUrl}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden
          />
        )}
        {h.mode === "image" && hasHeroMedia && (
          // eslint-disable-next-line @next/next/no-img-element -- runtime CMS URL
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={h.mediaUrl}
            alt=""
          />
        )}
        {(h.mode === "gradient" || !hasHeroMedia) && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a2e1f] via-[#0c3d2e] to-[#1a4a3a]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,215,0,0.15),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(77,172,212,0.1),transparent_60%)]" />
          </>
        )}
        {hasHeroMedia && (
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"
            aria-hidden
          />
        )}
        {hasHeroMedia && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,215,0,0.1),transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(77,172,212,0.08),transparent_55%)]" />
          </>
        )}

        <div className="relative z-10 mx-auto max-w-4xl px-5 text-center">
          <p className="mb-6 text-[12px] font-semibold uppercase tracking-[0.2em] text-gold/80">
            {h.eyebrow}
          </p>
          <h1 className="font-heading text-[clamp(2.5rem,7vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.03em] text-white">
            {h.titleLine1}{" "}
            <span className="italic">{h.titleItalic}</span>
            <br />
            {h.titleLine2}
          </h1>
          <p className="mx-auto mt-8 max-w-lg text-[17px] font-light leading-relaxed text-white/60">
            {h.subtitle}
          </p>
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              className="h-[52px] rounded-full bg-white px-8 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#0a2e1f] hover:bg-white/90 shadow-xl shadow-white/10"
              render={<Link href={h.primaryCtaHref} />}
            >
              {h.primaryCtaLabel}
              <ArrowRight className="ml-2 size-4" />
            </Button>
            <Button
              variant="ghost"
              className="h-[52px] rounded-full px-8 text-[13px] font-semibold uppercase tracking-[0.08em] text-white/70 hover:bg-white/10 hover:text-white"
              render={<Link href={h.secondaryCtaHref} />}
            >
              {h.secondaryCtaLabel}
            </Button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="relative px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-ochre">
              {settings.whereWeGo.label}
            </p>
            <h2 className="font-heading text-[clamp(2rem,4vw,3.5rem)] font-medium tracking-[-0.02em]">
              {settings.whereWeGo.titleLine1}{" "}
              <span className="italic">{settings.whereWeGo.titleItalic}</span>{" "}
              {settings.whereWeGo.titleLine2}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Link
              href={settings.whereWeGo.brazil.href}
              className="group relative block overflow-hidden rounded-3xl"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-[#0a3d2e] via-[#1a6b4a] to-[#2d8a5e] transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="mb-3 flex items-center gap-2">
                  <MapPin className="size-3.5 text-gold" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gold">
                    {settings.whereWeGo.brazil.region}
                  </span>
                </div>
                <h3 className="font-heading text-4xl font-medium tracking-[-0.02em] text-white">
                  {settings.whereWeGo.brazil.title}
                </h3>
                <p className="mt-2 text-[15px] text-white/60">
                  {settings.whereWeGo.brazil.blurb}
                </p>
              </div>
            </Link>

            <Link
              href={settings.whereWeGo.australia.href}
              className="group relative block overflow-hidden rounded-3xl"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-[#8B5E3C] via-[#C1440E] to-[#d4764a] transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="mb-3 flex items-center gap-2">
                  <MapPin className="size-3.5 text-gold" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gold">
                    {settings.whereWeGo.australia.region}
                  </span>
                </div>
                <h3 className="font-heading text-4xl font-medium tracking-[-0.02em] text-white">
                  {settings.whereWeGo.australia.title}
                </h3>
                <p className="mt-2 text-[15px] text-white/60">
                  {settings.whereWeGo.australia.blurb}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-sand/30 px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex flex-col sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-ochre">
                {settings.featured.label}
              </p>
              <h2 className="font-heading text-[clamp(2rem,4vw,3rem)] font-medium tracking-[-0.02em]">
                {settings.featured.titleLine1}{" "}
                <span className="italic">{settings.featured.titleItalic}</span>
              </h2>
            </div>
            <Link
              href={settings.featured.viewAllHref}
              className="mt-4 inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.08em] text-foreground/50 transition-colors hover:text-foreground sm:mt-0"
            >
              {settings.featured.viewAllLabel}
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {settings.featured.items.map((item) => (
              <Link
                key={`${item.title}-${item.href}`}
                href={item.href}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/[0.06]"
              >
                <div
                  className={`relative h-56 overflow-hidden bg-gradient-to-br ${item.gradient}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute left-4 top-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                      <MapPin className="size-3" />
                      {item.location}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="text-[12px] font-medium text-white/80">
                      {item.duration}
                    </span>
                    <span className="text-[12px] font-medium text-white/80">
                      full guide {item.price}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-heading text-xl font-medium tracking-[-0.01em]">
                    {item.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-foreground/50">
                    {item.description}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-[13px] font-medium text-ochre transition-all group-hover:gap-2">
                    Preview guide
                    <ArrowRight className="size-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex flex-col sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-ochre">
                {settings.ugc.label}
              </p>
              <h2 className="font-heading text-[clamp(2rem,4vw,3rem)] font-medium tracking-[-0.02em]">
                {settings.ugc.titleLine1}{" "}
                <span className="italic">{settings.ugc.titleItalic}</span>
              </h2>
            </div>
            <Link
              href={settings.ugc.viewAllHref}
              className="mt-4 inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.08em] text-foreground/50 transition-colors hover:text-foreground sm:mt-0"
            >
              {settings.ugc.viewAllLabel}
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {settings.ugc.items.map((card) => (
              <Link
                key={`${card.title}-${card.tag}`}
                href={card.href}
                className={`group relative mb-5 block break-inside-avoid overflow-hidden rounded-2xl ${card.aspect}`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.gradient} transition-transform duration-700 group-hover:scale-110`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute left-4 top-4">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/90 backdrop-blur-md">
                    {card.tag}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-heading text-[18px] font-medium leading-snug text-white">
                    {card.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sand/30 px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex flex-col sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-ochre">
                {settings.partnerships.label}
              </p>
              <h2 className="font-heading text-[clamp(2rem,4vw,3rem)] font-medium tracking-[-0.02em]">
                {settings.partnerships.titleLine1}{" "}
                <span className="italic">{settings.partnerships.titleItalic}</span>
              </h2>
            </div>
            <Link
              href={settings.partnerships.workWithHref}
              className="mt-4 inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.08em] text-foreground/50 transition-colors hover:text-foreground sm:mt-0"
            >
              {settings.partnerships.workWithLabel}
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {settings.partnerships.services.map((service) => (
              <Link
                key={service.name}
                href={settings.partnerships.workWithHref}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div
                  className={`aspect-square bg-gradient-to-br ${service.gradient} transition-transform duration-500 group-hover:scale-105`}
                />
                <div className="p-4">
                  <h3 className="text-[14px] font-medium">{service.name}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-foreground/50">
                    {service.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="size-4 fill-gold text-gold" />
            ))}
          </div>
          <blockquote className="font-heading text-[clamp(1.3rem,3vw,2rem)] font-medium italic leading-snug tracking-[-0.01em] text-foreground/80">
            &ldquo;{settings.testimonial.quote}&rdquo;
          </blockquote>
          <p className="mt-6 text-[13px] font-medium uppercase tracking-[0.1em] text-foreground/40">
            {settings.testimonial.attribution}
          </p>
        </div>
      </section>

      <section className="relative overflow-hidden px-5 py-24">
        <div className="absolute inset-0 bg-[#0a2e1f]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,215,0,0.08),transparent_70%)]" />
        <div className="relative z-10 mx-auto max-w-xl text-center">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold/60">
            {settings.finalCta.label}
          </p>
          <h2 className="font-heading text-[clamp(2rem,4vw,3rem)] font-medium tracking-[-0.02em] text-white">
            {settings.finalCta.titleLine1}{" "}
            <span className="italic">{settings.finalCta.titleItalic}</span>
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-white/50">
            {settings.finalCta.body}
          </p>
          <Button
            className="mt-10 h-[52px] rounded-full bg-gold px-8 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#0a2e1f] shadow-lg shadow-gold/20 hover:bg-gold/90"
            render={<Link href={settings.finalCta.ctaHref} />}
          >
            {settings.finalCta.ctaLabel}
          </Button>
        </div>
      </section>
    </>
  );
}
