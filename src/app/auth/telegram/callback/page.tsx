"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";

export default function TelegramCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");

    if (!code) {
      setTimeout(
        () =>
          setError(
            "No authentication code found. Please try logging in again.",
          ),
        0,
      );
      return;
    }

    const state = sessionStorage.getItem("telegram_state");
    const codeVerifier = sessionStorage.getItem("telegram_code_verifier");

    if (!state || !codeVerifier) {
      setTimeout(
        () =>
          setError(
            "Security verification failed. Please try logging in again.",
          ),
        0,
      );
      return;
    }

    // Clean up sessionStorage
    sessionStorage.removeItem("telegram_state");
    sessionStorage.removeItem("telegram_code_verifier");

    // Save current URL to send to backend for verification
    const currentUrl = window.location.href;

    // Clean up the URL search params while preserving path
    window.history.replaceState(null, "", window.location.pathname);

    const verifyLogin = async () => {
      try {
        await authApi.verifyTelegramLogin(currentUrl, state, codeVerifier);
        router.push("/customer/dashboard");
      } catch (err) {
        console.error("Telegram login failed:", err);
        setError("Failed to verify your login. Please try again.");
      }
    };

    verifyLogin();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface-50 text-ink">
      {error ? (
        <div className="text-center space-y-4">
          <div className="text-danger mb-2">
            <span className="material-symbols-outlined text-4xl">error</span>
          </div>
          <h1 className="text-xl font-bold">Authentication Failed</h1>
          <p className="text-ink-muted">{error}</p>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="mt-6 px-4 py-2 bg-primary text-white rounded font-medium hover:bg-primary-dark transition-colors"
          >
            Return to Login
          </button>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h1 className="text-xl font-semibold">Verifying Login...</h1>
          <p className="text-ink-muted">
            Please wait while we securely log you in.
          </p>
        </div>
      )}
    </div>
  );
}
