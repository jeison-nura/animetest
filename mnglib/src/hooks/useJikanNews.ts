"use client";
import { useState, useEffect } from 'react';
import { jikanService, JikanNewsItem } from '@/lib/jikan';
import { getMockNews } from '@/lib/mockNews';

interface UseJikanNewsReturn {
  news: JikanNewsItem[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}

export const useJikanNews = (initialLimit: number = 10): UseJikanNewsReturn => {
  const [news, setNews] = useState<JikanNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [limit] = useState(initialLimit);

  const fetchNews = async (pageNum: number, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      let newsData: JikanNewsItem[] = [];
      
      try {
        // Intentar obtener noticias reales de la API de Jikan
        newsData = await jikanService.getNewsFromPopularAnime(limit * pageNum);
        
        // Si no obtenemos noticias de la API, usar datos simulados
        if (newsData.length === 0) {
          newsData = getMockNews(limit, 0);
        }
      } catch (apiError) {
        // Usar datos simulados como respaldo
        newsData = getMockNews(limit, 0);
      }
      
      if (append) {
        // Para paginación, agregar más datos simulados con el desplazamiento apropiado
        const offset = (pageNum - 1) * limit;
        const additionalNews = getMockNews(limit, offset);
        setNews(prev => {
          const combined = [...prev, ...additionalNews];
          // Eliminar duplicados basados en mal_id (seguridad adicional)
          const unique = combined.filter((item, index, self) => 
            index === self.findIndex(t => t.mal_id === item.mal_id)
          );
          return unique;
        });
      } else {
        // Eliminar duplicados de los datos iniciales también
        const uniqueNewsData = newsData.filter((item, index, self) => 
          index === self.findIndex(t => t.mal_id === item.mal_id)
        );
        setNews(uniqueNewsData);
      }
      
      // Siempre mostrar cargar más con fines de demostración
      setHasMore(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las noticias');
      
      // Incluso en caso de error, mostrar solo datos simulados
      try {
        const offset = append ? (page - 1) * limit : 0;
        const mockData = getMockNews(limit, offset);
        if (!append) {
          setNews(mockData);
        }
      } catch (mockError) {
        // Respaldo  -  Solo si los datos simulados fallaron
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNews(nextPage, true);
    }
  };

  const refresh = () => {
    setPage(1);
    setNews([]);
    setHasMore(true);
    fetchNews(1, false);
  };

  useEffect(() => {
    fetchNews(1, false);
  }, []);

  return {
    news,
    loading,
    error,
    hasMore,
    loadMore,
    refresh
  };
};
