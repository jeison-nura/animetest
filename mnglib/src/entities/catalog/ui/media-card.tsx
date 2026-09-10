"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { CheckIcon, PlayIcon, PlusIcon, StarIcon } from "lucide-react";

import { getInitials } from "@/shared/lib/get-initials";

import type { CatalogEntry } from "../model/types";

type MediaCardProps = {
  entry: CatalogEntry;
  statusBadge?: ReactNode;
};

function MediaCard({ entry, statusBadge }: MediaCardProps) {
  const [hovered, setHovered] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const isManga = "chapters" in entry;
  const playHref = isManga ? `/read/${entry.id}` : `/watch/${entry.id}`;

  return (
    <article
      className="w-40 shrink-0 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative mb-2.5 w-full">
        <Link
          href={playHref}
          aria-label={`${isManga ? "Read" : "Watch"} ${entry.title}`}
        >
          <div
            className="relative w-full overflow-hidden rounded-xl transition-[transform,box-shadow] duration-300"
            style={{
              aspectRatio: "2 / 3",
              background: `linear-gradient(145deg, ${entry.color}cc 0%, ${entry.color}44 50%, #0f0f1e 100%)`,
              transform: hovered ? "scale(1.04) translateY(-2px)" : "scale(1)",
              boxShadow: hovered ? `0 16px 40px ${entry.color}44` : "none",
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 flex select-none items-center justify-center"
            >
              <span className="font-display text-[4rem] font-black leading-none text-white/10">
                {getInitials(entry.title)}
              </span>
            </div>

            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/30 to-transparent"
            />

            <div className="absolute inset-x-0 bottom-0 p-2.5">
              <p className="line-clamp-2 font-display text-xs font-semibold leading-tight text-white">
                {entry.title}
              </p>
            </div>

            <div
              aria-hidden
              className="absolute inset-0 flex items-center justify-center bg-black/45 transition-opacity duration-200"
              style={{ opacity: hovered ? 1 : 0 }}
            >
              <span
                className="flex size-12 items-center justify-center rounded-full bg-brand shadow-[0_0_24px_#7c3aed88] transition-transform duration-200"
                style={{ transform: hovered ? "scale(1)" : "scale(0.7)" }}
              >
                <PlayIcon size={18} fill="white" className="ml-0.5 text-white" />
              </span>
            </div>
          </div>
        </Link>

        <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
          {isManga ? (
            <span className="rounded bg-cyan-700 px-1.5 py-0.5 text-[10px] font-bold text-sky-100">
              MANGA
            </span>
          ) : (
            <span className="rounded bg-violet-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
              ANIME
            </span>
          )}
          {entry.isNew && (
            <span className="rounded bg-brand px-1.5 py-0.5 text-[10px] font-bold text-white">
              NEW
            </span>
          )}
          {statusBadge}
        </div>

        <button
          type="button"
          aria-label={
            bookmarked
              ? `Remove ${entry.title} from My List`
              : `Add ${entry.title} to My List`
          }
          aria-pressed={bookmarked}
          className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/65 transition-opacity duration-200"
          style={{ opacity: hovered || bookmarked ? 1 : 0 }}
          onClick={() => setBookmarked((prev) => !prev)}
        >
          {bookmarked ? (
            <CheckIcon size={12} className="text-brand-light" />
          ) : (
            <PlusIcon size={12} className="text-white" />
          )}
        </button>
      </div>

      <Link
        href={playHref}
        className="block truncate font-display text-sm font-semibold text-ink transition-colors hover:text-brand-light"
      >
        {entry.title}
      </Link>
      <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
        <span className="flex items-center gap-0.5 text-xs font-medium text-amber-400">
          <StarIcon size={10} fill="currentColor" /> {entry.rating}
        </span>
        <span aria-hidden className="text-xs text-ink-ghost">
          ·
        </span>
        <span className="text-xs text-ink-dim">
          {isManga ? `${entry.chapters} ch` : `${entry.episodes} ep`}
        </span>
        <span aria-hidden className="text-xs text-ink-ghost">
          ·
        </span>
        <span className="text-xs text-ink-dim">{entry.year}</span>
      </div>
      <div className="mt-1.5 flex flex-wrap gap-1">
        {entry.genres.slice(0, 2).map((genre) => (
          <span
            key={genre}
            className="rounded-full border border-line-strong bg-line px-1.5 py-0.5 text-[10px] text-ink-soft"
          >
            {genre}
          </span>
        ))}
      </div>
    </article>
  );
}

export { MediaCard };