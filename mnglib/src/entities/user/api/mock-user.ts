import * as catalogMocks from "@entities/catalog/api/mock-catalog";
import type { AnimeEntry, MangaEntry } from "@entities/catalog";

import type {
  Achievement,
  ActivityItem,
  GenreAffinity,
  ListStatus,
  ProfileStat,
  User,
  UserListEntry,
  UserProfileSettings,
} from "../model/types";

const profile: User = {
  id: 1,
  username: "AnimeSenpai",
  handle: "animesenpai",
  email: "senpai@mnglib.io",
  initials: "AS",
  proBadge: true,
  memberSince: "Jan 2022",
  bio: "Lifelong anime fan. If it has a great story and dark themes, I'm in. Currently obsessed with Frieren.",
};

const profileStats: ProfileStat[] = [
  { label: "Episodes Watched", value: "1 284", icon: "film" },
  { label: "Anime Completed", value: "147", icon: "trophy" },
  { label: "Manga Reading", value: "38", icon: "bookOpen" },
  { label: "Reviews Written", value: "24", icon: "trendingUp" },
];

const genreAffinities: GenreAffinity[] = [
  { genre: "Action", pct: 72, color: "#7c3aed" },
  { genre: "Dark Fantasy", pct: 58, color: "#b91c1c" },
  { genre: "Supernatural", pct: 47, color: "#0891b2" },
  { genre: "Drama", pct: 39, color: "#be185d" },
  { genre: "Adventure", pct: 31, color: "#d97706" },
  { genre: "Comedy", pct: 22, color: "#16a34a" },
];

const recentActivity: ActivityItem[] = [
  {
    id: 1,
    title: "Jujutsu Kaisen",
    ep: "Ep 18",
    rating: 9,
    color: "#7c3aed",
    date: "2 days ago",
  },
  {
    id: 2,
    title: "Frieren",
    ep: "Ep 26",
    rating: 10,
    color: "#0891b2",
    date: "4 days ago",
  },
  {
    id: 3,
    title: "Bleach: TYBW",
    ep: "Ep 44",
    rating: 9,
    color: "#d97706",
    date: "1 week ago",
  },
  {
    id: 4,
    title: "Demon Slayer",
    ep: "Ep 8",
    rating: 8,
    color: "#dc2626",
    date: "1 week ago",
  },
  {
    id: 5,
    title: "Vinland Saga",
    ep: "Ep 24",
    rating: 10,
    color: "#7f5231",
    date: "2 weeks ago",
  },
];

const watchHistory: ActivityItem[] = [...recentActivity, ...recentActivity].map(
  (item, index) => ({ ...item, id: index + 1 })
);

const achievements: Achievement[] = [
  {
    label: "Binge Master",
    desc: "10 eps in one day",
    icon: "trophy",
    color: "#d97706",
  },
  {
    label: "Completionist",
    desc: "50 series finished",
    icon: "award",
    color: "#7c3aed",
  },
  {
    label: "Early Adopter",
    desc: "Joined in 2022",
    icon: "calendar",
    color: "#0891b2",
  },
  {
    label: "Critic",
    desc: "20 reviews posted",
    icon: "trendingUp",
    color: "#be185d",
  },
];

const settings: UserProfileSettings = {
  displayName: "AnimeSenpai",
  email: "senpai@mnglib.io",
  language: "English",
  country: "Colombia",
};

const ANIME_LIST_STATUS: Record<number, ListStatus> = {
  1: "inProgress",
  2: "completed",
  3: "completed",
  4: "inProgress",
  9: "inProgress",
  10: "inProgress",
  11: "completed",
  12: "completed",
};

const MANGA_LIST_STATUS: Record<number, ListStatus> = {
  15: "inProgress",
  16: "inProgress",
  17: "completed",
  18: "completed",
};

export async function getProfile(): Promise<User> {
  return profile;
}

export async function getProfileStats(): Promise<ProfileStat[]> {
  return profileStats;
}

export async function getGenreAffinities(): Promise<GenreAffinity[]> {
  return genreAffinities;
}

export async function getRecentActivity(): Promise<ActivityItem[]> {
  return recentActivity;
}

export async function getWatchHistory(): Promise<ActivityItem[]> {
  return watchHistory;
}

export async function getAchievements(): Promise<Achievement[]> {
  return achievements;
}

export async function getProfileSettings(): Promise<UserProfileSettings> {
  return settings;
}

export async function getMyAnimeList(): Promise<UserListEntry<AnimeEntry>[]> {
  const [topPicks, trending] = await Promise.all([
    catalogMocks.getTopPicks(),
    catalogMocks.getTrending(),
  ]);

  return [...topPicks.slice(0, 4), ...trending.slice(0, 4)].map((entry) => ({
    entry,
    status: ANIME_LIST_STATUS[entry.id] ?? "inProgress",
  }));
}

export async function getMyMangaList(): Promise<UserListEntry<MangaEntry>[]> {
  const topManga = await catalogMocks.getTopManga();

  return topManga.slice(0, 4).map((entry) => ({
    entry,
    status: MANGA_LIST_STATUS[entry.id] ?? "inProgress",
  }));
}
