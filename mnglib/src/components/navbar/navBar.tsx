"use client";

import {
  BookmarkIcon,
  CircleUserRoundIcon,
  HouseIcon,
  LogOutIcon,
  MailIcon,
  SearchIcon,
  ShoppingBagIcon,
  BarChart3,
  Newspaper,
} from "lucide-react";
import { CircleButton } from "../ui/circleButton";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Actualizar pestaña activa basada en la ruta actual
  useEffect(() => {
    if (pathname === "/home") setActiveTab("home");
    else if (pathname === "/search") setActiveTab("search");
    else if (pathname === "/bookmarks") setActiveTab("bookmarks");
    else if (pathname === "/profile") setActiveTab("profile");
    else if (pathname === "/notifications") setActiveTab("notifications");
    else if (pathname === "/news") setActiveTab("news");
    else if (pathname === "/store") setActiveTab("store");
    else if (pathname === "/dashboard") setActiveTab("dashboard");
    else setActiveTab("dashboard"); // Por defecto al dashboard
  }, [pathname]);

  const handleNavigation = (route: string) => {
    setActiveTab(route);
    router.push(route);
  };

  const handleLogout = () => {
    // Aquí puedes agregar lógica de cierre de sesión
    router.push("/login");
  };

  return (
    <div className="flex flex-col gap-10 bg-black rounded-xl w-32 h-screen items-center justify-center">
      <div className="flex flex-col gap-10 items-center">
        <CircleButton 
          icon={HouseIcon} 
          onClick={() => handleNavigation("/home")}
          isActive={activeTab === "home"}
          tooltip="Home"
        />
        <CircleButton 
          icon={BarChart3} 
          onClick={() => handleNavigation("/dashboard")}
          isActive={activeTab === "dashboard"}
          tooltip="Dashboard"
        />
        <CircleButton 
          icon={SearchIcon} 
          onClick={() => handleNavigation("/search")}
          isActive={activeTab === "search"}
          tooltip="Search"
        />
        <CircleButton 
          icon={BookmarkIcon} 
          onClick={() => handleNavigation("/bookmarks")}
          isActive={activeTab === "bookmarks"}
          tooltip="Bookmarks"
        />
        <CircleButton 
          icon={CircleUserRoundIcon} 
          onClick={() => handleNavigation("/profile")}
          isActive={activeTab === "profile"}
          tooltip="Profile"
        />
        <CircleButton 
          icon={MailIcon} 
          onClick={() => handleNavigation("/notifications")}
          isActive={activeTab === "notifications"}
          tooltip="Notifications"
        />
        <CircleButton 
          icon={Newspaper} 
          onClick={() => handleNavigation("/news")}
          isActive={activeTab === "news"}
          tooltip="News"
        />
        <CircleButton 
          icon={ShoppingBagIcon} 
          onClick={() => handleNavigation("/store")}
          isActive={activeTab === "store"}
          tooltip="Store"
        />
      </div>
      <div className="rounded-full justify-end flex absolute bottom-4">
        <CircleButton 
          icon={LogOutIcon} 
          className="w-16 h-16" 
          onClick={handleLogout}
          tooltip="Logout"
        />
      </div>
    </div>
  );
};
