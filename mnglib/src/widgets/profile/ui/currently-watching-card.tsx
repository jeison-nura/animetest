import Link from "next/link";

import { getInitials } from "@/shared/lib/get-initials";
import type { WatchProgressItem } from "@entities/catalog";

const CARD_TITLE = "Currently Watching";

type CurrentlyWatchingCardProps = {
  items: WatchProgressItem[];
};

function CurrentlyWatchingCard({ items }: CurrentlyWatchingCardProps) {
  return (
    <div className="rounded-xl border border-line-soft bg-card p-5">
      <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-ink-faint">
        {CARD_TITLE}
      </h3>
      <div className="space-y-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/watch/${item.catalogId}`}
            aria-label={`Continue watching ${item.title}`}
            className="group flex cursor-pointer items-center gap-3"
          >
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-lg font-display font-black text-white/20 transition-transform group-hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${item.color}aa, ${item.color}33)`,
              }}
            >
              {getInitials(item.title, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-xs font-semibold text-ink">
                {item.title}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-line-soft">
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <span className="text-[10px] text-ink-faint">
                  {item.progress}%
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export { CurrentlyWatchingCard };
