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

let XMLParser;
try {
  ({ XMLParser } = await import("fast-xml-parser"));
} catch {
  console.error("❌ fast-xml-parser が見つかりません。\n   npm install -D fast-xml-parser を実行してください。");
  process.exit(1);
}

// ─── 設定 ─────────────────────────────────────────────────────────────────────

const BSDATA_DIR = join(process.cwd(), "..", "wh40k-10e");
const OUTPUT_PATH = join(process.cwd(), "src", "data", "wh40k-units.json");

/**
 * library: entryLinks 解決に使うライブラリ .cat ファイル名（拡張子なし）
 *   指定すると、該当 .cat の sharedSelectionEntries を ID マップとして使い
 *   メイン .cat の entryLinks を解決する。
 */
const FACTION_MAP = {
  // ── Aeldari ──────────────────────────────────────────────────────────────
  "Aeldari - Aeldari Library":  { name: "Aeldari (Craftworlds)", group: "Xenos",    library: null },
  "Aeldari - Drukhari":         { name: "Drukhari",              group: "Xenos",    library: "Aeldari - Aeldari Library" },
  "Aeldari - Ynnari":           { name: "Ynnari",                group: "Xenos",    library: "Aeldari - Aeldari Library" },
  // ── Chaos ────────────────────────────────────────────────────────────────
  "Chaos - Chaos Daemons Library":  { name: "Chaos Daemons",       group: "Chaos",    library: null },
  "Chaos - Chaos Knights Library":  { name: "Chaos Knights",       group: "Chaos",    library: null },
  "Chaos - Chaos Space Marines":    { name: "Chaos Space Marines", group: "Chaos",    library: null },
  "Chaos - Death Guard":            { name: "Death Guard",         group: "Chaos",    library: null },
  "Chaos - Emperor's Children":     { name: "Emperor's Children",  group: "Chaos",    library: null },
  "Chaos - Thousand Sons":          { name: "Thousand Sons",       group: "Chaos",    library: null },
  "Chaos - World Eaters":           { name: "World Eaters",        group: "Chaos",    library: null },
  // ── Xenos ────────────────────────────────────────────────────────────────
  "Genestealer Cults": { name: "Genestealer Cults", group: "Xenos", library: null },
  "Leagues of Votann": { name: "Leagues of Votann", group: "Xenos", library: null },
  "Necrons":           { name: "Necrons",           group: "Xenos", library: null },
  "Orks":              { name: "Orks",              group: "Xenos", library: null },
  "T'au Empire":       { name: "T'au Empire",       group: "Xenos", library: null },
  "Tyranids":          { name: "Tyranids",          group: "Xenos", library: null },
  // ── Imperium ─────────────────────────────────────────────────────────────
  "Imperium - Adepta Sororitas":           { name: "Adepta Sororitas",      group: "Imperium", library: null },
  "Imperium - Adeptus Custodes":           { name: "Adeptus Custodes",      group: "Imperium", library: null },
  "Imperium - Adeptus Mechanicus":         { name: "Adeptus Mechanicus",    group: "Imperium", library: null },
  "Imperium - Agents of the Imperium":     { name: "Agents of the Imperium",group: "Imperium", library: null },
  "Imperium - Astra Militarum - Library":  { name: "Astra Militarum",       group: "Imperium", library: null },
  "Imperium - Black Templars":             { name: "Black Templars",        group: "Imperium", library: null },
  "Imperium - Blood Angels":               { name: "Blood Angels",          group: "Imperium", library: null },
  "Imperium - Dark Angels":                { name: "Dark Angels",           group: "Imperium", library: null },
  "Imperium - Deathwatch":                 { name: "Deathwatch",            group: "Imperium", library: null },
  "Imperium - Grey Knights":               { name: "Grey Knights",          group: "Imperium", library: null },
  "Imperium - Imperial Fists":             { name: "Imperial Fists",        group: "Imperium", library: null },
  "Imperium - Imperial Knights - Library": { name: "Imperial Knights",      group: "Imperium", library: null },
  "Imperium - Iron Hands":                 { name: "Iron Hands",            group: "Imperium", library: null },
  "Imperium - Raven Guard":                { name: "Raven Guard",           group: "Imperium", library: null },
  "Imperium - Salamanders":                { name: "Salamanders",           group: "Imperium", library: null },
  "Imperium - Space Marines":              { name: "Space Marines",         group: "Imperium", library: null },
  "Imperium - Space Wolves":               { name: "Space Wolves",          group: "Imperium", library: null },
  "Imperium - Ultramarines":               { name: "Ultramarines",          group: "Imperium", library: null },
  "Imperium - White Scars":                { name: "White Scars",           group: "Imperium", library: null },
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

function makeParser() {
  return new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    isArray: (name) => ["selectionEntry", "categoryLink", "cost", "entryLink"].includes(name),
  });
}

/** .cat を解析して unit/model エントリを返す。libMap があれば entryLinks も解決する */
function parseCat(filepath, libMap = null) {
  const parser = makeParser();
  const xml = readFileSync(filepath, "utf-8");
  const catalogue = parser.parse(xml).catalogue;
  if (!catalogue) return [];

  const results = [];

  function extractUnit(entry) {
    const name = entry["@_name"] ?? "";
    const type = entry["@_type"] ?? "";
    if (entry["@_hidden"] === "true") return;
    if (!["model", "unit"].includes(type)) return;
    if (name.includes("[Legends]")) return;

    let pts = 0;
    for (const cost of entry.costs?.cost ?? []) {
      if (cost["@_name"] === "pts") {
        pts = Math.round(parseFloat(cost["@_value"] ?? "0") || 0);
        break;
      }
    }
    if (pts <= 0) return;

    const cats = (entry.categoryLinks?.categoryLink ?? [])
      .map((cl) => cl["@_name"] ?? "")
      .filter((c) => c && !IGNORED_CAT_PREFIXES.some((p) => c.startsWith(p)));

    results.push({ id: slugify(name), name, pts, role: getRole(cats), categories: cats });
  }

  // 直接定義されているエントリ
  for (const e of catalogue.selectionEntries?.selectionEntry ?? []) extractUnit(e);
  for (const e of catalogue.sharedSelectionEntries?.selectionEntry ?? []) extractUnit(e);

  // entryLinks → ライブラリから解決
  if (libMap) {
    for (const link of catalogue.entryLinks?.entryLink ?? []) {
      const target = libMap.get(link["@_targetId"]);
      if (target) extractUnit(target);
    }
  }

  return results;
}

/** ライブラリ .cat の sharedSelectionEntries を id → entry の Map として返す */
function buildLibMap(filename) {
  const parser = makeParser();
  const xml = readFileSync(join(BSDATA_DIR, `${filename}.cat`), "utf-8");
  const catalogue = parser.parse(xml).catalogue;
  const map = new Map();
  for (const e of catalogue?.sharedSelectionEntries?.selectionEntry ?? []) {
    if (e["@_id"]) map.set(e["@_id"], e);
  }
  return map;
}

// ─── 既存JSONから日本語訳を退避 ───────────────────────────────────────────────

const savedUnitJa    = new Map();
const savedFactionJa = new Map();

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

// ─── ライブラリマップをキャッシュ ────────────────────────────────────────────

const libMapCache = new Map();
function getLibMap(libName) {
  if (!libMapCache.has(libName)) {
    libMapCache.set(libName, buildLibMap(libName));
  }
  return libMapCache.get(libName);
}

// ─── メイン ───────────────────────────────────────────────────────────────────

const output = {};
const catFiles = readdirSync(BSDATA_DIR).filter((f) => f.endsWith(".cat"));
const untranslated = [];

for (const filename of catFiles.sort()) {
  const key = filename.replace(/\.cat$/, "");
  const info = FACTION_MAP[key];
  if (!info) continue;

  const libMap = info.library ? getLibMap(info.library) : null;
  const units  = parseCat(join(BSDATA_DIR, filename), libMap);

  // 重複除去
  const seen = new Set();
  const deduped = units.filter((u) => {
    if (seen.has(u.name)) return false;
    seen.add(u.name);
    return true;
  });

  // ID 重複回避
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
