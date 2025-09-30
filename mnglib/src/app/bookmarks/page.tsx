"use client";

import React, { useState } from 'react';
import { Heart, Calendar, Star, Play, Eye, Trash2, Filter } from 'lucide-react';
import { BookmarkProvider, useBookmarks } from '@/contexts/BookmarkContext';

const BookmarkList = () => {
  const { bookmarks, removeBookmark } = useBookmarks();
  const [filterType, setFilterType] = useState<'all' | 'anime' | 'manga'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'ongoing' | 'upcoming'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title' | 'rating'>('newest');

  const filteredBookmarks = bookmarks
    .filter(bookmark => {
      const typeMatch = filterType === 'all' || bookmark.type === filterType;
      const statusMatch = filterStatus === 'all' || bookmark.status === filterStatus;
      return typeMatch && statusMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.addedAt.getTime() - a.addedAt.getTime();
        case 'oldest':
          return a.addedAt.getTime() - b.addedAt.getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'ongoing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'upcoming':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'anime' 
      ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      : 'bg-purple-500/20 text-purple-400 border-purple-500/30';
  };

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Heart className="w-16 h-16 text-gray-600 mb-4" />
        <h3 className="text-2xl font-bold text-gray-400 mb-2">No hay favoritos</h3>
        <p className="text-gray-500 text-center max-w-md">
          Agrega animes a tus favoritos haciendo clic en el corazón ❤️ en la página de inicio
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Mis Favoritos</h1>
          <p className="text-gray-400">{bookmarks.length} {bookmarks.length === 1 ? 'favorito' : 'favoritos'}</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-400">Filtros</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-600/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tipo</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Todos</option>
              <option value="anime">Anime</option>
              <option value="manga">Manga</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Estado</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Todos</option>
              <option value="completed">Completado</option>
              <option value="ongoing">En curso</option>
              <option value="upcoming">Próximamente</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Ordenar por</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="newest">Más recientes</option>
              <option value="oldest">Más antiguos</option>
              <option value="title">Título</option>
              <option value="rating">Calificación</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookmarks Grid - 4 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredBookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-600/50 hover:border-orange-500/50 transition-all duration-300 group"
          >
            {/* Image */}
            <div className="relative aspect-[3/4] overflow-hidden">
              <img
                src={bookmark.image}
                alt={bookmark.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Type Badge */}
              <div className="absolute top-3 left-3">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getTypeColor(bookmark.type)}`}>
                  {bookmark.type === 'anime' ? 'Anime' : 'Manga'}
                </span>
              </div>

              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(bookmark.status)}`}>
                  {bookmark.status === 'completed' ? 'Completado' :
                   bookmark.status === 'ongoing' ? 'En curso' : 'Próximamente'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="absolute bottom-3 right-3 flex gap-2">
                <button className="w-8 h-8 bg-orange-500/80 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors">
                  <Play className="w-4 h-4 text-white" />
                </button>
                <button 
                  onClick={() => removeBookmark(bookmark.id)}
                  className="w-8 h-8 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              {/* Title */}
              <div>
                <h3 className="font-bold text-white text-lg line-clamp-2 group-hover:text-orange-400 transition-colors">
                  {bookmark.title}
                </h3>
                {bookmark.japaneseTitle && (
                  <p className="text-gray-400 text-sm mt-1 line-clamp-1">
                    {bookmark.japaneseTitle}
                  </p>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-yellow-400 font-semibold">{bookmark.rating}</span>
                <span className="text-gray-400 text-sm">/ 5.0</span>
              </div>

              {/* Info */}
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{bookmark.year}</span>
                  <span>•</span>
                  <span>{bookmark.episodes} {bookmark.type === 'anime' ? 'episodios' : 'capítulos'}</span>
                </div>
                
                {/* Genres */}
                <div className="flex flex-wrap gap-1">
                  {bookmark.genre.slice(0, 2).map((genre, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-slate-700 rounded text-xs"
                    >
                      {genre}
                    </span>
                  ))}
                  {bookmark.genre.length > 2 && (
                    <span className="px-2 py-1 bg-slate-700 rounded text-xs">
                      +{bookmark.genre.length - 2}
                    </span>
                  )}
                </div>
              </div>

              {/* Added Date */}
              <div className="text-xs text-gray-500 pt-2 border-t border-slate-700">
                Agregado el {formatDate(bookmark.addedAt)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function BookmarksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <BookmarkList />
      </div>
    </div>
  );
}