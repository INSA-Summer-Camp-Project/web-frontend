import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import SignupPage from "@/app/(auth)/signup/page";
import { ApiError } from "@/lib/api";

const mockPush = vi.fn();
const mockRegister = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    register: mockRegister,
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

// Helper to transition to Step 2 in tests
const goToStep2 = async () => {
  vi.useFakeTimers();
  render(<SignupPage />);
  const telegramButton = screen.getByRole("button", {
    name: /sign up with telegram/i,
  });
  fireEvent.click(telegramButton);
  act(() => {
    vi.advanceTimersByTime(1000);
  });
  vi.useRealTimers();
};

describe("SignupPage Component (2-Step Telegram Onboarding)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Step 1: Telegram Authentication", () => {
    it("renders Step 1 with Telegram signup button and login link", () => {
      render(<SignupPage />);

      expect(screen.getByText("Join ServiceHub")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /sign up with telegram/i }),
      ).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /log in/i })).toHaveAttribute(
        "href",
        "/login",
      );

      // Verify old email/password fields are absent
      expect(screen.queryByLabelText("Email Address")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Password")).not.toBeInTheDocument();
      expect(
        screen.queryByText(/or sign up with email/i),
      ).not.toBeInTheDocument();
    });

    it("transitions to Step 2 onboarding form after Telegram authentication", async () => {
      await goToStep2();

      expect(screen.getByText("Complete your profile")).toBeInTheDocument();
      expect(screen.getByText("Step 2 of 2")).toBeInTheDocument();
    });
  });

  describe("Step 2: Onboarding Form Rendering", () => {
    it("renders First Name, Last Name, Gender, DOB, and 2 simplified role choices", async () => {
      await goToStep2();

      expect(screen.getByLabelText("First Name")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("John")).toBeInTheDocument();

      expect(screen.getByLabelText("Last Name")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Doe")).toBeInTheDocument();

      expect(screen.getByLabelText("Gender")).toBeInTheDocument();
      expect(screen.getByLabelText("Date of Birth")).toBeInTheDocument();

      // Role Selection - 2 options
      expect(screen.getByText("Choose your role")).toBeInTheDocument();
      expect(screen.getByText("I want to hire help")).toBeInTheDocument();
      expect(screen.getByText("I want to offer services")).toBeInTheDocument();
      expect(screen.queryByText("I run a business")).not.toBeInTheDocument();

      // Submit Button
      expect(
        screen.getByRole("button", { name: /complete sign up/i }),
      ).toBeInTheDocument();
    });

    it("allows user to navigate back to Step 1", async () => {
      await goToStep2();

      const backButton = screen.getByRole("button", {
        name: /back to telegram login/i,
      });
      fireEvent.click(backButton);

      expect(screen.getByText("Join ServiceHub")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /sign up with telegram/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Step 2: Role Selection State", () => {
    it("defaults to CUSTOMER and allows selecting WORKER role", async () => {
      await goToStep2();

      const customerRadio = screen.getByDisplayValue(
        "CUSTOMER",
      ) as HTMLInputElement;
      const workerRadio = screen.getByDisplayValue(
        "WORKER",
      ) as HTMLInputElement;

      expect(customerRadio.checked).toBe(true);
      expect(workerRadio.checked).toBe(false);
      expect(screen.queryByDisplayValue("BUSINESS")).not.toBeInTheDocument();

      fireEvent.click(workerRadio);
      expect(customerRadio.checked).toBe(false);
      expect(workerRadio.checked).toBe(true);
    });
  });

  describe("Step 2: Form Validation", () => {
    it("displays validation errors when submitting empty inputs in Step 2", async () => {
      await goToStep2();

      const submitButton = screen.getByRole("button", {
        name: /complete sign up/i,
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("First name is required")).toBeInTheDocument();
        expect(screen.getByText("Last name is required")).toBeInTheDocument();
        expect(screen.getByText("Please select a gender")).toBeInTheDocument();
        expect(
          screen.getByText("Date of birth is required"),
        ).toBeInTheDocument();
      });

      expect(mockRegister).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("displays error when name inputs have fewer than 2 characters", async () => {
      await goToStep2();

      fireEvent.change(screen.getByLabelText("First Name"), {
        target: { value: "A" },
      });
      fireEvent.change(screen.getByLabelText("Last Name"), {
        target: { value: "B" },
      });
      fireEvent.change(screen.getByLabelText("Gender"), {
        target: { value: "MALE" },
      });
      fireEvent.change(screen.getByLabelText("Date of Birth"), {
        target: { value: "1995-05-15" },
      });

      fireEvent.click(
        screen.getByRole("button", { name: /complete sign up/i }),
      );

      await waitFor(() => {
        expect(
          screen.getByText("First name must be at least 2 characters long"),
        ).toBeInTheDocument();
        expect(
          screen.getByText("Last name must be at least 2 characters long"),
        ).toBeInTheDocument();
      });

      expect(mockRegister).not.toHaveBeenCalled();
    });
  });

  describe("Step 2: Form Submission & Error Handling", () => {
    it("submits valid onboarding data and redirects to '/'", async () => {
      mockRegister.mockResolvedValueOnce(undefined);
      await goToStep2();

      // Select WORKER role
      fireEvent.click(screen.getByDisplayValue("WORKER"));

      // Fill in onboarding inputs
      fireEvent.change(screen.getByLabelText("First Name"), {
        target: { value: "Alice" },
      });
      fireEvent.change(screen.getByLabelText("Last Name"), {
        target: { value: "Smith" },
      });
      fireEvent.change(screen.getByLabelText("Gender"), {
        target: { value: "FEMALE" },
      });
      fireEvent.change(screen.getByLabelText("Date of Birth"), {
        target: { value: "1992-08-20" },
      });

      fireEvent.click(
        screen.getByRole("button", { name: /complete sign up/i }),
      );

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith(
          expect.objectContaining({
            role: "WORKER",
            fullName: "Alice Smith",
          }),
        );
        expect(mockPush).toHaveBeenCalledWith("/");
      });
    });

    it("displays server error alert when registration API rejects", async () => {
      mockRegister.mockRejectedValueOnce(
        new ApiError(400, "Account creation failed."),
      );
      await goToStep2();

      fireEvent.change(screen.getByLabelText("First Name"), {
        target: { value: "Alice" },
      });
      fireEvent.change(screen.getByLabelText("Last Name"), {
        target: { value: "Smith" },
      });
      fireEvent.change(screen.getByLabelText("Gender"), {
        target: { value: "FEMALE" },
      });
      fireEvent.change(screen.getByLabelText("Date of Birth"), {
        target: { value: "1992-08-20" },
      });

      fireEvent.click(
        screen.getByRole("button", { name: /complete sign up/i }),
      );

      await waitFor(() => {
        expect(screen.getByRole("alert")).toHaveTextContent(
          "Account creation failed.",
        );
      });

      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
