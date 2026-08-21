import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface DecodedToken {
  lastActiveRole?: string;
  role?: string;
  systemRole?: string;
  exp?: number;
}

/**
 * Lightweight JWT payload parser compliant with Edge runtime (no external crypto dependencies).
 */
export function parseJwtPayload(token: string): DecodedToken | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = atob(base64);

    return JSON.parse(jsonPayload) as DecodedToken;
  } catch {
    return null;
  }
}

/**
 * Extracts auth token and active role from cookies or headers.
 */
export function extractAuth(request: NextRequest): {
  token: string | null;
  activeRole: string | null;
} {
  // Check authorization header
  const authHeader = request.headers.get("authorization");
  let token: string | null = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  }

  // Check token cookies (including access_token)
  if (!token) {
    token =
      request.cookies.get("servicehub_access_token")?.value ||
      request.cookies.get("access_token")?.value ||
      request.cookies.get("accessToken")?.value ||
      request.cookies.get("token")?.value ||
      null;
  }

  let activeRole: string | null =
    request.cookies.get("servicehub_active_role")?.value ||
    request.cookies.get("lastActiveRole")?.value ||
    request.cookies.get("activeRole")?.value ||
    null;

  // If token is present, attempt to decode role and expiry from JWT payload
  if (token) {
    const payload = parseJwtPayload(token);
    if (payload) {
      // Check expiration if present
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        return { token: null, activeRole: null };
      }
      activeRole = payload.lastActiveRole || payload.role || activeRole;
    }
  }

  return { token, activeRole };
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect customer portal routes (/customer/dashboard, /customer/jobs, /customer/workers, /customer/profile, etc.)
  if (pathname.startsWith("/customer")) {
    const { token } = extractAuth(request);

    // If not authenticated, redirect to /login
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect worker portal routes (/worker/dashboard, /worker/jobs, /worker/profile, etc.)
  if (pathname.startsWith("/worker")) {
    // Check if it is a public worker profile route: /worker/[id] (e.g. /worker/wrk-123 or /worker/uuid)
    // Protected worker routes: /worker/dashboard, /worker/jobs, /worker/profile
    const isProtectedWorkerRoute =
      pathname.startsWith("/worker/dashboard") ||
      pathname.startsWith("/worker/jobs") ||
      pathname.startsWith("/worker/profile");

    if (isProtectedWorkerRoute) {
      const { token, activeRole } = extractAuth(request);

      // If not authenticated, redirect to /login
      if (!token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("returnUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }

      // If authenticated but role is not WORKER, redirect to /signup or /onboarding/role
      if (activeRole !== "WORKER") {
        const redirectUrl = new URL("/signup", request.url);
        redirectUrl.searchParams.set("error", "worker_role_required");
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/worker/:path*", "/customer/:path*"],
};
