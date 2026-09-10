"use client";

import { useState } from "react";
import { StarIcon } from "lucide-react";

import { cn } from "@/shared/lib/cn";

const TOTAL_STARS = 5;

type StarRatingProps = {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md";
  className?: string;
};

function StarRating({
  value,
  onChange,
  readOnly = false,
  size = "md",
  className,
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const displayValue = !readOnly && hovered > 0 ? hovered : value;
  const starSize = size === "sm" ? "size-3" : "size-5";

  return (
    <div
      role={readOnly ? "img" : "radiogroup"}
      aria-label={
        readOnly
          ? `Rated ${value} out of ${TOTAL_STARS} stars`
          : "Rate with stars"
      }
      className={cn("flex items-center gap-0.5", className)}
    >
      {Array.from({ length: TOTAL_STARS }, (_, index) => {
        const star = index + 1;
        const isFilled = star <= displayValue;

        if (readOnly) {
          return (
            <StarIcon
              key={star}
              className={cn(
                starSize,
                isFilled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-line-strong text-line-strong"
              )}
            />
          );
        }

        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={star === value}
            aria-label={`Rate ${star} of ${TOTAL_STARS} stars`}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange?.(star)}
            className="transition-transform duration-150 hover:scale-110"
          >
            <StarIcon
              className={cn(
                starSize,
                isFilled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-ink-ghost hover:text-amber-400"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

export { StarRating, type StarRatingProps };