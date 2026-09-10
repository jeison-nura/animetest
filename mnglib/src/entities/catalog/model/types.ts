export type MediaKind = "anime" | "manga";

export interface MediaItem {
  id: number;
  title: string;
  rating: number;
  year: number;
  genres: string[];
  color: string;
  description?: string;
  relatedId?: number;
  isNew?: boolean;
}

export interface AnimeEntry extends MediaItem {
  episodes: number;
}

export interface MangaEntry extends MediaItem {
  chapters: number;
}

export type CatalogEntry = AnimeEntry | MangaEntry;

export interface HeroSlidePalette {
  from: string;
  to: string;
  accent: string;
  textAccent: string;
}

export interface HeroSlide {
  id: number;
  catalogId: number;
  title: string;
  subtitle: string;
  description: string;
  genres: string[];
  rating: string;
  episodes: number;
  palette: HeroSlidePalette;
}

export interface WatchProgressItem {
  id: number;
  catalogId: number;
  title: string;
  episode: string;
  progress: number;
  totalEps: number;
  color: string;
}
