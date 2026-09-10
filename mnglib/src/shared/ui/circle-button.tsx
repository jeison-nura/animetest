import type { ComponentProps } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";

type CircleButtonProps = ComponentProps<typeof Button> & {
  icon: LucideIcon;
  label: string;
};

function CircleButton({
  icon: Icon,
  label,
  type = "button",
  className,
  ...props
}: CircleButtonProps) {
  return (
    <Button
      data-slot="circle-button"
      type={type}
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      className={cn("rounded-full bg-transparent", className)}
      {...props}
    >
      <Icon className="size-6" />
    </Button>
  );
}

export { CircleButton, type CircleButtonProps };
