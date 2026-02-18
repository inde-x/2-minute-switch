"use client";

// src/app/paywall/page.tsx
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { logEvent } from "@/lib/analytics";

export default function PaywallPage() {
  const searchParams = useSearchParams();
  const canceled = searchParams.get("canceled") === "1";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Log paywall_viewed once on mount
  useEffect(() => {
    logEvent("paywall_viewed");
  }, []);

  async function handleCheckout() {
    setError(null);
    setLoading(true);
    logEvent("checkout_clicked");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        window.location.href = `/login?next=${encodeURIComponent("/paywall")}`;
        return;
      }

      const res = await fetch("/api/stripe/checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "Failed to create checkout session");
      }

      const { url } = await res.json();
      window.location.href = url;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setError(message);
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      {canceled && (
        <p className="mb-6 rounded-md bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          Checkout was canceled — you can try again any time.
        </p>
      )}

      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Unlock 2-Minute Switch
      </h1>

      <p className="mt-4 text-base text-gray-600">
        Build sustainable state-switching habits with guided 2-minute protocols.
        Start free for 7 days, then continue for just a few dollars a month.
      </p>

      <ul className="mt-8 space-y-2 text-left text-sm text-gray-700">
        {[
          "Unlimited protocol sessions",
          "Before / after mood tracking",
          "Full protocol library (breathing, movement, mindset & more)",
        ].map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            {feature}
          </li>
        ))}
      </ul>

      {error && (
        <p className="mt-6 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="mt-8 w-full rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Redirecting…" : "Start 7-day free trial"}
      </button>

      <p className="mt-3 text-xs text-gray-400">
        No charge today. Cancel any time before the trial ends.
      </p>
    </div>
  );
}
