"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Camera, Video, MapPin, Globe } from "lucide-react";
import { getAboutPageSettings } from "@/lib/firestore";
import {
  DEFAULT_ABOUT_PAGE_SETTINGS,
  mergeWithAboutDefaults,
} from "@/lib/site-defaults";
import { hasDisplayableMedia } from "@/lib/media-utils";
import type { AboutPageSettings } from "@/types";

function socialIcon(label: string) {
  const l = label.toLowerCase();
  if (l.includes("instagram")) return Camera;
  return Video;
}

export default function AboutPage() {
  const [settings, setSettings] = useState<AboutPageSettings>(
    DEFAULT_ABOUT_PAGE_SETTINGS
  );

  useEffect(() => {
    getAboutPageSettings()
      .then((raw) => setSettings(mergeWithAboutDefaults(raw)))
      .catch(() => setSettings(mergeWithAboutDefaults(null)));
  }, []);

  const showAvatar =
    settings.avatarUrl && hasDisplayableMedia(settings.avatarUrl);

  return (
    <main>
      <section className="relative flex h-[45vh] min-h-[320px] items-center justify-center overflow-hidden bg-gradient-to-br from-brazil-green to-brazil-blue pt-24">
        <div className="absolute inset-0 bg-black/30" />
        <h1 className="relative z-10 font-heading text-5xl font-bold text-white sm:text-6xl">
          {settings.heroTitle}
        </h1>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-20">
        <div className="flex flex-col items-center gap-12 md:flex-row md:items-start">
          {showAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.avatarUrl}
              alt={settings.name}
              className="h-[200px] w-[200px] shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="h-[200px] w-[200px] shrink-0 rounded-full bg-gradient-to-br from-sky to-brazil-blue" />
          )}

          <div className="flex flex-col gap-4 text-center md:text-left">
            <h2 className="font-heading text-3xl font-bold">{settings.name}</h2>
            <p className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground md:justify-start">
              <MapPin className="size-4" />
              {settings.roles}
            </p>
            <Separator />
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              {settings.bio.map((para) => (
                <p key={para.slice(0, 32)}>{para}</p>
              ))}
            </div>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              {settings.socials.map((social) => {
                const Icon = socialIcon(social.label);
                return (
                  <Button
                    key={social.label}
                    size="sm"
                    variant="outline"
                    render={
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                  >
                    <Icon className="size-4" />
                    {social.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-16 px-4">
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
          {settings.stats.map((stat) => (
            <Card key={stat.label} className="text-center">
              <CardContent className="flex flex-col items-center gap-1 py-2">
                <span className="font-heading text-4xl font-bold text-brazil-blue">
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

      <section className="bg-sand py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ochre mb-3">
              {settings.highlightsLabel}
            </p>
            <h2 className="font-heading text-3xl font-bold tracking-tight">
              {settings.highlightsTitle}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {settings.highlightsIntro}
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {settings.highlights.map((highlight) => (
              <Card key={highlight.slice(0, 40)} className="bg-white/70">
                <CardContent className="py-5 text-sm leading-relaxed text-muted-foreground">
                  {highlight}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="mx-auto max-w-xl text-sm text-muted-foreground">
              {settings.highlightsOutro}
            </p>
            <Button
              size="lg"
              className="mt-8 h-12 rounded-full px-8 text-base"
              render={<Link href={settings.highlightsCtaHref} />}
            >
              {settings.highlightsCtaLabel}
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="mx-auto max-w-2xl text-center">
          <Globe className="mx-auto size-10 text-brazil-blue" />
          <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight">
            {settings.ctaTitle}
          </h2>
          <p className="mt-3 text-muted-foreground">{settings.ctaBody}</p>
          <Button
            size="lg"
            className="mt-8 h-12 rounded-full px-8 text-base"
            render={<Link href={settings.ctaHref} />}
          >
            {settings.ctaLabel}
          </Button>
        </div>
      </section>
    </main>
  );
}
