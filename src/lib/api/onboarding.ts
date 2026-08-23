import { apiClient } from "@/lib/api";
import type {
  OnboardingStatus,
  CompleteOnboardingPayload,
  UserProfile,
} from "@/types";

export const onboardingApi = {
  getStatus: (): Promise<OnboardingStatus> => {
    return apiClient.get<OnboardingStatus>("/api/v1/onboarding");
  },

  completeOnboarding: (
    data: CompleteOnboardingPayload,
  ): Promise<{ user: UserProfile }> => {
    // Map to backend OnboardUserDto
    const backendPayload = {
      name: `${data.firstName} ${data.lastName}`.trim(),
      birthdate: new Date(data.birthdate).toISOString(),
      gender: data.gender,
      activeRole: data.role,
    };
    return apiClient.post<{ user: UserProfile }>(
      "/api/v1/onboarding",
      backendPayload,
    );
  },
};
