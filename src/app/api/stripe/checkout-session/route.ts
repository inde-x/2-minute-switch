// src/app/api/stripe/checkout-session/route.ts
import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabaseServer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  // ── 1. Authenticate the caller via the Authorization header ───────────────
  // The client sends: Authorization: Bearer <supabase-access-token>
  const authHeader = req.headers.get("authorization") ?? "";
  const accessToken = authHeader.replace(/^Bearer\s+/i, "").trim();

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createServiceClient();

  // Validate token and retrieve the user
  const {
    data: { user },
    error: userError,
  } = await db.auth.getUser(accessToken);

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── 2. Load (or init) the profile row ─────────────────────────────────────
  const { data: profile, error: profileError } = await db
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (profileError && profileError.code !== "PGRST116") {
    // PGRST116 = row not found — that is fine, we'll upsert below
    console.error("[checkout-session] profile fetch error", profileError);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  // ── 3. Create or reuse the Stripe Customer ────────────────────────────────
  let customerId: string = profile?.stripe_customer_id ?? "";

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;

    // Persist it immediately so concurrent requests don't create duplicates
    const { error: upsertError } = await db.from("profiles").upsert(
      { id: user.id, stripe_customer_id: customerId },
      { onConflict: "id" },
    );

    if (upsertError) {
      console.error("[checkout-session] profile upsert error", upsertError);
      return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
  }

  // ── 4. Create the Stripe Checkout Session ─────────────────────────────────
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],
    subscription_data: {
      trial_period_days: 7,
    },
    success_url: `${appUrl}/billing/success`,
    cancel_url: `${appUrl}/paywall?canceled=1`,
  });

  return NextResponse.json({ url: session.url });
}
