import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { onboardingApi } from "@/lib/api/onboarding";
import type { OnboardingStatus, CompleteOnboardingPayload } from "@/types";

export const useOnboardingStatus = () => {
  return useQuery<OnboardingStatus, Error>({
    queryKey: ["auth", "onboardingStatus"],
    queryFn: () => onboardingApi.getStatus(),
  });
};

export const useCompleteOnboarding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CompleteOnboardingPayload) => onboardingApi.completeOnboarding(data),
    onSuccess: () => {
      // Invalidate both auth and onboarding status after completing onboarding
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "onboardingStatus"] });
    },
  });
};
