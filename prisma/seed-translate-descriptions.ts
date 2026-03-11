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
 *   --dry-run           DB に書き込まず翻訳結果をコンソール出力のみ
 *   --limit N           最初の N件だけ処理（テスト用）
 *   --reset             既存の descriptionJa をクリアして再翻訳
 *   --corrections-only  MANUAL_DESCRIPTION_CORRECTIONS の訂正のみ適用（翻訳しない）
 */

import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

// .env.local が存在すれば読み込み、DATABASE_URL を上書き（Next.js と同じ優先順位にする）
const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  for (const line of fs.readFileSync(envLocalPath, "utf-8").split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, "");
  }
}

const prisma = new PrismaClient();

const DRY_RUN          = process.argv.includes("--dry-run");
const RESET            = process.argv.includes("--reset");
const CORRECTIONS_ONLY = process.argv.includes("--corrections-only");
const limitArg = process.argv.indexOf("--limit");
const LIMIT    = limitArg !== -1 ? parseInt(process.argv[limitArg + 1], 10) : Infinity;

// ─── 手動訂正辞書（完全一致）──────────────────────────────────────────────────
// キー   : 英語の原文（DB の description フィールドと完全一致）
// 値     : 正しい日本語訳
//
// 適用方法:
//   node_modules/.bin/tsx prisma/seed-translate-descriptions.ts --corrections-only
//
const MANUAL_DESCRIPTION_CORRECTIONS: Record<string, string> = {
  // ── ここに追記 ──────────────────────────────────────────────────────────────
  "While this model is leading a unit, each time a model in that unit makes an attack, that attack has the ^^**[Sustained Hits 1]**^^ ability and add 1 to the Hit roll.": "この兵が指揮官としてユニットを率いている間、そのユニット内の兵が攻撃を行う際、その攻撃は［連続命中 1］アビリティを獲得し、ヒットロールに +1 の修正を受ける。",
  "Once per battle, when this model is selected to shoot, it can use this ability. If it does, until the end of the phase, its Bloody Twins weapon has a Damage characteristic of 3 and the [Anti-Infantry 5+] and [Devastating Wounds] abilities.":"バトル中 1 回限り、この兵が射撃を宣言したタイミングでこの兵はこのアビリティを使用できる。その場合、そのフェイズの終了時まで、この兵が装備している流血の双星は【ダメージ量】が 3 となり、［インファントリー特効5+］と［会心ウーンズ］アビリティを持つ。",
};

// ─── 手動訂正辞書（前方一致）──────────────────────────────────────────────────
// キー   : 英語の原文の書き出し（startsWith で一致）
// 値     : (englishDescription) => japaneseDescription を返す関数
//          第1引数に元の英語全文が渡されるので、ユニット名部分だけ抽出して付け加えることも可能
//
// 例: "This model can be attached to the following unit(s):\n■ XXX" を
//     "この兵は以下のユニットに合流できる：\n■ XXX" に変換したい場合
//
const MANUAL_PREFIX_CORRECTIONS: Array<{
  startsWith: string;
  translate: (en: string) => string;
}> = [
  {
    // "This model can be attached to the following unit:\n■ XXX"
    // "This model can be attached to the following units:\n■ XXX\n■ YYY"
    startsWith: "This model can be attached to the following unit",
    translate: (en: string) => {
      // "■ ユニット名" 以降の行はそのまま引き継ぐ
      const lines = en.split("\n");
      const unitLines = lines.slice(1).join("\n");
      return `この兵は以下のユニットに合流できる：\n${unitLines}`;
    },
  },
];

// リクエスト間の待機時間（レートリミット対策）
const DELAY_MS = 300;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── WH40K 専門用語の後処理辞書 ─────────────────────────────────────────────
// Google翻訳が誤訳・不自然になりやすいゲーム用語を修正する
const TERMINOLOGY_FIXES: [RegExp, string][] = [
  // フェイズ・ターン
  [/戦闘フェイズ/g,     "白兵戦フェイズ"],
  [/射撃フェーズ/g,     "射撃フェイズ"],
  [/突撃フェーズ/g,     "突撃フェイズ"],
  [/移動フェーズ/g,     "移動フェイズ"],
  [/コマンドフェーズ/g, "指揮フェイズ"],
  [/モラルフェーズ/g,   "モラルフェイズ"],
  // アクション
  [/通常移動/g,   "通常移動"],
  [/アドバンス/g, "全力移動"],
  [/撤退/g,       "退却移動"],
  // ダイス・ロール
  [/傷ロール/g,   "ウーンズロール"],
  [/ヒットロール/g, "ヒットロール"],
  [/セービングスロー/g, "セービングスロー"],
  // セーブ
  [/無敵セーブ/g, "スペシャルセーヴ"],
  // ユニット状態
  [/射撃可能な状態/g, "射撃可能"],
  [/「リード」/g,   "リーダー"],
  // 数値表記
  [/(\d+)インチ/g,  "$1インチ"],
  // 記号・書式
  [/■\s+/g, "■ "],
];

// ─── 既存の日本語訳に対する一括置換辞書 ─────────────────────────────────────
// TERMINOLOGY_FIXES は新規翻訳時に適用されるが、既存DB内の訳には適用されない。
// ここに登録した文字列は --corrections-only 時に既存 descriptionJa に対して置換する。
//
// キー: 置換前の日本語文字列（部分一致）
// 値:   置換後の日本語文字列
const JAPANESE_REPLACEMENTS: Record<string, string> = {
  "無敵セーブ": "スペシャルセーヴ",
};

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

// ─── 手動訂正を適用 ──────────────────────────────────────────────────────────

async function applyManualCorrections(dryRun: boolean): Promise<number> {
  let applied = 0;

  // ── 完全一致 ──────────────────────────────────────────────────────────────
  const entries = Object.entries(MANUAL_DESCRIPTION_CORRECTIONS);
  for (const [description, descriptionJa] of entries) {
    const targets = await prisma.unitAbility.findMany({
      where: { description },
      select: { id: true },
    });
    if (targets.length === 0) {
      console.log(`  ⚠ 原文が見つかりません: "${description.slice(0, 60)}"`);
      continue;
    }
    if (dryRun) {
      console.log(`  [DRY RUN] ${targets.length}件 → "${descriptionJa.slice(0, 60)}..."`);
    } else {
      await prisma.unitAbility.updateMany({
        where: { id: { in: targets.map((t) => t.id) } },
        data:  { descriptionJa },
      });
      console.log(`  ✅ ${targets.length}件更新: "${descriptionJa.slice(0, 60)}..."`);
    }
    applied += targets.length;
  }

  // ── 前方一致 ──────────────────────────────────────────────────────────────
  for (const rule of MANUAL_PREFIX_CORRECTIONS) {
    const targets = await prisma.unitAbility.findMany({
      where: { description: { startsWith: rule.startsWith } },
      select: { id: true, description: true },
    });
    if (targets.length === 0) {
      console.log(`  ⚠ 前方一致なし: "${rule.startsWith.slice(0, 60)}"`);
      continue;
    }
    for (const t of targets) {
      const descriptionJa = rule.translate(t.description);
      if (dryRun) {
        console.log(`  [DRY RUN] → "${descriptionJa.slice(0, 60)}..."`);
      } else {
        await prisma.unitAbility.update({
          where: { id: t.id },
          data:  { descriptionJa },
        });
      }
      applied++;
    }
    if (!dryRun) console.log(`  ✅ ${targets.length}件更新 (前方一致): "${rule.startsWith.slice(0, 40)}..."`);
  }

  // ── 日本語→日本語 一括置換 ────────────────────────────────────────────────
  const jaEntries = Object.entries(JAPANESE_REPLACEMENTS);
  for (const [oldText, newText] of jaEntries) {
    const targets = await prisma.unitAbility.findMany({
      where: { descriptionJa: { contains: oldText } },
      select: { id: true, descriptionJa: true },
    });
    if (targets.length === 0) {
      console.log(`  ⚠ 日本語置換対象なし: "${oldText}"`);
      continue;
    }
    if (dryRun) {
      console.log(`  [DRY RUN] JA置換 ${targets.length}件: "${oldText}" → "${newText}"`);
    } else {
      for (const t of targets) {
        const updated = t.descriptionJa!.replaceAll(oldText, newText);
        await prisma.unitAbility.update({ where: { id: t.id }, data: { descriptionJa: updated } });
      }
      console.log(`  ✅ JA置換 ${targets.length}件: "${oldText}" → "${newText}"`);
    }
    applied += targets.length;
  }

  if (applied === 0) console.log("  手動訂正辞書にエントリがありません。");
  return applied;
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  // ── 訂正のみモード ─────────────────────────────────────────────────────────
  if (CORRECTIONS_ONLY) {
    console.log("📝 手動訂正を適用します...\n");
    if (DRY_RUN) console.log("  [DRY RUN モード - DB 書き込みなし]\n");
    const count = await applyManualCorrections(DRY_RUN);
    console.log(`\n完了: ${count} 件に適用しました。`);
    return;
  }

  console.log("🌐 アビリティ説明文の翻訳を開始します（Google Translate）...\n");

  // ── 手動訂正を先に適用 ────────────────────────────────────────────────────
  const totalCorrections =
    Object.keys(MANUAL_DESCRIPTION_CORRECTIONS).length + MANUAL_PREFIX_CORRECTIONS.length;
  if (totalCorrections > 0) {
    console.log(`📝 手動訂正辞書を先に適用...\n`);
    await applyManualCorrections(DRY_RUN);
    console.log();
  }

  // 翻訳除外リストを構築（完全一致 + 前方一致の対象 ID を除外）
  const correctedDescriptions = Object.keys(MANUAL_DESCRIPTION_CORRECTIONS);

  // 前方一致の対象 ID を収集
  const prefixExcludedIds = new Set<string>();
  for (const rule of MANUAL_PREFIX_CORRECTIONS) {
    const matched = await prisma.unitAbility.findMany({
      where: { description: { startsWith: rule.startsWith } },
      select: { id: true },
    });
    matched.forEach((m) => prefixExcludedIds.add(m.id));
  }

  // 翻訳対象を取得（手動訂正済みのものは除外）
  const baseWhere = RESET
    ? (correctedDescriptions.length ? { description: { notIn: correctedDescriptions } } : {})
    : { descriptionJa: null, ...(correctedDescriptions.length ? { description: { notIn: correctedDescriptions } } : {}) };

  const allAbilities = (await prisma.unitAbility.findMany({
    where: baseWhere,
    select: { id: true, description: true },
    orderBy: { id: "asc" },
  })).filter((a) => !prefixExcludedIds.has(a.id));

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
    console.log(`   DB 内 descriptionJa 登録済み: ${total} 件`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
