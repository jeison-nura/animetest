import { Button } from "./button";
import { CircleButtonProps } from "@/lib/types/ui";

export const CircleButton = ({
  icon: Icon,
  className = "",
  onClick,
}: CircleButtonProps) => {
  return (
    <Button
      variant="ghost"
      className={`rounded-full w-10 h-10 p-0 flex items-center justify-center bg-transparent ${className}`}
      onClick={onClick}
    >
      <Icon style={{ width: "1.5rem", height: "1.5rem" }} />
    </Button>
  );
};
