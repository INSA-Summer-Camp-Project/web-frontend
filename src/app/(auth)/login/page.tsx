"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
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
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-primary hover:underline"
              >
                Get Started
              </Link>
            </p>
            <p className="text-xs text-ink-muted leading-relaxed flex items-center justify-center">
              <Lock size={14} className="mr-1" />
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
