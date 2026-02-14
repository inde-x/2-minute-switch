import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect the main product routes for MVP
  const isProtected = pathname.startsWith("/switch");

  if (!isProtected) return NextResponse.next();

  // Supabase stores session in localStorage by default (client-side),
  // so middleware cannot read it reliably without auth-helpers cookies.
  // MVP approach: allow route, but client-side redirect if not authed.
  return NextResponse.next();
}

export const config = {
  matcher: ["/switch/:path*"],
};