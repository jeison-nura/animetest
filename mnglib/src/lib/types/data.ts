/**
 * Interfaces para modelos de datos de la aplicación
 */

/**
 * Interfaz base para elementos multimedia (anime, manga, etc.)
 */
export interface MediaItem {
  id: number;
  title: string;
  imageUrl: string;
  description?: string;
  rating?: number;
  releaseDate?: string;
  genres?: string[];
}

/**
 * Interfaz para elementos de anime
 */
export interface AnimeItem extends MediaItem {
  episodes?: number;
  duration?: string;
  studio?: string;
  status?: "ongoing" | "completed" | "upcoming";
}

/**
 * Interfaz para elementos de manga
 */
export interface MangaItem extends MediaItem {
  chapters?: number;
  author?: string;
  publisher?: string;
  status?: "ongoing" | "completed" | "upcoming";
}

/**
 * Interfaz para usuario
 */
export interface User {
  id: number;
  username: string;
  email?: string;
  avatar?: string;
  favorites?: (AnimeItem | MangaItem)[];
  watchlist?: AnimeItem[];
  readlist?: MangaItem[];
}
