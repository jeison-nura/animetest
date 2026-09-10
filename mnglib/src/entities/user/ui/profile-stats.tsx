import {
  BookOpenIcon,
  FilmIcon,
  TrendingUpIcon,
  TrophyIcon,
  type LucideIcon,
} from "lucide-react";

import type { ProfileStat } from "../model/types";

const STAT_ICONS: Record<ProfileStat["icon"], LucideIcon> = {
  film: FilmIcon,
  trophy: TrophyIcon,
  bookOpen: BookOpenIcon,
  trendingUp: TrendingUpIcon,
};

type ProfileStatsProps = {
  stats: ProfileStat[];
};

function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map(({ label, value, icon }) => {
        const Icon = STAT_ICONS[icon];
        return (
          <div
            key={label}
            className="flex items-center gap-3 rounded-xl border border-line-soft bg-card p-4 transition-all duration-200"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-line-strong">
              <Icon size={16} className="text-brand-light" />
            </div>
            <div>
              <p className="font-display text-lg font-black leading-none text-white">
                {value}
              </p>
              <p className="mt-0.5 text-xs text-ink-faint">{label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { ProfileStats };
