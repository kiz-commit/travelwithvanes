import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getItineraryById } from "@/lib/firestore";
import { plainTextFromHtml } from "@/lib/rich-text";
import { GUIDE_CURRENCY } from "@/lib/pricing";

function baseUrl(request: Request): string {
  return process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin;
}

export async function POST(request: Request) {
  try {
    const { itemType, itemId } = (await request.json()) as {
      itemType?: string;
      itemId?: string;
    };

    if (itemType !== "itinerary" || !itemId) {
      return NextResponse.json({ error: "Unknown item." }, { status: 400 });
    }

    // Always price from the database — never trust a price sent by the browser.
    const itinerary = await getItineraryById(itemId);
    if (!itinerary || !itinerary.published || !(itinerary.price > 0)) {
      return NextResponse.json(
        { error: "This guide isn't available to buy right now." },
        { status: 404 }
      );
    }

    const stripe = getStripe();
    const site = baseUrl(request);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: GUIDE_CURRENCY,
            product_data: {
              name: `${itinerary.title} — full trip guide`,
              description: plainTextFromHtml(itinerary.description).slice(0, 300) || undefined,
              images: itinerary.coverImage ? [itinerary.coverImage] : undefined,
            },
            // Stripe amounts are in the smallest currency unit (cents).
            unit_amount: Math.round(itinerary.price * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${site}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/itineraries/${itinerary.slug}`,
      metadata: { itemType: "itinerary", itemId: itinerary.id, slug: itinerary.slug },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Checkout is unavailable right now. Please try again shortly." },
      { status: 500 }
    );
  }
}
