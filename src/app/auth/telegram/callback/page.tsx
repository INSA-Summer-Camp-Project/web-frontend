"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/authStore";
import { Spinner } from "@/components/ui/Spinner";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((state) => state.setUser);
  const setActiveRole = useAuthStore((state) => state.setActiveRole);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // For Telegram OAuth verification
        const state = sessionStorage.getItem("tg_state");
        const codeVerifier = sessionStorage.getItem("tg_codeVerifier");

        let user;
        if (state && codeVerifier) {
          // Clean up immediately to prevent double-execution in React 18 Strict Mode
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

        // Navigate based on role or returnUrl
        if (!user.lastActiveRole) {
          router.push("/onboarding");
        } else {
          setActiveRole(user.lastActiveRole);
          if (returnUrl && returnUrl.startsWith("/")) {
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
        router.push("/login?error=auth_failed");
      }
    };

    handleCallback();
  }, [router, setUser, setActiveRole, searchParams]);

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
