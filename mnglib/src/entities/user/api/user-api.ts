import { http, isMockMode, mockDelay } from "@shared/api";

import type { AnimeEntry, MangaEntry } from "@entities/catalog";

import type {
  Achievement,
  ActivityItem,
  GenreAffinity,
  ProfileStat,
  User,
  UserListEntry,
  UserProfileSettings,
} from "../model/types";
import * as userMocks from "./mock-user";

export const userApi = {
  async getProfile(): Promise<User> {
    if (isMockMode()) {
      await mockDelay();
      return userMocks.getProfile();
    }
    return http.get<User>("/me/profile");
  },

  async getProfileStats(): Promise<ProfileStat[]> {
    if (isMockMode()) {
      await mockDelay();
      return userMocks.getProfileStats();
    }
    return http.get<ProfileStat[]>("/me/profile/stats");
  },

  async getGenreAffinities(): Promise<GenreAffinity[]> {
    if (isMockMode()) {
      await mockDelay();
      return userMocks.getGenreAffinities();
    }
    return http.get<GenreAffinity[]>("/me/profile/genre-affinities");
  },

  async getRecentActivity(): Promise<ActivityItem[]> {
    if (isMockMode()) {
      await mockDelay();
      return userMocks.getRecentActivity();
    }
    return http.get<ActivityItem[]>("/me/activity/recent");
  },

  async getWatchHistory(): Promise<ActivityItem[]> {
    if (isMockMode()) {
      await mockDelay();
      return userMocks.getWatchHistory();
    }
    return http.get<ActivityItem[]>("/me/activity/history");
  },

  async getAchievements(): Promise<Achievement[]> {
    if (isMockMode()) {
      await mockDelay();
      return userMocks.getAchievements();
    }
    return http.get<Achievement[]>("/me/achievements");
  },

  async getProfileSettings(): Promise<UserProfileSettings> {
    if (isMockMode()) {
      await mockDelay();
      return userMocks.getProfileSettings();
    }
    return http.get<UserProfileSettings>("/me/settings");
  },

  async getMyAnimeList(): Promise<UserListEntry<AnimeEntry>[]> {
    if (isMockMode()) {
      await mockDelay();
      return userMocks.getMyAnimeList();
    }
    return http.get<UserListEntry<AnimeEntry>[]>("/me/lists/anime");
  },

  async getMyMangaList(): Promise<UserListEntry<MangaEntry>[]> {
    if (isMockMode()) {
      await mockDelay();
      return userMocks.getMyMangaList();
    }
    return http.get<UserListEntry<MangaEntry>[]>("/me/lists/manga");
  },
};
