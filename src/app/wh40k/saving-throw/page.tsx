import type { Metadata } from "next";
import SavingThrowClient from "./SavingThrowClient";

export const metadata: Metadata = {
  title: "セービング早見表 | WH40K",
  description:
    "Warhammer 40,000 基本セーヴ値(Sv)とAP値から実質セーヴ値を確認。試合中にスマホでサッと参照。",
};

export default function SavingThrowPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-rose-500">
          Warhammer 40,000
        </span>
        <h1 className="text-3xl font-black uppercase tracking-tight text-(--fg-body)">
          セービング
        </h1>
        <p className="text-sm text-muted leading-relaxed">
          基本セーヴ値(Sv)とAP値から実質セーヴ値を確認できます。行(Sv)・列(AP)をタップして絞り込み。
        </p>
      </header>
      <SavingThrowClient />
    </div>
  );
}
