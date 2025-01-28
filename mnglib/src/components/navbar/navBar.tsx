import {
  BookmarkIcon,
  CircleUserRoundIcon,
  HouseIcon,
  LogOutIcon,
  MailIcon,
  SearchIcon,
  ShoppingBagIcon,
} from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

export const NavBar = () => {
  return (
    <div className="flex flex-col gap-10 bg-black rounded-xl w-1/6 h-screen items-center justify-center">
      <div className="flex flex-col gap-10  items-center">
        <Button className="rounded-full w-full">
          <HouseIcon style={{ width: "1.5rem", height: "1.5rem" }} />
        </Button>
        <Button className="rounded-full">
          <SearchIcon style={{ width: "1.5rem", height: "1.5rem" }} />
        </Button>
        <Button className="rounded-full">
          <BookmarkIcon style={{ width: "1.5rem", height: "1.5rem" }} />
        </Button>
        <Button className="rounded-full">
          <CircleUserRoundIcon style={{ width: "1.5rem", height: "1.5rem" }} />
        </Button>
        <Button className="rounded-full">
          <MailIcon style={{ width: "1.5rem", height: "1.5rem" }} />
        </Button>
        <Button className="rounded-full">
          <ShoppingBagIcon style={{ width: "1.5rem", height: "1.5rem" }} />
        </Button>
      </div>
      <div className="rounded-full justify-end flex absolute bottom-4">
        <Button>
          <LogOutIcon style={{ width: "1.5rem", height: "1.5rem" }} />
        </Button>
      </div>
    </div>
  );
};
