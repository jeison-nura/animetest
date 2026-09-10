import type { CatalogEntry } from "@entities/catalog";

export interface User {
  id: number;
  username: string;
  handle: string;
  email?: string;
  avatar?: string;
  initials?: string;
  proBadge?: boolean;
  memberSince?: string;
  bio?: string;
}

export type ProfileStatIcon = "film" | "trophy" | "bookOpen" | "trendingUp";

export interface ProfileStat {
  label: string;
  value: string;
  icon: ProfileStatIcon;
}

export interface GenreAffinity {
  genre: string;
  pct: number;
  color: string;
}

export interface ActivityItem {
  id: number;
  title: string;
  ep: string;
  rating: number;
  color: string;
  date: string;
}

export type AchievementIcon =
  | "trophy"
  | "award"
  | "calendar"
  | "trendingUp";

export interface Achievement {
  label: string;
  desc: string;
  icon: AchievementIcon;
  color: string;
}

export interface UserProfileSettings {
  displayName: string;
  email: string;
  language: string;
  country: string;
}

export type ListStatus = "completed" | "inProgress";

export interface UserListEntry<TEntry = CatalogEntry> {
  entry: TEntry;
  status: ListStatus;
}
