import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";

export const msSans = localFont({
  src: [
    {
      path: "ms_sans_serif.woff",
      weight: "normal",
      style: "normal",
    },
    {
      path: "MS Sans Serif Bold.ttf",
      weight: "bold",
      style: "normal",
    },
  ],
  variable: "--font-msSans",
});

export const trebuchet = localFont({
  src: [
    {
      path: "trebuc.ttf",
      weight: "bold",
      style: "normal",
    },
  ],
  variable: "--font-trebuchet",
});

export const segoe = localFont({
  src: [
    {
      path: "Segoe UI.ttf",
      weight: "normal",
      style: "normal",
    },
    {
      path: "Segoe UI Bold.ttf",
      weight: "bold",
      style: "normal",
    },
    {
      path: "Segoe UI Italic.ttf",
      weight: "normal",
      style: "italic",
    },
    {
      path: "Segoe UI Bold Italic.ttf",
      weight: "bold",
      style: "italic",
    },
  ],
  variable: "--font-segoe",
});

export const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${trebuchet.className} ${msSans.className}`}>
        {children}
      </body>
    </html>
  );
}
