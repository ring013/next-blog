// src/app/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next Blog",
  description: "Next.js + Markdown の学習用ブログ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-zinc-950 text-zinc-50">
        {/* Header */}
        <header className="border-b border-zinc-800">
          <div className="max-w-[960px] mx-auto p-4 flex items-center justify-between">
            <Link href="/" className="text-lg font-extrabold tracking-wide hover:opacity-90">
              Next Blog
            </Link>
            <nav className="flex items-center gap-5 text-sm">
              <Link href="/" className="hover:opacity-80">Home</Link>
              <Link href="/blog" className="hover:opacity-80">Blog</Link>
              <Link href="/about" className="hover:opacity-80">About</Link>
            </nav>
          </div>
        </header>

        {/* Main */}
        <main className="pb-10">{children}</main>

        {/* Footer */}
        <footer className="border-t border-zinc-800">
          <div className="max-w-[960px] mx-auto p-4 text-xs text-zinc-400">
            © {new Date().getFullYear()} ギラ Blog
          </div>
        </footer>
      </body>
    </html>
  );
}
