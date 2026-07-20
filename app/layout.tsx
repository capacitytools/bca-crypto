import type { Metadata } from "next";
import "./globals.css";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "BUNMI Crypto Analysis",
  description: "Analyze Smarter. Trade Better.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-bca-bg text-white antialiased">
        <AppHeader />
        <main className="pt-16 pb-24 min-h-screen px-4">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
