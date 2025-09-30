import "./globals.css";
import type { Metadata } from "next";
import { BookmarkProvider } from "@/contexts/BookmarkContext";

export const metadata: Metadata = {
  title: "Anime Library - Provider Dashboard",
  description: "Provider dashboard for anime and manga content management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Pacifica:wght@400&display=swap" rel="stylesheet" />
      </head>
      <body>
        <BookmarkProvider>
          {children}
        </BookmarkProvider>
      </body>
    </html>
  );
}
