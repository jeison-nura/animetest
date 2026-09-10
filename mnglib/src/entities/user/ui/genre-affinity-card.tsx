import type { GenreAffinity } from "../model/types";

const CARD_TITLE = "Genre Affinity";

type GenreAffinityCardProps = {
  affinities: GenreAffinity[];
};

function GenreAffinityCard({ affinities }: GenreAffinityCardProps) {
  return (
    <div className="rounded-xl border border-line-soft bg-card p-5">
      <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-ink-faint">
        {CARD_TITLE}
      </h3>
      <div className="space-y-3">
        {affinities.map(({ genre, pct, color }) => (
          <div key={genre}>
            <div className="mb-1 flex justify-between">
              <span className="text-sm font-medium text-ink-bright">
                {genre}
              </span>
              <span className="text-xs font-bold" style={{ color }}>
                {pct}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-line-soft">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${color}, ${color}88)`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { GenreAffinityCard };
