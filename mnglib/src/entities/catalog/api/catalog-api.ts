import { http, isMockMode, mockDelay } from "@shared/api";

import type {
  AnimeEntry,
  CatalogEntry,
  HeroSlide,
  MangaEntry,
  WatchProgressItem,
} from "../model/types";
import * as catalogMocks from "./mock-catalog";

export const catalogApi = {
  async getHeroSlides(): Promise<HeroSlide[]> {
    if (isMockMode()) {
      await mockDelay();
      return catalogMocks.getHeroSlides();
    }
    return http.get<HeroSlide[]>("/catalog/hero-slides");
  },

  async getContinueWatching(): Promise<WatchProgressItem[]> {
    if (isMockMode()) {
      await mockDelay();
      return catalogMocks.getContinueWatching();
    }
    return http.get<WatchProgressItem[]>("/me/continue-watching");
  },

  async getTopPicks(): Promise<AnimeEntry[]> {
    if (isMockMode()) {
      await mockDelay();
      return catalogMocks.getTopPicks();
    }
    return http.get<AnimeEntry[]>("/catalog/top-picks");
  },

  async getTrending(): Promise<AnimeEntry[]> {
    if (isMockMode()) {
      await mockDelay();
      return catalogMocks.getTrending();
    }
    return http.get<AnimeEntry[]>("/catalog/trending");
  },

  async getTopManga(): Promise<MangaEntry[]> {
    if (isMockMode()) {
      await mockDelay();
      return catalogMocks.getTopManga();
    }
    return http.get<MangaEntry[]>("/catalog/top-manga");
  },

  async getCatalogEntry(id: number): Promise<CatalogEntry | null> {
    if (isMockMode()) {
      await mockDelay();
      return catalogMocks.getCatalogEntry(id);
    }
    return http.get<CatalogEntry | null>(`/catalog/entries/${id}`);
  },
};
