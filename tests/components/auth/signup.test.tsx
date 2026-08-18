import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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

describe("SignupPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders all form elements, role selector, and action buttons", () => {
      render(<SignupPage />);

      expect(screen.getByText("Join ServiceHub")).toBeInTheDocument();
      expect(screen.getByText("Choose your role")).toBeInTheDocument();
      expect(screen.getByText("I want to hire help")).toBeInTheDocument();
      expect(screen.getByText("I want to offer services")).toBeInTheDocument();
      expect(screen.getByText("I run a business")).toBeInTheDocument();

      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText("John Doe")).toBeInTheDocument();

      expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("you@example.com"),
      ).toBeInTheDocument();

      expect(screen.getByLabelText("Password")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Min 8 characters"),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /create account with email/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /sign up with telegram/i }),
      ).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /log in/i })).toHaveAttribute(
        "href",
        "/login",
      );
    });
  });

  describe("Role Selection State", () => {
    it("defaults to CUSTOMER and updates selection when clicking other roles", () => {
      render(<SignupPage />);

      const customerRadio = screen.getByDisplayValue(
        "CUSTOMER",
      ) as HTMLInputElement;
      const workerRadio = screen.getByDisplayValue(
        "WORKER",
      ) as HTMLInputElement;
      const businessRadio = screen.getByDisplayValue(
        "BUSINESS",
      ) as HTMLInputElement;

      expect(customerRadio.checked).toBe(true);
      expect(workerRadio.checked).toBe(false);
      expect(businessRadio.checked).toBe(false);

      // Select WORKER
      fireEvent.click(workerRadio);
      expect(customerRadio.checked).toBe(false);
      expect(workerRadio.checked).toBe(true);
      expect(businessRadio.checked).toBe(false);

      // Select BUSINESS
      fireEvent.click(businessRadio);
      expect(customerRadio.checked).toBe(false);
      expect(workerRadio.checked).toBe(false);
      expect(businessRadio.checked).toBe(true);
    });
  });

  describe("Form Validation", () => {
    it("triggers validation errors when submitting empty inputs", async () => {
      render(<SignupPage />);

      const emailInput = screen.getByPlaceholderText("you@example.com");
      const form = emailInput.closest("form")!;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText("Email is required")).toBeInTheDocument();
        expect(screen.getByText("Password is required")).toBeInTheDocument();
      });

      expect(mockRegister).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("triggers error when email format is invalid", async () => {
      render(<SignupPage />);

      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInput = screen.getByPlaceholderText("Min 8 characters");
      const form = emailInput.closest("form")!;

      fireEvent.change(emailInput, { target: { value: "invalid-email" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.submit(form);

      await waitFor(() => {
        expect(
          screen.getByText("Please enter a valid email address"),
        ).toBeInTheDocument();
      });

      expect(mockRegister).not.toHaveBeenCalled();
    });

    it("triggers error when password is less than 8 characters", async () => {
      render(<SignupPage />);

      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInput = screen.getByPlaceholderText("Min 8 characters");
      const form = emailInput.closest("form")!;

      fireEvent.change(emailInput, { target: { value: "user@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "1234567" } });
      fireEvent.submit(form);

      await waitFor(() => {
        expect(
          screen.getByText("Password must be at least 8 characters long"),
        ).toBeInTheDocument();
      });

      expect(mockRegister).not.toHaveBeenCalled();
    });

    it("triggers error when fullName has fewer than 2 characters", async () => {
      render(<SignupPage />);

      const fullNameInput = screen.getByPlaceholderText("John Doe");
      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInput = screen.getByPlaceholderText("Min 8 characters");
      const form = emailInput.closest("form")!;

      fireEvent.change(fullNameInput, { target: { value: "A" } });
      fireEvent.change(emailInput, { target: { value: "user@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.submit(form);

      await waitFor(() => {
        expect(
          screen.getByText("Full name must be at least 2 characters long"),
        ).toBeInTheDocument();
      });

      expect(mockRegister).not.toHaveBeenCalled();
    });
  });

  describe("Form Submission", () => {
    it("calls register handler and redirects to '/' with selected role and valid data", async () => {
      mockRegister.mockResolvedValueOnce(undefined);

      render(<SignupPage />);

      const workerRadio = screen.getByDisplayValue("WORKER");
      fireEvent.click(workerRadio);

      const fullNameInput = screen.getByPlaceholderText("John Doe");
      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInput = screen.getByPlaceholderText("Min 8 characters");
      const form = emailInput.closest("form")!;

      fireEvent.change(fullNameInput, { target: { value: "Jane Smith" } });
      fireEvent.change(emailInput, {
        target: { value: "jane.smith@example.com" },
      });
      fireEvent.change(passwordInput, {
        target: { value: "securePassword123" },
      });
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith({
          role: "WORKER",
          fullName: "Jane Smith",
          email: "jane.smith@example.com",
          password: "securePassword123",
        });
        expect(mockPush).toHaveBeenCalledWith("/");
      });
    });

    it("displays server error alert when registration API rejects", async () => {
      mockRegister.mockRejectedValueOnce(
        new ApiError(400, "Email is already registered."),
      );

      render(<SignupPage />);

      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInput = screen.getByPlaceholderText("Min 8 characters");
      const form = emailInput.closest("form")!;

      fireEvent.change(emailInput, {
        target: { value: "existing@example.com" },
      });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByRole("alert")).toHaveTextContent(
          "Email is already registered.",
        );
      });

      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
