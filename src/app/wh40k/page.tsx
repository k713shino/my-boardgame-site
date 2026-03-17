import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "WH40K | Warhammer 40,000",
  description:
    "Warhammer 40,000 情報ハブ。Aeldari ロスタービルダー、ユニットリファレンス、初心者ガイド。",
};

const LINKS = [
  {
    href: "/wh40k/builder",
    label: "Army Builder",
    labelJa: "ロスタービルダー",
    desc: "全陣営対応 編成ツール。ポイント計算・保存・共有対応。",
    icon: "⚔️",
    highlight: true,
  },
  {
    href: "/wh40k/rosters",
    label: "Rosters",
    labelJa: "保存ロスター",
    desc: "保存したロスター一覧を確認・管理する。",
    icon: "📋",
    highlight: false,
  },
  {
    href: "/wh40k/damage-calc",
    label: "Damage Calculator",
    labelJa: "期待ダメージ計算機",
    desc: "武器スペックと防御値を入力して期待ダメージを計算する。",
    icon: "🎲",
    highlight: false,
  },
  {
    href: "/wh40k/paint-conv",
    label: "Paint Conversion",
    labelJa: "塗料変換ツール",
    desc: "Citadel → Vallejo / ガンダムアッセンブルカラー 対応表。あくまで主観なので参考程度に。",
    icon: "🎨",
    highlight: false,
  },
];

export default function WH40KHubPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-12">
      {/* Hero */}
      <div className="space-y-3">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-rose-500">
          Warhammer 40,000
        </span>
        <h1 className="text-3xl font-black uppercase tracking-tight sm:text-4xl">
          WH40K Hub
        </h1>
        <p className="text-sm text-muted leading-relaxed">
          10th Edition 対応。ロスター作成・塗料変換・初心者ガイドを提供する WH40K 情報ハブです。<br />
          ロスタービルダーのポイントデータなどは GW 公式ルールを参考にしていますが、誤りがある可能性もあるため、<br />
          必ず公式ルールブックで確認してください。
        </p>
      </div>

      {/* Nav cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {LINKS.map(({ href, label, labelJa, desc, icon, highlight }) => (
          <Link
            key={href}
            href={href}
            className={`group flex flex-col gap-2 rounded-2xl border p-5 transition hover:-translate-y-0.5 ${
              highlight
                ? "border-rose-400/40 bg-rose-500/5 hover:border-rose-400/70"
                : "surface-card border-transparent hover:border-slate-300/60 dark:hover:border-slate-600/60"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{icon}</span>
              <span
                className={`text-sm font-bold ${
                  highlight ? "text-rose-500" : "text-[color:var(--fg-body)]"
                }`}
              >
                {label}
              </span>
            </div>
            <p className="text-[0.65rem] font-medium text-muted">{labelJa}</p>
            <p className="text-xs text-muted leading-relaxed">{desc}</p>
          </Link>
        ))}
      </div>

      {/* Note */}
      <p className="rounded-xl border border-amber-300/40 bg-amber-50/50 px-4 py-3 text-[0.65rem] leading-relaxed text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/5 dark:text-amber-400">
        ⚠️ 大会使用前は必ず GW 公式{" "}
        <strong>Munitorum Field Manual</strong> で確認してください。
      </p>
    </div>
  );
}
