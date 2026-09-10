"use client";

import { useState } from "react";

import {
  MediaCard,
  type AnimeEntry,
  type MangaEntry,
} from "@entities/catalog";
import { StatusBadge, type UserListEntry } from "@entities/user";
import { cn } from "@/shared/lib/cn";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "completed", label: "Completed" },
  { key: "inProgress", label: "In Progress" },
] as const;

type ListFilter = (typeof FILTERS)[number]["key"];

type MyListSectionProps = {
  title: string;
  items: UserListEntry[];
};

function MyListSection({ title, items }: MyListSectionProps) {
  return (
    <section>
      <h3 className="mb-4 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-widest text-ink-faint">
        {title}
        <span className="text-[10px] font-semibold tracking-normal text-ink-ghost">
          ({items.length})
        </span>
      </h3>
      {items.length > 0 ? (
        <div className="flex flex-wrap gap-5">
          {items.map((item) => (
            <MediaCard
              key={item.entry.id}
              entry={item.entry}
              statusBadge={<StatusBadge status={item.status} />}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-ink-faint">Nothing here yet</p>
      )}
    </section>
  );
}

type MyListViewProps = {
  animeList: UserListEntry<AnimeEntry>[];
  mangaList: UserListEntry<MangaEntry>[];
};

function MyListView({ animeList, mangaList }: MyListViewProps) {
  const [filter, setFilter] = useState<ListFilter>("all");
  const allItems: UserListEntry[] = [...animeList, ...mangaList];
  const matchesFilter = (item: UserListEntry) =>
    filter === "all" || item.status === filter;

  return (
    <div className="px-8 py-8">
      <div
        role="group"
        aria-label="Filter by status"
        className="mb-8 flex flex-wrap gap-2"
      >
        {FILTERS.map(({ key, label }) => {
          const isActive = key === filter;
          const count =
            key === "all"
              ? allItems.length
              : allItems.filter((item) => item.status === key).length;

          return (
            <button
              key={key}
              type="button"
              aria-pressed={isActive}
              onClick={() => setFilter(key)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors duration-200",
                isActive
                  ? "border-brand bg-brand text-white"
                  : "border-line-strong bg-line text-ink-muted hover:border-brand/40 hover:text-ink"
              )}
            >
              {label}
              <span className="ml-1.5 opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-8">
        <MyListSection
          title="Animes"
          items={animeList.filter(matchesFilter)}
        />
        <MyListSection
          title="Mangas"
          items={mangaList.filter(matchesFilter)}
        />
      </div>
    </div>
  );
}

export { MyListView };