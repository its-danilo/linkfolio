import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe, PRO_PRICE_ID } from "@/lib/stripe";

/** Creates a Stripe Checkout session to subscribe to Pro. */
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile) {
    return NextResponse.json({ error: "no profile" }, { status: 400 });
  }

  const stripe = getStripe();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // Ensure the user has a Stripe customer.
  let customerId: string | null = profile.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { user_id: user.id },
    });
    customerId = customer.id;
    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: PRO_PRICE_ID, quantity: 1 }],
    allow_promotion_codes: true,
    success_url: `${siteUrl}/dashboard?upgraded=1`,
    cancel_url: `${siteUrl}/dashboard`,
  });

  return NextResponse.json({ url: session.url });
}
