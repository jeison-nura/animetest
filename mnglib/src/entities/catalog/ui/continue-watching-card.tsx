"use client";

import { useState } from "react";
import Link from "next/link";
import { PlayIcon } from "lucide-react";

import { getInitials } from "@/shared/lib/get-initials";

import type { WatchProgressItem } from "../model/types";

type ContinueWatchingCardProps = {
  item: WatchProgressItem;
};

function ContinueWatchingCard({ item }: ContinueWatchingCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/watch/${item.catalogId}`}
      aria-label={`Continue watching ${item.title}`}
      className="w-60 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-line-soft bg-card transition-[transform,box-shadow] duration-200"
      style={{
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered ? `0 12px 32px ${item.color}33` : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative h-32 w-full"
        style={{
          background: `linear-gradient(135deg, ${item.color}99, ${item.color}22, #1a1a2e)`,
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex select-none items-end justify-end p-3 opacity-10"
        >
          <span className="font-display text-6xl font-black leading-none text-white">
            {getInitials(item.title, 2)}
          </span>
        </div>

        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-brand shadow-[0_0_20px_#7c3aed66]">
            <PlayIcon size={15} fill="white" className="ml-0.5 text-white" />
          </span>
        </div>

        <span className="absolute left-2.5 top-2.5 rounded-lg bg-black/70 px-2 py-0.5 text-xs font-medium text-[#c0c0d8]">
          {item.episode}
        </span>
      </div>

      <div aria-hidden className="h-0.5 bg-line-soft">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${item.progress}%`,
            background: `linear-gradient(90deg, #7c3aed, ${item.color})`,
          }}
        />
      </div>

      <div className="p-3">
        <h3 className="text-sm font-bold text-white">{item.title}</h3>
        <p className="mt-0.5 text-xs text-ink-faint">
          {item.episode} of {item.totalEps} · {item.progress}% watched
        </p>
      </div>
    </Link>
  );
}

export { ContinueWatchingCard };
