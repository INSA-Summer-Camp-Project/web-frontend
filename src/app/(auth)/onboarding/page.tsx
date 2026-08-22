"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useCompleteOnboarding } from "@/hooks/useOnboarding";
import { AuthSplitLayout } from "@/components/ui/AuthSplitLayout";
import { RoleSelector, type RoleType } from "@/components/ui/RoleSelector";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";

export default function OnboardingPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const setActiveRole = useAuthStore((state) => state.setActiveRole);
  
  const [role, setRole] = useState<RoleType | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "OTHER" | "">("");

  const { mutate: completeOnboarding, isPending } = useCompleteOnboarding();

  const submitOnboarding = () => {
    if (!firstName || !lastName) {
      toast.error("Please provide your full name");
      return;
    }
    if (!birthdate) {
      toast.error("Please provide your birth date");
      return;
    }
    if (!gender) {
      toast.error("Please specify your gender");
      return;
    }
    if (!role) {
      toast.error("Please select a role to continue");
      return;
    }

    completeOnboarding(
      {
        firstName,
        lastName,
        birthdate,
        gender: gender as "MALE" | "FEMALE" | "OTHER",
        role: role as "CUSTOMER" | "WORKER",
      },
      {
        onSuccess: (data: any) => {
          if (data && data.user) {
            setUser(data.user);
          }
          setActiveRole(role as "CUSTOMER" | "WORKER");
          toast.success("Welcome to ServiceHub!");
          
          if (role === "CUSTOMER") {
            router.push("/customer/dashboard");
          } else {
            router.push("/worker/dashboard");
          }
        },
        onError: (err) => {
          toast.error(err.message || "Failed to complete onboarding");
        }
      }
    );
  };

  return (
    <AuthSplitLayout 
      brandTitle="Welcome to ServiceHub" 
      brandSubtitle="Let's get your account set up."
    >
      <div className="w-full max-w-md mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-ink mb-2">
            Complete your profile
          </h1>
          <p className="text-ink-muted">
            Tell us a bit more about yourself to get started.
          </p>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <Input
                  label="Last Name"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              
              <Input
                label="Birth Date"
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                required
              />
              
              <div className="space-y-1.5">
                <span className="block text-sm font-semibold text-ink">Gender</span>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full rounded-sm border border-border bg-surface-alt p-3.5 text-sm text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors cursor-pointer"
                  required
                >
                  <option value="" disabled>Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <span className="block text-base font-serif font-bold text-ink">Select your role</span>
              <RoleSelector 
                value={role} 
                onChange={setRole}
                variant="cards" 
              />
            </div>
            
          <Button 
            size="lg" 
            className="w-full" 
            onClick={submitOnboarding}
            disabled={!role || !firstName || !lastName || !birthdate || !gender || isPending}
            isLoading={isPending}
          >
            Complete Setup
          </Button>
        </div>
      </div>
    </AuthSplitLayout>
  );
}
