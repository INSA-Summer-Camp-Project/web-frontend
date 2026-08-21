"use client";

import Link from "next/link";
import { AuthCard, AuthSplitLayout } from "@/components/ui";
import { TelegramLoginButton } from "@/components/features/auth/TelegramLoginButton";

export default function SignupPage() {
  return (
    <AuthSplitLayout
      brandTitle="ServiceHub"
      brandSubtitle="Your next opportunity awaits."
    >
      <AuthCard
        title="Create an account"
        subtitle="Join ServiceHub today. Secure, passwordless authentication via Telegram."
        maxWidth="md"
        footer={
          <div className="flex flex-col gap-5 text-center w-full">
            <p className="text-sm text-ink-muted">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary font-semibold hover:underline hover:text-primary-dark transition-colors"
              >
                Sign in
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
          <TelegramLoginButton buttonText="Continue with Telegram" />
        </div>
      </AuthCard>
    </AuthSplitLayout>
  );
}
