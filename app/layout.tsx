import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Murtaza Bootwala — Portfolio",
  description: "Computer Engineering @ Cal Poly '29",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}