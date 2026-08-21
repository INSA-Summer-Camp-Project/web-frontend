import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { middleware, parseJwtPayload, extractAuth } from "@/middleware";

function createJwt(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.signature`;
}

describe("middleware", () => {
  describe("parseJwtPayload", () => {
    it("decodes valid JWT payload", () => {
      const token = createJwt({
        lastActiveRole: "WORKER",
        sub: "usr-123",
      });
      const parsed = parseJwtPayload(token);
      expect(parsed?.lastActiveRole).toBe("WORKER");
    });

    it("returns null for malformed token", () => {
      expect(parseJwtPayload("invalid-token")).toBeNull();
    });
  });

  describe("extractAuth", () => {
    it("extracts token from Bearer authorization header", () => {
      const token = createJwt({ lastActiveRole: "WORKER" });
      const request = new NextRequest(
        "http://localhost:3000/worker/dashboard",
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );

      const { token: extractedToken, activeRole } = extractAuth(request);
      expect(extractedToken).toBe(token);
      expect(activeRole).toBe("WORKER");
    });

    it("extracts token from servicehub_access_token cookies", () => {
      const token = createJwt({ lastActiveRole: "WORKER" });
      const request = new NextRequest(
        "http://localhost:3000/worker/dashboard",
        {
          headers: {
            cookie: `servicehub_access_token=${token}`,
          },
        },
      );

      const { token: extractedToken, activeRole } = extractAuth(request);
      expect(extractedToken).toBe(token);
      expect(activeRole).toBe("WORKER");
    });

    it("extracts token from access_token cookie", () => {
      const token = createJwt({ lastActiveRole: "CUSTOMER" });
      const request = new NextRequest(
        "http://localhost:3000/customer/dashboard",
        {
          headers: {
            cookie: `access_token=${token}`,
          },
        },
      );

      const { token: extractedToken, activeRole } = extractAuth(request);
      expect(extractedToken).toBe(token);
      expect(activeRole).toBe("CUSTOMER");
    });

    it("handles expired token", () => {
      const expiredTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      const token = createJwt({
        lastActiveRole: "WORKER",
        exp: expiredTime,
      });
      const request = new NextRequest(
        "http://localhost:3000/worker/dashboard",
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );

      const { token: extractedToken } = extractAuth(request);
      expect(extractedToken).toBeNull();
    });
  });

  describe("customer route protection", () => {
    it("redirects unauthenticated users accessing /customer/dashboard to /login", () => {
      const request = new NextRequest(
        "http://localhost:3000/customer/dashboard",
      );
      const response = middleware(request);

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toContain("/login?returnUrl=");
      expect(response.headers.get("location")).toContain(
        encodeURIComponent("/customer/dashboard"),
      );
    });

    it("redirects unauthenticated users accessing /customer/jobs to /login", () => {
      const request = new NextRequest("http://localhost:3000/customer/jobs");
      const response = middleware(request);

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toContain("/login?returnUrl=");
    });

    it("allows authenticated customer to access /customer/dashboard", () => {
      const token = createJwt({ lastActiveRole: "CUSTOMER" });
      const request = new NextRequest(
        "http://localhost:3000/customer/dashboard",
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );
      const response = middleware(request);

      expect(response.status).toBe(200);
      expect(response.headers.get("location")).toBeNull();
    });
  });

  describe("worker route protection", () => {
    it("redirects unauthenticated users accessing /worker/dashboard to /login", () => {
      const request = new NextRequest("http://localhost:3000/worker/dashboard");
      const response = middleware(request);

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toContain("/login?returnUrl=");
    });

    it("redirects non-worker role accessing /worker/dashboard to /signup", () => {
      const token = createJwt({ lastActiveRole: "CUSTOMER" });
      const request = new NextRequest(
        "http://localhost:3000/worker/dashboard",
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );
      const response = middleware(request);

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toContain(
        "/signup?error=worker_role_required",
      );
    });

    it("allows authenticated WORKER role to access /worker/dashboard", () => {
      const token = createJwt({ lastActiveRole: "WORKER" });
      const request = new NextRequest(
        "http://localhost:3000/worker/dashboard",
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );
      const response = middleware(request);

      expect(response.status).toBe(200);
      expect(response.headers.get("location")).toBeNull();
    });

    it("protects /worker/jobs route", () => {
      const request = new NextRequest("http://localhost:3000/worker/jobs");
      const response = middleware(request);

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toContain("/login?returnUrl=");
    });

    it("protects /worker/profile route", () => {
      const request = new NextRequest("http://localhost:3000/worker/profile");
      const response = middleware(request);

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toContain("/login?returnUrl=");
    });

    it("allows public worker profile /worker/wrk-123 without auth redirect", () => {
      const request = new NextRequest("http://localhost:3000/worker/wrk-123");
      const response = middleware(request);

      expect(response.status).toBe(200);
      expect(response.headers.get("location")).toBeNull();
    });
  });
});
