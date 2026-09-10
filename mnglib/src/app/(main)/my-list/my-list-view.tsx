"use client";

import { useCallback } from "react";

import { userApi } from "@entities/user";
import { useAsyncData } from "@/shared/lib/use-async-data";
import { AsyncError, PageLoader } from "@/shared/ui";
import { MyListView } from "@widgets/my-list";

function MyListPageView() {
  const { data, isLoading, error, refetch } = useAsyncData(
    useCallback(async () => {
      const [animeList, mangaList] = await Promise.all([
        userApi.getMyAnimeList(),
        userApi.getMyMangaList(),
      ]);

      return { animeList, mangaList };
    }, [])
  );

  if (error) {
    return <AsyncError onRetry={refetch} />;
  }

  if (isLoading || !data) {
    return <PageLoader />;
  }

  return <MyListView animeList={data.animeList} mangaList={data.mangaList} />;
}

export { MyListPageView };
