import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const { itemType, itemId, title, price } = await request.json();
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: title },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
      metadata: { itemType, itemId },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
