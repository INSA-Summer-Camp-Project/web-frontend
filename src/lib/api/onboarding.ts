import { apiClient } from "@/lib/api";
import type { OnboardingStatus, CompleteOnboardingPayload } from "@/types";

export const onboardingApi = {
  getStatus: (): Promise<OnboardingStatus> => {
    return apiClient.get<OnboardingStatus>("/api/v1/onboarding");
  },

  completeOnboarding: (data: CompleteOnboardingPayload): Promise<{ user: any }> => {
    // Map to backend OnboardUserDto
    const backendPayload = {
      name: `${data.firstName} ${data.lastName}`.trim(),
      birthdate: new Date(data.birthdate).toISOString(),
      gender: data.gender,
      activeRole: data.role,
    };
    return apiClient.post<{ user: any }>("/api/v1/onboarding", backendPayload);
  },
};
