import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { VerificationSection } from "@/components/features/worker/VerificationSection";
import type { WorkerProfile, UserProfile } from "@/types";

describe("VerificationSection", () => {
  const mockUser: UserProfile = {
    id: "usr-1",
    name: "Abebe Bikila",
    phone: "+251912345678",
    email: "abebe@example.com",
    role: "WORKER",
  };

  const mockProfile: WorkerProfile = {
    id: "wrk-1",
    user: mockUser,
  };

  it("renders verification titles and verified phone number", () => {
    render(<VerificationSection profile={mockProfile} user={mockUser} />);

    expect(screen.getByText("Trust & Verification Status")).toBeInTheDocument();
    expect(screen.getByText("Phone Authentication")).toBeInTheDocument();
    expect(screen.getByText("+251912345678")).toBeInTheDocument();
    expect(screen.getByText("Service Provider Account")).toBeInTheDocument();
    expect(screen.getByText("Verified")).toBeInTheDocument();
  });
});
