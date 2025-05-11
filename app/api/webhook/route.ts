// app/api/webhook/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { supabase } from "@/services/supabaseClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.metadata?.userEmail;

    // Determine credits from price ID
    // const priceId =
    //   session?.display_items?.[0]?.price?.id ||
    //   session?.line_items?.[0]?.price?.id;
    let creditsToAdd = 0;

    // Match your actual Stripe price IDs here
    switch (session?.metadata?.priceId) {
      case process.env.NEXT_PUBLIC_PRICE_ID_20:
        creditsToAdd = 20;
        break;
      case process.env.NEXT_PUBLIC_PRICE_ID_40:
        creditsToAdd = 40;
        break;
      default:
        creditsToAdd = 0;
    }

    // Update Supabase credits
    const { data: existing } = await supabase
      .from("Users")
      .select("credits")
      .eq("email", email)
      .single();

    const newCredits = (existing?.credits || 0) + creditsToAdd;

    await supabase
      .from("Users")
      .update({ credits: newCredits })
      .eq("email", email);
  }

  return NextResponse.json({ received: true });
}
