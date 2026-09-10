import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeftIcon } from "lucide-react";

import { catalogApi, RelatedAdaptationSection } from "@entities/catalog";
import { MangaReader } from "@widgets/manga-reader";

type ReadPageProps = {
  params: Promise<{ id: string }>;
};

const CHAPTER_NUMBER = 1;

export async function generateMetadata({
  params,
}: ReadPageProps): Promise<Metadata> {
  const { id } = await params;
  const entry = await catalogApi.getCatalogEntry(Number(id));

  return {
    title: entry ? `Chapter ${CHAPTER_NUMBER} · ${entry.title}` : "Not Found",
  };
}

export default async function ReadPage({ params }: ReadPageProps) {
  const { id } = await params;
  const entry = await catalogApi.getCatalogEntry(Number(id));

  if (!entry) {
    notFound();
  }

  if (!("chapters" in entry)) {
    redirect(`/watch/${entry.id}`);
  }

  const related = entry.relatedId
    ? await catalogApi.getCatalogEntry(entry.relatedId)
    : null;

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
            Chapter {CHAPTER_NUMBER}
          </h1>
          <p className="text-xs text-ink-faint">{entry.title} · Official</p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 pb-10">
        <MangaReader
          title={entry.title}
          chapterLabel="Chapter 1"
          accentColor={entry.color}
        />
        {entry.description && (
          <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-relaxed text-ink-muted">
            {entry.description}
          </p>
        )}
        {related && <RelatedAdaptationSection related={related} />}
      </div>
    </div>
  );
}