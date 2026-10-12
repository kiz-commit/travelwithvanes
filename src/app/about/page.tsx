import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/media/safe-image";
import { PlanTripBand } from "@/components/trips/planning-sections";
import { getAboutPageSettings } from "@/lib/firestore";
import { hasDisplayableMedia } from "@/lib/media-utils";
import { mergeWithAboutDefaults, realSocialLinks } from "@/lib/site-defaults";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "About Vanessa",
  description:
    "Meet Vanessa — Brazilian-born, Australia-based trip planner and travel creator behind travelwithvanes.",
};

const FALLBACK_PORTRAIT =
  "https://images.unsplash.com/photo-1643400813604-b3877e0c4db9?auto=format&fit=crop&w=1200&q=75";

export default async function AboutPage() {
  const settings = mergeWithAboutDefaults(await getAboutPageSettings().catch(() => null));
  const hasPortrait = Boolean(settings.avatarUrl && hasDisplayableMedia(settings.avatarUrl));
  const socials = realSocialLinks(settings.socials);

  return (
    <main className="text-ink">
      <section className="pb-14 pt-[calc(var(--nav-height)+2.5rem)] sm:pt-[calc(var(--nav-height)+3.5rem)]">
        <div className="wrap grid items-start gap-10 md:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <p className="kicker">About</p>
            <h1 className="t-h1 mt-2">{settings.heroTitle.replace(/\*/g, "")}</h1>
            <p className="mt-2 text-[15px] text-dust">{settings.roles}</p>
            <div className="mt-6 max-w-xl space-y-4 text-[17px] leading-8 text-ink/85">
              {settings.bio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button variant="primary" size="cta" render={<Link href="/plan" />}>Plan a trip with Vanessa</Button>
              {socials.map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="px-2 text-[15px] font-semibold text-mar hover:underline">
                  {social.label}
                </a>
              ))}
            </div>
          </div>
          <div className="md:sticky md:top-[calc(var(--nav-height)+1.5rem)]">
            <SafeImage
              src={hasPortrait ? settings.avatarUrl : FALLBACK_PORTRAIT}
              fallbackSrc={FALLBACK_PORTRAIT}
              alt={hasPortrait ? settings.name : ""}
              className="aspect-[4/5] max-h-[min(36rem,75vh)] w-full rounded-xl object-cover"
            />
            {settings.stats.length > 0 ? (
              <dl className="mt-4 grid grid-cols-3 gap-3">
                {settings.stats.slice(0, 3).map((stat) => (
                  <div key={stat.label} className="flex flex-col-reverse rounded-lg bg-mist p-3 text-center">
                    <dt className="mt-0.5 text-[12px] text-dust">{stat.label}</dt>
                    <dd className="font-heading text-lg text-mata">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section bg-mist">
        <div className="wrap grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <h2 className="t-h2">{settings.highlightsTitle}</h2>
            <p className="mt-3 max-w-md text-[16px] leading-7 text-dust">{settings.highlightsIntro}</p>
          </div>
          <div>
            <ul className="grid gap-4">
              {settings.highlights.map((item) => (
                <li key={item} className="flex gap-3 text-[16px] leading-7">
                  <Check className="mt-1.5 size-4 shrink-0 text-mata" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-xl text-[15px] leading-7 text-dust">{settings.highlightsOutro}</p>
            {settings.highlightsCtaLabel ? (
              <Link href={settings.highlightsCtaHref || "/trips"} className="mt-4 inline-block text-[15px] font-semibold text-mar hover:underline">
                {settings.highlightsCtaLabel}
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <PlanTripBand title={settings.ctaTitle} body={settings.ctaBody} href={settings.ctaHref || "/plan"} label={settings.ctaLabel || "Plan a trip"} />
    </main>
  );
}
