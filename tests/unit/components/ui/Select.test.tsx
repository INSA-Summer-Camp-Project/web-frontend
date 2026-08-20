import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Select } from "@/components/ui/Select";

describe("Select", () => {
  const options = [
    { value: "plumbing", label: "Plumbing" },
    { value: "cleaning", label: "Cleaning" },
    { value: "electrical", label: "Electrical", disabled: true },
  ];

  it("renders with label and options", () => {
    render(<Select label="Category" options={options} />);

    expect(screen.getByLabelText("Category")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Plumbing" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Cleaning" }),
    ).toBeInTheDocument();
  });

  it("handles selection change", () => {
    const handleChange = vi.fn();
    render(
      <Select label="Category" options={options} onChange={handleChange} />,
    );

    const select = screen.getByLabelText("Category");
    fireEvent.change(select, { target: { value: "cleaning" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect((select as HTMLSelectElement).value).toBe("cleaning");
  });

  it("displays placeholder option", () => {
    render(
      <Select
        label="Category"
        placeholder="Select a category"
        options={options}
      />,
    );

    expect(
      screen.getByRole("option", { name: "Select a category" }),
    ).toBeInTheDocument();
  });

  it("displays error message", () => {
    render(<Select label="Category" error="Please select a category" />);

    expect(screen.getByText("Please select a category")).toBeInTheDocument();
  });

  it("supports disabled state", () => {
    render(<Select label="Category" disabled options={options} />);

    expect(screen.getByLabelText("Category")).toBeDisabled();
  });
});
