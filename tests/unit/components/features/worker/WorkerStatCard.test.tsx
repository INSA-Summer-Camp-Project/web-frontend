import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Briefcase } from "lucide-react";
import {
  WorkerStatCard,
  WorkerStatCardSkeleton,
} from "@/components/features/worker/WorkerStatCard";

describe("WorkerStatCard", () => {
  it("renders metric label and numeric value", () => {
    render(
      <WorkerStatCard
        label="Active Jobs"
        value={4}
        icon={<Briefcase size={20} />}
      />,
    );

    expect(screen.getByText("Active Jobs")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("renders currency formatted value", () => {
    render(
      <WorkerStatCard
        label="Total Earnings"
        value={15400}
        isCurrency={true}
        icon={<Briefcase size={20} />}
        change="+12% from last month"
        changeType="positive"
      />,
    );

    expect(screen.getByText("Total Earnings")).toBeInTheDocument();
    expect(screen.getByText("ETB")).toBeInTheDocument();
    expect(screen.getByText("15,400")).toBeInTheDocument();
    expect(screen.getByText("+12% from last month")).toBeInTheDocument();
  });

  it("renders skeleton loader", () => {
    render(<WorkerStatCardSkeleton />);
    expect(screen.getByTestId("stat-card-skeleton")).toBeInTheDocument();
  });
});
