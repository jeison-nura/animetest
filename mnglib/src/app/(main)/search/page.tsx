import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
};

export default function SearchPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="font-display text-2xl font-bold text-ink-muted">
        Search — coming soon
      </h1>
    </div>
  );
}
