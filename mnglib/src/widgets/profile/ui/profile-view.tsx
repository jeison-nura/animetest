"use client";

import { useState } from "react";

import {
  MediaCard,
  type AnimeEntry,
  type MangaEntry,
  type WatchProgressItem,
} from "@entities/catalog";
import {
  AchievementsCard,
  ActivityFeed,
  ActivityHistory,
  GenreAffinityCard,
  ProfileBanner,
  ProfileIdentity,
  ProfileStats,
  SettingsList,
  StatusBadge,
  type Achievement,
  type ActivityItem,
  type GenreAffinity,
  type ProfileStat,
  type User,
  type UserListEntry,
  type UserProfileSettings,
} from "@entities/user";

import { CurrentlyWatchingCard } from "./currently-watching-card";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "mylist", label: "My List" },
  { key: "history", label: "History" },
  { key: "settings", label: "Settings" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

type MyListSectionProps = {
  title: string;
  items: UserListEntry[];
};

function MyListSection({ title, items }: MyListSectionProps) {
  return (
    <section>
      <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-ink-faint">
        {title}
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

type ProfileViewProps = {
  profile: User;
  stats: ProfileStat[];
  genreAffinities: GenreAffinity[];
  recentActivity: ActivityItem[];
  watchHistory: ActivityItem[];
  achievements: Achievement[];
  settings: UserProfileSettings;
  currentlyWatching: WatchProgressItem[];
  myAnimeList: UserListEntry<AnimeEntry>[];
  myMangaList: UserListEntry<MangaEntry>[];
};

function ProfileView({
  profile,
  stats,
  genreAffinities,
  recentActivity,
  watchHistory,
  achievements,
  settings,
  currentlyWatching,
  myAnimeList,
  myMangaList,
}: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  return (
    <div className="min-h-full">
      <ProfileBanner />

      <div className="relative -mt-13 px-10">
        <ProfileIdentity profile={profile} />
        <ProfileStats stats={stats} />

        <div
          role="tablist"
          aria-label="Profile sections"
          className="mb-8 flex gap-1 border-b border-line"
        >
          {TABS.map(({ key, label }) => {
            const isActive = key === activeTab;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(key)}
                className={`relative px-5 py-2.5 font-display text-sm font-semibold transition-colors duration-200 ${
                  isActive ? "text-brand-light" : "text-ink-faint hover:text-ink"
                }`}
              >
                {label}
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-0.5 rounded-t-full bg-brand"
                  />
                )}
              </button>
            );
          })}
        </div>

        {activeTab === "overview" && (
          <div
            role="tabpanel"
            className="grid gap-6 pb-10 lg:grid-cols-[1fr_320px]"
          >
            <div className="min-w-0 space-y-6">
              <GenreAffinityCard affinities={genreAffinities} />
              <ActivityFeed items={recentActivity} />
            </div>
            <div className="space-y-5">
              <AchievementsCard achievements={achievements} />
              <CurrentlyWatchingCard items={currentlyWatching} />
            </div>
          </div>
        )}

        {activeTab === "mylist" && (
          <div role="tabpanel" className="space-y-8 pb-10">
            <MyListSection title="Animes" items={myAnimeList} />
            <MyListSection title="Mangas" items={myMangaList} />
          </div>
        )}

        {activeTab === "history" && (
          <div role="tabpanel" className="pb-10">
            <ActivityHistory items={watchHistory} />
          </div>
        )}

        {activeTab === "settings" && (
          <div role="tabpanel" className="max-w-lg space-y-4 pb-10">
            <SettingsList settings={settings} />
            <button
              type="button"
              className="mt-2 w-full rounded-xl bg-brand py-3 font-display text-sm font-bold text-white transition-all duration-200 hover:brightness-110"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export { ProfileView };
