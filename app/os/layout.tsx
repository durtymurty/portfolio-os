import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./os.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Portfolio OS",
  description: "The desktop-OS version of my portfolio — draggable windows, a terminal, and a few games.",
};

export default function OSLayout({ children }: { children: React.ReactNode }) {
  return <div className={`os-root ${inter.variable}`}>{children}</div>;
}
