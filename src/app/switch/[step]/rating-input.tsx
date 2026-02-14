"use client";

import { useState, useEffect } from "react";
import { getRating, setRating, type RatingKind } from "@/lib/ratings";

export default function RatingInput({
  kind,
  label,
}: {
  kind: RatingKind;
  label: string;
}) {
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    setValue(getRating(kind));
  }, [kind]);

  function handleSelect(n: number) {
    setValue(n);
    setRating(kind, n);
  }

  return (
    <fieldset className="flex flex-col items-center gap-3">
      <legend className="text-sm font-medium text-gray-700">{label}</legend>
      <div className="flex gap-1.5">
        {Array.from({ length: 11 }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSelect(i)}
            className={`h-9 w-9 rounded-md text-sm font-medium transition-colors ${
              value === i
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {i}
          </button>
        ))}
      </div>
      <span className="flex gap-4 text-xs text-gray-400">
        <span>0 = low</span>
        <span>10 = high</span>
      </span>
    </fieldset>
  );
}
