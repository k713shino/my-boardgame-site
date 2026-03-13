import type { Metadata } from "next";
import { DamageCalcClient } from "./DamageCalcClient";

export const metadata: Metadata = {
  title: "Damage Calculator | WH40K",
  description:
    "WH40K 10th Edition 期待ダメージ計算機。武器スペックとターゲット防御値を入力して期待ダメージを算出。",
};

export default function DamageCalcPage() {
  return <DamageCalcClient />;
}
