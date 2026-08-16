"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthCard, Button, Input } from "@/components/ui";
import { loginSchema, LoginInput } from "@/lib/validations/auth";

export default function LoginPage() {
  const [isTelegramLoading, setIsTelegramLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleTelegramLogin = () => {
    setIsTelegramLoading(true);
    setTimeout(() => {
      setIsTelegramLoading(false);
    }, 1200);
  };

  const onSubmit = async (data: LoginInput) => {
    setServerError("");
    // Simulated form submission (no API call per requirement)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Login submitted:", data);
  };

  return (
    <AuthCard
      brandName="ServiceHub"
      logoIcon="handyman"
      title="Welcome back"
      subtitle="Secure, passwordless authentication. Verify your identity in one click."
      maxWidth="md"
      footer={
        <div className="flex flex-col gap-3 text-center w-full">
          <p className="text-sm text-ink-muted">
            New to ServiceHub?{" "}
            <Link
              href="/signup"
              className="text-primary font-bold hover:underline hover:text-primary-dark transition-colors"
            >
              Create an account
            </Link>
          </p>
          <div className="bg-surface-alt rounded-lg p-3 border border-outline-variant/50">
            <p className="text-xs text-ink-muted text-left flex gap-2 items-start leading-relaxed">
              <span className="material-symbols-outlined text-info shrink-0 text-[16px] mt-0.5">
                lock
              </span>
              <span>
                By continuing, you acknowledge that you have read and
                understood, and agree to ServiceHub&apos;s{" "}
                <Link
                  href="#"
                  className="underline hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="#"
                  className="underline hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
                .
              </span>
            </p>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-5 w-full">
        {/* Telegram Login Button */}
        <button
          type="button"
          onClick={handleTelegramLogin}
          disabled={isTelegramLoading || isSubmitting}
          className="w-full bg-[#229ED9] hover:bg-[#1E8CC0] active:bg-[#1975A0] text-white rounded-lg py-3 px-6 flex items-center justify-center gap-3 transition-colors duration-200 shadow-sm active:scale-[0.98] font-semibold text-sm disabled:opacity-60 cursor-pointer"
        >
          {isTelegramLoading ? (
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined animate-spin text-[20px]">
                progress_activity
              </span>
              Connecting to Telegram...
            </span>
          ) : (
            <>
              <svg
                className="w-5 h-5 fill-current shrink-0"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"></path>
              </svg>
              <span>Login with Telegram</span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="w-full flex items-center gap-3 relative my-1">
          <div className="h-px bg-outline-variant flex-1" />
          <span className="text-xs uppercase tracking-wider text-ink-muted bg-surface px-2">
            or continue with
          </span>
          <div className="h-px bg-outline-variant flex-1" />
        </div>

        {/* Email Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3 text-left"
        >
          {serverError && (
            <div className="p-3 rounded-lg bg-error-container text-on-error-container text-xs font-medium">
              {serverError}
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            leftIcon={
              <span className="material-symbols-outlined text-[20px]">
                mail
              </span>
            }
            {...register("email")}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            leftIcon={
              <span className="material-symbols-outlined text-[20px]">
                lock
              </span>
            }
            {...register("password")}
          />

          <Button
            type="submit"
            variant="secondary"
            fullWidth
            isLoading={isSubmitting}
            disabled={isSubmitting}
            loadingText="Logging in..."
          >
            Log In with Email
          </Button>
        </form>
      </div>
    </AuthCard>
  );
}
