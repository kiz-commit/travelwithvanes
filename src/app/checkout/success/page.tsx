import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SanitizedHtml } from "@/components/sanitized-html";
import { GuideTimeline } from "@/components/itineraries/guide-timeline";
import { getItineraryById, getSiteSettings } from "@/lib/firestore";
import { hasRichListContent } from "@/lib/itinerary-migrate";
import { mergeWithSiteDefaults } from "@/lib/site-defaults";
import { getStripe } from "@/lib/stripe";
import { SafeImage } from "@/components/media/safe-image";
import type { Itinerary } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your guide",
  robots: { index: false, follow: false },
};

async function loadPurchase(sessionId: string | undefined): Promise<{
  paid: boolean;
  guide: Itinerary | null;
  email: string | null;
}> {
  if (!sessionId || !sessionId.startsWith("cs_")) return { paid: false, guide: null, email: null };
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === "paid";
    const itemId = session.metadata?.itemId;
    const guide = paid && session.metadata?.itemType === "itinerary" && itemId ? await getItineraryById(itemId) : null;
    return { paid, guide, email: session.customer_details?.email ?? null };
  } catch (error) {
    console.error("Could not load checkout session:", error);
    return { paid: false, guide: null, email: null };
  }
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const [{ paid, guide, email }, site] = await Promise.all([
    loadPurchase(session_id),
    getSiteSettings().catch(() => null),
  ]);
  const contact = mergeWithSiteDefaults(site).email;

  if (!paid || !guide) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center bg-linen px-5 pt-28">
        <div className="max-w-lg text-center">
          <CheckCircle2 className="mx-auto size-14 text-olive" />
          <h1 className="mt-6 font-heading text-4xl font-medium italic tracking-tight text-ink">
            {paid ? "Payment received — thank you!" : "We couldn't find that purchase"}
          </h1>
          <p className="mt-4 text-lg leading-8 text-dust">
            {paid
              ? "Your guide is being prepared. If it doesn't appear here, email Vanessa with your receipt and she'll send it straight over."
              : "If you've just paid, refresh this page in a moment. Still stuck? Email Vanessa with your receipt and she'll sort it out."}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button variant="creator" size="cta" render={<a href={`mailto:${contact}?subject=${encodeURIComponent("My trip guide purchase")}`} />}>
              <Mail className="size-4" /> Email Vanessa
            </Button>
            <Button variant="creator-outline" size="cta" render={<Link href="/itineraries" />}>Browse guides</Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-linen text-ink">
      <section className="px-5 pb-10 pt-32 sm:px-8 sm:pt-40 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-start gap-4 rounded-2xl bg-cobalt p-6 text-paper sm:p-8">
            <CheckCircle2 className="mt-1 size-6 shrink-0 text-sun" />
            <div>
              <p className="font-heading text-2xl font-medium">Obrigada! Your full guide is unlocked.</p>
              <p className="mt-2 text-sm leading-6 text-paper/75">
                Bookmark this page — it&apos;s your copy of the guide.
                {email ? ` A receipt has been sent to ${email}.` : ""} Questions on the road? Email {contact}.
              </p>
            </div>
          </div>

          <p className="section-eyebrow mt-14">Full trip guide · {guide.duration} {guide.duration === 1 ? "day" : "days"}</p>
          <h1 className="mt-4 font-heading text-[clamp(2.6rem,6vw,4.75rem)] font-medium leading-[0.95] tracking-[-0.05em]">{guide.title}</h1>
          {guide.coverImage ? (
            <SafeImage src={guide.coverImage} alt="" className="mt-10 aspect-[16/9] w-full rounded-2xl object-cover" />
          ) : null}
          <SanitizedHtml html={guide.description} className="rich-text mt-10 font-heading text-2xl leading-[1.4] text-ink" />

          <h2 className="mt-16 border-b border-ink/15 pb-4 font-heading text-3xl font-medium tracking-[-0.03em] sm:text-4xl">Day by day</h2>
          <GuideTimeline days={guide.days} />

          {hasRichListContent(guide.highlights) ? (
            <div className="mt-6 rounded-2xl bg-paper p-7">
              <h2 className="font-heading text-2xl font-medium">Highlights</h2>
              <SanitizedHtml html={guide.highlights} className="rich-text mt-4 text-[15px] leading-7 text-ink/80" />
            </div>
          ) : null}

          <div className="mt-16 flex flex-col items-start justify-between gap-5 rounded-2xl border border-ink/10 p-7 sm:flex-row sm:items-center">
            <div>
              <p className="font-heading text-2xl font-medium">Want this booked for you?</p>
              <p className="mt-1 text-sm text-dust">Vanessa can tailor and arrange the whole trip.</p>
            </div>
            <Button variant="creator" size="cta" render={<Link href="/plan" />}>Plan my trip <ArrowUpRight className="size-4" /></Button>
          </div>
        </div>
      </section>
    </main>
  );
}
