#!/usr/bin/env node
/**
 * scripts/parse-bsdata.mjs
 *
 * BSData / wh40k-10e の .cat ファイルを解析し、
 * src/data/wh40k-units.json を生成するスクリプト。
 *
 * 使い方:
 *   1. このリポジトリと同階層に wh40k-10e をクローン
 *      git clone https://github.com/BSData/wh40k-10e.git ../wh40k-10e
 *   2. 実行
 *      npm run generate:wh40k
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "fs";
import { join } from "path";

// ─── fast-xml-parser は devDependency として必要 ────────────────────────────
let XMLParser;
try {
  ({ XMLParser } = await import("fast-xml-parser"));
} catch {
  console.error(
    "❌ fast-xml-parser が見つかりません。\n" +
      "   npm install -D fast-xml-parser を実行してください。"
  );
  process.exit(1);
}

// ─── 設定 ─────────────────────────────────────────────────────────────────────

const BSDATA_DIR = join(process.cwd(), "..", "wh40k-10e");
const OUTPUT_PATH = join(process.cwd(), "src", "data", "wh40k-units.json");

const FACTION_MAP = {
  "Aeldari - Aeldari Library":              { name: "Aeldari (Craftworlds)", group: "Xenos" },
  "Aeldari - Drukhari":                     { name: "Drukhari",              group: "Xenos" },
  "Chaos - Chaos Daemons Library":          { name: "Chaos Daemons",         group: "Chaos" },
  "Chaos - Chaos Knights Library":          { name: "Chaos Knights",         group: "Chaos" },
  "Chaos - Chaos Space Marines":            { name: "Chaos Space Marines",   group: "Chaos" },
  "Chaos - Death Guard":                    { name: "Death Guard",           group: "Chaos" },
  "Chaos - Emperor's Children":             { name: "Emperor's Children",    group: "Chaos" },
  "Chaos - Thousand Sons":                  { name: "Thousand Sons",         group: "Chaos" },
  "Chaos - World Eaters":                   { name: "World Eaters",          group: "Chaos" },
  "Genestealer Cults":                      { name: "Genestealer Cults",     group: "Xenos" },
  "Imperium - Adepta Sororitas":            { name: "Adepta Sororitas",      group: "Imperium" },
  "Imperium - Adeptus Custodes":            { name: "Adeptus Custodes",      group: "Imperium" },
  "Imperium - Adeptus Mechanicus":          { name: "Adeptus Mechanicus",    group: "Imperium" },
  "Imperium - Astra Militarum - Library":   { name: "Astra Militarum",       group: "Imperium" },
  "Imperium - Black Templars":              { name: "Black Templars",        group: "Imperium" },
  "Imperium - Blood Angels":                { name: "Blood Angels",          group: "Imperium" },
  "Imperium - Dark Angels":                 { name: "Dark Angels",           group: "Imperium" },
  "Imperium - Deathwatch":                  { name: "Deathwatch",            group: "Imperium" },
  "Imperium - Grey Knights":                { name: "Grey Knights",          group: "Imperium" },
  "Imperium - Imperial Knights - Library":  { name: "Imperial Knights",      group: "Imperium" },
  "Imperium - Space Marines":               { name: "Space Marines",         group: "Imperium" },
  "Imperium - Space Wolves":                { name: "Space Wolves",          group: "Imperium" },
  "Imperium - Ultramarines":                { name: "Ultramarines",          group: "Imperium" },
  "Leagues of Votann":                      { name: "Leagues of Votann",     group: "Xenos" },
  "Necrons":                                { name: "Necrons",               group: "Xenos" },
  "Orks":                                   { name: "Orks",                  group: "Xenos" },
  "T'au Empire":                            { name: "T'au Empire",           group: "Xenos" },
  "Tyranids":                               { name: "Tyranids",              group: "Xenos" },
};

const IGNORED_CAT_PREFIXES = [
  "Faction:", "Attacks", "Damage", "Extra", "Ranged", "Melee",
  "Psychic", "Torrent", "Assault", "Smoke",
];

// ─── ヘルパー ─────────────────────────────────────────────────────────────────

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function getRole(cats) {
  const s = new Set(cats);
  if (s.has("Character")) return "HQ";
  if (s.has("Battleline")) return "Battleline";
  if (s.has("Dedicated Transport") || (s.has("Transport") && s.has("Vehicle"))) return "Transport";
  if ((s.has("Vehicle") || s.has("Monster") || s.has("Walker")) && !s.has("Character")) return "Heavy";
  return "Other";
}

function parseCat(filepath) {
  const xml = readFileSync(filepath, "utf-8");
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    isArray: (name) =>
      ["selectionEntry", "categoryLink", "cost", "entryLink"].includes(name),
  });
  const parsed = parser.parse(xml);
  const catalogue = parsed.catalogue;
  if (!catalogue) return [];

  const results = [];

  function processEntries(entries) {
    if (!Array.isArray(entries)) return;
    for (const entry of entries) {
      const name = entry["@_name"] ?? "";
      const type = entry["@_type"] ?? "";
      if (entry["@_hidden"] === "true") continue;
      if (!["model", "unit"].includes(type)) continue;
      if (name.includes("[Legends]")) continue;

      let pts = 0;
      for (const cost of entry.costs?.cost ?? []) {
        if (cost["@_name"] === "pts") {
          pts = Math.round(parseFloat(cost["@_value"] ?? "0") || 0);
          break;
        }
      }
      if (pts <= 0) continue;

      const cats = (entry.categoryLinks?.categoryLink ?? [])
        .map((cl) => cl["@_name"] ?? "")
        .filter((c) => c && !IGNORED_CAT_PREFIXES.some((p) => c.startsWith(p)));

      results.push({ id: slugify(name), name, pts, role: getRole(cats), categories: cats });
    }
  }

  // ユニットは selectionEntries と sharedSelectionEntries の両方に存在する
  processEntries(catalogue.selectionEntries?.selectionEntry);
  processEntries(catalogue.sharedSelectionEntries?.selectionEntry);
  return results;
}

// ─── 既存JSONから日本語訳を退避 ───────────────────────────────────────────────
// 再生成のたびに手動翻訳が消えないよう nameJa を Map に退避し、パース後に復元する。
// 種族は name（英語）で照合するためIDが変わっても引き継がれる。

const savedUnitJa   = new Map(); // ユニット英語名 → nameJa
const savedFactionJa = new Map(); // 種族英語名   → nameJa

if (existsSync(OUTPUT_PATH)) {
  try {
    const existing = JSON.parse(readFileSync(OUTPUT_PATH, "utf-8"));
    for (const faction of Object.values(existing)) {
      if (faction.nameJa) savedFactionJa.set(faction.name, faction.nameJa);
      for (const unit of faction.units ?? []) {
        if (unit.name && unit.nameJa) savedUnitJa.set(unit.name, unit.nameJa);
      }
    }
    console.log(`[OK] Loaded translations: ${savedFactionJa.size} factions / ${savedUnitJa.size} units\n`);
  } catch (e) {
    console.warn("[WARN] Failed to load existing translations:", e.message);
  }
}

// ─── メイン ───────────────────────────────────────────────────────────────────

const output = {};
const catFiles = readdirSync(BSDATA_DIR).filter((f) => f.endsWith(".cat"));
const untranslated = [];

for (const filename of catFiles.sort()) {
  const key = filename.replace(/\.cat$/, "");
  const info = FACTION_MAP[key];
  if (!info) continue;

  const units = parseCat(join(BSDATA_DIR, filename));

  // 重複除去
  const seen = new Set();
  const deduped = units.filter((u) => {
    if (seen.has(u.name)) return false;
    seen.add(u.name);
    return true;
  });

  // ID重複回避
  const idCount = {};
  for (const u of deduped) {
    const base = u.id;
    if (idCount[base] !== undefined) { idCount[base]++; u.id = `${base}_${idCount[base]}`; }
    else idCount[base] = 0;
  }

  if (!deduped.length) continue;

  // nameJa 復元
  for (const u of deduped) {
    u.nameJa = savedUnitJa.get(u.name) ?? "";
    if (!u.nameJa) untranslated.push({ faction: info.name, name: u.name });
  }

  const factionId = slugify(info.name);
  output[factionId] = {
    id: factionId,
    name: info.name,
    nameJa: savedFactionJa.get(info.name) ?? "",
    group: info.group,
    units: deduped,
  };

  const missing = deduped.filter((u) => !u.nameJa).length;
  console.log(`[OK] ${info.name}: ${deduped.length} units${missing ? `  (untranslated: ${missing})` : ""}`);
}

console.log(`\nTotal factions: ${Object.keys(output).length}`);
console.log(`Total units: ${Object.values(output).reduce((s, f) => s + f.units.length, 0)}`);

if (untranslated.length > 0) {
  console.log(`\n[INFO] nameJa 未設定 (${untranslated.length} units):`);
  let cur = "";
  for (const { faction, name } of untranslated) {
    if (faction !== cur) { cur = faction; console.log(`  [${faction}]`); }
    console.log(`    "${name}": ""`);
  }
} else {
  console.log("\n[OK] All units have nameJa!");
}

mkdirSync(join(process.cwd(), "src", "data"), { recursive: true });
writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), "utf-8");
console.log(`\n[OK] Saved to ${OUTPUT_PATH}`);