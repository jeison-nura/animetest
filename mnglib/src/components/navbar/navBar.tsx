import {
  BookmarkIcon,
  CircleUserRoundIcon,
  HouseIcon,
  LogOutIcon,
  MailIcon,
  SearchIcon,
  ShoppingBagIcon,
} from "lucide-react";
import { CircleButton } from "../ui/circleButton";

export const NavBar = () => {
  return (
    <div className="flex flex-col gap-10 bg-black rounded-xl w-32 h-screen items-center justify-center">
      <div className="flex flex-col gap-10  items-center">
        <CircleButton icon={HouseIcon} />
        <CircleButton icon={SearchIcon} />
        <CircleButton icon={BookmarkIcon} />
        <CircleButton icon={CircleUserRoundIcon} />
        <CircleButton icon={MailIcon} />
        <CircleButton icon={ShoppingBagIcon} />
      </div>
      <div className="rounded-full justify-end flex absolute bottom-4">
        <CircleButton icon={LogOutIcon} className="w-16 h-16" />
      </div>
    </div>
  );
};
