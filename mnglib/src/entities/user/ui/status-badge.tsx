import { cn } from "@/shared/lib/cn";

import type { ListStatus } from "../model/types";

const STATUS_CONFIG: Record<ListStatus, { label: string; className: string }> =
  {
    completed: { label: "Completed", className: "bg-emerald-600 text-white" },
    inProgress: { label: "In Progress", className: "bg-blue-600 text-white" },
  };

type StatusBadgeProps = {
  status: ListStatus;
  className?: string;
};

function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        "rounded px-1.5 py-0.5 text-[10px] font-bold",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

export { StatusBadge };