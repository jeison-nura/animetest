"use client";

import { useCallback } from "react";

import { catalogApi } from "@entities/catalog";
import { userApi } from "@entities/user";
import { useAsyncData } from "@/shared/lib/use-async-data";
import { AsyncError, PageLoader } from "@/shared/ui";
import { ProfileView } from "@widgets/profile";

function ProfilePageView() {
  const { data, isLoading, error, refetch } = useAsyncData(
    useCallback(async () => {
      const [
        profile,
        stats,
        genreAffinities,
        recentActivity,
        watchHistory,
        achievements,
        settings,
        currentlyWatching,
        myAnimeList,
        myMangaList,
      ] = await Promise.all([
        userApi.getProfile(),
        userApi.getProfileStats(),
        userApi.getGenreAffinities(),
        userApi.getRecentActivity(),
        userApi.getWatchHistory(),
        userApi.getAchievements(),
        userApi.getProfileSettings(),
        catalogApi.getContinueWatching(),
        userApi.getMyAnimeList(),
        userApi.getMyMangaList(),
      ]);

      return {
        profile,
        stats,
        genreAffinities,
        recentActivity,
        watchHistory,
        achievements,
        settings,
        currentlyWatching,
        myAnimeList,
        myMangaList,
      };
    }, [])
  );

  if (error) {
    return <AsyncError onRetry={refetch} />;
  }

  if (isLoading || !data) {
    return <PageLoader />;
  }

  return (
    <ProfileView
      profile={data.profile}
      stats={data.stats}
      genreAffinities={data.genreAffinities}
      recentActivity={data.recentActivity}
      watchHistory={data.watchHistory}
      achievements={data.achievements}
      settings={data.settings}
      currentlyWatching={data.currentlyWatching.slice(0, 3)}
      myAnimeList={data.myAnimeList}
      myMangaList={data.myMangaList}
    />
  );
}

export { ProfilePageView };
