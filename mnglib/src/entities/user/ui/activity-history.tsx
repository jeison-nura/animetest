import { getInitials } from "@/shared/lib/get-initials";
import { StarRating } from "@/shared/ui";

import { getFilledStars } from "../lib/get-filled-stars";
import type { ActivityItem } from "../model/types";

type ActivityHistoryProps = {
  items: ActivityItem[];
};

function ActivityHistory({ items }: ActivityHistoryProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => {
        return (
          <div
            key={item.id}
            className="flex cursor-pointer items-center gap-4 rounded-xl border border-line-soft bg-card p-4 transition-colors duration-200 hover:border-line-strong"
          >
            <div
              className="flex size-12 shrink-0 items-center justify-center rounded-xl font-display text-xl font-black text-white/20"
              style={{
                background: `linear-gradient(135deg, ${item.color}aa, ${item.color}33)`,
              }}
            >
              {getInitials(item.title, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display font-semibold text-ink">{item.title}</p>
              <p className="text-sm text-ink-faint">{item.ep}</p>
            </div>
            <div
              className="flex items-center gap-1"
              aria-label={`Rated ${item.rating} out of 10`}
            >
              <StarRating
                value={getFilledStars(item.rating)}
                readOnly
                size="sm"
              />
            </div>
            <p className="shrink-0 text-xs text-ink-ghost">{item.date}</p>
          </div>
        );
      })}
    </div>
  );
}

export { ActivityHistory };
