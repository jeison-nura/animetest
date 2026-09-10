"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  PlayIcon,
  PlusIcon,
  StarIcon,
} from "lucide-react";

import type { HeroSlide } from "@entities/catalog";

type HeroCarouselProps = {
  slides: HeroSlide[];
};

function HeroCarousel({ slides }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [savedIds, setSavedIds] = useState<number[]>([]);

  if (slides.length === 0) {
    return null;
  }

  const slide = slides[current];
  const { palette } = slide;
  const isSaved = savedIds.includes(slide.id);

  const goToPrev = () =>
    setCurrent((index) => (index - 1 + slides.length) % slides.length);
  const goToNext = () => setCurrent((index) => (index + 1) % slides.length);
  const toggleSave = () =>
    setSavedIds((ids) =>
      isSaved ? ids.filter((id) => id !== slide.id) : [...ids, slide.id]
    );

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured anime"
      className="relative h-[clamp(380px,58vh,560px)] w-full overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 transition-all duration-700"
        style={{
          background: `linear-gradient(135deg, ${palette.from} 0%, ${palette.to} 55%, #08080f 100%)`,
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute right-[-8%] top-[-25%] rounded-full transition-all duration-700"
        style={{
          width: "55vw",
          height: "55vw",
          background: `radial-gradient(circle, ${palette.accent}28 0%, transparent 70%)`,
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(${palette.accent} 1px, transparent 1px), linear-gradient(90deg, ${palette.accent} 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(8,8,15,0.92) 0%, rgba(8,8,15,0.55) 55%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(8,8,15,1) 0%, transparent 45%)",
        }}
      />

      <div className="relative flex h-full max-w-2xl flex-col justify-end px-10 pb-10">
        <div className="mb-3 flex items-center gap-3">
          <span
            aria-hidden
            className="h-0.5 w-7 rounded-full"
            style={{ background: palette.accent }}
          />
          <span
            className="text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: palette.textAccent }}
          >
            {slide.subtitle}
          </span>
        </div>

        <h1
          className="mb-4 font-display text-[clamp(2rem,5.5vw,4rem)] font-black leading-none text-white"
          style={{ textShadow: `0 0 80px ${palette.accent}44` }}
        >
          {slide.title}
        </h1>

        <div className="mb-4 flex flex-wrap gap-2">
          {slide.genres.map((genre) => (
            <span
              key={genre}
              className="rounded-full border px-3 py-1 text-xs font-medium"
              style={{
                background: `${palette.accent}18`,
                color: palette.textAccent,
                borderColor: `${palette.accent}30`,
              }}
            >
              {genre}
            </span>
          ))}
          <span className="flex items-center gap-1 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-400">
            <StarIcon size={10} fill="currentColor" /> {slide.rating}
          </span>
          <span className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-ink-muted">
            <ClockIcon size={10} /> {slide.episodes} Episodes
          </span>
        </div>

        <p className="mb-7 max-w-md text-sm leading-relaxed text-ink-muted">
          {slide.description}
        </p>

        <div className="flex items-center gap-3">
          <Link
            href={`/watch/${slide.catalogId}`}
            className="flex items-center gap-2 rounded-xl px-7 py-3 font-display text-sm font-bold text-white transition-all duration-200 hover:scale-105 hover:brightness-110"
            style={{
              background: palette.accent,
              boxShadow: `0 4px 30px ${palette.accent}55`,
            }}
          >
            <PlayIcon size={16} fill="white" /> Watch Now
          </Link>
          <button
            type="button"
            onClick={toggleSave}
            aria-pressed={isSaved}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.07] px-6 py-3 font-display text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/10"
          >
            {isSaved ? <CheckIcon size={15} /> : <PlusIcon size={15} />}
            {isSaved ? "In My List" : "Add to List"}
          </button>
        </div>
      </div>

      <div className="absolute bottom-5 right-10 flex items-center gap-2">
        <button
          type="button"
          onClick={goToPrev}
          aria-label="Previous slide"
          className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-black/55 transition-all duration-200 hover:scale-110"
        >
          <ChevronLeftIcon size={15} className="text-white" />
        </button>

        {slides.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}: ${item.title}`}
            aria-current={index === current}
            className="h-[7px] rounded-full transition-all duration-300"
            style={{
              width: index === current ? "22px" : "7px",
              background:
                index === current
                  ? palette.accent
                  : "rgba(255,255,255,0.25)",
            }}
          />
        ))}

        <button
          type="button"
          onClick={goToNext}
          aria-label="Next slide"
          className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-black/55 transition-all duration-200 hover:scale-110"
        >
          <ChevronRightIcon size={15} className="text-white" />
        </button>
      </div>
    </div>
  );
}

export { HeroCarousel };
