import type { Metadata } from "next";

import { MyListPageView } from "./my-list-view";

export const metadata: Metadata = {
  title: "My List",
};

export default function MyListPage() {
  return <MyListPageView />;
}
