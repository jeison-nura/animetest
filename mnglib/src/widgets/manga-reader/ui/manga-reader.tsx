"use client";

import { useState, type KeyboardEvent } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { getInitials } from "@/shared/lib/get-initials";
import { cn } from "@/shared/lib/cn";

const TOTAL_PAGES = 18;

const READING_MODES = [
  { key: "single", label: "Single Page" },
  { key: "longStrip", label: "Long Strip" },
] as const;

type ReadingMode = (typeof READING_MODES)[number]["key"];

type MangaReaderProps = {
  title: string;
  chapterLabel?: string;
  accentColor?: string;
};

function MangaReader({
  title,
  chapterLabel = "Chapter 1",
  accentColor = "#7c3aed",
}: MangaReaderProps) {
  const [mode, setMode] = useState<ReadingMode>("single");
  const [page, setPage] = useState(1);

  const goToPrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const goToNext = () => setPage((prev) => Math.min(prev + 1, TOTAL_PAGES));

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (mode !== "single") {
      return;
    }
    if (event.key === "ArrowLeft") {
      goToPrev();
    } else if (event.key === "ArrowRight") {
      goToNext();
    }
  };

  const renderPageCanvas = (pageNumber: number, seamless = false) => (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        seamless
          ? "border border-line-soft rounded-none"
          : "rounded-xl border border-line-soft"
      )}
      style={{
        aspectRatio: "2 / 3",
        background: `linear-gradient(145deg, ${accentColor}22 0%, #0d0d1a 70%)`,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center"
      >
        <span className="font-display text-8xl font-black leading-none text-white/5">
          {pageNumber}
        </span>
      </div>
      <span className="absolute bottom-3 right-3 rounded-lg bg-black/70 px-2 py-1 text-xs font-medium text-[#c0c0d8]">
        {getInitials(title, 2)} · p.{pageNumber}
      </span>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        role="group"
        aria-label="Reading mode"
        className="flex gap-2"
      >
        {READING_MODES.map(({ key, label }) => {
          const isActive = key === mode;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={isActive}
              onClick={() => setMode(key)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors duration-200",
                isActive
                  ? "border-brand bg-brand text-white"
                  : "border-line-strong bg-line text-ink-muted hover:border-brand/40 hover:text-ink"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {mode === "single" ? (
        <>
          <div
            tabIndex={0}
            onKeyDown={handleKeyDown}
            aria-label={`Manga page ${page}, use arrow keys to navigate`}
            className="w-full max-w-md focus:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
          >
            {renderPageCanvas(page)}
          </div>
          <span className="rounded-lg bg-black/70 px-2 py-1 text-xs font-medium text-[#c0c0d8]">
            {chapterLabel}
          </span>
          <div className="flex w-full max-w-md items-center justify-between">
            <button
              type="button"
              onClick={goToPrev}
              disabled={page === 1}
              aria-label="Previous page"
              className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors duration-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeftIcon size={16} />
            </button>
            <p className="text-sm text-ink-muted" aria-live="polite">
              Page {page} of {TOTAL_PAGES}
            </p>
            <button
              type="button"
              onClick={goToNext}
              disabled={page === TOTAL_PAGES}
              aria-label="Next page"
              className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors duration-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRightIcon size={16} />
            </button>
          </div>
        </>
      ) : (
        <div className="flex w-full max-w-md flex-col">
          {Array.from({ length: TOTAL_PAGES }, (_, index) => index + 1).map(
            (pageNumber) => (
              <div key={pageNumber} className="overflow-hidden">
                {renderPageCanvas(pageNumber, true)}
              </div>
            )
          )}
          <p
            className="text-center text-sm text-ink-muted"
            aria-live="polite"
          >
            {chapterLabel} · {TOTAL_PAGES} pages
          </p>
        </div>
      )}
    </div>
  );
}

export { MangaReader };