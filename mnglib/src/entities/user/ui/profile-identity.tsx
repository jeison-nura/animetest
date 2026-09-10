import { PencilIcon, SettingsIcon } from "lucide-react";

import type { User } from "../model/types";

type ProfileIdentityProps = {
  profile: User;
};

function ProfileIdentity({ profile }: ProfileIdentityProps) {
  return (
    <div className="mb-6 flex items-end gap-5">
      <div className="relative shrink-0">
        <div className="flex size-24 select-none items-center justify-center rounded-2xl border-[3px] border-night bg-gradient-to-br from-brand to-brand-light font-display text-2xl font-black text-white shadow-[0_8px_32px_#7c3aed55]">
          {profile.initials}
        </div>
        <button
          type="button"
          aria-label="Edit avatar"
          className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border-2 border-night bg-brand transition-all duration-200 hover:scale-110"
        >
          <PencilIcon size={11} className="text-white" />
        </button>
      </div>

      <div className="min-w-0 flex-1 pb-1">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-2xl font-black text-white">
            {profile.username}
          </h1>
          {profile.proBadge && (
            <span className="rounded-full border border-brand/25 bg-brand/15 px-2.5 py-1 text-xs font-semibold text-brand-light">
              PRO
            </span>
          )}
        </div>
        <p className="mt-0.5 text-sm text-ink-faint">
          @{profile.handle}
          {profile.memberSince ? ` · Member since ${profile.memberSince}` : ""}
        </p>
        {profile.bio && (
          <p className="mt-1.5 max-w-lg text-sm text-ink-muted">{profile.bio}</p>
        )}
      </div>

      <button
        type="button"
        className="mt-2 flex shrink-0 items-center gap-2 self-start rounded-xl border border-white/10 bg-white/[0.07] px-5 py-2.5 font-display text-sm font-semibold text-ink transition-colors duration-200 hover:bg-white/10"
      >
        <SettingsIcon size={14} /> Edit Profile
      </button>
    </div>
  );
}

export { ProfileIdentity };
