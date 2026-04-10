import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FactCheck AI — Live Verification Pipeline",
  description: "Verify claims with 4 structured web searches across premier fact-check sites",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body className={`${outfit.className} bg-bg-primary text-text-primary min-h-full flex flex-col relative`}>
        <div className="bg-gradient-mesh" />
        
        {/* Global Navigation */}
        <nav className="sticky top-0 z-50 glass-panel border-b-glass-border">
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-bg-primary border border-neon-cyan/30 flex items-center justify-center text-sm transition-all group-hover:neon-glow-cyan">
                🔍
              </div>
              <span className="text-xl font-bold tracking-tight">
                FactCheck<span className="text-gradient">AI</span>
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-text-secondary hover:text-white transition-colors">
                Login
              </Link>
              <Link href="/signup" className="text-sm font-medium px-4 py-2 rounded-full border border-neon-purple/50 text-white hover:bg-neon-purple/10 hover:neon-glow-purple transition-all">
                Sign Up
              </Link>
            </div>
          </div>
        </nav>

        <main className="flex-1 relative z-10 p-6 md:p-10">
          {children}
        </main>
      </body>
    </html>
  );
}
