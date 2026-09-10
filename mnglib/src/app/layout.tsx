import type { Metadata, Viewport } from "next";
import { Exo_2, Outfit } from "next/font/google";

import { APP_DESCRIPTION, APP_NAME } from "@/shared/config/site";

import "./globals.css";

const fontDisplay = Exo_2({
  subsets: ["latin"],
  variable: "--font-exo-2",
  display: "swap",
});

const fontSans = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
};

export const viewport: Viewport = {
  themeColor: "#08080f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontDisplay.variable} ${fontSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
