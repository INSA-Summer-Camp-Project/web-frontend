"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  readonly?: boolean;
  allowHalf?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Rating: React.FC<RatingProps> = ({
  value,
  onChange,
  max = 5,
  readonly = false,
  allowHalf = false,
  className,
  size = "md",
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const isInteractive = !readonly && onChange !== undefined;
  const displayValue = hoverValue ?? value;

  const sizeClasses = {
    sm: "text-[16px]",
    md: "text-[20px]",
    lg: "text-[24px]",
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    index: number,
  ) => {
    if (!isInteractive) return;

    if (allowHalf) {
      const { left, width } = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - left) / width;
      setHoverValue(percent <= 0.5 ? index - 0.5 : index);
    } else {
      setHoverValue(index);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (!isInteractive || !onChange) return;

    if (allowHalf) {
      const { left, width } = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - left) / width;
      onChange(percent <= 0.5 ? index - 0.5 : index);
    } else {
      onChange(index);
    }
  };

  const handleMouseLeave = () => {
    if (!isInteractive) return;
    setHoverValue(null);
  };

  return (
    <div
      className={cn("inline-flex items-center gap-1", className)}
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: max }, (_, i) => i + 1).map((index) => {
        const isFull = displayValue >= index;
        const isHalf = displayValue >= index - 0.5 && displayValue < index;

        return (
          <div
            key={index}
            className={cn(
              "relative text-border-strong transition-colors",
              isInteractive && "cursor-pointer hover:scale-110 active:scale-95",
              sizeClasses[size],
            )}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onClick={(e) => handleClick(e, index)}
          >
            {/* Background Star */}
            <Star className="fill-current opacity-30 select-none text-border-strong w-[1em] h-[1em]" />

            {/* Foreground Star */}
            {(isFull || isHalf) && (
              <div
                className={cn(
                  "absolute top-0 left-0 overflow-hidden text-accent select-none",
                  isHalf ? "w-[50%]" : "w-full",
                )}
              >
                <Star className="fill-current w-[1em] h-[1em]" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
