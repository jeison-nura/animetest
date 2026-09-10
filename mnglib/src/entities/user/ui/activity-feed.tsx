import { getInitials } from "@/shared/lib/get-initials";
import { StarRating } from "@/shared/ui";

import { getFilledStars } from "../lib/get-filled-stars";
import type { ActivityItem } from "../model/types";

const CARD_TITLE = "Recent Activity";

type ActivityFeedProps = {
  items: ActivityItem[];
};

function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <div className="rounded-xl border border-line-soft bg-card p-5">
      <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-ink-faint">
        {CARD_TITLE}
      </h3>
      <div className="space-y-3">
        {items.map((item) => {
          return (
            <div
              key={item.id}
              className="group flex cursor-pointer items-center gap-3"
            >
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-lg font-display text-lg font-black text-white/20 transition-transform duration-200 group-hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${item.color}aa, ${item.color}33)`,
                }}
              >
                {getInitials(item.title, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm font-semibold text-ink">
                  {item.title}
                </p>
                <p className="text-xs text-ink-faint">
                  {item.ep} · {item.date}
                </p>
              </div>
              <div
                className="flex shrink-0 items-center gap-1"
                aria-label={`Rated ${item.rating} out of 10`}
              >
                <StarRating
                  value={getFilledStars(item.rating)}
                  readOnly
                  size="sm"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { ActivityFeed };
