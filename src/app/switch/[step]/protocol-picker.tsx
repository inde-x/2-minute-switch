"use client";

import { useState } from "react";
import {
  PROTOCOLS,
  ALL_CATEGORIES,
  CATEGORY_LABELS,
  type Protocol,
  type ProtocolCategory,
} from "@/lib/protocols";
import { logEvent } from "@/lib/analytics";

export default function ProtocolPicker({
  selected,
  onSelect,
}: {
  selected: Protocol | null;
  onSelect: (protocol: Protocol) => void;
}) {
  const [filter, setFilter] = useState<ProtocolCategory | "all">("all");

  const visible =
    filter === "all"
      ? PROTOCOLS
      : PROTOCOLS.filter((p) => p.category === filter);

  function handleSelect(protocol: Protocol) {
    onSelect(protocol);
    logEvent("protocol_selected", { protocolId: protocol.id });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            filter === "all"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filter === cat
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Protocol grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => {
          const isSelected = selected?.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => handleSelect(p)}
              className={`rounded-lg border p-3 text-left transition-colors ${
                isSelected
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 bg-white hover:border-gray-400"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`text-sm font-semibold ${isSelected ? "text-white" : "text-gray-900"}`}
                >
                  {p.title}
                </span>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {CATEGORY_LABELS[p.category]}
                </span>
              </div>
              <p
                className={`mt-1 text-xs leading-relaxed ${isSelected ? "text-gray-300" : "text-gray-500"}`}
              >
                {p.summary}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
