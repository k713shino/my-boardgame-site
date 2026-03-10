/**
 * prisma/seed-translate-descriptions.ts
 *
 * Google Translate 非公式エンドポイントを使ってアビリティ説明文を日本語翻訳し DB に格納する。
 * API キー不要・無料。
 *
 * 実行:
 *   node_modules/.bin/tsx prisma/seed-translate-descriptions.ts
 *
 * オプション:
 *   --dry-run   DB に書き込まず翻訳結果をコンソール出力のみ
 *   --limit N   最初の N件だけ処理（テスト用）
 *   --reset     既存の descriptionJa をクリアして再翻訳
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DRY_RUN = process.argv.includes("--dry-run");
const RESET   = process.argv.includes("--reset");
const limitArg = process.argv.indexOf("--limit");
const LIMIT    = limitArg !== -1 ? parseInt(process.argv[limitArg + 1], 10) : Infinity;

// リクエスト間の待機時間（レートリミット対策）
const DELAY_MS = 300;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── WH40K 専門用語の後処理辞書 ─────────────────────────────────────────────
// Google翻訳が誤訳・不自然になりやすいゲーム用語を修正する
const TERMINOLOGY_FIXES: [RegExp, string][] = [
  // フェイズ・ターン
  [/戦闘フェイズ/g,     "戦闘フェイズ"],
  [/射撃フェーズ/g,     "射撃フェイズ"],
  [/突撃フェーズ/g,     "突撃フェイズ"],
  [/移動フェーズ/g,     "移動フェイズ"],
  [/コマンドフェーズ/g, "コマンドフェイズ"],
  [/モラルフェーズ/g,   "モラルフェイズ"],
  // アクション
  [/通常移動/g,   "通常移動"],
  [/アドバンス/g, "アドバンス移動"],
  [/撤退/g,       "撤退"],
  // ダイス・ロール
  [/傷ロール/g,   "ウーンドロール"],
  [/ヒットロール/g, "ヒットロール"],
  [/セービングスロー/g, "セービングスロー"],
  // ユニット状態
  [/射撃可能な状態/g, "射撃可能"],
  [/「リード」/g,   "リーダー"],
  // 数値表記
  [/(\d+)インチ/g,  "$1インチ"],
  // 記号・書式
  [/■\s+/g, "■ "],
];

function applyTerminologyFixes(text: string): string {
  let result = text;
  for (const [pattern, replacement] of TERMINOLOGY_FIXES) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

// ─── Google Translate 非公式 API ──────────────────────────────────────────────

async function translateText(text: string): Promise<string> {
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ja&dt=t&q=" +
    encodeURIComponent(text);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data = (await res.json()) as unknown[][];
  // data[0] は [[翻訳テキスト, 原文, ...], ...] の配列
  const translated = (data[0] as string[][]).map((s) => s[0]).join("");
  return applyTerminologyFixes(translated);
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌐 アビリティ説明文の翻訳を開始します（Google Translate）...\n");

  // 翻訳対象を取得
  const where = RESET ? {} : { descriptionJa: null };
  const allAbilities = await prisma.unitAbility.findMany({
    where,
    select: { id: true, description: true },
    orderBy: { id: "asc" },
  });

  // ユニーク description でグルーピング（同じ説明文を1回だけ翻訳）
  const uniqueMap = new Map<string, string[]>(); // description → [id, ...]
  for (const a of allAbilities) {
    if (!uniqueMap.has(a.description)) uniqueMap.set(a.description, []);
    uniqueMap.get(a.description)!.push(a.id);
  }

  const uniqueItems = Array.from(uniqueMap.entries());
  const target = Math.min(uniqueItems.length, LIMIT);

  console.log(`  対象: ${allAbilities.length} 件 (ユニーク説明文: ${uniqueItems.length} 件)`);
  console.log(`  処理: ${target} 件を翻訳 (推定 ${Math.round(target * DELAY_MS / 1000 / 60)} 分)\n`);
  if (DRY_RUN) console.log("  [DRY RUN モード - DB 書き込みなし]\n");

  let success = 0;
  let failed  = 0;

  for (let i = 0; i < target; i++) {
    const [description, ids] = uniqueItems[i];

    // 進捗表示（10件ごと）
    if (i % 10 === 0) {
      process.stdout.write(`  [${i + 1}/${target}] `);
    }

    try {
      const descriptionJa = await translateText(description);

      if (!DRY_RUN) {
        await prisma.unitAbility.updateMany({
          where:  { id: { in: ids } },
          data:   { descriptionJa },
        });
      } else if (i < 3) {
        // DRY RUN: 最初の3件だけ表示
        console.log(`\n  EN: ${description.slice(0, 80)}...`);
        console.log(`  JA: ${descriptionJa.slice(0, 80)}...`);
      }

      success++;
      if (i % 10 === 9 || i === target - 1) console.log(`✅`);
    } catch (err) {
      failed++;
      if (i % 10 === 9 || i === target - 1) console.log(`一部エラー`);
      console.error(`  ❌ [${i + 1}] ${String(err)}`);
    }

    if (i < target - 1) await sleep(DELAY_MS);
  }

  console.log(`\n🎉 完了: ${success} 件成功 / ${failed} 件失敗`);

  if (!DRY_RUN) {
    const total = await prisma.unitAbility.count({ where: { descriptionJa: { not: null } } });
    console.log(`   DB 内 descriptionJa 登録済み: ${total} / ${allAbilities.length + (RESET ? 0 : 0)} 件`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
