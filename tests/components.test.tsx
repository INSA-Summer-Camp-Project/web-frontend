import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Input, Button, RoleSelector, AuthCard } from "../src/components/ui";

describe("Stitch UI Components Test Suite", () => {
  describe("Input Component", () => {
    it("renders label, placeholder, and helper text", () => {
      render(
        <Input
          label="Email Address"
          placeholder="user@example.com"
          helperText="We will never share your email."
        />,
      );
      expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("user@example.com"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("We will never share your email."),
      ).toBeInTheDocument();
    });

    it("displays error message when provided", () => {
      render(<Input label="Username" error="Username is required" />);
      expect(screen.getByText("Username is required")).toBeInTheDocument();
    });

    it("toggles password visibility when password type is used", () => {
      render(
        <Input label="Password" type="password" placeholder="Enter password" />,
      );
      const inputEl = screen.getByPlaceholderText(
        "Enter password",
      ) as HTMLInputElement;
      expect(inputEl.type).toBe("password");

      const toggleButton = screen.getByRole("button", {
        name: /show password/i,
      });
      fireEvent.click(toggleButton);
      expect(inputEl.type).toBe("text");

      fireEvent.click(screen.getByRole("button", { name: /hide password/i }));
      expect(inputEl.type).toBe("password");
    });
  });

  describe("Button Component", () => {
    it("renders primary button correctly", () => {
      render(<Button variant="primary">Submit</Button>);
      const button = screen.getByRole("button", { name: "Submit" });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass("bg-primary");
    });

    it("renders secondary button correctly", () => {
      render(<Button variant="secondary">Cancel</Button>);
      const button = screen.getByRole("button", { name: "Cancel" });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass("bg-surface-alt");
    });

    it("shows loading spinner and disables interaction when isLoading is true", () => {
      render(
        <Button isLoading loadingText="Processing...">
          Click Me
        </Button>,
      );
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(screen.getByText("Processing...")).toBeInTheDocument();
    });
  });

  describe("RoleSelector Component", () => {
    it("renders default options (CUSTOMER, WORKER, BUSINESS)", () => {
      render(<RoleSelector value="CUSTOMER" />);
      expect(screen.getByText("I want to hire help")).toBeInTheDocument();
      expect(screen.getByText("I want to offer services")).toBeInTheDocument();
      expect(screen.getByText("I run a business")).toBeInTheDocument();
    });

    it("triggers onChange when a role card is clicked", () => {
      const handleChange = vi.fn();
      render(<RoleSelector value="CUSTOMER" onChange={handleChange} />);
      const workerRole = screen.getByDisplayValue("WORKER");
      fireEvent.click(workerRole);
      expect(handleChange).toHaveBeenCalledWith("WORKER");
    });
  });

  describe("AuthCard Component", () => {
    it("renders card title, brand header, and children", () => {
      render(
        <AuthCard
          brandName="ServiceHub"
          title="Welcome Back"
          subtitle="Login to your account"
        >
          <div data-testid="auth-form">Form Content</div>
        </AuthCard>,
      );
      expect(screen.getByText("ServiceHub")).toBeInTheDocument();
      expect(screen.getByText("Welcome Back")).toBeInTheDocument();
      expect(screen.getByText("Login to your account")).toBeInTheDocument();
      expect(screen.getByTestId("auth-form")).toBeInTheDocument();
    });
  });
});
