import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Analytics } from '@vercel/analytics/next';

const themeScript = `(() => {
  const root = document.documentElement;
  const apply = (theme) => {
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.dataset.theme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch (_) {}
  };
  const params = new URLSearchParams(window.location.search);
  const paramTheme = params.get("theme");
  if (paramTheme === "light" || paramTheme === "dark") {
    apply(paramTheme);
    return;
  }
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      apply(stored);
      return;
    }
  } catch (_) {
    // ignore read errors
  }
  apply("light");
})();`;

export const metadata: Metadata = {
  title: "Boardgame Lab",
  description: "ボードゲームの記録・レビュー・イベント告知",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="icon" href="/images/icon.svg" type="image/svg+xml"></link>
      </head>
      <body className="min-h-dvh transition-colors duration-500">
        <div className="flex min-h-dvh flex-col items-center justify-center gap-12 px-6 py-12">
          <header className="surface-card w-full max-w-4xl rounded-[24px] px-6 py-6 text-center">
            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold uppercase tracking-[0.32em] text-muted">
                <Link className="nav-link" href="/games">Games</Link>
                <Link className="nav-link" href="/plays">Plays</Link>
                <Link className="nav-link" href="/posts">Blog</Link>
                <Link className="nav-link" href="/events">Events</Link>
              </div>
              <ThemeToggle />
            </div>
            <Link href="/" className="brand-link mt-6 flex flex-col items-center gap-2 text-2xl font-black uppercase tracking-[0.2em]">
              <span className="brand-subtitle text-[0.65rem] font-semibold uppercase tracking-[0.4em]">Boardgame culture journal</span>
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
          <footer className="w-full max-w-4xl text-center text-xs uppercase tracking-[0.35em] text-muted">
            © {new Date().getFullYear()} Boardgame Lab
          </footer>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
