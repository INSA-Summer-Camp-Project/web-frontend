"use client";

import Link from "next/link";
import { AuthCard, AuthSplitLayout } from "@/components/ui";
import { TelegramLoginButton } from "@/components/features/auth/TelegramLoginButton";

export default function LoginPage() {
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
                href="/terms"
                className="font-medium hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
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
          <TelegramLoginButton buttonText="Login with Telegram" />
        </div>
      </AuthCard>
    </AuthSplitLayout>
  );
}
