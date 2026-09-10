import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";

import { getInitials } from "@/shared/lib/get-initials";

import type { CatalogEntry } from "../model/types";

type RelatedAdaptationSectionProps = {
  related: CatalogEntry;
};

function RelatedAdaptationSection({ related }: RelatedAdaptationSectionProps) {
  const relatedIsManga = "chapters" in related;

  return (
    <section className="mt-10">
      <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-ink-faint">
        {relatedIsManga ? "Manga Adaptation" : "Anime Adaptation"}
      </h2>
      <Link
        href={relatedIsManga ? `/read/${related.id}` : `/watch/${related.id}`}
        className="group flex max-w-md items-center gap-4 rounded-xl border border-line-soft bg-card p-4 transition-colors duration-200 hover:border-line-strong"
      >
        <div
          className="flex size-12 shrink-0 items-center justify-center rounded-lg font-display font-black text-white/20"
          style={{
            background: `linear-gradient(135deg, ${related.color}aa, ${related.color}33)`,
          }}
        >
          {getInitials(related.title, 2)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display font-semibold text-ink">
            {related.title}
          </p>
          <p className="text-xs text-ink-faint">
            {"chapters" in related
              ? `${related.chapters} chapters`
              : `${related.episodes} episodes`}{" "}
            · {related.year} · ★ {related.rating}
          </p>
        </div>
        <ChevronRightIcon
          size={16}
          className="shrink-0 text-ink-ghost transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </Link>
    </section>
  );
}

export { RelatedAdaptationSection };