"use client";

import { useState } from "react";
import { CheckIcon } from "lucide-react";

import { StarRating } from "@/shared/ui";

const SECTION_TITLE = "Rate This Episode";

function EpisodeRating() {
  const [rating, setRating] = useState(0);
  const [isRated, setIsRated] = useState(false);

  return (
    <section
      aria-label={SECTION_TITLE}
      className="rounded-xl border border-line-soft bg-card p-5"
    >
      <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-ink-faint">
        {SECTION_TITLE}
      </h3>
      {isRated ? (
        <div className="flex flex-wrap items-center gap-3">
          <StarRating value={rating} readOnly />
          <span className="flex items-center gap-1 text-sm font-medium text-emerald-400">
            <CheckIcon size={14} /> Saved
          </span>
          <button
            type="button"
            onClick={() => setIsRated(false)}
            className="text-xs text-ink-dim underline-offset-2 transition-colors hover:text-ink hover:underline"
          >
            Change
          </button>
        </div>
      ) : (
        <StarRating
          value={rating}
          onChange={(value) => {
            setRating(value);
            setIsRated(true);
          }}
        />
      )}
    </section>
  );
}

export { EpisodeRating };