"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AuthCard, Button, AuthSplitLayout } from "@/components/ui";

import { authApi } from "@/lib/api/auth";

export default function LoginPage() {
  const [isTelegramLoading, setIsTelegramLoading] = useState(false);

  const handleTelegramLogin = () => {
    setIsTelegramLoading(true);
    window.location.href = authApi.getTelegramLoginUrl();
  };

  return (
    <AuthSplitLayout
      brandTitle="ServiceHub"
      brandSubtitle="Trusted services, connected."
    >
      <AuthCard
        title="Welcome back"
        subtitle="Secure, passwordless authentication. Verify your identity in one click."
        maxWidth="md"
        footer={
          <div className="flex flex-col gap-5 text-center w-full">
            <p className="text-sm text-ink-muted">
              New to ServiceHub?{" "}
              <Link
                href="/signup"
                className="text-primary font-semibold hover:underline hover:text-primary-dark transition-colors"
              >
                Get started
              </Link>
            </p>
            <p className="text-xs text-ink-muted leading-relaxed">
              <span className="material-symbols-outlined text-[14px] align-middle mr-1 relative -top-[1px]">
                lock
              </span>
              By continuing, you agree to ServiceHub&apos;s{" "}
              <Link
                href="#"
                className="font-medium hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="#"
                className="font-medium hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        }
      >
        <div className="flex flex-col gap-5 w-full">
          {/* Telegram Login Button */}
          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={handleTelegramLogin}
            isLoading={isTelegramLoading}
            loadingText="Connecting to Telegram..."
            leftIcon={
              <svg
                className="w-5 h-5 fill-current shrink-0"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"></path>
              </svg>
            }
          >
            Login with Telegram
          </Button>
        </div>
      </AuthCard>
    </AuthSplitLayout>
  );
}
