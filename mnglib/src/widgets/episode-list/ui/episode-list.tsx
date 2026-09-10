"use client";

import { useState } from "react";

import { cn } from "@/shared/lib/cn";

const MAX_VISIBLE_EPISODES = 24;

type EpisodeListProps = {
  total: number;
  current?: number;
};

function EpisodeList({ total, current = 1 }: EpisodeListProps) {
  const [selected, setSelected] = useState(current);
  const visibleEpisodes = Math.min(total, MAX_VISIBLE_EPISODES);

  return (
    <section
      aria-label="Episodes"
      className="rounded-xl border border-line-soft bg-card p-5"
    >
      <h3 className="mb-4 flex items-baseline justify-between font-display text-sm font-bold uppercase tracking-widest text-ink-faint">
        Episodes
        <span className="text-[10px] font-semibold tracking-normal text-ink-ghost">
          {total} total
        </span>
      </h3>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: visibleEpisodes }, (_, index) => {
          const episodeNumber = index + 1;
          const isActive = episodeNumber === selected;

          return (
            <button
              key={episodeNumber}
              type="button"
              aria-pressed={isActive}
              aria-label={`Episode ${episodeNumber}`}
              onClick={() => setSelected(episodeNumber)}
              className={cn(
                "flex size-9 items-center justify-center rounded-lg border text-xs font-semibold transition-colors duration-200",
                isActive
                  ? "border-brand bg-brand text-white"
                  : "border-line-strong bg-line text-ink-muted hover:border-brand/40 hover:text-ink"
              )}
            >
              {episodeNumber}
            </button>
          );
        })}
      </div>
      {total > MAX_VISIBLE_EPISODES && (
        <p className="mt-3 text-[10px] text-ink-ghost">
          Showing first {MAX_VISIBLE_EPISODES} of {total} episodes
        </p>
      )}
    </section>
  );
}

export { EpisodeList };