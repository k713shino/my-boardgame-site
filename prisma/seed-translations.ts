/**
 * prisma/seed-translations.ts
 *
 * ユニットの武器名・アビリティ名の日本語訳を DB に投入する。
 *
 * 翻訳ソース:
 *   1. アエルダリ固有名: src/app/wh40k/aeldari/data.ts（手訳）から抽出
 *   2. 武器特殊ルール (keywords): WH40K 10版公式用語辞書
 *   3. 汎用アビリティ名: WH40K 10版公式用語辞書
 *
 * 実行:
 *   node_modules/.bin/tsx prisma/seed-translations.ts
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

// ─── 武器名辞書（英語 → 日本語）───────────────────────────────────────────────
// アエルダリ由来 + 汎用兵器名の公式訳
const WEAPON_NAME_MAP: Record<string, string> = {
  // ── アエルダリ系 ────────────────────────────────────────────────────────────
  "The Wailing Doom": "嘆きの破滅",
  "The Wailing Doom (Ranged)": "嘆きの破滅（射撃）",
  "The Wailing Doom – strike": "嘆きの破滅（打撃）",
  "The Wailing Doom – sweep": "嘆きの破滅（薙ぎ払い）",
  "Shuriken Pistol": "シュリケン・ピストル",
  "Star Glaive": "スターグレイブ",
  "Mind War": "精神の戦い",
  "Staff of Ulthamar": "ウルスラーンのスタッフ",
  "Singing Spear": "シンギングスピア",
  "Twin Shuriken Catapult": "ツイン・シュリケン・カタパルト",
  "Witch Staff": "ウィッチスタッフ",
  "Witchblade": "ウィッチブレード",
  "Eye of Wrath": "怒りの眼",
  "The Spear of Twilight": "黄昏の槍",
  "Sword of Asur": "アスルの剣",
  "Fury of the Tempest": "嵐の猛威",
  "Shining Blade": "輝く刃",
  "Fire Axe": "ファイアーアックス",
  "Firepike": "ファイアーパイク",
  "The Silent Death": "沈黙の死",
  "Blade of Destruction": "破壊の刃",
  "The Maugetar (Ranged)": "モーゲタール（射撃）",
  "The Maugetar (Melee)": "モーゲタール（白兵）",
  "The Maugetar": "モーゲタール",
  "Avenger Shuriken Catapult": "アヴェンジャー・シュリケン・カタパルト",
  "Close Combat Weapon": "近接武器",
  "Shuriken Catapult": "シュリケン・カタパルト",
  "Banshee Blade": "バンシーブレード",
  "Scorpion Chainsword": "スコーピオン・チェーンソード",
  "Death Spinner": "デス・スピナー",
  "Lasblaster": "ラスブラスター",
  "Laser Lance": "レーザーランス",
  "Fusion Gun": "フュージョン・ガン",
  "Ranger Long Rifle": "レンジャー・ロングライフル",
  "Shuriken Cannon": "シュリケン・キャノン",
  "Ghostaxe and Forceshield": "ゴーストアックス＋フォースシールド",
  "Ghostsword": "ゴーストソード",
  "D-Scythe": "Dサイズ",
  "Wraithcannon": "レイスキャノン",
  "Bright Lance": "ブライトランス",
  "Ghostglaive": "ゴーストグレイブ",
  "Heavy Wraithcannon": "ヘヴィ・レイスキャノン",
  "Suncannon": "サンキャノン",
  "Titanic Feet": "タイタニック・フィート",
  "Titanic Wraithglaive": "タイタニック・レイスグレイブ",
  "Scatter Laser": "スキャッター・レーザー",
  "Reaper Launcher": "リーパーランチャー",
  "Reaper Launcher (Starshot)": "リーパーランチャー（スターショット）",
  "Reaper Launcher (Starswarm)": "リーパーランチャー（スタースワーム）",
  "D-cannon": "Dキャノン",
  "Shadow Weaver": "シャドウ・ウィーバー",
  "Vibro Cannon": "ヴィブロ・キャノン",
  "Prism Cannon": "プリズムキャノン",
  "Prism Cannon (Dispersed)": "プリズムキャノン（散射）",
  "Prism Cannon (Focused)": "プリズムキャノン（集束）",
  "Doomweaver (Dispersed)": "ドゥームウィーバー（散射）",
  "Doomweaver (Focused)": "ドゥームウィーバー（集束）",
  "Pulse Laser": "パルスレーザー",
  "Wave Serpent Shield": "ウェーブサーペント・シールド",
  "Starcannon": "スターキャノン",
  // ── デュカーリ・インナーリ系 ─────────────────────────────────────────────────────
  "Agoniser": "アゴナイザー",
  "Venom Blade": "ヴェノムブレード",
  "Archite Glaive": "アーカイト・グレイブ",
  "Razorflails": "レイザーフレイル",
  "Splinter Rifle": "スプリンター・ライフル",
  "Hekatarii Blade": "ヘカタリィ・ブレード",
  "Klaive": "クレイブ",
  "Zephyrglaive": "ゼフィル・グレイブ",
  "Haywire Cannon": "ヘイワイアー・キャノン",
  "Dark Lance": "ダーク・ランス",
  "Splinter Cannon": "スプリンター・キャノン",
  "Twin Splinter Rifle": "ツイン・スプリンター・ライフル",
  "Rift Cannon": "リフトキャノン",
  // ── 汎用共通武器（大文字小文字バリアント含む） ─────────────────────────────────
  "Close combat weapon": "近接武器",
  "Armoured tracks": "装甲履帯",
  "Armoured hull": "装甲船体",
  "Combi-weapon": "コンビ・ウェポン",
  "Combi-bolter": "コンビ・ボルター",
  "Storm bolter": "ストームボルター",
  "Storm Bolter": "ストームボルター",
  "Twin heavy bolter": "ツイン・ヘヴィ・ボルター",
  "Twin Heavy Bolter": "ツイン・ヘヴィ・ボルター",
  "Hunter-killer missile": "ハンターキラー・ミサイル",
  "Hunter-Killer Missile": "ハンターキラー・ミサイル",
  "Havoc launcher": "ハヴォック・ランチャー",
  "Havoc Launcher": "ハヴォック・ランチャー",
  "Autopistol": "オートピストル",
  "Plasma pistol - standard": "プラズマ・ピストル（スタンダード）",
  "Plasma pistol - supercharge": "プラズマ・ピストル（スーパーチャージ）",
  "Plasma gun - standard": "プラズマガン（スタンダード）",
  "Plasma gun - supercharge": "プラズマガン（スーパーチャージ）",
  "Power weapon": "パワーウェポン",
  "Power sword": "パワーソード",
  "Power fist": "パワーフィスト",
  "Heavy bolter": "ヘヴィ・ボルター",
  "Splinter Pistol": "スプリンター・ピストル",
  "Splinter pistol": "スプリンター・ピストル",
  "Flamer": "フレイマー",
  "Heavy Flamer": "ヘヴィ・フレイマー",
  "Bolt Pistol": "ボルト・ピストル",
  "Bolt pistol": "ボルト・ピストル",
  "Bolt Rifle": "ボルトライフル",
  "Bolter": "ボルター",
  "Boltgun": "ボルトガン",
  "Plasma Pistol": "プラズマ・ピストル",
  "Plasma Pistol - Standard": "プラズマ・ピストル（スタンダード）",
  "Plasma Pistol - Supercharge": "プラズマ・ピストル（スーパーチャージ）",
  "Plasma Gun": "プラズマガン",
  "Plasma Gun - Standard": "プラズマガン（スタンダード）",
  "Plasma Gun - Supercharge": "プラズマガン（スーパーチャージ）",
  "Plasma Cannon - Standard": "プラズマキャノン（スタンダード）",
  "Plasma Cannon - Supercharge": "プラズマキャノン（スーパーチャージ）",
  "Lascannon": "ラスキャノン",
  "Missile Launcher": "ミサイルランチャー",
  "Missile Launcher - Krak": "ミサイルランチャー（クラック）",
  "Missile Launcher - Frag": "ミサイルランチャー（フラグ）",
  "Power Sword": "パワーソード",
  "Power Fist": "パワーフィスト",
  "Power Weapon": "パワーウェポン",
  "Power Axe": "パワーアックス",
  "Power Maul": "パワーモール",
  "Thunder Hammer": "サンダーハンマー",
  "Chain Sword": "チェーンソード",
  "Chainsword": "チェーンソード",
  "Astartes Chainsword": "アスタルテス・チェーンソード",
  "Combat Knife": "コンバットナイフ",
  "Frag Grenade": "フラグ・グレネード",
  "Krak Grenade": "クラック・グレネード",
  "Astartes grenade launcher - krak": "アスタルテス・グレネードランチャー（クラック）",
  "Astartes grenade launcher - frag": "アスタルテス・グレネードランチャー（フラグ）",
  "Hand Flamer": "ハンドフレイマー",
  "Heavy Bolter": "ヘヴィ・ボルター",
  "Multi-melta": "マルチメルタ",
  "Meltagun": "メルタガン",
  "Melta Rifle": "メルタライフル",
  "Volkite Charger": "ヴォルカイト・チャージャー",
  "Volkite Pistol": "ヴォルカイト・ピストル",
  "Inferno Pistol": "インフェルノ・ピストル",
  "Grav-pistol": "グラブ・ピストル",
  "Grav-gun": "グラブガン",
  "Las Pistol": "ラス・ピストル",
  "Laspistol": "ラス・ピストル",
  "Lasgun": "ラスガン",
  "Pulse Rifle": "パルスライフル",
  "Pulse Carbine": "パルスカービン",
  "Rail Rifle": "レールライフル",
  "Ion Rifle": "イオンライフル",
  "Accelerator Burst Cannon": "アクセラレーター・バーストキャノン",
  "Burst Cannon": "バーストキャノン",
  "Gauss Flayer": "ガウス・フレイヤー",
  "Gauss Blaster": "ガウス・ブラスター",
  "Gauss Cannon": "ガウスキャノン",
  "Gauss Reaper": "ガウス・リーパー",
  "Staff of Light": "スタッフ・オブ・ライト",
  "Warp Flamer": "ワープフレイマー",
  "Psycannon": "サイキャノン",
  "Force Staff": "フォーススタッフ",
  "Force Sword": "フォースソード",
  "Force Axe": "フォースアックス",
  "Nemesis Force Sword": "ネメシス・フォースソード",
  "Nemesis Warding Stave": "ネメシス・ウォーディングスタッフ",
  "Rubric Marine Weapons": "ルーブリック・マリーンの武器",
  "Inferno Boltgun": "インフェルノ・ボルトガン",
  "Plague Knife": "プレイグナイフ",
  "Plaguesword": "プレイグソード",
  "Great Plague Cleaver": "グレート・プレイグ・クリーバー",
  "Plague Spewer": "プレイグスピュワー",
  "Bubotic Axe": "ブボティック・アックス",
  "Reaper Autocannon": "リーパー・オートキャノン",
  "Macro Plasma Incinerator - Standard": "マクロ・プラズマ・インシネレーター（スタンダード）",
  "Macro Plasma Incinerator - Supercharge": "マクロ・プラズマ・インシネレーター（スーパーチャージ）",
  "Grav-cannon": "グラブキャノン",
};

// ─── 武器特殊ルール（keywords）辞書 ──────────────────────────────────────────
// keywords フィールドはカンマ区切り文字列。各トークンを個別に変換する。
const WEAPON_KEYWORD_MAP: Record<string, string> = {
  "Assault": "アサルト",
  "Heavy": "ヘヴィ",
  "Pistol": "ピストル",
  "Rapid Fire 1": "ラピッドファイア 1",
  "Rapid Fire 2": "ラピッドファイア 2",
  "Rapid Fire 3": "ラピッドファイア 3",
  "Blast": "ブラスト",
  "Torrent": "噴射",
  "Sustained Hits 1": "連続命中 1",
  "Sustained Hits 2": "連続命中 2",
  "Sustained Hits D3": "連続命中 D3",
  "Sustained Hits D6": "連続命中 D6",
  "Lethal Hits": "会心ヒット",
  "Devastating Wounds": "会心ウーンズ",
  "Psychic": "サイキック",
  "Precision": "精密攻撃",
  "Twin-linked": "ツインリンク",
  "Indirect Fire": "間接射撃",
  "Melta 1": "メルタ 1",
  "Melta 2": "メルタ 2",
  "Melta 3": "メルタ 3",
  "Melta 4": "メルタ 4",
  "Lance": "ランス",
  "Ignores Cover": "遮蔽無効",
  "Hazardous": "暴発",
  "One Shot": "ワンショット",
  "Scatter": "スキャッター",
  "Smoke": "スモーク",
  "Anti-Infantry 2+": "インファントリー特攻 2+",
  "Anti-Infantry 3+": "インファントリー特攻 3+",
  "Anti-Infantry 4+": "インファントリー特攻 4+",
  "Anti-Infantry 5+": "インファントリー特攻 5+",
  "Anti-Vehicle 2+": "ビークル特攻 2+",
  "Anti-Vehicle 3+": "ビークル特攻 3+",
  "Anti-Vehicle 4+": "ビークル特攻 4+",
  "Anti-Vehicle 5+": "ビークル特攻 5+",
  "Anti-Monster 2+": "モンスター特攻 2+",
  "Anti-Monster 3+": "モンスター特攻 3+",
  "Anti-Monster 4+": "モンスター特攻 4+",
  "Anti-Monster 5+": "モンスター特攻 5+",
  "Anti-Fly 4+": "飛行特攻 4+",
  "Anti-Chaos 4+": "ケイオス特攻 4+",
  "Anti-Tyranid 4+": "ティラニッド特攻 4+",
  "Anti-Psyker 4+": "サイカー特攻 4+",
  "Ceaseless": "絶え間なき",
  "Extra Attacks": "追加攻撃",
  "Rend": "貫通",
  "Strength": "攻撃力",
  "Melee": "白兵戦",
  "infantry": "インファントリー",
  "-": "",
};

// ─── アビリティ名辞書（英語 → 日本語）─────────────────────────────────────────
const ABILITY_NAME_MAP: Record<string, string> = {
  // ── 汎用ルール ───────────────────────────────────────────────────────────────
  "Objective Secured": "目標確保",
  "Deep Strike": "ディープストライク",
  "Deadly Demise 1": "恐るべき最期（1）",
  "Deadly Demise D3": "恐るべき最期（D3）",
  "Deadly Demise D6": "恐るべき最期（D6）",
  "Deadly Demise 2": "恐るべき最期（2）",
  "Deadly Demise 3": "恐るべき最期（3）",
  "Explodes": "爆発",
  "Stealth": "ステルス",
  "Hard to Hit": "当てにくい",
  "Leader": "リーダー",
  "Lone Operative": "単独工作員",
  "Feel No Pain 4+": "痛みを知らぬ者 4+",
  "Feel No Pain 5+": "痛みを知らぬ者 5+",
  "Feel No Pain 6+": "痛みを知らぬ者 6+",
  "Feel No Pain 3+": "痛みを知らぬ者 3+",
  "Fights First": "先行戦闘",
  "Infiltrators": "潜入",
  "Scout 6\"": "スカウト 6インチ",
  "Scout 9\"": "スカウト 9インチ",
  "Scouts 6\"": "スカウト 6インチ",
  "Scouts 7\"": "スカウト 7インチ",
  "Scouts 8\"": "スカウト 8インチ",
  "Scouts 9\"": "スカウト 9インチ",
  "Scout 7\"": "スカウト 7インチ",
  "Scout 8\"": "スカウト 8インチ",
  "Smoke": "スモーク",
  "Firing Deck 6": "砲撃デッキ 6",
  "Firing Deck 10": "砲撃デッキ 10",
  "Firing Deck 12": "砲撃デッキ 12",
  "Firing Deck 16": "砲撃デッキ 16",
  "Deadly Demise": "致命的な死",
  "Monster Hunter": "モンスターハンター",
  "Daemon": "デーモン",
  "Daemon of Chaos": "ケイオスのデーモン",
  "Lethal Hits": "致命的命中",
  "Devastating Wounds": "壊滅的ウーンド",
  "Battle Focus": "バトルフォーカス",
  "Faction: Aeldari": "陣営：アエルダリ",
  "Transport Capacity": "輸送能力",
  "Power of the Machine Spirit": "機械霊の力",
  "Assault Vehicle": "強襲車両",
  "Hover Tank": "ホバータンク",
  "Open-topped": "オープントップ",
  "Firing Deck": "砲撃デッキ",
  // ── アエルダリ系 ─────────────────────────────────────────────────────────────
  "Molten Form": "溶融の形態",
  "The Bloody-Handed (Aura)": "血塗られた手（オーラ）",
  "Superlative Strategist": "卓越した戦略家",
  "Path of Command": "コマンドのパス",
  "Indomitable Strength of Will": "不屈の意志の力",
  "Branching Fates (Psychic)": "分岐する運命（サイキック）",
  "Doom (Psychic)": "ドゥーム（サイキック）",
  "Guide (Psychic)": "ガイド（サイキック）",
  "Spirit Mark": "スピリットマーク",
  "Revive": "リバイブ",
  "Runes of Battle (Conceal)": "バトルのルーン（隠蔽）",
  "Runes of Battle (Embolden)": "バトルのルーン（鼓舞）",
  "Tactical Acumen": "戦術的眼識",
  "Hand of Asuryan": "アシュリアンの御手",
  "Cloudstrider": "雲の歩者",
  "Death is Not Enough": "死では不十分",
  "The Burning Blood": "燃える血",
  "Will Not Die": "死に抗う意志",
  "Disarming Strike": "武装解除の一撃",
  "War Shout": "戦の叫び",
  "Harvest of Souls": "魂の収穫",
  "The Reaper's Gaze": "死神の眼差し",
  "Bladestorm": "ブレードストーム",
  "Fleet of Foot": "軽快な足取り",
  "Storm Assault": "ストーム突撃",
  "Swooping Advance": "急降下前進",
  "Reckless Advance": "無謀な前進",
  "Banshee Mask": "バンシーマスク",
  "Swift": "俊足",
  "Mandiblasters": "マンディブラスター",
  "Warp Jump": "ワープジャンプ",
  "Flickerjump": "フリッカージャンプ",
  "Skyleap": "スカイリープ",
  "Shimmershield": "シマーシールド",
  "Tank Hunters": "タンクハンター",
  "Pathfinders": "道先案内人",
  "A Deadly Prize": "致命的な賞",
  "Deadly Demise D6 (Aeldari)": "致命的な死（D6）",
  "Fearsome Aspect": "恐怖の相貌",
  "Wraithlord Resilience": "レイスロードの回復力",
  "Agile": "機敏",
  "Inescapable Accuracy": "不可避の精度",
  "Guardian Crew": "ガーディアン操縦",
  "Monofilament Network": "モノフィラメント・ネットワーク",
  "Resonance Disruption": "共鳴波破壊",
  "Linked Fire": "連結射撃",
  "Monofilament Shroud": "モノフィラメント・シュラウド",
  "Precognitive Dodging": "予知的回避",
  "Energy Field": "エネルギーフィールド",
  "Apex Predator": "頂点の捕食者",
  "Venomous Strike": "毒の一撃",
  "Shrieking Doom": "絶叫する終焉",
  "Death Unveiled": "死の露見",
  "Choreographer of War": "戦の振付師",
  "Saedath Stratagem": "サエダス戦略",
  "Veil of Tears (Psychic)": "涙のヴェール（サイキック）",
  "Shards of Light (Psychic)": "光の破片（サイキック）",
  "Cruel Amusement": "残酷な楽しみ",
  "Flip Belt": "フリップ・ベルト",
  "Blitz": "電撃突破",
  "Word of the Phoenix (Psychic)": "フェニックスの言葉（サイキック）",
  "Gyre of Souls (Aura)": "魂の渦（オーラ）",
  "Chosen of Ynnead": "ヤナールの選ばれし者",
  "Lethal Reflexes": "致死的な反射神経",
  "Avatar of Ynnead (Psychic)": "ヤナールのアヴァター（サイキック）",
  "Soulburst": "ソウルバースト",
  "Power from Pain (Ynnari)": "苦痛からの力（インナーリ）",
  "Acrobatic": "アクロバット",
  "Prismatic Blur": "プリズマティック・ブラー",
  "Bladevanes Attack": "ブレードヴェーン攻撃",
  "Lethal Precision": "致命的な精度",
  "Crewed Platform": "クルー・プラットフォーム",
  "Damaged: 1-6 Wounds Remaining": "損傷: ウーンド1〜6残存",
  "Damaged: 1-5 Wounds Remaining": "損傷: ウーンド1〜5残存",
  "Damaged: 1-4 Wounds Remaining": "損傷: ウーンド1〜4残存",
  "Damaged: 1-3 Wounds Remaining": "損傷: ウーンド1〜3残存",
  "Titanic Strides": "タイタニック・ストライド",
  "Point-blank Devastation": "至近距離の壊滅",
  "Piratical Hero":"英雄海賊",
  // ── スペースマリーン系 ────────────────────────────────────────────────────────
  "Oath of Moment": "その時の誓い",
  "And They Shall Know No Fear": "彼らは恐れを知らない",
  "Combat Squads": "コンバットスクワッド",
  "Shock Assault": "ショック・アサルト",
  "Bolter Discipline": "ボルター規律",
  "Astartes Shield": "アスタルテス・シールド",
  "Stormblade": "ストームブレード",
  "Rites of Battle (Aura)": "戦いの儀式（オーラ）",
  "Inspirational Leader": "鼓舞するリーダー",
  "Teleport Strike": "テレポートストライク",
  "Target Elimination": "目標排除",
  "Inner Fire (Psychic)": "内なる炎（サイキック）",
  "Smite (Psychic)": "スマイト（サイキック）",
  "Psychic Hood": "サイキック・フード",
  "Deny the Witch": "魔女を否定",
  // ── ネクロン系 ────────────────────────────────────────────────────────────────
  "Reanimation Protocols": "リアニメーション・プロトコル",
  "Living Metal": "リビングメタル",
  "My Will Be Done (Aura)": "我が意志は成される（オーラ）",
  "The Triarch's Gaze": "トリアーク審問官の眼差し",
  "United in Purpose": "目的のために一致団結",
  // ── オルク系 ─────────────────────────────────────────────────────────────────
  "Waaagh!": "ウォーー！",
  "Dakka! Dakka! Dakka!": "ダッカ！ダッカ！ダッカ！",
  "Mob Rule": "モブルール",
  "Ere We Go": "さあ行くぞ",
  "Rampage": "暴走",
  // ── ティラニッド系 ────────────────────────────────────────────────────────────
  "Shadow in the Warp": "ウォープの影",
  "Synapse": "シナプス",
  "Instinctive Behaviour": "本能的行動",
  "The Horror (Psychic)": "恐怖（サイキック）",
  "Tyranids": "ティラニッド",
  "Tyranid": "ティラニッド",
  // ── ケイオス系 ───────────────────────────────────────────────────────────────
  "Mark of Chaos Ascendant": "混沌昇格の印",
  "Death to the False Emperor!": "偽皇帝に死を！",
  "Aura of Dark Glory": "暗黒の栄光のオーラ",
  // ── アデプタス・メカニクス系 ──────────────────────────────────────────────────
  "Doctrina Imperatives": "ドクトリナ・インペラティブ",
  "Canticles of the Omnissiah": "オムニシア讃歌",
  // ── アデプタ・ソロリタス系 ────────────────────────────────────────────────────
  "Acts of Faith": "信仰の行為",
  "Miracle Dice": "奇跡のダイス",
  "Shield of Faith": "信仰の盾",
  // ── インペリアル・ガード系 ────────────────────────────────────────────────────
  "Voice of Command": "司令の声",
  "Take Aim!": "狙え！",
  "Fix Bayonets!": "銃剣を構えろ！",
  "Suppressing Fire": "制圧射撃",
  "Platoon Commander": "プラトーン・コマンダー",
  // ── 汎用アビリティ ──────────────────────────────────────────────────────────
  "Attached Unit": "従属ユニット",
  "Transport": "トランスポート",
  "Assault Ramp": "強襲ランプ",
  "Damaged: 1-5 wounds remaining": "損傷：残傷1〜5",
  "Damaged: 1-7 wounds remaining": "損傷：残傷1〜7",
  "Damaged: 1-9 wounds remaining": "損傷：残傷1〜9",
  "Damaged: 1-10 wounds remaining": "損傷：残傷1〜10",
  "Damaged: 1-7 Wounds Remaining": "損傷：残傷1〜7",
  "Damaged: 1-9 Wounds Remaining": "損傷：残傷1〜9",
  "Damaged: 1-10 Wounds Remaining": "損傷：残傷1〜10",
  // ── ケイオス系（追加）────────────────────────────────────────────────────────
  "Mortal Sorcery (Aura)": "致命的な呪術（オーラ）",
  "Dark Sacrifice": "ダーク・サクリファイス",
  "Instrument of Chaos": "ケイオスの道具",
  "Daemonic Icon": "デーモニック・アイコン",
  "Seductive Gambit": "誘惑の賭け",
  "Dread Tyrants (Aura)": "恐怖の暴君（オーラ）",
  "Penumbral Puppetry": "半影の操り",
  "Murderer's Cowl": "殺し屋のカウル",
  // ── アエルダリ系（追加）──────────────────────────────────────────────────────
  "Aspect Shrine Token": "アスペクト・シュライン・トークン",
  "Guerrilla Adepts": "ゲリラの達人",
  "Travelling Players": "旅する役者たち",
  "Scuttling Walker": "這い回る歩行者",
};

// ─── keywords 文字列の日本語変換 ─────────────────────────────────────────────

function translateKeywords(keywords: string): string | null {
  if (!keywords || keywords === "-") return null;
  const tokens = keywords.split(",").map((t) => t.trim()).filter(Boolean);
  const translated = tokens.map((token) => {
    // 完全一致（大文字小文字区別あり）
    if (WEAPON_KEYWORD_MAP[token]) return WEAPON_KEYWORD_MAP[token];
    // 大文字小文字区別なし fallback
    const tokenLower = token.toLowerCase();
    const ciMatch = Object.entries(WEAPON_KEYWORD_MAP).find(([k]) => k.toLowerCase() === tokenLower);
    if (ciMatch) return ciMatch[1];
    // "Rapid Fire X" のパターン
    const rfMatch = token.match(/^Rapid Fire (\d+)$/);
    if (rfMatch) return `ラピッドファイア ${rfMatch[1]}`;
    // "Anti-X Y+" のパターン
    const antiMatch = token.match(/^Anti-(.+) (\d+)\+$/);
    if (antiMatch) return `${antiMatch[1]} ${antiMatch[2]}+特化`;
    // "Melta X" のパターン
    const meltaMatch = token.match(/^Melta (\d+)$/);
    if (meltaMatch) return `メルタ ${meltaMatch[1]}`;
    // "Sustained Hits X" パターン
    const shMatch = token.match(/^Sustained Hits (.+)$/);
    if (shMatch) return `連続命中 ${shMatch[1]}`;
    // "Feel No Pain X+" パターン
    const fnpMatch = token.match(/^Feel No Pain (\d+)\+$/);
    if (fnpMatch) return `痛みを知らぬ者 ${fnpMatch[1]}+`;
    return token; // 翻訳なければ英語のまま
  });
  const result = translated.join("、");
  // 全て英語のままだった場合は null を返す（表示しない）
  return result === keywords ? null : result;
}

// ─── ユニット名辞書（英語 → 日本語）──────────────────────────────────────────
// wh40k-units.json の nameJa を直接編集せずに、ここで訂正できる。
// 実行後は Neon DB に即反映される（再デプロイ不要）。
//
// キー   : 英語ユニット名（DB の Unit.name と完全一致）
// 値     : 正しい日本語訳
//
const UNIT_NAME_MAP: Record<string, string> = {
  // ── ここに追記 ──────────────────────────────────────────────────────────────
  "Prince Yriel": "ユリエルの君",

};

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Applying translations...\n");

  // ユニット名の翻訳
  const unitNameEntries = Object.entries(UNIT_NAME_MAP);
  if (unitNameEntries.length > 0) {
    console.log(`  Translating ${unitNameEntries.length} unit names...`);
    let unitHit = 0;
    for (const [name, nameJa] of unitNameEntries) {
      const count = await prisma.unit.updateMany({ where: { name }, data: { nameJa } });
      if (count.count > 0) unitHit += count.count;
      else console.warn(`  ⚠ Unit not found: "${name}"`);
    }
    console.log(`  ✅ Unit names updated: ${unitHit}`);
  }

  // 武器プロファイルの翻訳
  const weapons = await prisma.unitWeaponProfile.findMany({
    select: { id: true, name: true, keywords: true },
  });
  console.log(`  Translating ${weapons.length} weapon profiles...`);

  let weaponHit = 0;
  let keywordHit = 0;
  const BATCH = 500;

  for (let i = 0; i < weapons.length; i += BATCH) {
    const batch = weapons.slice(i, i + BATCH);
    await Promise.all(
      batch.map((w) => {
        const nameJa = WEAPON_NAME_MAP[w.name]
          ?? Object.entries(WEAPON_NAME_MAP).find(([k]) => k.toLowerCase() === w.name.toLowerCase())?.[1]
          ?? null;
        const keywordsJa = translateKeywords(w.keywords);
        if (nameJa) weaponHit++;
        if (keywordsJa) keywordHit++;
        if (!nameJa && !keywordsJa) return Promise.resolve();
        return prisma.unitWeaponProfile.update({
          where: { id: w.id },
          data: { nameJa, keywordsJa },
        });
      })
    );
  }
  console.log(`  ✅ Weapon names translated: ${weaponHit}/${weapons.length}`);
  console.log(`  ✅ Weapon keywords translated: ${keywordHit}/${weapons.length}`);

  // アビリティの翻訳
  const abilities = await prisma.unitAbility.findMany({
    select: { id: true, name: true },
  });
  console.log(`\n  Translating ${abilities.length} abilities...`);

  let abilityHit = 0;
  for (let i = 0; i < abilities.length; i += BATCH) {
    const batch = abilities.slice(i, i + BATCH);
    await Promise.all(
      batch.map((a) => {
        const nameJa = ABILITY_NAME_MAP[a.name] ?? null;
        if (!nameJa) return Promise.resolve();
        abilityHit++;
        return prisma.unitAbility.update({
          where: { id: a.id },
          data: { nameJa },
        });
      })
    );
  }
  console.log(`  ✅ Ability names translated: ${abilityHit}/${abilities.length}`);

  // 未翻訳の固有名を上位20件出力（辞書拡充の参考に）
  const untranslatedWeapons = weapons
    .filter((w) => !WEAPON_NAME_MAP[w.name])
    .reduce<Record<string, number>>((acc, w) => {
      acc[w.name] = (acc[w.name] ?? 0) + 1;
      return acc;
    }, {});
  const top20Weapons = Object.entries(untranslatedWeapons)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20);

  console.log("\n  📋 未翻訳の武器名（出現頻度上位20件）:");
  for (const [name, count] of top20Weapons) {
    console.log(`     ${count}x  ${name}`);
  }

  const untranslatedAbilities = abilities
    .filter((a) => !ABILITY_NAME_MAP[a.name])
    .reduce<Record<string, number>>((acc, a) => {
      acc[a.name] = (acc[a.name] ?? 0) + 1;
      return acc;
    }, {});
  const top20Abilities = Object.entries(untranslatedAbilities)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20);

  console.log("\n  📋 未翻訳のアビリティ名（出現頻度上位20件）:");
  for (const [name, count] of top20Abilities) {
    console.log(`     ${count}x  ${name}`);
  }

  console.log("\n🎉 Translation seeding done.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
