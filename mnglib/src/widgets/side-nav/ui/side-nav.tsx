"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOutIcon } from "lucide-react";

import { cn } from "@/shared/lib/cn";
import { APP_NAME } from "@/shared/config/site";
import { NAV_ITEMS, SIGN_OUT_LABEL } from "../model/nav-items";

function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 z-20 flex h-screen w-[68px] shrink-0 flex-col items-center border-r border-line bg-panel py-6">
      <Link
        href="/home"
        aria-label={`${APP_NAME} home`}
        className="mb-7 flex size-10 select-none items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-light font-display text-xs font-black text-white shadow-[0_4px_20px_#7c3aed55]"
      >
        ML
      </Link>

      <nav
        aria-label="Main navigation"
        className="flex w-full flex-1 flex-col gap-0.5 px-2"
      >
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              title={label}
              className={cn(
                "group relative flex h-11 w-full items-center justify-center rounded-xl transition-colors duration-200",
                isActive ? "bg-brand/10" : "hover:bg-white/5"
              )}
            >
              {isActive && (
                <span
                  aria-hidden
                  className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-brand"
                />
              )}
              <Icon
                size={19}
                className={cn(
                  "transition-colors duration-200",
                  isActive
                    ? "text-brand-light"
                    : "text-ink-ghost group-hover:text-white"
                )}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute left-full z-50 ml-3 whitespace-nowrap rounded-lg border border-line-strong bg-card px-2.5 py-1 text-xs font-medium text-ink opacity-0 transition-opacity duration-150 group-hover:opacity-100"
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        aria-label={SIGN_OUT_LABEL}
        title={SIGN_OUT_LABEL}
        className="group flex h-11 w-full items-center justify-center rounded-xl transition-colors duration-200"
      >
        <LogOutIcon
          size={18}
          className="text-ink-ghost transition-colors duration-200 group-hover:text-red-400"
        />
      </button>
    </aside>
  );
}

export { SideNav };
