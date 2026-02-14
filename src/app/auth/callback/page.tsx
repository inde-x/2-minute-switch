"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

function CallbackHandler() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/switch/1";

  useEffect(() => {
    // Supabase JS client automatically picks up the auth tokens from the URL
    // hash fragment when getSession() is called after an OAuth redirect.
    supabase.auth.getSession().then(() => {
      window.location.href = next;
    });
  }, [next]);

  return <p className="text-sm text-gray-500">Signing you in&hellip;</p>;
}

export default function AuthCallbackPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <Suspense
        fallback={
          <p className="text-sm text-gray-500">Signing you in&hellip;</p>
        }
      >
        <CallbackHandler />
      </Suspense>
    </main>
  );
}
