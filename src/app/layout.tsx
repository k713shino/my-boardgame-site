import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SiteHeader } from "@/components/SiteHeader";

const themeScript = [
  "(() => {",
  "  const root = document.documentElement;",
  "  const apply = (theme) => {",
  "    root.classList.remove(\"light\", \"dark\");",
  "    root.classList.add(theme);",
  "    root.dataset.theme = theme;",
  "    try {",
  "      localStorage.setItem(\"theme\", theme);",
  "    } catch (_) {}",
  "  };",
  "  const params = new URLSearchParams(window.location.search);",
  "  const paramTheme = params.get(\"theme\");",
  "  if (paramTheme === \"light\" || paramTheme === \"dark\") {",
  "    apply(paramTheme);",
  "    return;",
  "  }",
  "  try {",
  "    const stored = localStorage.getItem(\"theme\");",
  "    if (stored === \"light\" || stored === \"dark\") {",
  "      apply(stored);",
  "      return;",
  "    }",
  "  } catch (_) {",
  "    // ignore read errors",
  "  }",
  "  apply(\"light\");",
  "})();",
].join("\n");

export const metadata: Metadata = {
  title: "Boardgame Lab",
  description: "ボードゲームの記録・レビュー・イベント告知",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="icon" href="/images/icon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-dvh transition-colors duration-500">
        <div className="flex min-h-dvh flex-col items-center gap-10 px-4 py-8 sm:gap-12 sm:px-6 sm:py-12">
          <SiteHeader />
          <main className="w-full max-w-4xl">
            {children}
          </main>
          <footer className="w-full max-w-4xl text-center text-xs uppercase tracking-[0.2em] text-muted sm:tracking-[0.35em]">
            © {new Date().getFullYear()} Boardgame Lab
          </footer>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
