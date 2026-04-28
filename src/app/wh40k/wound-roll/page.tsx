import type { Metadata } from "next";
import WoundRollClient from "./WoundRollClient";

export const metadata: Metadata = {
  title: "ウーンズロール早見表 | WH40K",
  description:
    "Warhammer 40,000 強度(S)vs耐久力(T)のウーンズロール対応表。試合中にスマホでサッと確認。",
};

export default function WoundRollPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-rose-500">
          Warhammer 40,000
        </span>
        <h1 className="text-3xl font-black uppercase tracking-tight text-(--fg-body)">
          ウーンズロール
        </h1>
        <p className="text-sm text-muted leading-relaxed">
          強度(S)と耐久力(T)から必要な出目を確認できます。行(S)・列(T)をタップして絞り込み。
        </p>
      </header>
      <WoundRollClient />
    </div>
  );
}
