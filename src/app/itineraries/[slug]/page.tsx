import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SanitizedHtml } from "@/components/sanitized-html";
import { SafeImage } from "@/components/media/safe-image";
import { BuyGuideButton } from "@/components/itineraries/buy-guide-button";
import { GuideTimeline } from "@/components/itineraries/guide-timeline";
import { getItineraryBySlug } from "@/lib/firestore";
import { hasRichListContent } from "@/lib/itinerary-migrate";
import { formatGuidePrice } from "@/lib/pricing";
import { plainTextFromHtml } from "@/lib/rich-text";

export const revalidate = 300;

type Params = { slug: string };

async function loadGuide(slug: string) {
  try {
    const guide = await getItineraryBySlug(slug);
    return guide && guide.published ? guide : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = await loadGuide(slug);
  if (!guide) return { title: "Guide not found" };
  return {
    title: guide.title,
    description: plainTextFromHtml(guide.description).slice(0, 160),
    openGraph: guide.coverImage ? { images: [guide.coverImage] } : undefined,
  };
}

export default async function ItineraryDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const guide = await loadGuide(slug);
  if (!guide) notFound();

  const previewDays = guide.days.slice(0, Math.min(2, guide.days.length));
  const lockedCount = Math.max(guide.days.length - previewDays.length, 0);
  const price = formatGuidePrice(guide.price);
  const dayLabel = `${guide.duration} ${guide.duration === 1 ? "day" : "days"}`;
  const facts = [
    { label: "Length", value: dayLabel },
    { label: "Country", value: guide.country || "—" },
    { label: "Places", value: guide.destinations.join(", ") },
  ];
  const gallery = guide.gallery.filter(Boolean).slice(0, 3);

  return (
    <main className="text-ink">
      <div className="wrap pb-16 pt-[calc(var(--nav-height)+1.5rem)] sm:pt-[calc(var(--nav-height)+2.5rem)]">
        <nav aria-label="Breadcrumb" className="text-[14px] text-dust">
          <Link href="/itineraries" className="hover:text-ink hover:underline">Trip guides</Link>
          {guide.country ? (
            <>
              <span aria-hidden className="mx-2">/</span>
              <Link href={`/itineraries?country=${encodeURIComponent(guide.country)}`} className="hover:text-ink hover:underline">{guide.country}</Link>
            </>
          ) : null}
        </nav>

        <div className="mt-4 grid gap-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-14">
          <div className="min-w-0">
            <h1 className="t-h1">{guide.title}</h1>
            <SanitizedHtml html={guide.description} className="rich-text t-lead mt-3 max-w-2xl text-dust" />

            <div className="mt-6 overflow-hidden rounded-xl bg-mata">
              {guide.coverImage ? (
                <SafeImage src={guide.coverImage} alt="" className="aspect-[16/9] max-h-[62vh] w-full object-cover" />
              ) : (
                <div className="aspect-[16/9] max-h-[62vh] w-full bg-[linear-gradient(150deg,#0e4d3a,#0b2a20)]" />
              )}
            </div>
            {gallery.length > 0 ? (
              <div className="mt-3 grid grid-cols-3 gap-3">
                {gallery.map((url) => (
                  <SafeImage key={url} hideOnError src={url} alt="" loading="lazy" className="aspect-[4/3] w-full rounded-lg object-cover" />
                ))}
              </div>
            ) : null}

            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 rounded-xl bg-mist p-5 lg:hidden">
              {facts.map((fact) => (
                <div key={fact.label} className={fact.label === "Places" ? "col-span-2" : ""}>
                  <dt className="text-[13px] text-dust">{fact.label}</dt>
                  <dd className="mt-0.5 text-[15px] font-medium">{fact.value}</dd>
                </div>
              ))}
            </dl>

            {previewDays.length > 0 ? (
              <section className="mt-12">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="t-h2">Free preview</h2>
                  <p className="text-[14px] text-dust">{previewDays.length} of {guide.days.length} sections</p>
                </div>
                <GuideTimeline days={previewDays} fadeLast={lockedCount > 0} />
              </section>
            ) : null}

            {lockedCount > 0 ? (
              <div className="mt-2 flex flex-col gap-5 rounded-xl bg-floresta p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-7">
                <div className="flex gap-4">
                  <Lock className="mt-1 size-5 shrink-0 text-maracuja" aria-hidden />
                  <div>
                    <h3 className="t-h3">{lockedCount} more {lockedCount === 1 ? "day" : "days"} in the full guide</h3>
                    <p className="mt-1 max-w-md text-[15px] leading-6 text-white/70">Every day of the route, plus Vanessa&apos;s food, stay and practical notes.</p>
                  </div>
                </div>
                <BuyGuideButton itineraryId={guide.id} label={`Unlock for ${price}`} className="shrink-0 sm:w-56" />
              </div>
            ) : null}

            {hasRichListContent(guide.included) ? (
              <section className="mt-12">
                <h2 className="t-h2">Inside the full guide</h2>
                <SanitizedHtml html={guide.included} className="rich-text mt-5 text-[15px] leading-7 text-ink/85" />
              </section>
            ) : null}

            {hasRichListContent(guide.excluded) ? (
              <section className="mt-10 rounded-xl bg-mist p-6">
                <h2 className="text-[15px] font-semibold">Good to know</h2>
                <SanitizedHtml html={guide.excluded} className="rich-text mt-3 text-[14px] leading-6 text-dust" />
              </section>
            ) : null}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-[calc(var(--nav-height)+1.5rem)] space-y-4">
              <div className="rounded-xl border border-ink/10 bg-white p-6 soft-shadow">
                <p className="text-[14px] text-dust">Full guide</p>
                <p className="mt-1 font-heading text-[1.75rem] leading-tight text-mata">{price}</p>
                <p className="mt-1 text-[13px] text-dust">One-time purchase, instant access</p>
                <dl className="mt-5 space-y-3 border-t border-ink/10 pt-5">
                  {facts.map((fact) => (
                    <div key={fact.label} className="grid grid-cols-[5rem_1fr] gap-3 text-[14px]">
                      <dt className="text-dust">{fact.label}</dt>
                      <dd className="font-medium leading-5">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
                {hasRichListContent(guide.highlights) ? (
                  <div className="mt-5 border-t border-ink/10 pt-5">
                    <p className="text-[14px] font-semibold">Highlights</p>
                    <SanitizedHtml html={guide.highlights} className="rich-text mt-2 text-[14px] leading-6 text-dust" />
                  </div>
                ) : null}
                <BuyGuideButton itineraryId={guide.id} className="mt-6" />
                <p className="mt-3 flex items-center justify-center gap-1.5 text-[13px] text-dust"><Check className="size-3.5" aria-hidden />Secure checkout with Stripe</p>
              </div>
              <div className="rounded-xl bg-mist p-5">
                <p className="text-[15px] font-semibold">Want it planned and booked?</p>
                <p className="mt-1 text-[14px] leading-6 text-dust">Vanessa can tailor this route to your dates and arrange everything.</p>
                <Button variant="creator-outline" size="sm" className="mt-3" render={<Link href="/plan" />}>Plan a trip</Button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className="sticky bottom-0 z-30 border-t border-ink/10 bg-white/95 backdrop-blur lg:hidden">
        <div className="wrap flex items-center justify-between gap-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold">{guide.title}</p>
            <p className="text-[13px] text-dust">Full guide {price}</p>
          </div>
          <BuyGuideButton itineraryId={guide.id} label="Unlock" className="w-28 shrink-0" />
        </div>
      </div>
    </main>
  );
}
