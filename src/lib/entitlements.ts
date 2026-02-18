// src/lib/entitlements.ts
// Single source of truth for access rules.
// All functions run client-side using the anon Supabase client so RLS applies.

import { supabase } from "@/lib/supabaseClient";

export type SubscriptionStatus =
  | "none"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled";

export interface UserProfile {
  subscription_status: SubscriptionStatus;
  current_period_end: string | null;
  free_session_used: boolean;
}

/** Fetch the current user's profile row. Returns null if not found or unauthenticated. */
export async function fetchProfile(): Promise<UserProfile | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("subscription_status, current_period_end, free_session_used")
    .eq("id", session.user.id)
    .single();

  if (error || !data) return null;

  return data as UserProfile;
}

/** True when the user has an active paid/trialing subscription. */
export function isPaidUser(profile: UserProfile): boolean {
  return (
    profile.subscription_status === "trialing" ||
    profile.subscription_status === "active"
  );
}

/**
 * Determine whether the current user may start (or continue) a session.
 *
 * Rules:
 *  - Paid (trialing | active) → always allowed.
 *  - Free, session not yet used → allowed (one free session).
 *  - Free, session already used → blocked.
 */
export function canStartSession(profile: UserProfile): boolean {
  if (isPaidUser(profile)) return true;
  return !profile.free_session_used;
}

/**
 * Mark the free session as consumed for the authenticated user.
 * No-op if already set to avoid redundant writes.
 */
export async function markFreeSessionUsed(): Promise<void> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return;

  await supabase
    .from("profiles")
    .update({ free_session_used: true })
    .eq("id", session.user.id)
    .eq("free_session_used", false); // only write if not already set
}
