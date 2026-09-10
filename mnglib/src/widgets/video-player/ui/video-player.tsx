"use client";

import { useState } from "react";
import { PauseIcon, PlayIcon } from "lucide-react";

import { getInitials } from "@/shared/lib/get-initials";

type VideoPlayerProps = {
  title: string;
  accentColor?: string;
};

function VideoPlayer({ title, accentColor = "#7c3aed" }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div
      className="relative aspect-video w-full overflow-hidden rounded-xl border border-line-soft"
      style={{
        background: `linear-gradient(135deg, ${accentColor}33 0%, #0d0d1a 70%)`,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center"
      >
        <span className="font-display text-8xl font-black leading-none text-white/5">
          {getInitials(title)}
        </span>
      </div>

      <button
        type="button"
        onClick={() => setIsPlaying((prev) => !prev)}
        aria-label={isPlaying ? "Pause" : "Play"}
        aria-pressed={isPlaying}
        className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand shadow-[0_0_32px_#7c3aed88] transition-all duration-200 hover:scale-110"
      >
        {isPlaying ? (
          <PauseIcon size={26} fill="white" className="text-white" />
        ) : (
          <PlayIcon size={26} fill="white" className="ml-1 text-white" />
        )}
      </button>

      <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-8">
        <button
          type="button"
          onClick={() => setIsPlaying((prev) => !prev)}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
        >
          {isPlaying ? (
            <PauseIcon size={14} fill="white" className="text-white" />
          ) : (
            <PlayIcon size={14} fill="white" className="ml-0.5 text-white" />
          )}
        </button>
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-brand transition-all duration-700"
            style={{ width: isPlaying ? "42%" : "0%" }}
          />
        </div>
        <span className="text-xs text-white/60">0:00 / 24:00</span>
      </div>
    </div>
  );
}

export { VideoPlayer };