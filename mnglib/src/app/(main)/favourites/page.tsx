import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favourites",
};

export default function FavouritesPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="font-display text-2xl font-bold text-ink-muted">
        Favourites — coming soon
      </h1>
    </div>
  );
}
