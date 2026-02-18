"use client";

import { useState, useCallback } from "react";
import type { Protocol } from "@/lib/protocols";
import ProtocolPicker from "./protocol-picker";
import ProtocolTimer from "./protocol-timer";
import RatingInput from "./rating-input";
import { markFreeSessionUsed } from "@/lib/entitlements";
import { logEvent } from "@/lib/analytics";
import { logError } from "@/lib/error";

export default function ProtocolStep() {
  const [selected, setSelected] = useState<Protocol | null>(null);

  const handleAfterRating = useCallback(async () => {
    try {
      logEvent("session_completed");
      // Mark the free session used. No-op for paid users / already-used profiles.
      await markFreeSessionUsed();
    } catch (err) {
      logError("ProtocolStep.handleAfterRating", err);
    }
  }, []);

  return (
    <div className="flex flex-col gap-8">
      {/* Protocol selection */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-gray-700">
          Choose a protocol
        </h2>
        <ProtocolPicker selected={selected} onSelect={setSelected} />
      </div>

      {/* Timer + steps (shown after picking a protocol) */}
      {selected && (
        <>
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-bold text-gray-900">
              {selected.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{selected.summary}</p>
            <ol className="mt-4 list-inside list-decimal space-y-2 text-sm text-gray-700">
              {selected.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </div>

          <ProtocolTimer />

          <RatingInput
            kind="after"
            label="How do you feel now? (after)"
            onSelect={handleAfterRating}
          />
        </>
      )}
    </div>
  );
}
