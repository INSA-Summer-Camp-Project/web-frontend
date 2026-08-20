import React from "react";

export interface PriceDisplayProps extends React.HTMLAttributes<HTMLSpanElement> {
  amount: number | string;
  currency?: string;
  period?: string;
  prefix?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showDecimals?: boolean;
}

const sizeStyles = {
  sm: "text-xs font-semibold",
  md: "text-sm font-semibold",
  lg: "text-lg font-bold",
  xl: "text-2xl font-bold font-serif",
};

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  amount,
  currency = "ETB",
  period,
  prefix,
  size = "md",
  showDecimals = false,
  className = "",
  ...props
}) => {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;

  const formattedAmount = isNaN(numericAmount)
    ? amount
    : new Intl.NumberFormat("en-US", {
        minimumFractionDigits: showDecimals ? 2 : 0,
        maximumFractionDigits: showDecimals ? 2 : 2,
      }).format(numericAmount);

  return (
    <span
      className={`inline-flex items-baseline tracking-tight text-ink tabular-nums ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {prefix && (
        <span className="font-normal text-ink-muted mr-1 text-[0.9em]">
          {prefix}
        </span>
      )}
      {currency && (
        <span className="font-medium text-ink-muted mr-1 text-[0.85em]">
          {currency}
        </span>
      )}
      <span>{formattedAmount}</span>
      {period && (
        <span className="font-normal text-ink-muted ml-0.5 text-[0.85em]">
          {period}
        </span>
      )}
    </span>
  );
};
