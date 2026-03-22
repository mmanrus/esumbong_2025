"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import clsx from "clsx";

const LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};

// ─── Interactive (for forms) ──────────────────────────────────────────────────

type StarRatingInputProps = {
  value: number; // current selected value (0 = none)
  onChange: (v: number) => void;
  error?: string;
  disabled?: boolean;
};

export function StarRatingInput({
  value,
  onChange,
  error,
  disabled,
}: StarRatingInputProps) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div className="space-y-1.5">
      <div
        className="flex items-center gap-1"
        onMouseLeave={() => setHovered(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            className={clsx(
              "transition-all duration-100 focus:outline-none focus-visible:ring-2",
              "focus-visible:ring-yellow-400 rounded-sm",
              disabled
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer hover:scale-110",
            )}
          >
            <Star
              className={clsx(
                "w-8 h-8 sm:w-9 sm:h-9 transition-colors duration-100",
                star <= active
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-transparent text-gray-300",
              )}
              strokeWidth={1.5}
            />
          </button>
        ))}

        {/* Label beside stars */}
        {active > 0 && (
          <span className="ml-2 text-sm font-medium text-yellow-600 min-w-[72px]">
            {LABELS[active]}
          </span>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

// ─── Read-only display ────────────────────────────────────────────────────────

type StarRatingDisplayProps = {
  value: number | null;
  size?: "sm" | "md";
};

export function StarRatingDisplay({
  value,
  size = "sm",
}: StarRatingDisplayProps) {
  if (!value)
    return <span className="text-sm text-muted-foreground">No rating</span>;

  const iconClass = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={clsx(
            iconClass,
            star <= value
              ? "fill-yellow-400 text-yellow-400"
              : "fill-transparent text-gray-300",
          )}
          strokeWidth={1.5}
        />
      ))}
      <span className="ml-1.5 text-sm font-medium text-yellow-600">
        {value}/5 · {LABELS[value] ?? ""}
      </span>
    </div>
  );
}
