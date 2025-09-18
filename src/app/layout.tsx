import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

const themeScript = `(() => {
  const root = document.documentElement;
  const apply = (theme) => {
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  };
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      apply(stored);
      return;
    }
  } catch (_) {
    // ignore read errors
  }
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  apply(prefersDark ? "dark" : "light");
})();`;

export const metadata: Metadata = {
  title: "Boardgame Lab",
  description: "ボードゲームの記録・レビュー・イベント告知",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh bg-slate-50 text-slate-900 transition-colors duration-500 selection:bg-indigo-400/30 selection:text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="flex min-h-dvh flex-col">
          <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-slate-50/70 backdrop-blur supports-[backdrop-filter]:bg-slate-50/50 dark:border-slate-800/60 dark:bg-slate-950/60">
            <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4 md:gap-6">
              <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900 transition hover:text-indigo-600 dark:text-white dark:hover:text-indigo-300">
                Boardgame Lab
              </Link>
              <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                <Link className="relative transition hover:text-indigo-600 dark:hover:text-indigo-300" href="/games">Games</Link>
                <Link className="relative transition hover:text-indigo-600 dark:hover:text-indigo-300" href="/plays">Plays</Link>
                <Link className="relative transition hover:text-indigo-600 dark:hover:text-indigo-300" href="/posts">Blog</Link>
                <Link className="relative transition hover:text-indigo-600 dark:hover:text-indigo-300" href="/events">Events</Link>
              </nav>
              <div className="flex items-center gap-3">
                <ThemeToggle />
              </div>
            </div>
          </header>
          <main className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-12">
            {children}
          </main>
          <footer className="mx-auto w-full max-w-5xl px-6 pb-12 text-sm text-slate-600 dark:text-slate-400">
            © {new Date().getFullYear()} Boardgame Lab
          </footer>
        </div>
      </body>
    </html>
  );
}
