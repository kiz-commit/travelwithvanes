"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Download,
  Mail,
  MapPin,
  MessageSquare,
  Play,
  Send,
  Sparkles,
} from "lucide-react";
import { AttentionHook, HookStage } from "@/components/hook/attention-hook";
import { getHomePageSettings, getUGCPosts } from "@/lib/firestore";
import { mergeWithHomePageDefaults } from "@/lib/homepage-defaults";
import { UGCPost, type HomeHookMoment } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VideoTile } from "@/components/media/video-tile";
import {
  collectPortfolioMedia,
  postPreviewUrl,
} from "@/lib/portfolio-media";

const niches = [
  "Hotels & stays",
  "Tourism boards",
  "Travel essentials",
  "Restaurants",
  "Lifestyle products",
  "Brazil + Australia",
];

const samples = [
  {
    type: "Organic reel",
    title: "Three reasons I would book this stay again",
    format: "Hook, room reveal, amenities, experience CTA",
    color: "bg-clay",
    size: "min-h-96",
  },
  {
    type: "Paid social",
    title: "The travel essential I actually kept using",
    format: "Problem, demo, proof, offer angle",
    color: "bg-olive",
    size: "min-h-80",
  },
  {
    type: "Destination POV",
    title: "What a local would do with one day here",
    format: "Saved tips, mapped stops, natural voiceover",
    color: "bg-ocean",
    size: "min-h-[28rem]",
  },
  {
    type: "Photo set",
    title: "Lifestyle stills for web, email, and ads",
    format: "Natural light, product in context, clean crops",
    color: "bg-ochre",
    size: "min-h-72",
  },
  {
    type: "Story sequence",
    title: "Behind-the-scenes arrival to checkout",
    format: "Narrative flow, quick edits, brand tags",
    color: "bg-cobalt",
    size: "min-h-80",
  },
  {
    type: "UGC ad",
    title: "I tried this so you do not have to guess",
    format: "Testimonial angle, objection handling, CTA",
    color: "bg-espresso",
    size: "min-h-96",
  },
];

const packages = [
  {
    name: "Starter UGC",
    detail: "For one product, stay, or experience that needs fast creative proof.",
    includes: ["1 edited video", "3 hook options", "Raw clips included"],
  },
  {
    name: "Campaign Set",
    detail: "For brands testing angles across paid and organic social.",
    includes: ["3 edited videos", "Shot list + scripts", "Usage-ready captions"],
  },
  {
    name: "Travel Feature",
    detail: "For hotels, destinations, restaurants, and experiences.",
    includes: ["Video + photo set", "Story sequence", "Location-led concepting"],
  },
];

const process = [
  "Brief and campaign goal",
  "Hooks, script, and shot plan",
  "Filming in real context",
  "Edit delivery and revisions",
];

const fallbackTags = ["UGC", "Travel", "Brand Work"];

const UGC_HOOK_SEEN_KEY = "travelwithvanes:ugc-hook-seen";

type UGCFeedClientProps = {
  initialHookMoment: HomeHookMoment;
};

export function UGCFeedClient({ initialHookMoment }: UGCFeedClientProps) {
  const [posts, setPosts] = useState<UGCPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [hookMoment, setHookMoment] = useState(initialHookMoment);
  const [showHookAnimation, setShowHookAnimation] = useState(false);

  useEffect(() => {
    getUGCPosts()
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    getHomePageSettings()
      .then((raw) =>
        setHookMoment(mergeWithHomePageDefaults(raw).hookMoment)
      )
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(UGC_HOOK_SEEN_KEY)) {
        setShowHookAnimation(true);
        window.localStorage.setItem(UGC_HOOK_SEEN_KEY, "1");
      }
    } catch {
      // Ignore storage errors (private mode restrictions, etc.)
    }
  }, []);

  const portfolioMedia = collectPortfolioMedia(posts);

  const pageContent = (
        <main className="bg-linen">
          <section className="border-b border-ink/10 px-5 pb-24 pt-32 sm:px-8 sm:pb-28 sm:pt-40 lg:px-12">
            <div className="mx-auto grid max-w-[90rem] gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <p className="section-eyebrow">Creator portfolio · BR + AU</p>
                <h1 className="mt-6 max-w-[11ch] font-heading text-[clamp(3rem,7vw,6.25rem)] font-medium leading-[0.88] tracking-[-0.065em] text-ink">
                  Content people can <span className="italic text-cobalt">feel.</span>
                </h1>
                <p className="mt-7 max-w-2xl text-[18px] leading-8 text-dust">
                  Creator-led video and photography for hotels, destinations,
                  food, and lifestyle brands—made with a Brazilian point of
                  view and a traveller&apos;s eye.
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {niches.map((niche) => (
                    <Badge
                      key={niche}
                      className="rounded-full border border-ink/10 bg-transparent px-4 py-2 text-ink shadow-none"
                    >
                      {niche}
                    </Badge>
                  ))}
                </div>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Button
                    variant="creator"
                    className="h-12 px-6 text-[14px]"
                    render={<a href="mailto:hello@travelwithvanes.com" />}
                  >
                    <Mail className="size-4" />
                    Request rates
                  </Button>
                  <Button
                    variant="creator-outline"
                    className="h-12 px-6 text-[14px]"
                    render={<Link href="/itineraries" />}
                  >
                    See travel guides
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[1.25rem] bg-cobalt p-7 text-linen soft-shadow sm:p-10">
                <div aria-hidden className="absolute -right-16 -top-16 size-60 rounded-full border border-linen/15" />
                <div className="relative flex min-h-[31rem] flex-col justify-between">
                  <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.22em] text-linen/55"><span>Selected work</span><span>2026</span></div>
                  <div>
                    <Play className="mb-7 size-11 rounded-full border border-linen/25 p-3" />
                    <h2 className="max-w-[9ch] font-heading text-5xl font-medium italic leading-[0.9] tracking-[-0.05em]">Warm, useful, never over-produced.</h2>
                    <div className="mt-8 flex items-center gap-2 text-xs text-linen/60"><MapPin className="size-3.5" />Available across Brazil + Australia routes</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white px-5 py-20">
            <div className="mx-auto max-w-7xl">
              <div className="mb-12 grid gap-6 md:grid-cols-[0.75fr_1.25fr] md:items-end">
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-clay">
                    Work samples
                  </p>
                  <h2 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                    Scroll-native formats brands can actually use.
                  </h2>
                </div>
                <p className="text-lg leading-8 text-dust">
                  Instead of a generic portfolio wall, each sample makes the
                  buyer answer the useful questions: what format is it, what
                  problem does it solve, and where could it run?
                </p>
              </div>

              <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
                {portfolioMedia.length > 0
                  ? portfolioMedia.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        className="mb-5 block break-inside-avoid transition hover:-translate-y-1"
                      >
                        <VideoTile
                          url={item.url}
                          tag={item.tag}
                          title={item.title}
                          aspectClassName="aspect-[9/16] min-h-80"
                        />
                      </Link>
                    ))
                  : samples.map((sample) => (
                      <div
                        key={sample.title}
                        className={`mb-5 break-inside-avoid rounded-2xl ${sample.color} ${sample.size} p-5 text-white shadow-sm`}
                      >
                        <div className="flex h-full flex-col justify-between">
                          <div className="flex items-center justify-between">
                            <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] backdrop-blur">
                              {sample.type}
                            </span>
                            <Play className="size-9 fill-white rounded-full bg-white/20 p-2" />
                          </div>
                          <div>
                            <h3 className="text-3xl font-semibold leading-none">
                              {sample.title}
                            </h3>
                            <p className="mt-4 text-sm font-medium text-white/75">
                              {sample.format}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </section>

          <section id="pricing" className="scroll-mt-24 bg-paper px-5 py-20">
            <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-olive">
                  Deliverables
                </p>
                <h2 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                  Built for organic trust and paid testing.
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {packages.map((pack) => (
                  <div
                    key={pack.name}
                    className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm"
                  >
                    <h3 className="text-2xl font-semibold text-ink">
                      {pack.name}
                    </h3>
                    <p className="mt-3 leading-7 text-dust">{pack.detail}</p>
                    <div className="mt-6 space-y-3">
                      {pack.includes.map((item) => (
                        <div key={item} className="flex gap-3 text-sm font-medium">
                          <Check className="mt-0.5 size-4 text-olive" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-espresso px-5 py-20 text-white">
            <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div>
                <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-ochre">
                  Process
                </p>
                <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                  Clear enough for a brand team. Flexible enough for real life.
                </h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {process.map((step, index) => (
                  <div key={step} className="rounded-2xl bg-white/10 p-5">
                    <span className="text-sm font-semibold text-ochre">
                      0{index + 1}
                    </span>
                    <p className="mt-8 text-xl font-semibold">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white px-5 py-20">
            <div className="mx-auto max-w-7xl">
              <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-clay">
                    Case studies
                  </p>
                  <h2 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                    Latest UGC posts.
                  </h2>
                </div>
                <Button
                  variant="outline"
                  className="h-11 rounded-full bg-white"
                  render={<a href="mailto:hello@travelwithvanes.com" />}
                >
                  <Download className="size-4" />
                  Ask for media kit
                </Button>
              </div>

              {loading && (
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-clay border-t-transparent" />
                </div>
              )}

              {!loading && posts.length === 0 && (
                <div className="rounded-2xl border border-dashed border-ink/20 bg-linen p-8 text-dust">
                  CMS case studies can appear here once added. For now, the
                  sample grid above carries the portfolio structure.
                </div>
              )}

              {!loading && posts.length > 0 && (
                <div className="grid gap-5 md:grid-cols-3">
                  {posts.map((post) => {
                    const previewUrl = postPreviewUrl(post);
                    return (
                      <Link
                        key={post.id}
                        href={`/ugc/${post.slug}`}
                        className="rounded-2xl border border-ink/10 bg-linen p-5 transition hover:-translate-y-1 hover:shadow-xl"
                      >
                        {previewUrl ? (
                          <VideoTile
                            url={previewUrl}
                            aspectClassName="mb-5 aspect-[4/3]"
                            showOverlayText={false}
                            className="rounded-xl"
                          />
                        ) : (
                          <div className="mb-5 aspect-[4/3] rounded-xl bg-clay" />
                        )}
                        <div className="mb-3 flex flex-wrap gap-2">
                          {(post.tags.length ? post.tags : fallbackTags)
                            .slice(0, 2)
                            .map((tag) => (
                              <Badge key={tag} variant="outline">
                                {tag}
                              </Badge>
                            ))}
                        </div>
                        <h3 className="text-xl font-semibold leading-tight text-ink">
                          {post.title}
                        </h3>
                        <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-clay">
                          View case study
                          <ArrowRight className="size-4" />
                        </p>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <section className="bg-linen px-5 py-20">
            <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <Sparkles className="size-9 text-clay" />
                <h2 className="mt-5 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                  Let&apos;s build the angle before we build the edit.
                </h2>
                <p className="mt-5 text-lg leading-8 text-dust">
                  Send a brief, product link, location, or campaign goal and I
                  will respond with next steps for content, usage, and timeline.
                </p>
              </div>
              <div className="rounded-[2rem] bg-clay p-7 text-white">
                <div className="flex items-center gap-3">
                  <MessageSquare className="size-7" />
                  <p className="text-xl font-semibold">Brand enquiry</p>
                </div>
                <div className="mt-8 grid gap-3">
                  <Button
                    className="h-12 rounded-full bg-white px-6 text-[14px] font-semibold text-ink hover:bg-sun"
                    render={<a href="mailto:hello@travelwithvanes.com" />}
                  >
                    <Mail className="size-4" />
                    hello@travelwithvanes.com
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-12 rounded-full text-white hover:bg-white/10 hover:text-white"
                    render={<Link href="/about" />}
                  >
                    <Send className="size-4" />
                    About Vanessa
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>
  );

  return (
    <>
      {showHookAnimation ? (
        <HookStage>{pageContent}</HookStage>
      ) : (
        pageContent
      )}
      {showHookAnimation && <AttentionHook hookMoment={hookMoment} />}
    </>
  );
}
