type EventName =
  | "session_start"
  | "step_view"
  | "before_rating_set"
  | "after_rating_set"
  | "timer_start"
  | "timer_pause"
  | "timer_reset"
  | "timer_complete";

export function logEvent(
  name: EventName,
  data?: Record<string, unknown>,
): void {
  console.log(`[analytics] ${name}`, data ?? "");
}
