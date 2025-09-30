"use client";
import React from 'react';
import { JikanNewsItem } from '@/lib/jikan';
import { Calendar, User, MessageCircle, ExternalLink, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface JikanNewsCardProps {
  newsItem: JikanNewsItem;
  index: number;
}

export const JikanNewsCard: React.FC<JikanNewsCardProps> = ({ newsItem, index }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const truncatedExcerpt = stripHtml(newsItem.excerpt).substring(0, 150) + '...';

  return (
    <div 
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50 hover:border-orange-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 group animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex gap-4">
        {/* News Image */}
        {newsItem.images?.jpg?.image_url && (
          <div className="flex-shrink-0">
            <img
              src={newsItem.images.jpg.image_url}
              alt={newsItem.title}
              className="w-32 h-24 object-cover rounded-lg border border-slate-600/50 group-hover:border-orange-500/50 transition-colors duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* News Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors duration-300 line-clamp-2">
            {newsItem.title}
          </h3>

          {/* Excerpt */}
          <p className="text-slate-300 text-sm mb-4 line-clamp-3">
            {truncatedExcerpt}
          </p>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(newsItem.date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{newsItem.author_username}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{newsItem.comments} comentarios</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              onClick={() => window.open(newsItem.url, '_blank')}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 group/btn relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/0 to-red-400/0 group-hover/btn:from-orange-400/20 group-hover/btn:to-red-400/20 transition-all duration-300"></div>
              <ExternalLink className="w-4 h-4 mr-2 relative z-10" />
              <span className="relative z-10">Leer más</span>
            </Button>

            <Button
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 hover:scale-105"
            >
              <Heart className="w-4 h-4 mr-2" />
              Guardar
            </Button>
          </div>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 to-red-500/0 group-hover:from-orange-500/5 group-hover:to-red-500/5 rounded-xl transition-all duration-300 pointer-events-none"></div>
    </div>
  );
};
