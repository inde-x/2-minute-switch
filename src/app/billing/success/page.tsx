// src/app/billing/success/page.tsx
import Link from "next/link";

export default function BillingSuccessPage() {
  return (
    <div className="mx-auto max-w-lg py-20 text-center">
      <div className="text-5xl">🎉</div>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
        You&apos;re in!
      </h1>
      <p className="mt-4 text-base text-gray-600">
        Your 7-day free trial has started. Explore all protocols and build your
        switching habit — no charge today.
      </p>
      <Link
        href="/switch"
        className="mt-8 inline-block rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500"
      >
        Start your first switch
      </Link>
      <p className="mt-4 text-sm text-gray-400">
        Manage your subscription any time from your account settings.
      </p>
    </div>
  );
}
