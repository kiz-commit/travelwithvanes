import type { Metadata } from "next";
import { Mail, MessageCircle } from "lucide-react";
import { PLANNING_STEPS } from "@/components/trips/planning-sections";
import { PlanTripForm } from "@/components/trips/plan-trip-form";
import { getSiteSettings } from "@/lib/firestore";
import { mergeWithSiteDefaults } from "@/lib/site-defaults";
import { loadPublicTrips } from "@/lib/trips-data";

export const metadata: Metadata = {
  title: "Plan a trip",
  description:
    "Tell Vanessa about your Rio or Brazil trip — dates, budget and travel style — and get a tailored route and quote.",
};

export const revalidate = 300;

export default async function PlanPage({
  searchParams,
}: {
  searchParams: Promise<{ trip?: string }>;
}) {
  const [{ trip }, trips, site] = await Promise.all([
    searchParams,
    loadPublicTrips(),
    getSiteSettings().catch(() => null),
  ]);
  const { email } = mergeWithSiteDefaults(site);

  return (
    <main className="text-ink">
      <div className="wrap pb-20 pt-[calc(var(--nav-height)+2rem)] sm:pt-[calc(var(--nav-height)+3rem)]">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
          <div className="min-w-0 max-w-2xl">
            <h1 className="t-h1">Plan a trip with Vanessa</h1>
            <p className="t-lead mt-3 text-dust">
              Four quick steps, about three minutes. Rough answers are perfect — Vanessa will follow up with ideas, a suggested route and an honest quote.
            </p>
            <div className="mt-10">
              <PlanTripForm
                trips={trips.map(({ slug, title, country }) => ({ slug, title, country }))}
                initialTripSlug={trip}
                email={email}
              />
            </div>
          </div>

          <aside className="lg:pt-2">
            <div className="rounded-xl bg-mist p-6 lg:sticky lg:top-[calc(var(--nav-height)+1.5rem)]">
              <h2 className="t-h3 font-heading">What happens next</h2>
              <ol className="mt-5 space-y-5">
                {PLANNING_STEPS.map((step, index) => (
                  <li key={step.title} className="flex gap-3">
                    <span aria-hidden className="grid size-7 shrink-0 place-items-center rounded-full bg-white text-[13px] font-bold text-mata ring-1 ring-mata/20">{index + 1}</span>
                    <div>
                      <p className="text-[15px] font-semibold">{step.title}</p>
                      <p className="mt-1 text-[14px] leading-6 text-dust">{step.copy}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-6 space-y-2 border-t border-ink/10 pt-5 text-[14px] text-dust">
                <p className="flex items-center gap-2"><MessageCircle className="size-4 text-mata" aria-hidden />Free to ask, no obligation</p>
                <p className="flex items-center gap-2"><Mail className="size-4 text-mata" aria-hidden />Prefer email? <a href={`mailto:${email}`} className="font-semibold text-mar hover:underline">{email}</a></p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
