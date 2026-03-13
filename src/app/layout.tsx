import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SiteHeader } from "@/components/SiteHeader";
import Script from "next/script"

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

const BASE_URL = "https://my-boardgame-site.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Dice Journal | 霧島市発のボードゲーム情報メディア",
    template: "%s | Dice Journal",
  },
  description:
    "鹿児島県霧島市を拠点にしたボードゲームカルチャーメディア。ゲームレビュー・プレイログ・地域イベント情報を発信しています。",
  keywords: ["ボードゲーム", "霧島市", "鹿児島", "ボドゲ", "エイトマーリン", "ボードゲーム会"],
  openGraph: {
    title: "Dice Journal | 霧島市発のボードゲーム情報メディア",
    description:
      "鹿児島県霧島市を拠点にしたボードゲームカルチャーメディア。ゲームレビュー・プレイログ・地域イベント情報を発信しています。",
    url: BASE_URL,
    siteName: "Dice Journal",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "/images/ogp.png",
        width: 1424,
        height: 752,
        alt: "Dice Journal | 霧島市発のボードゲーム情報メディア",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dice Journal | 霧島市発のボードゲーム情報メディア",
    description: "鹿児島県霧島市のボードゲーム情報メディア",
    images: ["/images/ogp.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="icon" href="/images/icon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-dvh transition-colors duration-500">
        {children}

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Z95NS11GHT"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-Z95NS11GHT');
          `}
        </Script>
        <div className="flex min-h-dvh flex-col items-center gap-10 px-4 py-8 sm:gap-12 sm:px-6 sm:py-12">
          <SiteHeader />
          <main className="w-full max-w-4xl">
            {children}
          </main>
          <footer className="w-full max-w-4xl space-y-4 text-center text-xs text-muted">
            <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
              <p className="mb-2 uppercase tracking-[0.2em] sm:tracking-[0.35em]">関連サービス</p>
              <a
                href="https://paintingdayfinder.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-[0.7rem] font-medium tracking-wide transition-colors hover:border-slate-400 hover:text-slate-700 dark:border-slate-600 dark:hover:border-slate-400 dark:hover:text-slate-300"
              >
                🎨 塗装日和 — 模型塗装の最適日チェッカー
              </a>
            </div>
            <p className="uppercase tracking-[0.2em] sm:tracking-[0.35em]">
              © {new Date().getFullYear()} Dice Journal
            </p>
          </footer>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
