import { PencilIcon } from "lucide-react";

import type { UserProfileSettings } from "../model/types";

type SettingsListProps = {
  settings: UserProfileSettings;
};

function SettingsList({ settings }: SettingsListProps) {
  const rows = [
    { label: "Display Name", value: settings.displayName },
    { label: "Email", value: settings.email },
    { label: "Language", value: settings.language },
    { label: "Country", value: settings.country },
  ];

  return (
    <div className="space-y-4">
      {rows.map(({ label, value }) => (
        <div
          key={label}
          className="flex items-center justify-between rounded-xl border border-line-soft bg-card p-4"
        >
          <div>
            <p className="mb-0.5 font-display text-xs uppercase tracking-widest text-ink-faint">
              {label}
            </p>
            <p className="text-sm font-medium text-ink">{value}</p>
          </div>
          <button
            type="button"
            aria-label={`Edit ${label}`}
            className="rounded-lg p-2 text-ink-faint transition-colors duration-200 hover:bg-brand-light/10 hover:text-brand-light"
          >
            <PencilIcon size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

export { SettingsList };
