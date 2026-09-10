"use client";

import { useCallback } from "react";

import {
  catalogApi,
  ContinueWatchingCard,
  MediaCard,
} from "@entities/catalog";
import { useAsyncData } from "@/shared/lib/use-async-data";
import { AsyncError, PageLoader } from "@/shared/ui";
import { ContentRow } from "@widgets/content-row";
import { HeroCarousel } from "@widgets/hero-carousel";

function HomeView() {
  const { data, isLoading, error, refetch } = useAsyncData(
    useCallback(async () => {
      const [slides, continueWatching, topPicks, trending, topManga] =
        await Promise.all([
          catalogApi.getHeroSlides(),
          catalogApi.getContinueWatching(),
          catalogApi.getTopPicks(),
          catalogApi.getTrending(),
          catalogApi.getTopManga(),
        ]);

      return { slides, continueWatching, topPicks, trending, topManga };
    }, [])
  );

  if (error) {
    return <AsyncError onRetry={refetch} />;
  }

  if (isLoading || !data) {
    return <PageLoader />;
  }

  return (
    <>
      <HeroCarousel slides={data.slides} />
      <div className="space-y-10 px-8 py-8">
        <ContentRow title="Continue Watching">
          {data.continueWatching.map((item) => (
            <ContinueWatchingCard key={item.id} item={item} />
          ))}
        </ContentRow>

        <ContentRow title="Top Picks For You">
          {data.topPicks.map((entry) => (
            <MediaCard key={entry.id} entry={entry} />
          ))}
        </ContentRow>

        <ContentRow title="Trending Now">
          {data.trending.map((entry) => (
            <MediaCard key={entry.id} entry={entry} />
          ))}
        </ContentRow>

        <ContentRow title="Top Manga">
          {data.topManga.map((entry) => (
            <MediaCard key={entry.id} entry={entry} />
          ))}
        </ContentRow>
      </div>
    </>
  );
}

export { HomeView };
