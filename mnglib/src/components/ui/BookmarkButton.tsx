"use client";

import React from 'react';
import { Heart } from 'lucide-react';
import { useBookmarks, BookmarkItem } from '@/contexts/BookmarkContext';

interface BookmarkButtonProps {
  item: Omit<BookmarkItem, 'id' | 'addedAt'>;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({ 
  item, 
  className = '', 
  size = 'md' 
}) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  
  const isBooked = isBookmarked(`${item.title}-${item.japaneseTitle}`);
  
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(item);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center
        rounded-full
        transition-all duration-300
        hover:scale-110
        active:scale-95
        ${isBooked 
          ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
          : 'bg-white/20 text-white hover:bg-red-500/20 hover:text-red-400'
        }
        backdrop-blur-sm
        border border-white/20
        hover:border-red-400/50
        ${className}
      `}
      title={isBooked ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      <Heart 
        className={`${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} ${
          isBooked ? 'fill-current' : ''
        }`} 
      />
    </button>
  );
};
