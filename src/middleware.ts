import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface DecodedToken {
  activeRole?: string;
  role?: string;
  systemRole?: string;
  isOnboarded?: boolean;
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
  systemRole: string | null;
  isOnboarded: boolean;
} {
  // Check authorization header
  const authHeader = request.headers.get("authorization");
  let token: string | null = null;

  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  }

  // Check token cookies (try multiple cookie names for compatibility)
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

  let systemRole: string | null = null;
  let isOnboarded = false;

  // If token is present, attempt to decode role and expiry from JWT payload
  if (token) {
    const payload = parseJwtPayload(token);
    if (payload) {
      // Check expiration if present
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        return {
          token: null,
          activeRole: null,
          systemRole: null,
          isOnboarded: false,
        };
      }
      activeRole = payload.activeRole || payload.role || activeRole;
      systemRole = payload.systemRole || null;
      isOnboarded = payload.isOnboarded || false;
    }
  }

  return { token, activeRole, systemRole, isOnboarded };
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect customer portal routes (/customer/*)
  if (pathname.startsWith("/customer")) {
    const { token, isOnboarded } = extractAuth(request);

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // If authenticated but hasn't completed onboarding, redirect to onboarding
    if (!isOnboarded) {
      const redirectUrl = new URL("/onboarding", request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Protect worker portal routes (/worker/dashboard, /worker/jobs, /worker/profile, /worker/applications)
  if (pathname.startsWith("/worker")) {
    // /worker/[id] is a public profile page — allow it without auth
    const isProtectedWorkerRoute =
      pathname.startsWith("/worker/dashboard") ||
      pathname.startsWith("/worker/jobs") ||
      pathname.startsWith("/worker/profile") ||
      pathname.startsWith("/worker/applications");

    if (isProtectedWorkerRoute) {
      const { token, isOnboarded, activeRole } = extractAuth(request);

      if (!token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("returnUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }

      if (!isOnboarded) {
        const redirectUrl = new URL("/onboarding", request.url);
        return NextResponse.redirect(redirectUrl);
      }

      // If authenticated but doesn't have WORKER activeRole, redirect to onboarding
      if (activeRole !== "WORKER") {
        const redirectUrl = new URL("/onboarding", request.url);
        redirectUrl.searchParams.set("error", "worker_role_required");
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  // Protect admin routes (/admin/*)
  if (pathname.startsWith("/admin")) {
    const { token, systemRole } = extractAuth(request);

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (systemRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Handle /onboarding route
  if (pathname.startsWith("/onboarding")) {
    const { token, isOnboarded, activeRole } = extractAuth(request);

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    if (isOnboarded) {
      if (activeRole === "WORKER") {
        return NextResponse.redirect(new URL("/worker/dashboard", request.url));
      }
      return NextResponse.redirect(new URL("/customer/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/worker/:path*",
    "/customer/:path*",
    "/admin/:path*",
    "/onboarding",
  ],
};
