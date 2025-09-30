"use client";
import React, { useState } from 'react';
import { useJikanNews } from '@/hooks/useJikanNews';
import { JikanNewsCard } from './JikanNewsCard';
import { RefreshCw, Loader2, AlertCircle, Newspaper, TrendingUp, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const JikanNewsSection: React.FC = () => {
  const { news, loading, error, hasMore, loadMore, refresh } = useJikanNews(8);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  };

  const handleLoadMore = () => {
    loadMore();
  };

  if (error) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-red-500/50">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-red-400">Error al cargar noticias</h3>
            <p className="text-red-200">No se pudieron cargar las noticias de anime</p>
          </div>
        </div>
        <p className="text-slate-300 mb-4">{error}</p>
        <Button
          onClick={handleRefresh}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
            <Newspaper className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
              Noticias de Anime
            </h2>
            <p className="text-orange-100">Últimas noticias del mundo del anime desde MyAnimeList</p>
          </div>
        </div>
        
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {isRefreshing ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Actualizar
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/50 hover:border-orange-500/30 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Noticias cargadas</p>
              <p className="text-xl font-bold text-white">{news.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/50 hover:border-red-500/30 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Fuente</p>
              <p className="text-lg font-bold text-white">MyAnimeList</p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/50 hover:border-orange-500/30 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Última actualización</p>
              <p className="text-lg font-bold text-white">Ahora</p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && news.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-orange-400 animate-spin mx-auto mb-4" />
            <p className="text-slate-300">Cargando noticias de anime...</p>
          </div>
        </div>
      )}

      {/* News Grid */}
      {news.length > 0 && (
        <div className="grid gap-6">
          {news.map((newsItem, index) => (
            <JikanNewsCard
              key={`${newsItem.mal_id}-${index}`}
              newsItem={newsItem}
              index={index}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && news.length > 0 && (
        <div className="flex justify-center pt-6">
          <Button
            onClick={handleLoadMore}
            disabled={loading}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/0 to-red-400/0 group-hover:from-orange-400/20 group-hover:to-red-400/20 transition-all duration-300"></div>
            {loading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin relative z-10" />
            ) : (
              <TrendingUp className="w-5 h-5 mr-2 relative z-10" />
            )}
            <span className="relative z-10">
              {loading ? 'Cargando...' : 'Cargar más noticias'}
            </span>
          </Button>
        </div>
      )}

      {/* No More News */}
      {!hasMore && news.length > 0 && (
        <div className="text-center py-8">
          <p className="text-slate-400">¡Has visto todas las noticias disponibles!</p>
        </div>
      )}
    </div>
  );
};
