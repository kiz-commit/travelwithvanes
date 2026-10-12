import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TripCard } from "@/components/trips/trip-card";
import { TripCover } from "@/components/trips/trip-cover";
import { PackageInclusions, PlanTripBand } from "@/components/trips/planning-sections";
import { tripLengthLabel } from "@/lib/trip-packages";
import { loadPublicTrip } from "@/lib/trips-data";

type Params = { slug: string };

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const { trip } = await loadPublicTrip(slug);
  if (!trip) return { title: "Trip not found" };
  return {
    title: trip.title,
    description: trip.kicker,
    openGraph: trip.image ? { images: [trip.image] } : undefined,
  };
}

export default async function TripDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const { trip, all } = await loadPublicTrip(slug);
  if (!trip) notFound();

  const others = [
    ...all.filter((item) => item.slug !== trip.slug && item.country === trip.country),
    ...all.filter((item) => item.slug !== trip.slug && item.country !== trip.country),
  ].slice(0, 3);
  const planHref = `/plan?trip=${trip.slug}`;
  const priceLabel = trip.fromPrice ? `From ${trip.fromPrice}` : "Tailored quote";

  const facts = [
    { label: "Length", value: tripLengthLabel(trip) },
    { label: "Route", value: trip.route.join(" → ") },
    { label: "When to go", value: trip.season },
    { label: "Pace", value: trip.pace },
    { label: "Best for", value: trip.bestFor },
  ];

  return (
    <main className="text-ink">
      <div className="wrap pb-16 pt-[calc(var(--nav-height)+1.5rem)] sm:pt-[calc(var(--nav-height)+2.5rem)]">
        <nav aria-label="Breadcrumb" className="text-[14px] text-dust">
          <Link href="/trips" className="hover:text-ink hover:underline">Signature trips</Link>
          <span aria-hidden className="mx-2">/</span>
          <span>{trip.country}</span>
        </nav>

        <div className="mt-4 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
          {/* Main column */}
          <div className="min-w-0">
            <h1 className="t-h1">{trip.title}</h1>
            <p className="t-lead mt-3 max-w-2xl text-dust">{trip.kicker}</p>

            <div className="relative mt-6 overflow-hidden rounded-xl">
              <TripCover trip={trip} priority className="aspect-[16/9] max-h-[62vh] w-full" />
              {trip.badge ? (
                <span className="absolute left-3 top-3 rounded-md bg-maracuja px-2.5 py-1 text-[12px] font-semibold text-ink">{trip.badge}</span>
              ) : null}
            </div>

            {/* Key facts — on mobile they sit here; on desktop they're in the booking card */}
            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 rounded-xl bg-mist p-5 lg:hidden">
              {facts.slice(0, 4).map((fact) => (
                <div key={fact.label}>
                  <dt className="text-[13px] text-dust">{fact.label}</dt>
                  <dd className="mt-0.5 text-[15px] font-medium">{fact.value}</dd>
                </div>
              ))}
            </dl>

            <section className="mt-12">
              <h2 className="t-h2">The trip</h2>
              <p className="mt-4 max-w-2xl text-[17px] leading-8 text-ink/85">{trip.summary}</p>
            </section>

            <section className="mt-12">
              <h2 className="t-h2">Highlights</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {trip.highlights.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] leading-6">
                    <Check className="mt-1 size-4 shrink-0 text-mata" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-12">
              <h2 className="t-h2">{trip.nights > 0 ? "Day by day, roughly" : "How it works"}</h2>
              <ol className="mt-6 border-l-2 border-mist">
                {trip.outline.map((stop) => (
                  <li key={stop.title} className="relative pb-8 pl-6 last:pb-0">
                    <span aria-hidden className="absolute -left-[7px] top-1.5 size-3 rounded-full border-2 border-white bg-mata" />
                    <p className="text-[14px] font-semibold text-mar">{stop.when}</p>
                    <h3 className="t-h3 mt-1">{stop.title}</h3>
                    <p className="mt-1.5 max-w-2xl text-[15px] leading-7 text-dust">{stop.copy}</p>
                  </li>
                ))}
              </ol>
              <p className="mt-8 max-w-2xl rounded-lg bg-mist px-4 py-3 text-[14px] leading-6 text-dust">
                This is a starting shape, not a fixed tour. Nights, stays and experiences change to suit your dates, budget and travel style.
              </p>
            </section>

            <section className="mt-12">
              <h2 className="t-h2">Included</h2>
              <PackageInclusions className="mt-6" />
            </section>
          </div>

          {/* Booking card */}
          <aside className="hidden lg:block">
            <div className="sticky top-[calc(var(--nav-height)+1.5rem)] rounded-xl border border-ink/10 bg-white p-6 soft-shadow">
              <p className="text-[14px] text-dust">{trip.fromPrice ? "Guide price" : "Pricing"}</p>
              <p className="mt-1 font-heading text-[1.75rem] leading-tight text-mata">{priceLabel}</p>
              <p className="mt-1 text-[13px] leading-5 text-dust">
                {trip.fromPrice ? "Per person, twin share. " : "Priced to your dates and group. "}International flights not included.
              </p>
              <dl className="mt-5 space-y-3 border-t border-ink/10 pt-5">
                {facts.map((fact) => (
                  <div key={fact.label} className="grid grid-cols-[6rem_1fr] gap-3 text-[14px]">
                    <dt className="text-dust">{fact.label}</dt>
                    <dd className="font-medium leading-5">{fact.value}</dd>
                  </div>
                ))}
              </dl>
              <Button variant="primary" size="cta" className="mt-6 w-full" render={<Link href={planHref} />}>
                Request this trip
              </Button>
              <p className="mt-3 text-center text-[13px] text-dust">Free to ask. Vanessa replies personally.</p>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile booking bar */}
      <div className="sticky bottom-0 z-30 border-t border-ink/10 bg-white/95 backdrop-blur lg:hidden">
        <div className="wrap flex items-center justify-between gap-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold">{trip.title}</p>
            <p className="text-[13px] text-dust">{priceLabel}, {tripLengthLabel(trip)}</p>
          </div>
          <Button variant="primary" size="sm" className="h-11 shrink-0 px-4" render={<Link href={planHref} />}>
            Request trip
          </Button>
        </div>
      </div>

      {others.length > 0 ? (
        <section className="section bg-mist">
          <div className="wrap">
            <div className="flex items-end justify-between gap-6">
              <h2 className="t-h2">You might also like</h2>
              <Link href="/trips" className="text-[15px] font-semibold text-mar hover:underline">All trips</Link>
            </div>
            <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((item) => <TripCard key={item.id} trip={item} />)}
            </div>
          </div>
        </section>
      ) : null}

      <PlanTripBand
        title={trip.nights > 0 ? `Make “${trip.title}” yours` : "Tell Vanessa the dream"}
        href={planHref}
        label="Request this trip"
      />
    </main>
  );
}
