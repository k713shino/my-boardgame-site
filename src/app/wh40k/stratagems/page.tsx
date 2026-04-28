import type { Metadata } from "next";
import StratagemClient from "./StratagemClient";

export const metadata: Metadata = {
  title: "CP早見表 | WH40K",
  description:
    "Warhammer 40,000 コアストラテジェーム早見表。フェーズ別フィルタで試合中にすぐ確認。",
};

export default function StratagemPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-rose-500">
          Warhammer 40,000
        </span>
        <h1 className="text-3xl font-black uppercase tracking-tight text-(--fg-body)">
          CP 早見表
        </h1>
        <p className="text-sm text-muted leading-relaxed">
          コアストラテジェームのフェーズ別早見表。現在のフェーズを選ぶと使えるものだけ絞り込めます。
        </p>
      </header>
      <StratagemClient />
    </div>
  );
}
