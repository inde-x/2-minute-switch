"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { fetchProfile, canStartSession } from "@/lib/entitlements";
import { logEvent } from "@/lib/analytics";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      const redirectToLogin = () => {
        const next = encodeURIComponent(pathname);
        window.location.href = `/login?next=${next}`;
      };

      const redirectToPaywall = () => {
        try {
          logEvent("paywall_gate_triggered", { from: pathname });
        } catch {
          // analytics must never block the redirect
        }
        const next = encodeURIComponent(pathname);
        window.location.href = `/paywall?next=${next}`;
      };

      try {
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          redirectToLogin();
          return;
        }

        // Check entitlements: paid users pass through; free users get one session.
        const profile = await fetchProfile();

        if (!profile || !canStartSession(profile)) {
          redirectToPaywall();
          return;
        }

        if (mounted) setReady(true);
      } catch {
        redirectToLogin();
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, [pathname]);

  if (!ready) return null;

  return <>{children}</>;
}
