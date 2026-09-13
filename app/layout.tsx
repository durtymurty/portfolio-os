import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { PROFILE } from "./data";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

const description = `${PROFILE.name} — ${PROFILE.title}. Robotics, software, and hardware projects.`;

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-os-one-chi.vercel.app"),
  title: `${PROFILE.name} — Portfolio`,
  description,
  openGraph: {
    title: `${PROFILE.name} — Portfolio`,
    description,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#07080f",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
