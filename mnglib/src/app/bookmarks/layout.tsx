import { NavBar } from "@/components/navbar/navBar";

export default function BookmarksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-black">
      <div>
        <NavBar />
      </div>
      <div className="grow overflow-x-hidden overflow-y-auto">
        {children}
      </div>
    </div>
  );
} 