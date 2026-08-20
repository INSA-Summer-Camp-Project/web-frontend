import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Avatar } from "@/components/ui/Avatar";

describe("Avatar", () => {
  it("renders initials fallback when no image provided", () => {
    render(<Avatar name="Abebe Mekonnen" />);
    expect(screen.getByText("AM")).toBeInTheDocument();
  });

  it("renders single-word name initials", () => {
    render(<Avatar name="Sarah" />);
    expect(screen.getByText("SA")).toBeInTheDocument();
  });

  it("renders image when src is provided", () => {
    render(
      <Avatar
        src="https://res.cloudinary.com/demo/image/upload/sample.jpg"
        alt="User photo"
      />,
    );

    const img = screen.getByAltText("User photo");
    expect(img).toBeInTheDocument();
  });

  it("renders verified check badge when verified is true", () => {
    render(<Avatar name="Abebe" verified />);
    expect(screen.getByTestId("verified-badge")).toBeInTheDocument();
  });

  it("supports size variants", () => {
    const { container } = render(<Avatar name="Abebe" size="xl" />);
    const avatarBox = container.querySelector(".w-20");
    expect(avatarBox).toBeInTheDocument();
  });
});
