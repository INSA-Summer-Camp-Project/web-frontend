"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthCard, Button, Input, RoleSelector } from "@/components/ui";
import {
  onboardingSchema,
  OnboardingInput,
  OnboardingRole,
} from "@/lib/validations/auth";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/lib/api";
import {
  TermsOfServiceModal,
  PrivacyPolicyModal,
} from "@/components/features/legal";

export default function SignupPage() {
  const router = useRouter();
  const { register: registerAuth } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [isTelegramLoading, setIsTelegramLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: undefined,
      dateOfBirth: "",
      role: null as unknown as OnboardingRole,
    },
  });

  const handleTelegramSignup = () => {
    setIsTelegramLoading(true);
    setTimeout(() => {
      setIsTelegramLoading(false);
      setStep(2);
    }, 800);
  };

  const onSubmit = async (data: OnboardingInput) => {
    setServerError("");
    try {
      if (registerAuth) {
        await registerAuth({
          role: data.role,
          email: `${data.firstName.toLowerCase()}.${data.lastName.toLowerCase()}@telegram.user`,
          password: "telegram-authenticated-session",
          fullName: `${data.firstName} ${data.lastName}`.trim(),
        });
      }
      router.push("/");
    } catch (error) {
      if (error instanceof ApiError) {
        setServerError(error.message);
      } else {
        setServerError(
          "An unexpected error occurred during onboarding. Please try again.",
        );
      }
    }
  };

  // Consent blurb reused on both steps
  const consentNote = (
    <div className="bg-surface-alt rounded-sm p-3 border border-border text-left">
      <p className="text-xs text-ink-muted flex gap-2 items-start leading-relaxed">
        <span className="material-symbols-outlined text-info shrink-0 text-[16px] mt-0.5">
          lock
        </span>
        <span>
          By continuing, you acknowledge that you have read and understood, and
          agree to ServiceHub&apos;s{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setIsTermsOpen(true);
            }}
            className="underline hover:text-primary transition-colors"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setIsPrivacyOpen(true);
            }}
            className="underline hover:text-primary transition-colors"
          >
            Privacy Policy
          </a>
          .
        </span>
      </p>
    </div>
  );

  return (
    <>
      {/* Legal modals — shared across both signup steps */}
      <TermsOfServiceModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />
      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      {step === 1 ? (
        <AuthCard
          brandName="ServiceHub"
          logoIcon="handyman"
          title="Join ServiceHub"
          subtitle="Professional & trustworthy service marketplace. Get started with Telegram."
          maxWidth="md"
          footer={
            <div className="flex flex-col gap-3 text-center w-full">
              <p className="text-sm text-ink-muted">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary font-semibold hover:underline hover:text-primary-dark transition-colors"
                >
                  Log In
                </Link>
              </p>
              {consentNote}
            </div>
          }
        >
          <div className="flex flex-col gap-4 w-full">
            <button
              type="button"
              onClick={handleTelegramSignup}
              disabled={isTelegramLoading}
              className="w-full bg-[#229ED9] hover:bg-[#1E8CC0] active:bg-[#1975A0] text-white rounded-sm py-3 px-6 flex items-center justify-center gap-3 transition-all duration-150 shadow-sm hover:shadow-md active:scale-[0.98] font-semibold text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#229ED9] focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
            >
              {isTelegramLoading ? (
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined animate-spin text-[20px]">
                    progress_activity
                  </span>
                  <span>Connecting to Telegram...</span>
                </span>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 fill-current shrink-0"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z" />
                  </svg>
                  <span>Sign up with Telegram</span>
                </>
              )}
            </button>
            <p className="text-xs text-ink-muted text-center">
              We use Telegram for instant, passwordless authentication.
            </p>
          </div>
        </AuthCard>
      ) : (
        <AuthCard
          brandName="ServiceHub"
          logoIcon="badge"
          title="Complete your profile"
          subtitle="Tell us a bit about yourself to personalise your experience."
          maxWidth="lg"
          footer={
            <div className="flex justify-between items-center w-full text-xs text-ink-muted">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="group flex items-center gap-1 text-primary font-medium cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">
                  arrow_back
                </span>
                <span className="group-hover:underline">
                  Back to Telegram login
                </span>
              </button>
              <span>Step 2 of 2</span>
            </div>
          }
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5 w-full text-left"
            noValidate
          >
            {serverError && (
              <div
                role="alert"
                className="p-3.5 rounded-sm bg-error-light text-error-text text-xs font-medium border border-error/20 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-error text-[18px] shrink-0">
                  error
                </span>
                <span>{serverError}</span>
              </div>
            )}

            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <Input
                label="First Name"
                type="text"
                placeholder="John"
                required
                error={errors.firstName?.message}
                leftIcon={
                  <span className="material-symbols-outlined text-[20px]">
                    badge
                  </span>
                }
                {...register("firstName")}
              />
              <Input
                label="Last Name"
                type="text"
                placeholder="Doe"
                required
                error={errors.lastName?.message}
                leftIcon={
                  <span className="material-symbols-outlined text-[20px]">
                    person
                  </span>
                }
                {...register("lastName")}
              />
            </div>

            {/* Gender & Date of Birth */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <div className="flex flex-col gap-1.5 w-full">
                <label
                  htmlFor="gender"
                  className="text-sm font-semibold text-ink select-none"
                >
                  Gender <span className="text-error">*</span>
                </label>
                <div className="relative flex items-center w-full">
                  <div className="absolute left-3 flex items-center justify-center text-ink-muted pointer-events-none">
                    <span className="material-symbols-outlined text-[20px]">
                      wc
                    </span>
                  </div>
                  <select
                    id="gender"
                    aria-label="Gender"
                    required
                    {...register("gender")}
                    className={`w-full appearance-none rounded-sm border bg-surface-alt py-2.5 text-sm text-ink pl-10 pr-10 focus:outline-none focus:ring-2 transition-colors duration-150 cursor-pointer ${
                      errors.gender
                        ? "border-error focus:border-error focus:ring-error/20"
                        : "border-border focus:border-primary focus:ring-primary/20 hover:border-border-strong"
                    }`}
                  >
                    <option value="">Select gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                  <div className="absolute right-3 flex items-center justify-center text-ink-muted pointer-events-none">
                    <span className="material-symbols-outlined text-[20px]">
                      expand_more
                    </span>
                  </div>
                </div>
                {errors.gender && (
                  <p className="text-xs text-error flex items-center gap-1 font-medium mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">
                      error
                    </span>
                    {errors.gender.message}
                  </p>
                )}
              </div>

              <Input
                label="Date of Birth"
                type="date"
                placeholder="YYYY-MM-DD"
                required
                max={todayStr}
                error={errors.dateOfBirth?.message}
                leftIcon={
                  <span className="material-symbols-outlined text-[20px]">
                    calendar_today
                  </span>
                }
                {...register("dateOfBirth")}
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-ink mb-2 text-center sm:text-left">
                Choose your role <span className="text-error">*</span>
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

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isSubmitting}
              disabled={isSubmitting}
              loadingText="Completing Sign Up..."
            >
              Complete Sign Up
            </Button>
          </form>
        </AuthCard>
      )}
    </>
  );
}
