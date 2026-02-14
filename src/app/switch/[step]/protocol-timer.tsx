"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const TOTAL_SECONDS = 2 * 60;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function ProtocolTimer() {
  const [remaining, setRemaining] = useState(TOTAL_SECONDS);
  const [running, setRunning] = useState(false);
  const [complete, setComplete] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!running) {
      clearTimer();
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setRunning(false);
          setComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [running, clearTimer]);

  const handleStart = () => {
    if (!complete) setRunning(true);
  };

  const handlePause = () => {
    setRunning(false);
  };

  const handleReset = () => {
    setRunning(false);
    setComplete(false);
    setRemaining(TOTAL_SECONDS);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Timer display */}
      <div
        className={`font-mono text-5xl font-bold tabular-nums ${
          complete ? "text-green-600" : "text-gray-900"
        }`}
        aria-live="polite"
        role="timer"
      >
        {formatTime(remaining)}
      </div>

      {/* Status */}
      {complete && (
        <p className="text-sm font-medium text-green-600">
          Complete — protocol time is up.
        </p>
      )}

      {/* Controls */}
      <div className="flex gap-3">
        {!running && !complete && (
          <button
            onClick={handleStart}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            {remaining < TOTAL_SECONDS ? "Resume" : "Start"}
          </button>
        )}

        {running && (
          <button
            onClick={handlePause}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Pause
          </button>
        )}

        <button
          onClick={handleReset}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
