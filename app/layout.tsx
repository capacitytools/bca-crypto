import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BUNMI Crypto Analysis",
  description: "Analyze Smarter. Trade Better.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}
