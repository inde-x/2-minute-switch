"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/switch/1";

  const signIn = async () => {
    const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callbackUrl },
    });

    if (error) {
      console.error("OAuth sign-in error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="w-full max-w-sm rounded-xl border border-white/10 bg-white/5 p-6">
      <h1 className="text-xl font-semibold">Sign in</h1>
      <p className="mt-2 text-sm text-white/70">
        Sign in to save your sessions and access protocols.
      </p>

      <button
        onClick={signIn}
        className="mt-6 w-full rounded-md bg-white text-black px-4 py-2 font-medium hover:bg-white/90"
      >
        Continue with Google
      </button>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-black text-white">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
