import type { Metadata } from "next";
import { PaintConvClient } from "./PaintConvClient";

export const metadata: Metadata = {
  title: "Paint Conversion | WH40K",
  description:
    "Citadel カラーを Vallejo / ガンダムアッセンブルカラーに変換。塗料名で検索対応。",
};

export default function PaintConvPage() {
  return <PaintConvClient />;
}
