import { NavBar } from "@/components/navbar/navBar";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen bg-[#8a55f8]">
          <div>
            <NavBar />
          </div>
          <div className="grow overflow-x-hidden overflow-y-auto scrollbar-hide">
            {children}
          </div>
          <div className="w-72 bg-[#1e1e1e] rounded-l-xl overflow-y-auto scrollbar-hide">
            {/* Panel lateral derecho para "continue watching" */}
          </div>
        </div>
      </body>
    </html>
  );
}
