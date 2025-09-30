"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface BookmarkItem {
  id: string;
  title: string;
  japaneseTitle: string;
  image: string;
  genre: string[];
  year: number;
  episodes: number;
  type: 'anime' | 'manga';
  rating: number;
  status: 'completed' | 'ongoing' | 'upcoming';
  addedAt: Date;
}

interface BookmarkContextType {
  bookmarks: BookmarkItem[];
  addBookmark: (item: Omit<BookmarkItem, 'id' | 'addedAt'>) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  toggleBookmark: (item: Omit<BookmarkItem, 'id' | 'addedAt'>) => void;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
};

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('anime-bookmarks');
    if (savedBookmarks) {
      try {
        const parsed = JSON.parse(savedBookmarks);
        // Convert addedAt strings back to Date objects
        const bookmarksWithDates = parsed.map((bookmark: any) => ({
          ...bookmark,
          addedAt: new Date(bookmark.addedAt)
        }));
        setBookmarks(bookmarksWithDates);
      } catch (error) {
        // Silent fallback - use empty array
      }
    }
  }, []);

  // Save bookmarks to localStorage whenever bookmarks change
  useEffect(() => {
    localStorage.setItem('anime-bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = (item: Omit<BookmarkItem, 'id' | 'addedAt'>) => {
    const newBookmark: BookmarkItem = {
      ...item,
      id: `${item.title}-${Date.now()}`,
      addedAt: new Date()
    };
    setBookmarks(prev => [...prev, newBookmark]);
  };

  const removeBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
  };

  const isBookmarked = (id: string) => {
    return bookmarks.some(bookmark => bookmark.id === id);
  };

  const toggleBookmark = (item: Omit<BookmarkItem, 'id' | 'addedAt'>) => {
    const existingBookmark = bookmarks.find(bookmark => 
      bookmark.title === item.title && bookmark.japaneseTitle === item.japaneseTitle
    );
    
    if (existingBookmark) {
      removeBookmark(existingBookmark.id);
    } else {
      addBookmark(item);
    }
  };

  const value = {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    toggleBookmark
  };

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
};
