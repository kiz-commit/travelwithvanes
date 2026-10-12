import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TripsBrowser } from "@/components/trips/trips-browser";
import {
  HowItWorks,
  PackageInclusions,
  PlanTripBand,
  TripFaq,
} from "@/components/trips/planning-sections";
import { loadPublicTrips } from "@/lib/trips-data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Signature trips",
  description:
    "Tailored Rio de Janeiro, Brazil and South America trips designed by Vanessa — stays, transfers, guides and a day-by-day plan.",
};

export default async function TripsPage() {
  const trips = await loadPublicTrips();

  return (
    <main className="text-ink">
      <section className="pb-10 pt-[calc(var(--nav-height)+2.5rem)] sm:pt-[calc(var(--nav-height)+3.5rem)]">
        <div className="wrap grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="kicker">Plan it for me</p>
            <h1 className="t-h1 mt-2">Signature trips</h1>
            <p className="t-lead mt-4 max-w-xl text-dust">
              Routes Vanessa knows inside out, ready to shape around your dates, budget and pace. Pick one as a starting point, or ask for something completely custom.
            </p>
          </div>
          <div className="rounded-xl bg-mist p-5">
            <ul className="grid gap-2.5 text-[15px]">
              {[
                "Stays, transfers and guides arranged",
                "A day-by-day plan you can hold",
                "WhatsApp support while you travel",
                "Free to ask — pay only once you're happy",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 size-4 shrink-0 text-mata" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <Button variant="primary" size="cta" className="mt-5 w-full" render={<Link href="/plan" />}>
              Plan a custom trip
            </Button>
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-20">
        <div className="wrap">
          <TripsBrowser trips={trips} />
        </div>
      </section>

      <section className="section bg-mist">
        <div className="wrap">
          <h2 className="t-h2">How it works</h2>
          <HowItWorks className="mt-8" />
        </div>
      </section>

      <section className="section">
        <div className="wrap grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <div>
            <h2 className="t-h2">What every trip includes</h2>
            <p className="mt-3 max-w-sm text-[16px] leading-7 text-dust">
              International flights are booked separately so you can use your own points. Everything on the ground is taken care of.
            </p>
          </div>
          <PackageInclusions />
        </div>
      </section>

      <section className="section border-t border-ink/10">
        <div className="wrap grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <h2 className="t-h2">Questions people ask</h2>
          <TripFaq />
        </div>
      </section>

      <PlanTripBand />
    </main>
  );
}
