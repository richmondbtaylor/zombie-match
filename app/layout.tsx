import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import Sponsors from "@/components/Sponsors";
import PretendPicker from "@/components/PretendPicker";

export const metadata: Metadata = {
  title: "Zombie Match",
  description: "A half-built dating app. Bring it back to life.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="zombie-bar">
          🧟 Zombie build: it half works. Read ZOMBIE.md for what to fix.
        </div>
        <nav className="nav">
          <Link href="/" className="brand">Zombie Match</Link>
          <Link href="/">Discover</Link>
          <Link href="/matches">Matches</Link>
          <Link href="/likes">Who liked you</Link>
          <Link href="/profile">My profile</Link>
          <Link href="/pricing">Pricing</Link>
          <PretendPicker />
        </nav>
        <main>{children}</main>
        <Sponsors />
      </body>
    </html>
  );
}
