"use client";

import { useEffect } from "react";
import { logEvent } from "@/lib/analytics";

export default function StepTracker({ step }: { step: number }) {
  useEffect(() => {
    logEvent("step_view", { step });
    if (step === 1) {
      logEvent("session_start");
    }
  }, [step]);

  return null;
}
