import React from "react";

export type SpinnerSize = "sm" | "md" | "lg" | "xl";
export type SpinnerColor = "primary" | "white" | "muted" | "accent";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
  color?: SpinnerColor;
  label?: string;
}

const sizeMap: Record<SpinnerSize, string> = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-3",
  xl: "w-12 h-12 border-4",
};

const colorMap: Record<SpinnerColor, string> = {
  primary: "border-primary/20 border-t-primary",
  white: "border-white/20 border-t-white",
  muted: "border-border-strong/30 border-t-ink-muted",
  accent: "border-accent/20 border-t-accent",
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  color = "primary",
  label = "Loading...",
  className = "",
  ...props
}) => {
  return (
    <div
      role="status"
      className={`inline-flex items-center justify-center ${className}`}
      {...props}
    >
      <div
        className={`rounded-full animate-spin ${sizeMap[size]} ${colorMap[color]}`}
      />
      {label && <span className="sr-only">{label}</span>}
    </div>
  );
};
