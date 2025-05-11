// app/api/create-checkout-session/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

export async function POST(req: Request) {
  const { priceId, userEmail } = await req.json();

  console.log(priceId, userEmail);

  if (!priceId || !userEmail) {
    return NextResponse.json({ error: "Missing priceId or userEmail" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: {
      userEmail,
      priceId,
    },
    success_url: `${process.env.NEXT_PUBLIC_HOST_URL}/billing/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_HOST_URL}/billing`,
  });

  return NextResponse.json({ url: session.url });
}
