"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  Check,
  Clapperboard,
  Download,
  Mail,
  MapPin,
  MessageSquare,
  Play,
  Send,
  Sparkles,
} from "lucide-react";
import { getUGCPosts } from "@/lib/firestore";
import { UGCPost } from "@/types";
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
    color: "bg-[#f97316]",
    size: "min-h-96",
  },
  {
    type: "Paid social",
    title: "The travel essential I actually kept using",
    format: "Problem, demo, proof, offer angle",
    color: "bg-[#0f766e]",
    size: "min-h-80",
  },
  {
    type: "Destination POV",
    title: "What a local would do with one day here",
    format: "Saved tips, mapped stops, natural voiceover",
    color: "bg-[#2563eb]",
    size: "min-h-[28rem]",
  },
  {
    type: "Photo set",
    title: "Lifestyle stills for web, email, and ads",
    format: "Natural light, product in context, clean crops",
    color: "bg-[#eab308]",
    size: "min-h-72",
  },
  {
    type: "Story sequence",
    title: "Behind-the-scenes arrival to checkout",
    format: "Narrative flow, quick edits, brand tags",
    color: "bg-[#db2777]",
    size: "min-h-80",
  },
  {
    type: "UGC ad",
    title: "I tried this so you do not have to guess",
    format: "Testimonial angle, objection handling, CTA",
    color: "bg-[#111827]",
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

export default function UGCFeedPage() {
  const [posts, setPosts] = useState<UGCPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUGCPosts()
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  const portfolioMedia = collectPortfolioMedia(posts);

  return (
    <main className="bg-[#fffaf4]">
      <section className="px-5 pb-16 pt-32 sm:pt-36">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#111827]/10 bg-white px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#31516f] shadow-sm">
              <BadgeCheck className="size-4 text-[#0f766e]" />
              Travel UGC portfolio
            </div>
            <h1 className="font-heading text-[clamp(3rem,8vw,6.7rem)] font-semibold leading-[0.9] tracking-tight text-[#111827]">
              UGC for brands that need the trip to feel real.
            </h1>
            <p className="mt-7 max-w-2xl text-[18px] leading-8 text-[#4b5563]">
              I create creator-led videos, lifestyle photos, and travel stories
              for hotels, tourism, product, food, and lifestyle brands. The aim
              is simple: content that feels native, useful, and easy to buy.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {niches.map((niche) => (
                <Badge
                  key={niche}
                  className="rounded-full bg-white px-4 py-2 text-[#111827] shadow-sm"
                >
                  {niche}
                </Badge>
              ))}
            </div>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                className="h-12 rounded-full bg-[#111827] px-6 text-[14px] font-semibold text-white hover:bg-[#2563eb]"
                render={<a href="mailto:hello@travelwithvanes.com" />}
              >
                <Mail className="size-4" />
                Request rates
              </Button>
              <Button
                variant="outline"
                className="h-12 rounded-full border-[#111827]/15 bg-white px-6 text-[14px] font-semibold"
                render={<Link href="/itineraries" />}
              >
                See travel guides
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-[0.85fr_1.15fr]">
            <div className="space-y-4 pt-10">
              <div className="rounded-[2rem] bg-[#2563eb] p-4 text-white shadow-[0_24px_70px_rgba(37,99,235,0.22)]">
                <div className="aspect-[9/16] rounded-[1.4rem] bg-white/10 p-5">
                  <Play className="size-10 fill-white rounded-full bg-white/20 p-2" />
                  <p className="mt-28 text-3xl font-semibold leading-none">
                    hotel stay that feels booked, not staged
                  </p>
                </div>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#6b7280]">
                  Based in
                </p>
                <div className="mt-3 flex items-center gap-2 font-semibold">
                  <MapPin className="size-4 text-[#f97316]" />
                  Brazil + Australia routes
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-[2rem] bg-[#f97316] p-6 text-white shadow-[0_24px_70px_rgba(249,115,22,0.2)]">
                <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-white/70">
                  Creator profile
                </p>
                <h2 className="mt-24 text-5xl font-semibold leading-[0.9]">
                  warm, practical, destination-aware
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-[#0f766e] p-5 text-white">
                  <Camera className="size-7" />
                  <p className="mt-12 text-xl font-semibold">Photo sets</p>
                </div>
                <div className="rounded-2xl bg-[#111827] p-5 text-white">
                  <Clapperboard className="size-7" />
                  <p className="mt-12 text-xl font-semibold">UGC ads</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 grid gap-6 md:grid-cols-[0.75fr_1.25fr] md:items-end">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#f97316]">
                Work samples
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight text-[#111827] sm:text-5xl">
                Scroll-native formats brands can actually use.
              </h2>
            </div>
            <p className="text-lg leading-8 text-[#4b5563]">
              Instead of a generic portfolio wall, each sample makes the buyer
              answer the useful questions: what format is it, what problem does
              it solve, and where could it run?
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

      <section id="pricing" className="scroll-mt-24 bg-[#f6fbfe] px-5 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#0f766e]">
              Deliverables
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-[#111827] sm:text-5xl">
              Built for organic trust and paid testing.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {packages.map((pack) => (
              <div
                key={pack.name}
                className="rounded-2xl border border-[#111827]/10 bg-white p-6 shadow-sm"
              >
                <h3 className="text-2xl font-semibold text-[#111827]">
                  {pack.name}
                </h3>
                <p className="mt-3 leading-7 text-[#4b5563]">{pack.detail}</p>
                <div className="mt-6 space-y-3">
                  {pack.includes.map((item) => (
                    <div key={item} className="flex gap-3 text-sm font-medium">
                      <Check className="mt-0.5 size-4 text-[#0f766e]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#111827] px-5 py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#facc15]">
              Process
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Clear enough for a brand team. Flexible enough for real life.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {process.map((step, index) => (
              <div key={step} className="rounded-2xl bg-white/10 p-5">
                <span className="text-sm font-semibold text-[#facc15]">
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
              <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#2563eb]">
                Case studies
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight text-[#111827] sm:text-5xl">
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
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2563eb] border-t-transparent" />
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#111827]/20 bg-[#fffaf4] p-8 text-[#4b5563]">
              CMS case studies can appear here once added. For now, the sample
              grid above carries the portfolio structure.
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
                    className="rounded-2xl border border-[#111827]/10 bg-[#fffaf4] p-5 transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    {previewUrl ? (
                      <VideoTile
                        url={previewUrl}
                        aspectClassName="mb-5 aspect-[4/3]"
                        showOverlayText={false}
                        className="rounded-xl"
                      />
                    ) : (
                      <div className="mb-5 aspect-[4/3] rounded-xl bg-[#2563eb]" />
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
                    <h3 className="text-xl font-semibold leading-tight text-[#111827]">
                      {post.title}
                    </h3>
                    <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#2563eb]">
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

      <section className="bg-[#fffaf4] px-5 py-20">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <Sparkles className="size-9 text-[#f97316]" />
            <h2 className="mt-5 text-4xl font-semibold tracking-tight text-[#111827] sm:text-5xl">
              Let&apos;s build the angle before we build the edit.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#4b5563]">
              Send a brief, product link, location, or campaign goal and I will
              respond with next steps for content, usage, and timeline.
            </p>
          </div>
          <div className="rounded-[2rem] bg-[#2563eb] p-7 text-white">
            <div className="flex items-center gap-3">
              <MessageSquare className="size-7" />
              <p className="text-xl font-semibold">Brand enquiry</p>
            </div>
            <div className="mt-8 grid gap-3">
              <Button
                className="h-12 rounded-full bg-white px-6 text-[14px] font-semibold text-[#111827] hover:bg-[#fef3c7]"
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
}
