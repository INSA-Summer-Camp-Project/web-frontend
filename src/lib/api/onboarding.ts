import { apiClient } from "@/lib/api";
import type { OnboardingStatus, CompleteOnboardingPayload } from "@/types";

export const onboardingApi = {
  getStatus: (): Promise<OnboardingStatus> => {
    return apiClient.get<OnboardingStatus>("/api/v1/onboarding");
  },

  completeOnboarding: (data: CompleteOnboardingPayload): Promise<{ user: any }> => {
    return apiClient.post<{ user: any }>("/api/v1/onboarding", data);
  },
};
