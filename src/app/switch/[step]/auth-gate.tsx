"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

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

      try {
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          redirectToLogin();
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