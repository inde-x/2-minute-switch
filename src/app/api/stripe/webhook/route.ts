// src/app/api/stripe/webhook/route.ts
import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabaseServer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Maps Stripe subscription statuses to our allowed values.
// Stripe can return many statuses; we normalise to the subset we store.
type SubscriptionStatus =
  | "none"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled";

function toStatus(stripeStatus: Stripe.Subscription.Status): SubscriptionStatus {
  switch (stripeStatus) {
    case "trialing":
      return "trialing";
    case "active":
      return "active";
    case "past_due":
      return "past_due";
    case "canceled":
    case "unpaid":
    case "incomplete_expired":
      return "canceled";
    default:
      return "none";
  }
}

async function handleSubscriptionChange(sub: Stripe.Subscription) {
  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer.id;

  const status = toStatus(sub.status);
  // In Stripe API v20+ current_period_end lives on each SubscriptionItem.
  // We use the first item's value as the subscription-level period end.
  const periodEndUnix = sub.items.data[0]?.current_period_end ?? null;
  const currentPeriodEnd = periodEndUnix
    ? new Date(periodEndUnix * 1000).toISOString()
    : null;

  const db = createServiceClient();

  const { error } = await db
    .from("profiles")
    .update({
      subscription_status: status,
      current_period_end: currentPeriodEnd,
    })
    .eq("stripe_customer_id", customerId);

  if (error) {
    console.error(
      `[stripe-webhook] Failed to update profile for customer=${customerId}`,
      error,
    );
    // Return the error so the caller can decide whether to return 500
    return error;
  }

  console.log(
    `[stripe-webhook] Updated profile customer=${customerId} status=${status} period_end=${currentPeriodEnd}`,
  );
  return null;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    console.error("[stripe-webhook] Missing stripe-signature header");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[stripe-webhook] Signature verification failed: ${message}`);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(
        `[stripe-webhook] checkout.session.completed — session=${session.id} customer=${session.customer} subscription=${session.subscription}`,
      );
      break;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      console.log(
        `[stripe-webhook] ${event.type} — sub=${sub.id} customer=${sub.customer} status=${sub.status}`,
      );
      const err = await handleSubscriptionChange(sub);
      if (err) {
        return NextResponse.json({ error: "DB update failed" }, { status: 500 });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      console.log(
        `[stripe-webhook] customer.subscription.deleted — sub=${sub.id} customer=${sub.customer}`,
      );
      const err = await handleSubscriptionChange(sub);
      if (err) {
        return NextResponse.json({ error: "DB update failed" }, { status: 500 });
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId =
        typeof invoice.customer === "string"
          ? invoice.customer
          : invoice.customer?.id ?? "";
      console.log(
        `[stripe-webhook] invoice.payment_failed — invoice=${invoice.id} customer=${customerId}`,
      );
      // The subscription.updated event that follows will set status=past_due;
      // we log here for observability but don't need to write separately.
      break;
    }

    default:
      console.log(`[stripe-webhook] Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
