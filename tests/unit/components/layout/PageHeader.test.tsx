import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageHeader } from "@/components/layout/PageHeader";

describe("PageHeader", () => {
  it("renders title, subtitle, and badge", () => {
    render(
      <PageHeader
        title="Available Jobs"
        subtitle="Browse customer requests"
        badge={<span>12 Open</span>}
      />,
    );

    expect(screen.getByText("Available Jobs")).toBeInTheDocument();
    expect(screen.getByText("Browse customer requests")).toBeInTheDocument();
    expect(screen.getByText("12 Open")).toBeInTheDocument();
  });

  it("renders back link when backHref is provided", () => {
    render(
      <PageHeader
        title="Job Details"
        backHref="/worker/jobs"
        backLabel="Back to Jobs"
      />,
    );

    expect(screen.getByText("Back to Jobs")).toBeInTheDocument();
  });

  it("renders actions slot", () => {
    render(
      <PageHeader
        title="Profile"
        actions={<button type="button">Edit Profile</button>}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Edit Profile" }),
    ).toBeInTheDocument();
  });
});
