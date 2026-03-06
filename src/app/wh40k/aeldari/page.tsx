// src/app/wh40k/aeldari/page.tsx

import type { Metadata } from "next";
import { AeldariReference } from "./AeldariReference";
import { AELDARI_UNITS } from "./data";

export const metadata: Metadata = {
  title: "アエルダリ ユニットリファレンス | WH40K",
  description:
    "Warhammer 40,000 10th Edition アエルダリ（クラフトワールド）の全ユニットデータシート日本語リファレンス。ステータス・武器・アビリティ一覧。BSDataデータ使用。",
};

export default function AeldariPage() {
  return <AeldariReference units={AELDARI_UNITS} />;
}
