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
    <div className="flex flex-col bg-[#1e1e1e] rounded-r-xl w-20 h-screen items-center justify-between py-6">
      <div className="flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-[#8a55f8] flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-[#1e1e1e]"></div>
        </div>
      </div>
      <div className="flex flex-col gap-6 items-center">
        <CircleButton
          icon={HouseIcon}
          className="text-white hover:bg-[#8a55f8]/20"
        />
        <CircleButton
          icon={SearchIcon}
          className="text-white hover:bg-[#8a55f8]/20"
        />
        <CircleButton
          icon={BookmarkIcon}
          className="text-white hover:bg-[#8a55f8]/20"
        />
        <CircleButton
          icon={CircleUserRoundIcon}
          className="text-white hover:bg-[#8a55f8]/20"
        />
        <CircleButton
          icon={MailIcon}
          className="text-white hover:bg-[#8a55f8]/20"
        />
        <CircleButton
          icon={ShoppingBagIcon}
          className="text-white hover:bg-[#8a55f8]/20"
        />
      </div>
      <div>
        <CircleButton
          icon={LogOutIcon}
          className="text-white hover:bg-[#8a55f8]/20"
        />
      </div>
    </div>
  );
};
