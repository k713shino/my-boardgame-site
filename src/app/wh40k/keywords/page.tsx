import type { Metadata } from "next";
import KeywordClient from "./KeywordClient";

export const metadata: Metadata = {
  title: "キーワード辞典 | WH40K",
  description:
    "Warhammer 40,000 武器アビリティ・ユニットアビリティのキーワード一覧。日本語名・詳細ルールを検索・絞り込みで確認。",
};

export default function KeywordsPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-rose-500">
          Warhammer 40,000
        </span>
        <h1 className="text-3xl font-black uppercase tracking-tight text-(--fg-body)">
          キーワード辞典
        </h1>
        <p className="text-sm text-muted leading-relaxed">
          武器アビリティ・ユニットアビリティのキーワードを日本語で確認できます。
          カテゴリ絞り込みや検索でサッと参照。
        </p>
      </header>

      <KeywordClient />
    </div>
  );
}
