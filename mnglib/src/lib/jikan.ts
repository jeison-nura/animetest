// Jikan API types and service
export interface JikanNewsItem {
  mal_id: number;
  url: string;
  title: string;
  date: string;
  author_username: string;
  author_url: string;
  forum_url: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  comments: number;
  excerpt: string;
}

export interface JikanNewsResponse {
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
  data: JikanNewsItem[];
}

export interface JikanAnimeItem {
  mal_id: number;
  url: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  trailer?: {
    youtube_id: string;
    url: string;
    embed_url: string;
  };
  approved: boolean;
  titles: Array<{
    type: string;
    title: string;
  }>;
  title: string;
  title_english?: string;
  title_japanese?: string;
  title_synonyms: string[];
  type: string;
  source: string;
  episodes: number;
  status: string;
  airing: boolean;
  aired: {
    from: string;
    to?: string;
    prop: {
      from: {
        day: number;
        month: number;
        year: number;
      };
      to: {
        day: number;
        month: number;
        year: number;
      };
    };
    string: string;
  };
  duration: string;
  rating: string;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string;
  background: string;
  season: string;
  year: number;
  broadcast: {
    day: string;
    time: string;
    timezone: string;
    string: string;
  };
  producers: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  licensors: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  studios: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  genres: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  explicit_genres: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  themes: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  demographics: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
}

export interface JikanAnimeResponse {
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
  data: JikanAnimeItem[];
}

class JikanService {
  private baseUrl = 'https://api.jikan.moe/v4';

  async getNewsFromPopularAnime(limit: number = 10): Promise<JikanNewsItem[]> {
    try {
      // Use specific popular anime IDs that are known to have news
      const popularAnimeIds = [
        21,   // One Piece
        11061, // Hunter x Hunter
        16498, // Attack on Titan
        11757, // Sword Art Online
        5114,  // Fullmetal Alchemist: Brotherhood
        1535,  // Death Note
        1,     // Cowboy Bebop
        6702,  // Fairy Tail
        9253,  // Steins;Gate
        22319  // Tokyo Ghoul
      ];
      
      // Get news from these specific anime
      const newsPromises = popularAnimeIds.slice(0, 5).map(animeId => 
        this.getAnimeNews(animeId, 1, 3) // 3 news per anime
      );
      
      const newsResponses = await Promise.allSettled(newsPromises);
      
      // Flatten and combine all news
      const allNews: JikanNewsItem[] = [];
      newsResponses.forEach(result => {
        if (result.status === 'fulfilled' && result.value.data.length > 0) {
          allNews.push(...result.value.data);
        }
      });
      
      // Remove duplicates based on mal_id and sort by date (newest first)
      const uniqueNews = allNews.filter((item, index, self) => 
        index === self.findIndex(t => t.mal_id === item.mal_id)
      );
      
      return uniqueNews
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit);
    } catch (error) {
      throw error;
    }
  }

  async getAnimeNews(animeId: number, page: number = 1, limit: number = 10): Promise<JikanNewsResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/anime/${animeId}/news?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getTopAnime(page: number = 1, limit: number = 10): Promise<JikanAnimeResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/top/anime?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getAnimeById(id: number): Promise<{ data: JikanAnimeItem }> {
    try {
      const response = await fetch(`${this.baseUrl}/anime/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async searchAnime(query: string, page: number = 1, limit: number = 10): Promise<JikanAnimeResponse> {
    try {
      const encodedQuery = encodeURIComponent(query);
      const response = await fetch(`${this.baseUrl}/anime?q=${encodedQuery}&page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}

export const jikanService = new JikanService();
