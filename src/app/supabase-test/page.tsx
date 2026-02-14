// src/app/supabase-test/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SupabaseTestPage() {
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        // This hits Supabase auth; no DB tables needed.
        const { data, error } = await supabase.auth.getSession();

        if (cancelled) return;

        if (error) {
          setStatus("error");
          setMessage(`Supabase error: ${error.message}`);
          return;
        }

        setStatus("ok");
        setMessage(`Connected. Session: ${data.session ? "present" : "none"}`);
      } catch (e: any) {
        if (cancelled) return;
        setStatus("error");
        setMessage(`Unexpected error: ${e?.message ?? String(e)}`);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-semibold mb-4">Supabase Test</h1>

      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="text-sm text-white/70 mb-2">Status</div>
        <div className="text-lg">
          {status === "idle" && "Loading…"}
          {status === "ok" && "OK ✅"}
          {status === "error" && "Error ❌"}
        </div>

        {message && <pre className="mt-4 text-sm text-white/80 whitespace-pre-wrap">{message}</pre>}
      </div>
    </main>
  );
}