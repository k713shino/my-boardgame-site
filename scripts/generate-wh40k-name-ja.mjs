#!/usr/bin/env node

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const DATA_PATH = join(process.cwd(), "src", "data", "wh40k-units.json");
const OVERRIDES_PATH = join(process.cwd(), "scripts", "wh40k-name-ja-overrides.json");

const onlyEmpty = process.argv.includes("--only-empty");

const overrides = JSON.parse(readFileSync(OVERRIDES_PATH, "utf-8"));
const exactMap = new Map(Object.entries(overrides.exact ?? {}).map(([k, v]) => [k.toLowerCase(), v]));
const phraseMap = new Map(Object.entries(overrides.phrase ?? {}).map(([k, v]) => [k.toLowerCase(), v]));
const wordMap = new Map(Object.entries(overrides.word ?? {}).map(([k, v]) => [k.toLowerCase(), v]));

const KANA = {
  kya: "キャ", kyu: "キュ", kyo: "キョ", sha: "シャ", shu: "シュ", sho: "ショ",
  cha: "チャ", chu: "チュ", cho: "チョ", nya: "ニャ", nyu: "ニュ", nyo: "ニョ",
  hya: "ヒャ", hyu: "ヒュ", hyo: "ヒョ", mya: "ミャ", myu: "ミュ", myo: "ミョ",
  rya: "リャ", ryu: "リュ", ryo: "リョ", gya: "ギャ", gyu: "ギュ", gyo: "ギョ",
  ja: "ジャ", ju: "ジュ", jo: "ジョ", bya: "ビャ", byu: "ビュ", byo: "ビョ",
  pya: "ピャ", pyu: "ピュ", pyo: "ピョ", tsa: "ツァ", tsi: "ツィ", tse: "ツェ", tso: "ツォ",
  fa: "ファ", fi: "フィ", fe: "フェ", fo: "フォ", va: "ヴァ", vi: "ヴィ", ve: "ヴェ", vo: "ヴォ",
  ka: "カ", ki: "キ", ku: "ク", ke: "ケ", ko: "コ", sa: "サ", shi: "シ", su: "ス", se: "セ", so: "ソ",
  ta: "タ", chi: "チ", tsu: "ツ", te: "テ", to: "ト", na: "ナ", ni: "ニ", nu: "ヌ", ne: "ネ", no: "ノ",
  ha: "ハ", hi: "ヒ", fu: "フ", he: "ヘ", ho: "ホ", ma: "マ", mi: "ミ", mu: "ム", me: "メ", mo: "モ",
  ya: "ヤ", yu: "ユ", yo: "ヨ", ra: "ラ", ri: "リ", ru: "ル", re: "レ", ro: "ロ",
  wa: "ワ", wo: "ヲ", ga: "ガ", gi: "ギ", gu: "グ", ge: "ゲ", go: "ゴ",
  za: "ザ", ji: "ジ", zu: "ズ", ze: "ゼ", zo: "ゾ", da: "ダ", de: "デ", do: "ド",
  ba: "バ", bi: "ビ", bu: "ブ", be: "ベ", bo: "ボ", pa: "パ", pi: "ピ", pu: "プ", pe: "ペ", po: "ポ",
  a: "ア", i: "イ", u: "ウ", e: "エ", o: "オ",
};

const ENDING = { b: "ブ", c: "ク", d: "ド", f: "フ", g: "グ", h: "フ", j: "ジ", k: "ク", l: "ル", m: "ム", n: "ン", p: "プ", q: "ク", r: "ル", s: "ス", t: "ト", v: "ヴ", w: "ウ", x: "クス", y: "イ", z: "ズ" };

function normalizeAscii(input) {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’`]/g, "'")
    .replace(/\bw\/\b/gi, "with")
    .replace(/\s+/g, " ")
    .trim();
}

function replacePhrases(input) {
  let out = input;
  const keys = [...phraseMap.keys()].sort((a, b) => b.length - a.length);
  for (const k of keys) {
    const escaped = k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(new RegExp(`\\b${escaped}\\b`, "gi"), phraseMap.get(k));
  }
  return out;
}

function toPseudo(word) {
  return word
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/tion/g, "shon")
    .replace(/sion/g, "zhon")
    .replace(/ture/g, "cha")
    .replace(/ph/g, "f")
    .replace(/qu/g, "kw")
    .replace(/x/g, "ks")
    .replace(/dg(?=[eiy])/g, "j")
    .replace(/c(?=[eiy])/g, "s")
    .replace(/c/g, "k")
    .replace(/g(?=[eiy])/g, "j")
    .replace(/th/g, "s")
    .replace(/ch/g, "ch")
    .replace(/sh/g, "sh")
    .replace(/wh/g, "w");
}

function translitWord(token) {
  const lower = token.toLowerCase();
  if (wordMap.has(lower)) return wordMap.get(lower);
  if (/^\d+$/.test(token)) return token;
  if (/^[A-Z0-9]+$/.test(token)) return token;

  const s = toPseudo(token).replace(/[^a-z]/g, "");
  if (!s) return token;

  let i = 0;
  let out = "";
  while (i < s.length) {
    const c = s[i];
    const n = s[i + 1] ?? "";
    const nn = s[i + 2] ?? "";

    if (i + 1 < s.length && c === n && !/[aeiou]/.test(c) && c !== "n") {
      out += "ッ";
      i += 1;
      continue;
    }

    const tri = c + n + nn;
    if (KANA[tri]) {
      out += KANA[tri];
      i += 3;
      continue;
    }

    const bi = c + n;
    if (KANA[bi]) {
      out += KANA[bi];
      i += 2;
      continue;
    }

    if (c === "n" && n && !/[aeiouy]/.test(n)) {
      out += "ン";
      i += 1;
      continue;
    }

    if (i === s.length - 1 && ENDING[c]) {
      out += ENDING[c];
      i += 1;
      continue;
    }

    if (KANA[c]) {
      out += KANA[c];
      i += 1;
      continue;
    }

    i += 1;
  }

  return out || token;
}

function translateName(name) {
  const normalized = normalizeAscii(name);
  const exact = exactMap.get(normalized.toLowerCase());
  if (exact) return exact;

  const phraseDone = replacePhrases(normalized);
  const tokens = phraseDone.split(/(\s+|[-/(),.:&])/g);
  return tokens
    .map((t) => {
      if (!t) return t;
      if (/^\s+$/.test(t)) return t;
      if (/^[-/(),.:&]$/.test(t)) return t === "-" ? "・" : t;
      if (/[ァ-ヴー一-龯々]/.test(t)) return t;
      return translitWord(t);
    })
    .join("")
    .replace(/\s+/g, " ")
    .replace(/ {0,}\/ {0,}/g, "／")
    .trim();
}

const data = JSON.parse(readFileSync(DATA_PATH, "utf-8"));

let factionUpdated = 0;
let unitUpdated = 0;

for (const faction of Object.values(data)) {
  if (!onlyEmpty || !String(faction.nameJa ?? "").trim()) {
    faction.nameJa = translateName(faction.name);
    factionUpdated += 1;
  }
  for (const unit of faction.units ?? []) {
    if (!onlyEmpty || !String(unit.nameJa ?? "").trim()) {
      unit.nameJa = translateName(unit.name);
      unitUpdated += 1;
    }
  }
}

writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + "\n", "utf-8");
console.log(`Updated factions: ${factionUpdated}`);
console.log(`Updated units: ${unitUpdated}`);
console.log(`Saved: ${DATA_PATH}`);
