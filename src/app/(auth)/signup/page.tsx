"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthCard, Button, Input, RoleSelector } from "@/components/ui";
import { registerSchema, RegisterInput } from "@/lib/validations/auth";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const { register: registerAuth } = useAuth();
  const [isTelegramLoading, setIsTelegramLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "CUSTOMER",
      email: "",
      password: "",
      fullName: "",
    },
  });

  const handleTelegramSignup = () => {
    setIsTelegramLoading(true);
    setTimeout(() => {
      setIsTelegramLoading(false);
    }, 1200);
  };

  const onSubmit = async (data: RegisterInput) => {
    setServerError("");
    try {
      await registerAuth(data);
      router.push("/");
    } catch (error) {
      if (error instanceof ApiError) {
        setServerError(error.message);
      } else {
        setServerError(
          "An unexpected error occurred during registration. Please try again.",
        );
      }
    }
  };

  return (
    <AuthCard
      brandName="ServiceHub"
      logoIcon="handyman"
      title="Join ServiceHub"
      subtitle="Professional & Trustworthy Service Marketplace. Choose your role to get started."
      maxWidth="lg"
      footer={
        <div className="flex flex-col gap-3 text-center w-full">
          <p className="text-sm text-ink-muted">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-bold hover:underline hover:text-primary-dark transition-colors"
            >
              Log In
            </Link>
          </p>
          <p className="text-xs text-ink-muted leading-relaxed">
            By signing up, you agree to our{" "}
            <Link
              href="#"
              className="text-primary underline hover:text-primary-dark"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="#"
              className="text-primary underline hover:text-primary-dark"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      }
    >
      <div className="flex flex-col gap-6 w-full text-left">
        {serverError && (
          <div
            role="alert"
            className="p-3.5 rounded-lg bg-error-container text-on-error-container text-xs font-medium border border-error/20 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-error text-[18px] shrink-0">
              error
            </span>
            <span>{serverError}</span>
          </div>
        )}

        {/* Role Selection via Controller */}
        <div>
          <label className="block text-sm font-semibold text-ink mb-3 text-center md:text-left">
            Choose your role
          </label>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <RoleSelector
                value={field.value}
                onChange={field.onChange}
                error={errors.role?.message}
              />
            )}
          />
        </div>

        <hr className="border-outline-variant/60" />

        {/* Telegram Signup Action */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleTelegramSignup}
            disabled={isTelegramLoading || isSubmitting}
            className="w-full bg-primary hover:bg-primary-dark active:bg-primary-dark/90 text-on-primary rounded-lg py-3 px-6 flex items-center justify-center gap-3 transition-colors duration-200 shadow-sm active:scale-[0.98] font-semibold text-sm disabled:opacity-60 cursor-pointer"
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
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"></path>
                </svg>
                <span>Sign up with Telegram</span>
              </>
            )}
          </button>
          <p className="text-xs text-ink-muted text-center">
            We use Telegram for instant, passwordless authentication.
          </p>
        </div>

        {/* Divider */}
        <div className="w-full flex items-center gap-3 relative my-0.5">
          <div className="h-px bg-outline-variant flex-1" />
          <span className="text-xs uppercase tracking-wider text-ink-muted bg-surface px-2">
            or sign up with email
          </span>
          <div className="h-px bg-outline-variant flex-1" />
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <Input
            label="Full Name (Optional)"
            type="text"
            placeholder="John Doe"
            error={errors.fullName?.message}
            leftIcon={
              <span className="material-symbols-outlined text-[20px]">
                person
              </span>
            }
            {...register("fullName")}
          />

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
            placeholder="Min 8 characters"
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
            loadingText="Creating Account..."
          >
            Create Account with Email
          </Button>
        </form>
      </div>
    </AuthCard>
  );
}
