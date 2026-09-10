import {
  BellIcon,
  BookmarkCheckIcon,
  HeartIcon,
  HouseIcon,
  SearchIcon,
  UserIcon,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  icon: LucideIcon;
  label: string;
  href: string;
};

export const NAV_ITEMS: NavItem[] = [
  { icon: HouseIcon, label: "Home", href: "/home" },
  { icon: SearchIcon, label: "Search", href: "/search" },
  { icon: BookmarkCheckIcon, label: "My List", href: "/my-list" },
  { icon: UserIcon, label: "Profile", href: "/profile" },
  { icon: BellIcon, label: "Notifications", href: "/notifications" },
  { icon: HeartIcon, label: "Favourites", href: "/favourites" },
];

export const SIGN_OUT_LABEL = "Sign Out";
