import {
  AwardIcon,
  CalendarIcon,
  TrendingUpIcon,
  TrophyIcon,
  type LucideIcon,
} from "lucide-react";

import type { Achievement } from "../model/types";

const ACHIEVEMENT_ICONS: Record<Achievement["icon"], LucideIcon> = {
  trophy: TrophyIcon,
  award: AwardIcon,
  calendar: CalendarIcon,
  trendingUp: TrendingUpIcon,
};

const CARD_TITLE = "Achievements";

type AchievementsCardProps = {
  achievements: Achievement[];
};

function AchievementsCard({ achievements }: AchievementsCardProps) {
  return (
    <div className="rounded-xl border border-line-soft bg-card p-5">
      <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-ink-faint">
        {CARD_TITLE}
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {achievements.map(({ label, desc, icon, color }) => {
          const Icon = ACHIEVEMENT_ICONS[icon];
          return (
            <div
              key={label}
              className="flex cursor-default flex-col items-center gap-2 rounded-xl p-3 text-center transition-all duration-200 hover:scale-105"
              style={{
                background: `${color}0f`,
                border: `1px solid ${color}22`,
              }}
            >
              <div
                className="flex size-10 items-center justify-center rounded-full"
                style={{ background: `${color}22` }}
              >
                <Icon size={18} style={{ color }} />
              </div>
              <div>
                <p className="font-display text-xs font-bold text-ink">
                  {label}
                </p>
                <p className="mt-0.5 text-[10px] text-ink-faint">{desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { AchievementsCard };
