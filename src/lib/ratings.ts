const STORAGE_KEY = "2ms-ratings";

export type RatingKind = "before" | "after";

interface Ratings {
  before: number | null;
  after: number | null;
}

function read(): Ratings {
  if (typeof window === "undefined") return { before: null, after: null };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { before: null, after: null };
    const parsed = JSON.parse(raw);
    return {
      before: typeof parsed.before === "number" ? parsed.before : null,
      after: typeof parsed.after === "number" ? parsed.after : null,
    };
  } catch {
    return { before: null, after: null };
  }
}

export function getRating(kind: RatingKind): number | null {
  return read()[kind];
}

export function setRating(kind: RatingKind, value: number): void {
  const ratings = read();
  ratings[kind] = value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
}
