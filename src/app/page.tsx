"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const featuredItineraries = [
  {
    title: "7-Day Rio & São Paulo Guide",
    description:
      "Preview Copacabana sunsets, São Paulo food stops, and the route details you can unlock in the full guide.",
    duration: "7 Days",
    price: "$29",
    gradient: "from-[#0c4a3a] via-[#1a6b4a] to-[#2d8a5e]",
    location: "Brazil",
  },
  {
    title: "10-Day Australian Coast Guide",
    description:
      "Get a taste of Sydney Harbour, the Great Ocean Road, and the coastal notes inside the full guide.",
    duration: "10 Days",
    price: "$39",
    gradient: "from-[#8B5E3C] via-[#C1440E] to-[#d4764a]",
    location: "Australia",
  },
  {
    title: "14-Day Brazil & Australia Guide",
    description:
      "Sample the two-country route, then unlock the complete plan with hidden gems and local favourites.",
    duration: "14 Days",
    price: "$49",
    gradient: "from-[#1a3a5c] via-[#2d5a8a] to-[#4DACD4]",
    location: "Both",
  },
];

const ugcCards = [
  { tag: "UGC", title: "Hotel room reveal with natural voiceover", gradient: "from-[#0a3d2e] to-[#1a6b4a]", aspect: "aspect-[3/4]" },
  { tag: "Brand", title: "Travel essential packed into a real day", gradient: "from-[#C1440E] to-[#d4764a]", aspect: "aspect-[4/5]" },
  { tag: "Australia", title: "Coastal experience reel from Bondi", gradient: "from-[#1a3a5c] to-[#4DACD4]", aspect: "aspect-[3/4]" },
  { tag: "Food", title: "Restaurant story in São Paulo", gradient: "from-[#8B5E3C] to-[#C1440E]", aspect: "aspect-[4/3]" },
  { tag: "Tourism", title: "Destination guide with creator-led tips", gradient: "from-[#2d5a8a] to-[#0a3d2e]", aspect: "aspect-[3/4]" },
  { tag: "Lifestyle", title: "Road trip content for travel brands", gradient: "from-[#C1440E] to-[#d4764a]", aspect: "aspect-[4/5]" },
];

const partnershipServices = [
  {
    name: "UGC Video Packages",
    description: "Short-form videos, hooks, voiceovers, and product-in-use storytelling.",
    gradient: "from-[#e8ddd0] to-[#d4c4b0]",
  },
  {
    name: "Hotel & Stay Features",
    description: "Room tours, experience reels, amenities, and destination-led stay content.",
    gradient: "from-[#d4c4b0] to-[#c4b4a0]",
  },
  {
    name: "Tourism Partnerships",
    description: "Brazil and Australia guides, local recommendations, and itinerary content.",
    gradient: "from-[#c4d4d0] to-[#a4c4c0]",
  },
  {
    name: "Travel Brand Content",
    description: "Lifestyle photos and reels that show products in real travel moments.",
    gradient: "from-[#d0c8c0] to-[#c0b8b0]",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a2e1f] via-[#0c3d2e] to-[#1a4a3a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,215,0,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(77,172,212,0.1),transparent_60%)]" />

        <div className="relative z-10 mx-auto max-w-4xl px-5 text-center">
          <p className="mb-6 text-[12px] font-semibold uppercase tracking-[0.2em] text-gold/80">
            Brazil & Australia
          </p>
          <h1 className="font-heading text-[clamp(2.5rem,7vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.03em] text-white">
            Discover your{" "}
            <span className="italic">next</span>
            <br />
            adventure
          </h1>
          <p className="mx-auto mt-8 max-w-lg text-[17px] font-light leading-relaxed text-white/60">
            Curated trip guides, local travel notes, and authentic stories
            from a creator who calls both countries home.
          </p>
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              className="h-[52px] rounded-full bg-white px-8 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#0a2e1f] hover:bg-white/90 shadow-xl shadow-white/10"
              render={<Link href="/itineraries" />}
            >
              Preview Trip Guides
              <ArrowRight className="ml-2 size-4" />
            </Button>
            <Button
              variant="ghost"
              className="h-[52px] rounded-full px-8 text-[13px] font-semibold uppercase tracking-[0.08em] text-white/70 hover:text-white hover:bg-white/10"
              render={<Link href="/itineraries" />}
            >
              Browse Itineraries
            </Button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Destinations */}
      <section className="relative py-24 px-5">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ochre mb-3">
              Where we go
            </p>
            <h2 className="font-heading text-[clamp(2rem,4vw,3.5rem)] font-medium tracking-[-0.02em]">
              Two countries,{" "}
              <span className="italic">endless</span> stories
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Link href="/itineraries" className="group relative block overflow-hidden rounded-3xl">
              <div className="aspect-[4/3] bg-gradient-to-br from-[#0a3d2e] via-[#1a6b4a] to-[#2d8a5e] transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="size-3.5 text-gold" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gold">
                    South America
                  </span>
                </div>
                <h3 className="font-heading text-4xl font-medium text-white tracking-[-0.02em]">
                  Brazil
                </h3>
                <p className="mt-2 text-[15px] text-white/60">
                  Rio de Janeiro, São Paulo, Florianópolis, Salvador
                </p>
              </div>
            </Link>

            <Link href="/itineraries" className="group relative block overflow-hidden rounded-3xl">
              <div className="aspect-[4/3] bg-gradient-to-br from-[#8B5E3C] via-[#C1440E] to-[#d4764a] transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="size-3.5 text-gold" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gold">
                    Oceania
                  </span>
                </div>
                <h3 className="font-heading text-4xl font-medium text-white tracking-[-0.02em]">
                  Australia
                </h3>
                <p className="mt-2 text-[15px] text-white/60">
                  Sydney, Melbourne, Gold Coast, Byron Bay
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Trip Guides */}
      <section className="py-24 px-5 bg-sand/30">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-14">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ochre mb-3">
                Curated for you
              </p>
              <h2 className="font-heading text-[clamp(2rem,4vw,3rem)] font-medium tracking-[-0.02em]">
                Featured <span className="italic">trip guides</span>
              </h2>
            </div>
            <Link
              href="/itineraries"
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.08em] text-foreground/50 hover:text-foreground transition-colors"
            >
              View all guides
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredItineraries.map((item) => (
              <Link
                key={item.title}
                href="/itineraries"
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] transition-all duration-300 hover:shadow-xl hover:shadow-black/[0.06] hover:-translate-y-1"
              >
                <div className={`relative h-56 bg-gradient-to-br ${item.gradient} overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
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
                  <p className="mt-2 text-[14px] leading-relaxed text-foreground/50 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-[13px] font-medium text-ochre group-hover:gap-2 transition-all">
                    Preview guide
                    <ArrowRight className="size-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* UGC / Content Reel */}
      <section className="py-24 px-5">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-14">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ochre mb-3">
                UGC portfolio
              </p>
              <h2 className="font-heading text-[clamp(2rem,4vw,3rem)] font-medium tracking-[-0.02em]">
                Content made for <span className="italic">brands</span>
              </h2>
            </div>
            <Link
              href="/ugc"
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.08em] text-foreground/50 hover:text-foreground transition-colors"
            >
              View UGC
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {ugcCards.map((card) => (
              <Link
                key={card.title}
                href="/ugc"
                className={`group relative mb-5 block break-inside-avoid overflow-hidden rounded-2xl ${card.aspect}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} transition-transform duration-700 group-hover:scale-110`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="rounded-full bg-white/15 backdrop-blur-md px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/90">
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

      {/* Partnerships */}
      <section className="py-24 px-5 bg-sand/30">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-14">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ochre mb-3">
                Potential partnerships
              </p>
              <h2 className="font-heading text-[clamp(2rem,4vw,3rem)] font-medium tracking-[-0.02em]">
                Ways we can <span className="italic">work together</span>
              </h2>
            </div>
            <Link
              href="/about"
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.08em] text-foreground/50 hover:text-foreground transition-colors"
            >
              Work with me
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {partnershipServices.map((service) => (
              <Link
                key={service.name}
                href="/about"
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className={`aspect-square bg-gradient-to-br ${service.gradient} transition-transform duration-500 group-hover:scale-105`} />
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

      {/* Social Proof */}
      <section className="py-20 px-5">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="size-4 fill-gold text-gold" />
            ))}
          </div>
          <blockquote className="font-heading text-[clamp(1.3rem,3vw,2rem)] font-medium italic leading-snug tracking-[-0.01em] text-foreground/80">
            &ldquo;Vanessa&apos;s guide made our Brazil trip absolutely magical.
            The preview gave us confidence, and the full guide had every detail
            we needed.&rdquo;
          </blockquote>
          <p className="mt-6 text-[13px] font-medium uppercase tracking-[0.1em] text-foreground/40">
            Sarah & Mike - 7 Day Brazil Trip
          </p>
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative overflow-hidden py-24 px-5">
        <div className="absolute inset-0 bg-[#0a2e1f]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,215,0,0.08),transparent_70%)]" />
        <div className="relative z-10 mx-auto max-w-xl text-center">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold/60">
            Start planning
          </p>
          <h2 className="font-heading text-[clamp(2rem,4vw,3rem)] font-medium tracking-[-0.02em] text-white">
            Find your <span className="italic">next guide</span>
          </h2>
          <p className="mt-4 text-[15px] text-white/50 leading-relaxed">
            Preview Brazil and Australia guides, compare routes, and unlock
            the full plan when you find the trip that fits.
          </p>
          <Button
            className="mt-10 h-[52px] rounded-full bg-gold px-8 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#0a2e1f] hover:bg-gold/90 shadow-lg shadow-gold/20"
            render={<Link href="/itineraries" />}
          >
            Explore Trip Guides
          </Button>
        </div>
      </section>
    </>
  );
}
