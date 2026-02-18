// src/app/billing/cancel/page.tsx
import Link from "next/link";

export default function BillingCancelPage() {
  return (
    <div className="mx-auto max-w-lg py-20 text-center">
      <div className="text-5xl">👋</div>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
        Subscription canceled
      </h1>
      <p className="mt-4 text-base text-gray-600">
        Your subscription has been canceled. You&apos;ll keep access until the end
        of your current billing period.
      </p>
      <Link
        href="/switch"
        className="mt-8 inline-block rounded-lg bg-gray-900 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-gray-700"
      >
        Back to app
      </Link>
      <p className="mt-4 text-sm text-gray-400">
        Changed your mind?{" "}
        <Link href="/paywall" className="underline hover:text-gray-600">
          Resubscribe any time.
        </Link>
      </p>
    </div>
  );
}
