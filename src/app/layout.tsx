import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Boardgame Lab",
  description: "ボードゲームの記録・レビュー・イベント告知",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-dvh bg-white text-gray-900">
        <header className="sticky top-0 border-b bg-white/80 backdrop-blur z-50">
          <div className="mx-auto max-w-4xl px-4 py-3 flex gap-4">
            <Link href="/" className="font-bold">Boardgame Lab</Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/games">Games</Link>
              <Link href="/plays">Plays</Link>
              <Link href="/posts">Blog</Link>
              <Link href="/events">Events</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-4 py-8">
          {children}
        </main>
        <footer className="mx-auto max-w-4xl px-4 py-8 text-sm text-gray-500">
          © {new Date().getFullYear()} Boardgame Lab
        </footer>
      </body>
    </html>
  );
}
