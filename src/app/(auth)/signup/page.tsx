"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { AuthCard, AuthSplitLayout } from "@/components/ui";
import { TelegramLoginButton } from "@/components/features/auth/TelegramLoginButton";

export default function SignupPage() {
  return (
    <AuthSplitLayout
      brandTitle="ServiceHub"
      brandSubtitle="Join the trusted service marketplace."
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
                className="font-semibold text-primary hover:underline"
              >
                Sign in
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
          <TelegramLoginButton buttonText="Continue with Telegram" />
        </div>
      </AuthCard>
    </AuthSplitLayout>
  );
}
