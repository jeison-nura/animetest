import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeftIcon } from "lucide-react";

import { catalogApi, RelatedAdaptationSection } from "@entities/catalog";
import {
  commentsApi,
  CommentsSection,
  EpisodeRating,
} from "@features/episode-interactions";
import { EpisodeList } from "@widgets/episode-list";
import { VideoPlayer } from "@widgets/video-player";

type WatchPageProps = {
  params: Promise<{ id: string }>;
};

const EPISODE_NUMBER = 1;

export async function generateMetadata({
  params,
}: WatchPageProps): Promise<Metadata> {
  const { id } = await params;
  const entry = await catalogApi.getCatalogEntry(Number(id));

  return {
    title: entry ? `Episode ${EPISODE_NUMBER} · ${entry.title}` : "Not Found",
  };
}

export default async function WatchPage({ params }: WatchPageProps) {
  const { id } = await params;
  const entry = await catalogApi.getCatalogEntry(Number(id));

  if (!entry) {
    notFound();
  }

  if ("chapters" in entry) {
    redirect(`/read/${entry.id}`);
  }

  const [related, comments] = await Promise.all([
    entry.relatedId
      ? catalogApi.getCatalogEntry(entry.relatedId)
      : Promise.resolve(null),
    commentsApi.getEpisodeComments(EPISODE_NUMBER),
  ]);

  return (
    <div className="min-h-screen bg-night">
      <header className="flex items-center gap-3 px-6 py-4">
        <Link
          href="/home"
          aria-label="Back to home"
          className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-ink transition-colors duration-200 hover:bg-white/10"
        >
          <ArrowLeftIcon size={16} />
        </Link>
        <div>
          <h1 className="font-display text-lg font-bold text-white">
            Episode {EPISODE_NUMBER}
          </h1>
          <p className="text-xs text-ink-faint">{entry.title} · Subbed</p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 pb-10">
        <VideoPlayer title={entry.title} accentColor={entry.color} />

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
          <div className="min-w-0 space-y-8">
            {entry.description && (
              <p className="text-sm leading-relaxed text-ink-muted">
                {entry.description}
              </p>
            )}
            <EpisodeRating />
            <CommentsSection initialComments={comments} />
          </div>

          <div className="space-y-6">
            <EpisodeList total={entry.episodes} />
            {related && <RelatedAdaptationSection related={related} />}
          </div>
        </div>
      </div>
    </div>
  );
}