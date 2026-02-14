"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AccountPage() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email ?? null);
    })();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-semibold">Account</h1>
      <p className="mt-4 text-white/70">
        Signed in as: <span className="text-white">{email ?? "Not signed in"}</span>
      </p>

      <button
        onClick={signOut}
        className="mt-6 rounded-md border border-white/20 px-4 py-2 hover:bg-white/10"
      >
        Sign out
      </button>
    </main>
  );
}