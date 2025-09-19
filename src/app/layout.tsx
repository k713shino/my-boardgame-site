import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
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
        <link rel="icon" href="/images/icon.svg" type="image/svg+xml"></link>
      </head>
      <body className="min-h-dvh bg-slate-100 text-slate-900 transition-colors duration-500 selection:bg-rose-400/30 selection:text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="flex min-h-dvh flex-col items-center justify-center gap-12 px-6 py-12">
          <header className="w-full max-w-4xl rounded-[24px] border border-slate-200/70 bg-white px-6 py-6 text-center shadow-[0_30px_80px_-60px_rgba(148,163,184,0.8)] dark:border-slate-800/60 dark:bg-slate-900/70">
            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold uppercase tracking-[0.32em] text-slate-500 dark:text-slate-300">
                <Link className="transition hover:text-rose-500 dark:hover:text-rose-300" href="/games">Games</Link>
                <Link className="transition hover:text-rose-500 dark:hover:text-rose-300" href="/plays">Plays</Link>
                <Link className="transition hover:text-rose-500 dark:hover:text-rose-300" href="/posts">Blog</Link>
                <Link className="transition hover:text-rose-500 dark:hover:text-rose-300" href="/events">Events</Link>
              </div>
              <ThemeToggle />
            </div>
            <Link href="/" className="mt-6 flex flex-col items-center gap-2 text-2xl font-black uppercase tracking-[0.2em] text-slate-900 transition hover:text-rose-500 dark:text-white dark:hover:text-rose-300">
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">Boardgame culture journal</span>
              <span className="flex items-center gap-4">
                <Image
                  src="/images/icon.svg"
                  alt=""
                  width={48}
                  height={48}
                  className="h-10 w-10 text-rose-500"
                  aria-hidden
                  priority
                />
                <span>Boardgame Lab</span>
                <Image
                  src="/images/icon.svg"
                  alt=""
                  width={48}
                  height={48}
                  className="h-10 w-10 text-rose-500"
                  aria-hidden
                  priority
                />
              </span>
            </Link>
          </header>
          <main className="w-full max-w-4xl">
            {children}
          </main>
          <footer className="w-full max-w-4xl text-center text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} Boardgame Lab
          </footer>
        </div>
      </body>
    </html>
  );
}
