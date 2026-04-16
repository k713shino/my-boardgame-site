import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "WH40K | Warhammer 40,000",
  description:
    "Warhammer 40,000 ツールハブ。期待ダメージ計算・塗料変換。",
};

const NEWS = [
  {
    date: "2026-04-16",
    title: "ロスタービルダー・保存ロスター機能を終了しました",
    body: "著作権および海賊版に関する懸念から、Army Builder（ロスタービルダー）および Rosters（保存ロスター）機能を削除しました。ご利用いただいていた方にはご不便をおかけし申し訳ありません。引き続き Damage Calculator・Paint Conversion はご利用いただけます。",
  },
];

const TOOLS = [
  {
    href: "/wh40k/damage-calc",
    label: "Damage Calculator",
    labelJa: "期待ダメージ計算機",
    desc: "武器スペックと防御値を入力して期待ダメージを計算する。",
    icon: "🎲",
  },
  {
    href: "/wh40k/paint-conv",
    label: "Paint Conversion",
    labelJa: "塗料変換ツール",
    desc: "Citadel → Vallejo / ガンダムアッセンブルカラー 対応表。あくまで主観なので参考程度に。",
    icon: "🎨",
  },
];

export default function WH40KHubPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-12">
      <div className="space-y-3">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-rose-500">
          Warhammer 40,000
        </span>
        <h1 className="text-3xl font-black uppercase tracking-tight sm:text-4xl">
          WH40K Hub
        </h1>
        <p className="text-sm text-muted leading-relaxed">
          Warhammer 40,000 のプレイをサポートするツール集です。
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {TOOLS.map(({ href, label, labelJa, desc, icon }) => (
          <Link
            key={href}
            href={href}
            className="group surface-card flex flex-col gap-2 rounded-2xl border border-transparent p-5 transition hover:-translate-y-0.5 hover:border-slate-300/60 dark:hover:border-slate-600/60"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{icon}</span>
              <span className="text-sm font-bold text-(--fg-body)">
                {label}
              </span>
            </div>
            <p className="text-[0.65rem] font-medium text-muted">{labelJa}</p>
            <p className="text-xs text-muted leading-relaxed">{desc}</p>
          </Link>
        ))}
      </div>

      <section className="space-y-3">
        <h2 className="text-[0.65rem] font-bold uppercase tracking-widest text-muted">
          News
        </h2>
        <div className="space-y-2">
          {NEWS.map((item, i) => (
            <div key={i} className="surface-card rounded-2xl px-5 py-4 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <time className="text-[0.62rem] font-semibold tabular-nums text-rose-500">
                  {item.date}
                </time>
                <p className="text-xs font-bold">{item.title}</p>
              </div>
              <p className="text-[0.68rem] text-muted leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
