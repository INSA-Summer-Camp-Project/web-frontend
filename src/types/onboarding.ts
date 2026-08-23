export type OnboardingStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export interface CompleteOnboardingPayload {
  firstName: string;
  lastName: string;
  birthdate: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  role: "CUSTOMER" | "WORKER";
}
