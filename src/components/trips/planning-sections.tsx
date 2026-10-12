import Link from "next/link";
import { BedDouble, Car, Compass, MessageCircle, NotebookText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PACKAGE_INCLUSIONS } from "@/lib/trip-packages";
import { cn } from "@/lib/utils";

export const PLANNING_STEPS = [
  {
    title: "Tell Vanessa about the trip",
    copy: "Dates, who's coming, budget and what you're into. The planner takes about three minutes.",
  },
  {
    title: "Get a route that fits",
    copy: "Within a few days you get a suggested route with stays, experiences and a clear quote. Then you refine it together.",
  },
  {
    title: "Travel with backup",
    copy: "Everything's confirmed and written up, and Vanessa is a WhatsApp message away while you're in Brazil.",
  },
] as const;

export const TRIP_FAQS = [
  {
    q: "Is this a travel agency?",
    a: "Travelwithvanes is a small, personal trip-planning service run by Vanessa. Right now she designs trips one-on-one and arranges them with trusted local partners. Ready-to-book packages with a single price are on the way — tick the email box on the trip planner to hear first.",
  },
  {
    q: "Are international flights included?",
    a: "No. Flights to Brazil are booked separately, so you can use your own points and airline. Domestic flights within Brazil (say, Rio to Iguaçu) can be built into your trip.",
  },
  {
    q: "When is the best time to visit Rio?",
    a: "May to October is drier and milder — great for sightseeing and hiking. December to March is hot, humid and peak season, with New Year and Carnival bringing the biggest crowds and prices. There's no bad month, just different trips.",
  },
  {
    q: "Is Rio safe for visitors?",
    a: "Rio is a big city and needs the same street sense as any other. Your trip is built around well-located neighbourhoods, trusted drivers and guides, and a short, practical safety briefing before you go.",
  },
  {
    q: "Do I need a visa for Brazil?",
    a: "It depends on your passport, and the rules have changed in recent years. Check the official Brazilian government guidance for your nationality before booking — your plan will flag what to check.",
  },
  {
    q: "How far ahead should I start planning?",
    a: "Three to six months is ideal for most trips. For Carnival or New Year in Rio, start nine to twelve months out — the best-located stays go early.",
  },
] as const;

const INCLUSION_ICONS = [BedDouble, Car, Compass, NotebookText, MessageCircle];

export function HowItWorks({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <ol className={cn("grid gap-6 md:grid-cols-3 md:gap-8", className)}>
      {PLANNING_STEPS.map((step, index) => (
        <li key={step.title} className="flex gap-4">
          <span
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-full text-[15px] font-bold",
              dark ? "bg-maracuja text-ink" : "bg-mata text-white"
            )}
            aria-hidden
          >
            {index + 1}
          </span>
          <div>
            <h3 className={cn("t-h3", dark ? "text-white" : "text-ink")}>{step.title}</h3>
            <p className={cn("mt-1.5 text-[15px] leading-6", dark ? "text-white/70" : "text-dust")}>{step.copy}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function PackageInclusions({ className }: { className?: string }) {
  return (
    <ul className={cn("grid gap-x-8 gap-y-6 sm:grid-cols-2", className)}>
      {PACKAGE_INCLUSIONS.map((item, index) => {
        const Icon = INCLUSION_ICONS[index % INCLUSION_ICONS.length];
        return (
          <li key={item.title} className="flex gap-4">
            <Icon className="mt-0.5 size-5 shrink-0 text-mar" aria-hidden />
            <div>
              <h3 className="text-[16px] font-semibold text-ink">{item.title}</h3>
              <p className="mt-1 text-[15px] leading-6 text-dust">{item.copy}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function TripFaq({ className, limit }: { className?: string; limit?: number }) {
  const items = typeof limit === "number" ? TRIP_FAQS.slice(0, limit) : TRIP_FAQS;
  return (
    <div className={cn("divide-y divide-ink/10 border-y border-ink/10", className)}>
      {items.map((item) => (
        <details key={item.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-[17px] font-semibold text-ink marker:hidden [&::-webkit-details-marker]:hidden">
            {item.q}
            <Plus className="size-5 shrink-0 text-mar transition-transform group-open:rotate-45" aria-hidden />
          </summary>
          <p className="max-w-2xl pb-5 text-[15px] leading-7 text-dust">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

export function PlanTripBand({
  title = "Let's plan your Brazil.",
  body = "Tell Vanessa where you're dreaming of. She'll come back with a route, the right stays and an honest quote.",
  href = "/plan",
  label = "Plan a trip",
}: {
  title?: string;
  body?: string;
  href?: string;
  label?: string;
}) {
  return (
    <section className="bg-mata text-white">
      <div className="wrap flex flex-col gap-6 py-12 md:flex-row md:items-center md:justify-between md:py-14">
        <div className="max-w-2xl">
          <h2 className="t-h2">{title}</h2>
          <p className="mt-3 text-[16px] leading-7 text-white/75">{body}</p>
        </div>
        <Button variant="primary" size="cta" className="shrink-0" render={<Link href={href} />}>
          {label}
        </Button>
      </div>
    </section>
  );
}
