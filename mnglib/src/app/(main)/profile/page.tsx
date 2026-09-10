import type { Metadata } from "next";

import { ProfilePageView } from "./profile-view";

export const metadata: Metadata = {
  title: "Profile",
};

export default function ProfilePage() {
  return <ProfilePageView />;
}
