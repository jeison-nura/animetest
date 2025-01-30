import { Button } from "./button";

export const CircleButton = ({ icon: Icon, className = "" }) => {
  return (
    <Button
      className={`rounded-full w-12 h-12 p-0 flex items-center justify-center ${className}`}
    >
      <Icon style={{ width: "1.5rem", height: "1.5rem" }} />
    </Button>
  );
};
