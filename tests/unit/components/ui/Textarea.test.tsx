import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Textarea } from "@/components/ui/Textarea";

describe("Textarea", () => {
  it("renders with label and placeholder", () => {
    render(
      <Textarea
        label="Job Description"
        placeholder="Describe the job in detail"
      />,
    );

    expect(screen.getByLabelText("Job Description")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Describe the job in detail"),
    ).toBeInTheDocument();
  });

  it("handles input change", () => {
    const handleChange = vi.fn();
    render(<Textarea label="Bio" onChange={handleChange} />);

    const textarea = screen.getByLabelText("Bio");
    fireEvent.change(textarea, { target: { value: "Experienced worker" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect((textarea as HTMLTextAreaElement).value).toBe("Experienced worker");
  });

  it("displays error message", () => {
    render(<Textarea label="Bio" error="Bio is required" />);

    expect(screen.getByText("Bio is required")).toBeInTheDocument();
  });

  it("displays helper text when no error", () => {
    render(<Textarea label="Bio" helperText="Max 500 characters" />);

    expect(screen.getByText("Max 500 characters")).toBeInTheDocument();
  });

  it("supports disabled state", () => {
    render(<Textarea label="Bio" disabled />);

    expect(screen.getByLabelText("Bio")).toBeDisabled();
  });
});
