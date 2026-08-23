"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/authStore";
import { Spinner, Button } from "@/components/ui";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((state) => state.setUser);
  const setActiveRole = useAuthStore((state) => state.setActiveRole);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const state =
          sessionStorage.getItem("telegram_state") ||
          sessionStorage.getItem("tg_state");
        const codeVerifier =
          sessionStorage.getItem("telegram_code_verifier") ||
          sessionStorage.getItem("tg_codeVerifier");

        let user;
        if (state && codeVerifier) {
          // Clean up immediately to prevent double-execution in React 18 / 19 Strict Mode
          sessionStorage.removeItem("telegram_state");
          sessionStorage.removeItem("telegram_code_verifier");
          sessionStorage.removeItem("tg_state");
          sessionStorage.removeItem("tg_codeVerifier");

          // Verify OAuth redirect
          user = await authApi.verifyTelegramLogin(
            window.location.href,
            state,
            codeVerifier,
          );
        } else {
          user = await authApi.getMe();
        }

        setUser(user);

        const returnUrl = searchParams.get("returnUrl");

        // Navigate based on onboarding completion status
        if (!user.isOnboarded || !user.lastActiveRole) {
          router.push("/onboarding");
        } else {
          setActiveRole(user.lastActiveRole);
          document.cookie = `servicehub_active_role=${user.lastActiveRole}; path=/; max-age=2592000; SameSite=Lax`;
          if (returnUrl?.startsWith("/")) {
            router.push(returnUrl);
          } else {
            router.push(
              user.lastActiveRole === "CUSTOMER"
                ? "/customer/dashboard"
                : "/worker/dashboard",
            );
          }
        }
      } catch (err) {
        console.error("Auth callback failed", err);
        setError("Failed to verify your login. Please try again.");
      }
    };

    handleCallback();
  }, [router, setUser, setActiveRole, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface p-4">
        <div className="text-center space-y-4 max-w-sm">
          <h1 className="text-xl font-bold text-ink">Authentication Failed</h1>
          <p className="text-ink-muted text-sm">{error}</p>
          <Button
            variant="primary"
            onClick={() => router.push("/login")}
            className="mt-4"
          >
            Return to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" className="text-primary" />
        <p className="text-ink-muted font-medium">
          Completing authentication...
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-surface">
          <Spinner size="lg" className="text-primary" />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
