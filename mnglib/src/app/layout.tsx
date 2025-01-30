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
        <div className="flex h-screen bg-black">
          <div>
            <NavBar />
          </div>
          <div className="grow overflow-x-hidden overflow-y-auto">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
