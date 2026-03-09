// src/app/wh40k/aeldari/data.ts
// アエルダリ（クラフトワールド）全ユニットデータ
// 出典：Wahapedia / BSData wh40k-10e / Codex: Aeldari (2025)
// ⚠ Legends・Forge World・Ynnari・ハーレクインは別途管理

import type { AeldariUnit } from "./types";

export const AELDARI_UNITS: AeldariUnit[] = [

  // ════════════════════════════════════════════════════════════════════════════
  // ■ HQ ─ キャラクター
  // ════════════════════════════════════════════════════════════════════════════

  {
    id: "avatar_of_khaine",
    name: "Avatar of Khaine",
    nameJa: "アヴァター・オヴ・カイン",
    pts: 280,
    role: "HQ",
    categories: ["Monster", "Character", "Epic Hero", "Daemon", "Avatar of Khaine"],
    stats: { M: '10"', T: 11, Sv: "2+", W: 14, Ld: "6+", OC: 5 },
    invuln: "4+",
    weapons: [
      {
        name: "The Wailing Doom (Ranged)", nameJa: "嘆きの破滅（射撃）",
        type: "Ranged", range: '12"', A: 1, skill: "2+", S: 16, AP: -4, D: "D6+2",
        abilities: ["Sustained Hits D3"],
      },
      {
        name: "The Wailing Doom – strike", nameJa: "嘆きの破滅（打撃）",
        type: "Melee", range: "Melee", A: 6, skill: "2+", S: 16, AP: -4, D: "D6+2",
        abilities: [],
      },
      {
        name: "The Wailing Doom – sweep", nameJa: "嘆きの破滅（薙ぎ払い）",
        type: "Melee", range: "Melee", A: 12, skill: "2+", S: 8, AP: -2, D: 2,
        abilities: [],
      },
    ],
    abilities: [
      {
        name: "Molten Form", nameJa: "溶融の形態",
        desc: "このモデルに攻撃が割り当てられるたびに、その攻撃のダメージ値を半分にする。",
      },
      {
        name: "The Bloody-Handed (Aura)", nameJa: "血塗られた手（オーラ）",
        desc: "このモデルの6インチ以内にいる友軍アエルダリユニットのアドバンスロールとチャージロールに+1。",
      },
    ],
    keywords: ["Monster", "Character", "Epic Hero", "Daemon", "Avatar of Khaine"],
    fluff: "ケインの血塗られた怒りが具現化した戦争の神。圧倒的な力と殺意でアエルダリ軍を率いる戦神。ウーンド1〜5では命中ロールに-1のペナルティを受ける。",
  },

  {
    id: "autarch",
    name: "Autarch",
    nameJa: "アウターク",
    pts: 85,
    role: "HQ",
    categories: ["Character", "Infantry", "Grenades", "Autarch"],
    stats: { M: '7"', T: 3, Sv: "3+", W: 4, Ld: "6+", OC: 1 },
    invuln: "4+",
    weapons: [
      {
        name: "Shuriken Pistol", nameJa: "シュリケン・ピストル",
        type: "Ranged", range: '12"', A: 1, skill: "2+", S: 4, AP: -1, D: 1,
        abilities: ["Assault", "Pistol"],
      },
      {
        name: "Star Glaive", nameJa: "スターグレイブ",
        type: "Melee", range: "Melee", A: 4, skill: "2+", S: 6, AP: -3, D: 3,
        abilities: [],
      },
    ],
    abilities: [
      {
        name: "Superlative Strategist", nameJa: "卓越した戦略家",
        desc: "このモデルがユニットをリードしている間、そのユニットのアドバンスロールをリロールでき、アジャイルマヌーバー実行中のいかなるロールもリロールできる。",
      },
      {
        name: "Path of Command", nameJa: "コマンドのパス",
        desc: "各バトルラウンドに1回、このモデルのユニットがストラタジェムの対象になった際、そのストラタジェムのCPコストを1CPだけ減らすことができる。",
      },
    ],
    keywords: ["Infantry", "Character", "Aeldari", "Grenades", "Autarch"],
    fluff: "複数のアスペクト神殿の道を極めた戦士の頂点。豊富な武装オプションを持ち、あらゆる兵科ユニットのリーダーを務める汎用指揮官。",
  },

  {
    id: "autarch_wayleaper",
    name: "Autarch Wayleaper",
    nameJa: "アウターク・ウェイリーパー",
    pts: 80,
    role: "HQ",
    categories: ["Character", "Infantry", "Jump Pack", "Fly", "Grenades", "Autarch Wayleaper"],
    stats: { M: '14"', T: 3, Sv: "3+", W: 4, Ld: "6+", OC: 1 },
    invuln: "4+",
    weapons: [
      {
        name: "Shuriken Pistol", nameJa: "シュリケン・ピストル",
        type: "Ranged", range: '12"', A: 1, skill: "2+", S: 4, AP: -1, D: 1,
        abilities: ["Assault", "Pistol"],
      },
      {
        name: "Star Glaive", nameJa: "スターグレイブ",
        type: "Melee", range: "Melee", A: 4, skill: "2+", S: 6, AP: -3, D: 3,
        abilities: [],
      },
    ],
    abilities: [
      {
        name: "Deep Strike", nameJa: "ディープストライク",
        desc: "このモデルはデプロイメント時に戦略的予備として配置でき、移動フェイズに戦場の任意の地点（敵から9インチ超）に降下できる。",
      },
      {
        name: "Indomitable Strength of Will", nameJa: "不屈の意志の力",
        desc: "このモデルがユニットをリードしている間、バトルフォーカストークンを使用してアジャイルマヌーバーを行うたびD6を振る。3+でトークンを1つ回収する。",
      },
    ],
    keywords: ["Infantry", "Character", "Jump Pack", "Fly", "Grenades", "Autarch Wayleaper"],
    fluff: "ジャンプパックを装備しウェブウェイを跳躍するオーターク。ワープスパイダーやスウーピングホークを率いて奇襲を仕掛ける高機動指揮官。",
  },

  {
    id: "eldrad_ulthran",
    name: "Eldrad Ulthran",
    nameJa: "エルドラド・ウルスラーン",
    pts: 120,
    role: "HQ",
    categories: ["Character", "Infantry", "Epic Hero", "Psyker", "Farseer", "Eldrad Ulthran"],
    stats: { M: '7"', T: 3, Sv: "6+", W: 5, Ld: "5+", OC: 1 },
    invuln: "4+",
    weapons: [
      {
        name: "Mind War", nameJa: "精神の戦い",
        type: "Ranged", range: '18"', A: 1, skill: "2+", S: 6, AP: -3, D: 3,
        abilities: ["Psychic", "Precision"],
      },
      {
        name: "Staff of Ulthamar", nameJa: "ウルサマーのスタッフ",
        type: "Melee", range: "Melee", A: 4, skill: "2+", S: 5, AP: -1, D: 2,
        abilities: ["Psychic"],
      },
    ],
    abilities: [
      {
        name: "Branching Fates (Psychic)", nameJa: "分岐する運命（サイキック）",
        desc: "このモデルがユニットをリードしている間、フェイズに1回、そのユニットのヒットロール・ウーンドロール・ダメージロールの1つを未修正の6に変更できる。",
      },
      {
        name: "Doom (Psychic)", nameJa: "ドゥーム（サイキック）",
        desc: "移動フェイズ終了時、18インチ以内の視認可能な敵ユニット1体を選択。次のコマンドフェイズ開始まで、そのユニットへの友軍アエルダリの攻撃のウーンドロールに+1。",
      },
      {
        name: "Guide (Psychic)", nameJa: "ガイド（サイキック）",
        desc: "移動フェイズ終了時、18インチ以内の視認可能な敵ユニット1体を選択。次のコマンドフェイズ開始まで、そのユニットへの友軍アエルダリの攻撃のヒットロールに+1。各ユニットは1ターンに1回のみ選択可。",
      },
    ],
    keywords: ["Infantry", "Character", "Epic Hero", "Psyker", "Farseer", "Eldrad Ulthran"],
    fluff: "銀河最強の予言者。ウルサンの道を極め、数十万年先の未来をも見通す。ウルサマーのスタッフで精神の戦いを仕掛け、三つのサイキックパワーで戦場を支配する。",
  },

  {
    id: "farseer",
    name: "Farseer",
    nameJa: "ファーシーア",
    pts: 90,
    role: "HQ",
    categories: ["Character", "Infantry", "Psyker", "Farseer"],
    stats: { M: '7"', T: 3, Sv: "6+", W: 4, Ld: "5+", OC: 1 },
    invuln: "4+",
    weapons: [
      {
        name: "Singing Spear", nameJa: "シンギングスピア（射撃）",
        type: "Ranged", range: '12"', A: 1, skill: "2+", S: 9, AP: 0, D: 3,
        abilities: ["Psychic"],
      },
      {
        name: "Singing Spear", nameJa: "シンギングスピア（近接）",
        type: "Melee", range: "Melee", A: 4, skill: "2+", S: 3, AP: 0, D: 1,
        abilities: ["Psychic"],
      },
    ],
    abilities: [
      {
        name: "Guide (Psychic)", nameJa: "ガイド（サイキック）",
        desc: "移動フェイズ終了時、18インチ以内の視認可能な敵ユニット1体を選択。次のコマンドフェイズ開始まで、そのユニットへの友軍アエルダリのヒットロールに+1。",
      },
      {
        name: "Doom (Psychic)", nameJa: "ドゥーム（サイキック）",
        desc: "移動フェイズ終了時、18インチ以内の視認可能な敵ユニット1体を選択。次のコマンドフェイズ開始まで、そのユニットへの友軍アエルダリのウーンドロールに+1。",
      },
    ],
    keywords: ["Infantry", "Character", "Psyker", "Farseer"],
    fluff: "ウルスィアの道を歩む予言者。可能性の波を読み敵の動きを予知し、ガイドとドゥームで戦場全体に影響を及ぼすアエルダリ軍の知的支柱。",
  },

  {
    id: "farseer_skyrunner",
    name: "Farseer Skyrunner",
    nameJa: "ファーシーア・スカイランナー",
    pts: 110,
    role: "HQ",
    categories: ["Character", "Mounted", "Psyker", "Fly", "Farseer Skyrunner"],
    stats: { M: '14"', T: 4, Sv: "3+", W: 5, Ld: "5+", OC: 2 },
    invuln: "4+",
    weapons: [
      {
        name: "Singing Spear", nameJa: "シンギングスピア（射撃）",
        type: "Ranged", range: '12"', A: 1, skill: "2+", S: 9, AP: 0, D: 3,
        abilities: ["Psychic"],
      },
      {
        name: "Twin Shuriken Catapult", nameJa: "ツイン・シュリケン・カタパルト",
        type: "Ranged", range: '18"', A: 4, skill: "2+", S: 4, AP: -1, D: 1,
        abilities: ["Assault", "Twin-linked"],
      },
      {
        name: "Singing Spear", nameJa: "シンギングスピア（近接）",
        type: "Melee", range: "Melee", A: 4, skill: "2+", S: 3, AP: 0, D: 1,
        abilities: ["Psychic"],
      },
    ],
    abilities: [
      {
        name: "Guide (Psychic)", nameJa: "ガイド（サイキック）",
        desc: "移動フェイズ終了時、18インチ以内の視認可能な敵ユニット1体を選択。次のコマンドフェイズ開始まで、そのユニットへの友軍アエルダリのヒットロールに+1。",
      },
      {
        name: "Doom (Psychic)", nameJa: "ドゥーム（サイキック）",
        desc: "移動フェイズ終了時、18インチ以内の視認可能な敵ユニット1体を選択。次のコマンドフェイズ開始まで、そのユニットへの友軍アエルダリのウーンドロールに+1。",
      },
    ],
    keywords: ["Mounted", "Character", "Psyker", "Fly", "Farseer Skyrunner"],
    fluff: "ジェットバイクに乗ったファーシーア。高い機動性でウィンドライダー部隊を率いながら戦場全体に予知の力を及ぼす。",
  },

  {
    id: "spiritseer",
    name: "Spiritseer",
    nameJa: "スピリットシーア",
    pts: 60,
    role: "HQ",
    categories: ["Character", "Infantry", "Psyker", "Spiritseer"],
    stats: { M: '7"', T: 3, Sv: "6+", W: 3, Ld: "5+", OC: 1 },
    weapons: [
      {
        name: "Witch Staff", nameJa: "ウィッチスタッフ",
        type: "Melee", range: "Melee", A: 3, skill: "3+", S: 4, AP: -1, D: 2,
        abilities: ["Psychic"],
      },
    ],
    abilities: [
      {
        name: "Spirit Mark", nameJa: "スピリットマーク",
        desc: "コマンドフェイズに18インチ以内の敵ユニット1体を選択。次のコマンドフェイズ開始まで、そのユニットへの友軍レイスコンストラクトの近接攻撃のヒットロールに+1。",
      },
      {
        name: "Revive", nameJa: "リバイブ",
        desc: "コマンドフェイズに6インチ以内の友軍レイスコンストラクト1ユニットを選択。そのユニットはD3のウーンドを回復する。",
      },
    ],
    keywords: ["Infantry", "Character", "Psyker", "Spiritseer"],
    fluff: "死者の魂と交信する特殊なシーア。レイスコンストラクトとの霊的絆を持ち、レイス部隊を指揮する際に真価を発揮する。スピリットシーアと共に戦うレイスブレードは特に強力。",
  },

  {
    id: "warlock",
    name: "Warlock",
    nameJa: "ウォーロック",
    pts: 45,
    role: "HQ",
    categories: ["Character", "Infantry", "Psyker", "Warlock"],
    stats: { M: '7"', T: 3, Sv: "6+", W: 2, Ld: "5+", OC: 1 },
    weapons: [
      {
        name: "Singing Spear", nameJa: "シンギングスピア",
        type: "Ranged", range: '12"', A: 1, skill: "3+", S: 9, AP: 0, D: 3,
        abilities: ["Psychic"],
      },
      {
        name: "Witchblade", nameJa: "ウィッチブレード",
        type: "Melee", range: "Melee", A: 3, skill: "3+", S: 3, AP: -1, D: 1,
        abilities: ["Psychic"],
      },
    ],
    abilities: [
      {
        name: "Runes of Battle (Conceal)", nameJa: "バトルのルーン（隠蔽）",
        desc: "このモデルがユニットをリードしている間、そのユニットの受けるヒットロールに-1の修正を加える。",
      },
      {
        name: "Runes of Battle (Embolden)", nameJa: "バトルのルーン（鼓舞）",
        desc: "このモデルがユニットをリードしている間、そのユニットはバトルショックテストを自動的に通過する。",
      },
    ],
    keywords: ["Infantry", "Character", "Psyker", "Warlock"],
    fluff: "ウルスィアの道に足を踏み入れた若きシーア。ガーディアンやアスペクト戦士に付き従い、バトルのルーンで仲間を強化する。",
  },

  {
    id: "warlock_skyrunner",
    name: "Warlock Skyrunner",
    nameJa: "ウォーロック・スカイランナー",
    pts: 55,
    role: "HQ",
    categories: ["Character", "Mounted", "Psyker", "Fly", "Warlock Skyrunner"],
    stats: { M: '14"', T: 4, Sv: "3+", W: 3, Ld: "5+", OC: 2 },
    weapons: [
      {
        name: "Twin Shuriken Catapult", nameJa: "ツイン・シュリケン・カタパルト",
        type: "Ranged", range: '18"', A: 4, skill: "3+", S: 4, AP: -1, D: 1,
        abilities: ["Assault", "Twin-linked"],
      },
      {
        name: "Witchblade", nameJa: "ウィッチブレード",
        type: "Melee", range: "Melee", A: 3, skill: "3+", S: 3, AP: -1, D: 1,
        abilities: ["Psychic"],
      },
    ],
    abilities: [
      {
        name: "Runes of Battle (Conceal)", nameJa: "バトルのルーン（隠蔽）",
        desc: "このモデルがユニットをリードしている間、そのユニットの受けるヒットロールに-1の修正を加える。",
      },
      {
        name: "Runes of Battle (Embolden)", nameJa: "バトルのルーン（鼓舞）",
        desc: "このモデルがユニットをリードしている間、そのユニットはバトルショックテストを自動的に通過する。",
      },
    ],
    keywords: ["Mounted", "Character", "Psyker", "Fly", "Warlock Skyrunner"],
    fluff: "ジェットバイクに乗ったウォーロック。ウィンドライダー部隊と共に高速移動しながらサイキックの加護を与える。",
  },

  {
    id: "prince_yriel",
    name: "Prince Yriel",
    nameJa: "プリンス・イリエル",
    pts: 80,
    role: "HQ",
    categories: ["Character", "Infantry", "Epic Hero", "Fly", "Grenades", "Prince Yriel"],
    stats: { M: '7"', T: 3, Sv: "3+", W: 4, Ld: "6+", OC: 1 },
    invuln: "4+",
    weapons: [
      {
        name: "Eye of Wrath", nameJa: "怒りの眼",
        type: "Ranged", range: '12"', A: "D3", skill: "2+", S: 8, AP: -3, D: 2,
        abilities: ["Psychic", "Devastating Wounds"],
      },
      {
        name: "The Spear of Twilight", nameJa: "黄昏の槍",
        type: "Melee", range: "Melee", A: 5, skill: "2+", S: 6, AP: -3, D: 3,
        abilities: ["Devastating Wounds"],
      },
    ],
    abilities: [
      {
        name: "Yriel's Own", nameJa: "イリエル直属",
        desc: "このモデルが戦場にいる間、友軍アエルダリ・コルセアユニットへのストラタジェムのCPコストを1CP軽減する。",
      },
      {
        name: "Cursed", nameJa: "呪われた者",
        desc: "各ターン終了時、D3を振る。1の場合このモデルは1のモータルウーンドを受ける（セーブ不可）。",
      },
    ],
    keywords: ["Infantry", "Character", "Epic Hero", "Fly", "Grenades", "Prince Yriel"],
    fluff: "イリアサールのコルセアを率いた伝説の提督。黄昏の槍の呪いを背負いながら戦い続ける悲劇の英雄。コルセア部隊と相性抜群。",
  },

  // ════════════════════════════════════════════════════════════════════════════
  // ■ HQ ─ フェニックス・ロード
  // ════════════════════════════════════════════════════════════════════════════

  {
    id: "asurmen",
    name: "Asurmen",
    nameJa: "アシュルメン",
    pts: 125,
    role: "HQ",
    categories: ["Character", "Infantry", "Epic Hero", "Grenades", "Aspect Warrior", "Phoenix Lord", "Asurmen"],
    stats: { M: '7"', T: 3, Sv: "2+", W: 5, Ld: "6+", OC: 1 },
    invuln: "4+",
    weapons: [
      {
        name: "Bloody Twins", nameJa: "血染めの双銃",
        type: "Ranged", range: '24"', A: 6, skill: "2+", S: 5, AP: -1, D: 2,
        abilities: ["Assault"],
      },
      {
        name: "Sword of Asur", nameJa: "アスルの剣",
        type: "Melee", range: "Melee", A: 6, skill: "2+", S: 6, AP: -3, D: 3,
        abilities: ["Devastating Wounds"],
      },
    ],
    abilities: [
      {
        name: "Tactical Acumen", nameJa: "戦術的眼識",
        desc: "このモデルがユニットをリードしている間、射撃フェイズでそのユニットが射撃を終えた後、最大6インチの通常移動を行える。ただしそのターン中チャージ宣言はできない。",
      },
      {
        name: "Hand of Asuryan", nameJa: "アスルヤンの手",
        desc: "バトルに1回、射撃選択時に使用可。フェイズ終了まで、ブラッディツインズのダメージ値を3にし、[ANTI-INFANTRY 5+]と[DEVASTATING WOUNDS]を付与する。",
      },
    ],
    keywords: ["Infantry", "Character", "Epic Hero", "Grenades", "Aspect Warrior", "Phoenix Lord", "Asurmen"],
    fluff: "ダイア・アヴェンジャーズの始祖。すべてのアスペクト神殿の父とも呼ばれる最初のフェニックス・ロード。ブラッディツインズで敵歩兵を薙ぎ払う。",
  },

  {
    id: "baharroth",
    name: "Baharroth",
    nameJa: "バハロス",
    pts: 140,
    role: "HQ",
    categories: ["Character", "Infantry", "Epic Hero", "Jump Pack", "Fly", "Grenades", "Aspect Warrior", "Phoenix Lord", "Baharroth"],
    stats: { M: '14"', T: 3, Sv: "2+", W: 5, Ld: "6+", OC: 1 },
    invuln: "4+",
    weapons: [
      {
        name: "Fury of the Tempest", nameJa: "嵐の猛威",
        type: "Ranged", range: '24"', A: 4, skill: "2+", S: 6, AP: -1, D: 2,
        abilities: ["Assault", "Lethal Hits"],
      },
      {
        name: "Shining Blade", nameJa: "輝く刃",
        type: "Melee", range: "Melee", A: 6, skill: "2+", S: 5, AP: -2, D: 2,
        abilities: ["Sustained Hits 1"],
      },
    ],
    abilities: [
      {
        name: "Cloudstrider", nameJa: "雲の歩者",
        desc: "このモデルがユニットをリードしている間、相手ターン終了時にエンゲージメント外なら戦略的予備に戻れる。また、ディープストライクで配置した場合、移動フェイズに敵から6インチ超の任意の位置に配置し直せる。",
      },
      {
        name: "Death is Not Enough", nameJa: "死では不十分",
        desc: "射撃フェイズに射撃後、命中した敵ユニット（モンスター・ヴィークル除く）1体はバトルショックテストを受けなければならない。そのユニットのモデルが破壊されていれば-1の修正。",
      },
    ],
    keywords: ["Infantry", "Character", "Epic Hero", "Jump Pack", "Fly", "Grenades", "Aspect Warrior", "Phoenix Lord", "Baharroth"],
    fluff: "スウーピングホークスの始祖。风を呼び嵐を操り、ジャンプパックで戦場を自在に翔ける。その速度は敵の目に見えないほどだと言われる。",
  },

  {
    id: "fuegan",
    name: "Fuegan",
    nameJa: "フューガン",
    pts: 130,
    role: "HQ",
    categories: ["Character", "Infantry", "Epic Hero", "Grenades", "Aspect Warrior", "Phoenix Lord", "Fuegan"],
    stats: { M: '7"', T: 4, Sv: "2+", W: 6, Ld: "6+", OC: 1 },
    invuln: "4+",
    weapons: [
      {
        name: "Fire Axe", nameJa: "ファイアーアックス",
        type: "Melee", range: "Melee", A: 5, skill: "2+", S: 10, AP: -4, D: "D3+2",
        abilities: [],
      },
      {
        name: "Firepike", nameJa: "ファイアーパイク",
        type: "Ranged", range: '18"', A: 1, skill: "2+", S: 9, AP: -4, D: "D6",
        abilities: ["Assault", "Melta 4"],
      },
    ],
    abilities: [
      {
        name: "The Burning Blood", nameJa: "燃える血",
        desc: "このモデルがウーンドを受けるたびに、ターン終了時まで近接攻撃の攻撃回数が1増加する（最大+3まで）。",
      },
      {
        name: "Will Not Die", nameJa: "死に抗う意志",
        desc: "コマンドフェイズに、このモデルが1体以上のウーンドを失っている場合、D3を振る。2+でD3のウーンドを回復する。",
      },
    ],
    keywords: ["Infantry", "Character", "Epic Hero", "Grenades", "Aspect Warrior", "Phoenix Lord", "Fuegan"],
    fluff: "ファイアードラゴンズの始祖。傷を受けるほど燃え上がる戦士。ファイアーパイクとファイアーアックスで重装甲を溶かし、戦いが終わるまで決して倒れない。",
  },

  {
    id: "jain_zar",
    name: "Jain Zar",
    nameJa: "ジェイン・ザール",
    pts: 120,
    role: "HQ",
    categories: ["Character", "Infantry", "Epic Hero", "Grenades", "Aspect Warrior", "Phoenix Lord", "Jain Zar"],
    stats: { M: '8"', T: 3, Sv: "2+", W: 5, Ld: "6+", OC: 1 },
    invuln: "4+",
    weapons: [
      {
        name: "Shuriken Pistol", nameJa: "シュリケン・ピストル",
        type: "Ranged", range: '12"', A: 1, skill: "2+", S: 4, AP: -1, D: 1,
        abilities: ["Assault", "Pistol"],
      },
      {
        name: "The Silent Death", nameJa: "沈黙の死",
        type: "Melee", range: "Melee", A: 8, skill: "2+", S: 5, AP: -2, D: 1,
        abilities: ["Sustained Hits 1", "Anti-Infantry 3+"],
      },
      {
        name: "Blade of Destruction", nameJa: "破壊の刃",
        type: "Melee", range: "Melee", A: 5, skill: "2+", S: 6, AP: -3, D: 2,
        abilities: [],
      },
    ],
    abilities: [
      {
        name: "Disarming Strike", nameJa: "武装解除の一撃",
        desc: "各戦闘フェイズに1回、このモデルの攻撃で未修正6のヒットが出た場合、その攻撃の対象は次の射撃フェイズに射撃できない（ヴィークル・モンスター除く）。",
      },
      {
        name: "War Shout", nameJa: "戦の叫び",
        desc: "このモデルがユニットをリードしている間、そのユニットはFights First能力を持つ。また、敵ユニットに突撃された際、オーバーウォッチの攻撃回数が倍になる。",
      },
    ],
    keywords: ["Infantry", "Character", "Epic Hero", "Grenades", "Aspect Warrior", "Phoenix Lord", "Jain Zar"],
    fluff: "ハウリング・バンシーズの始祖。恐怖の叫び声で敵を凍り付かせ、沈黙の死と破壊の刃で嵐のように斬り裂く。最速のフェニックス・ロードと称される。",
  },

  {
    id: "maugan_ra",
    name: "Maugan Ra",
    nameJa: "モウガン・ラー",
    pts: 145,
    role: "HQ",
    categories: ["Character", "Infantry", "Epic Hero", "Grenades", "Aspect Warrior", "Phoenix Lord", "Maugan Ra"],
    stats: { M: '6"', T: 3, Sv: "2+", W: 5, Ld: "6+", OC: 1 },
    invuln: "4+",
    weapons: [
      {
        name: "The Maugetar (Ranged)", nameJa: "モーゲタール（射撃）",
        type: "Ranged", range: '48"', A: 4, skill: "2+", S: 8, AP: -2, D: 2,
        abilities: ["Heavy", "Ignores Cover"],
      },
      {
        name: "The Maugetar (Melee)", nameJa: "モーゲタール（近接）",
        type: "Melee", range: "Melee", A: 5, skill: "2+", S: 8, AP: -2, D: 2,
        abilities: [],
      },
    ],
    abilities: [
      {
        name: "Harvest of Souls", nameJa: "魂の収穫",
        desc: "射撃フェイズにこのモデルが攻撃を行うたびに、敵ユニットを破壊した場合、このユニットは2+でD3のウーンドを回復する。",
      },
      {
        name: "The Reaper's Gaze", nameJa: "死神の眼差し",
        desc: "このモデルがユニットをリードしている間、そのユニットの射撃攻撃は-1のヒットロール修正を無視する。",
      },
    ],
    keywords: ["Infantry", "Character", "Epic Hero", "Grenades", "Aspect Warrior", "Phoenix Lord", "Maugan Ra"],
    fluff: "ダーク・リーパーズの始祖。アンドーン神殿の生き残りとして死の道を歩む。超長射程モーゲタールで戦場の果てから正確無比に死を撒く。",
  },

  // ════════════════════════════════════════════════════════════════════════════
  // ■ Battleline
  // ════════════════════════════════════════════════════════════════════════════

  {
    id: "dire_avengers",
    name: "Dire Avengers",
    nameJa: "ダイア・アヴェンジャー",
    pts: 70,
    role: "Battleline",
    categories: ["Infantry", "Battleline", "Grenades", "Aspect Warrior", "Dire Avengers"],
    stats: { M: '7"', T: 3, Sv: "4+", W: 1, Ld: "6+", OC: 2 },
    weapons: [
      {
        name: "Avenger Shuriken Catapult", nameJa: "アヴェンジャー・シュリケン・カタパルト",
        type: "Ranged", range: '18"', A: 2, skill: "3+", S: 4, AP: -1, D: 1,
        abilities: ["Assault", "Twin-linked"],
      },
      {
        name: "Close Combat Weapon", nameJa: "近接武器",
        type: "Melee", range: "Melee", A: 2, skill: "3+", S: 3, AP: 0, D: 1,
        abilities: [],
      },
    ],
    abilities: [
      {
        name: "Bladestorm", nameJa: "ブレードストーム",
        desc: "このユニットが射撃を行う場合、ヒットロールが6の攻撃はAP値が-2になる。",
      },
    ],
    keywords: ["Infantry", "Battleline", "Grenades", "Aspect Warrior", "Dire Avengers"],
    fluff: "カハンドラス神殿のアスペクト戦士。シュリケン・カタパルトの精密射撃で敵を制圧する。5〜10体のユニット構成でエクサークが率いる。",
  },

  {
    id: "guardian_defenders",
    name: "Guardian Defenders",
    nameJa: "ガーディアン・ティフェンダー",
    pts: 80,
    role: "Battleline",
    categories: ["Infantry", "Battleline", "Grenades", "Guardians", "Guardian Defenders"],
    stats: { M: '7"', T: 3, Sv: "5+", W: 1, Ld: "6+", OC: 2 },
    weapons: [
      {
        name: "Shuriken Catapult", nameJa: "シュリケン・カタパルト",
        type: "Ranged", range: '12"', A: 2, skill: "4+", S: 4, AP: 0, D: 1,
        abilities: ["Assault"],
      },
      {
        name: "Heavy Weapon Platform", nameJa: "ヘヴィウェポン・プラットフォーム",
        type: "Ranged", range: '24"', A: 2, skill: "4+", S: 8, AP: -2, D: 2,
        abilities: ["Heavy"],
      },
    ],
    abilities: [
      {
        name: "Fleet of Foot", nameJa: "軽快な足取り",
        desc: "このユニットはバトルフォーカストークンを消費せずにフェード・バック・アジャイルマヌーバーを実行できる。",
      },
    ],
    keywords: ["Infantry", "Battleline", "Grenades", "Guardians", "Guardian Defenders"],
    fluff: "クラフトワールドの市民が武装した民兵部隊。ヘヴィウェポン・プラットフォームを持ち込み戦線を支える主力歩兵。10体1ユニット。",
  },

  {
    id: "storm_guardians",
    name: "Storm Guardians",
    nameJa: "ストーム・ガーディアン",
    pts: 65,
    role: "Battleline",
    categories: ["Infantry", "Battleline", "Grenades", "Guardians", "Storm Guardians"],
    stats: { M: '7"', T: 3, Sv: "5+", W: 1, Ld: "6+", OC: 2 },
    weapons: [
      {
        name: "Shuriken Pistol", nameJa: "シュリケン・ピストル",
        type: "Ranged", range: '12"', A: 1, skill: "4+", S: 4, AP: -1, D: 1,
        abilities: ["Assault", "Pistol"],
      },
      {
        name: "Close Combat Weapon", nameJa: "近接武器",
        type: "Melee", range: "Melee", A: 2, skill: "4+", S: 3, AP: 0, D: 1,
        abilities: [],
      },
    ],
    abilities: [
      {
        name: "Storm Assault", nameJa: "ストーム突撃",
        desc: "移動フェイズにこのユニットを選択した場合、アドバンスロールを行わずに移動値に+6インチして移動できる。そのターン中、射撃とチャージ宣言が可能。",
      },
    ],
    keywords: ["Infantry", "Battleline", "Grenades", "Guardians", "Storm Guardians"],
    fluff: "白兵戦に特化したガーディアン部隊。フレイマーや融合銃を2つ持ち込み、素早く前進して敵の中枢を突く。",
  },

  {
    id: "windriders",
    name: "Windriders",
    nameJa: "ウインドライダー",
    pts: 75,
    role: "Battleline",
    categories: ["Mounted", "Battleline", "Fly", "Windriders"],
    stats: { M: '14"', T: 4, Sv: "3+", W: 2, Ld: "6+", OC: 2 },
    weapons: [
      {
        name: "Twin Shuriken Catapult", nameJa: "ツイン・シュリケン・カタパルト",
        type: "Ranged", range: '18"', A: 4, skill: "4+", S: 4, AP: -1, D: 1,
        abilities: ["Assault", "Twin-linked"],
      },
      {
        name: "Close Combat Weapon", nameJa: "近接武器",
        type: "Melee", range: "Melee", A: 2, skill: "4+", S: 3, AP: 0, D: 1,
        abilities: [],
      },
    ],
    abilities: [
      {
        name: "Swooping Advance", nameJa: "急降下前進",
        desc: "このユニットのアドバンスロールに+2の修正を加える。",
      },
    ],
    keywords: ["Mounted", "Battleline", "Fly", "Windriders"],
    fluff: "ジェットバイクに乗ったアエルダリの機動部隊。シュリケンキャノンやエルダーミサイルランチャーへの換装も可能。3〜9体のユニット構成。",
  },

  {
    id: "corsair_voidreavers",
    name: "Corsair Voidreavers",
    nameJa: "コルセア・ヴォイドリーヴァー",
    pts: 70,
    role: "Battleline",
    categories: ["Infantry", "Battleline", "Anhrathe"],
    stats: { M: '7"', T: 3, Sv: "4+", W: 1, Ld: "6+", OC: 2 },
    weapons: [
      {
        name: "Shuriken Catapult", nameJa: "シュリケン・カタパルト",
        type: "Ranged", range: '12"', A: 2, skill: "4+", S: 4, AP: 0, D: 1,
        abilities: ["Assault"],
      },
      {
        name: "Close Combat Weapon", nameJa: "近接武器",
        type: "Melee", range: "Melee", A: 2, skill: "4+", S: 3, AP: 0, D: 1,
        abilities: [],
      },
    ],
    abilities: [
      {
        name: "Reckless Advance", nameJa: "無謀な前進",
        desc: "このユニットのアドバンスロールのサイコロ数を倍にし、その中の最も高い結果を使用する。",
      },
    ],
    keywords: ["Infantry", "Battleline", "Anhrathe", "Corsair Voidreavers"],
    fluff: "クラフトワールドとコモリアの狭間を生きるコルセア（海賊）の前衛部隊。規律よりも自由を尊ぶ荒々しい戦士たち。",
  },

  // ════════════════════════════════════════════════════════════════════════════
  // ■ Other ─ アスペクト戦士・特殊部隊
  // ════════════════════════════════════════════════════════════════════════════

  {
    id: "howling_banshees",
    name: "Howling Banshees",
    nameJa: "ハウリング・バンシー",
    pts: 80,
    role: "Other",
    categories: ["Infantry", "Grenades", "Aspect Warrior", "Howling Banshees"],
    stats: { M: '8"', T: 3, Sv: "4+", W: 1, Ld: "6+", OC: 1 },
    weapons: [
      {
        name: "Shuriken Pistol", nameJa: "シュリケン・ピストル",
        type: "Ranged", range: '12"', A: 1, skill: "3+", S: 4, AP: -1, D: 1,
        abilities: ["Assault", "Pistol"],
      },
      {
        name: "Banshee Blade", nameJa: "バンシーブレード",
        type: "Melee", range: "Melee", A: 3, skill: "3+", S: 4, AP: -1, D: 1,
        abilities: ["Anti-Infantry 3+"],
      },
    ],
    abilities: [
      {
        name: "Banshee Mask", nameJa: "バンシーマスク",
        desc: "このユニットが突撃した場合、突撃された敵ユニットはオーバーウォッチを行えず、ヒットのリロールもできない。",
      },
      {
        name: "Swift", nameJa: "俊足",
        desc: "このユニットの突撃ロールに+1。",
      },
    ],
    keywords: ["Infantry", "Grenades", "Aspect Warrior", "Howling Banshees"],
    fluff: "モラーリ神殿の戦士たち。恐怖の叫び声は敵を麻痺させ、高速移動と鋭いバンシーブレードで電光石火の斬撃を放つ近接特化の部隊。",
  },

  {
    id: "striking_scorpions",
    name: "Striking Scorpions",
    nameJa: "ストライキング・スコーピオン",
    pts: 85,
    role: "Other",
    categories: ["Infantry", "Grenades", "Aspect Warrior", "Striking Scorpions"],
    stats: { M: '7"', T: 3, Sv: "3+", W: 1, Ld: "6+", OC: 1 },
    weapons: [
      {
        name: "Shuriken Pistol", nameJa: "シュリケン・ピストル",
        type: "Ranged", range: '12"', A: 1, skill: "3+", S: 4, AP: -1, D: 1,
        abilities: ["Assault", "Pistol"],
      },
      {
        name: "Scorpion Chainsword", nameJa: "スコーピオン・チェーンソード",
        type: "Melee", range: "Melee", A: 4, skill: "3+", S: 4, AP: -1, D: 1,
        abilities: ["Sustained Hits 1"],
      },
    ],
    abilities: [
      {
        name: "Mandiblasters", nameJa: "マンディブラスター",
        desc: "各戦闘フェイズ開始時、このユニットがエンゲージメント内にいる場合、D6を振る。5+で敵ユニット1体に1のモータルウーンドを与える。",
      },
      {
        name: "Infiltrators, Scouts 7\", Stealth", nameJa: "潜入・スカウト7インチ・ステルス",
        desc: "ゲーム開始時にインフィルトレイターとして配置でき、バトル開始前に7インチの偵察移動を行える。射撃のヒットロールに-1の修正を受ける。",
      },
    ],
    keywords: ["Infantry", "Grenades", "Aspect Warrior", "Striking Scorpions"],
    fluff: "カエラ・メンシャのスコーピオン神殿の戦士。ステルス能力と素早い前進で敵の背後に回り込み、マンディブラスターで先制してチェーンソードで仕留める。",
  },

  {
    id: "warp_spiders",
    name: "Warp Spiders",
    nameJa: "ワープ・スパイダー",
    pts: 95,
    role: "Other",
    categories: ["Infantry", "Aspect Warrior", "Fly", "Warp Spiders"],
    stats: { M: '7"', T: 3, Sv: "3+", W: 1, Ld: "6+", OC: 1 },
    weapons: [
      {
        name: "Death Spinner", nameJa: "デス・スピナー",
        type: "Ranged", range: '12"', A: 4, skill: "3+", S: 6, AP: -1, D: 1,
        abilities: ["Twin-linked"],
      },
      {
        name: "Close Combat Weapon", nameJa: "近接武器",
        type: "Melee", range: "Melee", A: 2, skill: "3+", S: 3, AP: 0, D: 1,
        abilities: [],
      },
    ],
    abilities: [
      {
        name: "Warp Jump", nameJa: "ワープジャンプ",
        desc: "通常移動の代わりにワープジャンプを行える。9インチ移動し、2D6を振り1が出た場合このユニットに1のモータルウーンドを与える（セーブ不可）。",
      },
      {
        name: "Flickerjump", nameJa: "フリッカージャンプ",
        desc: "このユニットが射撃ターゲットになった際、4+で9インチ以内に再配置できる（エンゲージメント内の敵から1インチ超）。",
      },
    ],
    keywords: ["Infantry", "Aspect Warrior", "Fly", "Warp Spiders"],
    fluff: "イースイール神殿の戦士たちはウェブウェイを通じて瞬時に現れては消え、デス・スピナーの絹糸で敵を葬る。攪乱と奇襲の名手。",
  },

  {
    id: "swooping_hawks",
    name: "Swooping Hawks",
    nameJa: "スウィーピング・ホーク",
    pts: 75,
    role: "Other",
    categories: ["Infantry", "Grenades", "Aspect Warrior", "Jump Pack", "Fly", "Swooping Hawks"],
    stats: { M: '14"', T: 3, Sv: "4+", W: 1, Ld: "6+", OC: 1 },
    weapons: [
      {
        name: "Lasblaster", nameJa: "ラスブラスター",
        type: "Ranged", range: '24"', A: 3, skill: "3+", S: 4, AP: -1, D: 1,
        abilities: ["Assault"],
      },
      {
        name: "Close Combat Weapon", nameJa: "近接武器",
        type: "Melee", range: "Melee", A: 2, skill: "3+", S: 3, AP: 0, D: 1,
        abilities: [],
      },
    ],
    abilities: [
      {
        name: "Deep Strike", nameJa: "ディープストライク",
        desc: "このユニットはデプロイメント時に戦略的予備として配置でき、移動フェイズに任意の地点（敵から9インチ超）に降下できる。",
      },
      {
        name: "Skyleap", nameJa: "スカイリープ",
        desc: "移動フェイズに、このユニットは通常移動の代わりにスカイリープを行える。ユニットをゲームから取り除き、戦略的予備として配置し直す。",
      },
    ],
    keywords: ["Infantry", "Grenades", "Aspect Warrior", "Jump Pack", "Fly", "Swooping Hawks"],
    fluff: "タルスロン神殿の戦士たちは空から急降下し、ラスブラスターの閃光で敵を撃ちながら次の攻撃地点へと飛び去る。永遠の機動力を誇る。",
  },

  {
    id: "shining_spears",
    name: "Shining Spears",
    nameJa: "シャイニング・スピアー",
    pts: 120,
    role: "Other",
    categories: ["Mounted", "Grenades", "Aspect Warrior", "Fly", "Shining Spears"],
    stats: { M: '14"', T: 4, Sv: "3+", W: 2, Ld: "6+", OC: 2 },
    weapons: [
      {
        name: "Twin Shuriken Catapult", nameJa: "ツイン・シュリケン・カタパルト",
        type: "Ranged", range: '18"', A: 4, skill: "3+", S: 4, AP: -1, D: 1,
        abilities: ["Assault", "Twin-linked"],
      },
      {
        name: "Laser Lance", nameJa: "レーザーランス",
        type: "Melee", range: "Melee", A: 2, skill: "3+", S: 6, AP: -4, D: "D3",
        abilities: ["Lance"],
      },
    ],
    abilities: [
      {
        name: "Shimmershield", nameJa: "シマーシールド",
        desc: "このユニットは4+のインヴルネラブルセーブを持つ。",
      },
    ],
    keywords: ["Mounted", "Grenades", "Aspect Warrior", "Fly", "Shining Spears"],
    fluff: "アトハル神殿のジェットバイク騎士。光の槍（レーザーランス）を掲げて超高速で突撃し、突破後に再び空へと舞い上がる。",
  },

  {
    id: "fire_dragons",
    name: "Fire Dragons",
    nameJa: "ファイア・ドラゴン",
    pts: 80,
    role: "Other",
    categories: ["Infantry", "Grenades", "Aspect Warrior", "Fire Dragons"],
    stats: { M: '7"', T: 3, Sv: "4+", W: 1, Ld: "6+", OC: 1 },
    weapons: [
      {
        name: "Fusion Gun", nameJa: "フュージョン・ガン",
        type: "Ranged", range: '12"', A: 1, skill: "3+", S: 9, AP: -4, D: "D6",
        abilities: ["Assault", "Melta 3"],
      },
      {
        name: "Close Combat Weapon", nameJa: "近接武器",
        type: "Melee", range: "Melee", A: 2, skill: "3+", S: 3, AP: 0, D: 1,
        abilities: [],
      },
    ],
    abilities: [
      {
        name: "Tank Hunters", nameJa: "タンクハンター",
        desc: "このユニットのヴィークルとモンスターへの攻撃のウーンドロールをリロールできる。",
      },
    ],
    keywords: ["Infantry", "Grenades", "Aspect Warrior", "Fire Dragons"],
    fluff: "ヴァウル神殿の対装甲特化部隊。フュージョンガンの超熱線でどんな装甲も溶かし尽くす。5体での突撃はタイタン級の装甲ですら貫通する。",
  },

  {
    id: "rangers",
    name: "Rangers",
    nameJa: "レンジャー",
    pts: 75,
    role: "Other",
    categories: ["Infantry", "Grenades", "Rangers"],
    stats: { M: '7"', T: 3, Sv: "5+", W: 1, Ld: "6+", OC: 2 },
    weapons: [
      {
        name: "Ranger Long Rifle", nameJa: "レンジャー・ロングライフル",
        type: "Ranged", range: '36"', A: 1, skill: "3+", S: 5, AP: -2, D: 2,
        abilities: ["Precision", "Heavy"],
      },
      {
        name: "Close Combat Weapon", nameJa: "近接武器",
        type: "Melee", range: "Melee", A: 2, skill: "4+", S: 3, AP: 0, D: 1,
        abilities: [],
      },
    ],
    abilities: [
      {
        name: "Pathfinders", nameJa: "道先案内人",
        desc: "このユニットはInfiltrators、Scouts 7\"、Stealth能力を持つ。",
      },
      {
        name: "A Deadly Prize", nameJa: "致命的な賞",
        desc: "このユニットの射撃攻撃でキャラクタ―を倒した場合、相手のコマンドポイントを1CP減らす。",
      },
    ],
    keywords: ["Infantry", "Grenades", "Rangers"],
    fluff: "アウトキャストとして各地を放浪するアエルダリの狙撃手。潜入とステルスで敵の後方深くに侵入し、ロングライフルで指揮官を精密狙撃する。",
  },

  {
    id: "shroud_runners",
    name: "Shroud Runners",
    nameJa: "シュラウドランナー",
    pts: 75,
    role: "Other",
    categories: ["Mounted", "Fly", "Shroud Runners"],
    stats: { M: '14"', T: 4, Sv: "3+", W: 2, Ld: "6+", OC: 2 },
    weapons: [
      {
        name: "Twin Shuriken Catapult", nameJa: "ツイン・シュリケン・カタパルト",
        type: "Ranged", range: '18"', A: 4, skill: "4+", S: 4, AP: -1, D: 1,
        abilities: ["Assault", "Twin-linked"],
      },
      {
        name: "Ranger Long Rifle", nameJa: "レンジャー・ロングライフル",
        type: "Ranged", range: '36"', A: 1, skill: "3+", S: 5, AP: -2, D: 2,
        abilities: ["Precision", "Heavy"],
      },
      {
        name: "Close Combat Weapon", nameJa: "近接武器",
        type: "Melee", range: "Melee", A: 2, skill: "4+", S: 3, AP: 0, D: 1,
        abilities: [],
      },
    ],
    abilities: [
      {
        name: "Scouts 7\"", nameJa: "スカウト7インチ",
        desc: "バトル開始前に7インチの偵察移動を行える。",
      },
      {
        name: "Stealth", nameJa: "ステルス",
        desc: "このユニットへの射撃のヒットロールに-1の修正を加える。",
      },
    ],
    keywords: ["Mounted", "Fly", "Shroud Runners"],
    fluff: "ジェットバイクに乗ったレンジャー。高速移動とロングライフルの精密射撃を組み合わせた偵察特化部隊。オブジェクティブの早期確保に優れる。",
  },

  {
    id: "warlock_conclave",
    name: "Warlock Conclave",
    nameJa: "ウォーロック・コンクラーベ",
    pts: 55,
    role: "Other",
    categories: ["Infantry", "Psyker", "Warlock"],
    stats: { M: '7"', T: 3, Sv: "6+", W: 2, Ld: "5+", OC: 1 },
    weapons: [
      {
        name: "Witchblade", nameJa: "ウィッチブレード",
        type: "Melee", range: "Melee", A: 3, skill: "3+", S: 3, AP: -1, D: 1,
        abilities: ["Psychic"],
      },
    ],
    abilities: [
      {
        name: "Runes of Battle (Conceal)", nameJa: "バトルのルーン（隠蔽）",
        desc: "このユニットがユニットに合流している間、そのユニットへのヒットロールに-1。",
      },
      {
        name: "Runes of Battle (Embolden)", nameJa: "バトルのルーン（鼓舞）",
        desc: "このユニットがユニットに合流している間、そのユニットはバトルショックテストを自動通過する。",
      },
    ],
    keywords: ["Infantry", "Psyker", "Warlock"],
    fluff: "複数のウォーロックが集まった集団。サイキックの加護をユニットに与えながら戦場を行く。3体1ユニット。",
  },

  {
    id: "warlock_skyrunners",
    name: "Warlock Skyrunners",
    nameJa: "ウォーロック・スカイランナー",
    pts: 70,
    role: "Other",
    categories: ["Mounted", "Psyker", "Fly", "Warlock Skyrunner"],
    stats: { M: '14"', T: 4, Sv: "3+", W: 3, Ld: "5+", OC: 2 },
    weapons: [
      {
        name: "Twin Shuriken Catapult", nameJa: "ツイン・シュリケン・カタパルト",
        type: "Ranged", range: '18"', A: 4, skill: "3+", S: 4, AP: -1, D: 1,
        abilities: ["Assault", "Twin-linked"],
      },
      {
        name: "Witchblade", nameJa: "ウィッチブレード",
        type: "Melee", range: "Melee", A: 3, skill: "3+", S: 3, AP: -1, D: 1,
        abilities: ["Psychic"],
      },
    ],
    abilities: [
      {
        name: "Runes of Battle (Conceal)", nameJa: "バトルのルーン（隠蔽）",
        desc: "このユニットがリードしているユニットへのヒットロールに-1。",
      },
    ],
    keywords: ["Mounted", "Psyker", "Fly", "Warlock Skyrunner"],
    fluff: "ジェットバイクに乗ったウォーロックの集団。ウィンドライダーホストと組み合わせて高速移動しながらサイキック支援を行う。",
  },

  {
    id: "vypers",
    name: "Vypers",
    nameJa: "ヴァイパーズ",
    pts: 55,
    role: "Other",
    categories: ["Vehicle", "Fly", "Vyper"],
    stats: { M: '16"', T: 5, Sv: "4+", W: 5, Ld: "6+", OC: 2 },
    weapons: [
      {
        name: "Twin Shuriken Catapult", nameJa: "ツイン・シュリケン・カタパルト",
        type: "Ranged", range: '18"', A: 4, skill: "4+", S: 4, AP: -1, D: 1,
        abilities: ["Assault", "Twin-linked"],
      },
      {
        name: "Shuriken Cannon", nameJa: "シュリケン・キャノン（搭載）",
        type: "Ranged", range: '24"', A: 3, skill: "4+", S: 6, AP: -1, D: 1,
        abilities: [],
      },
      {
        name: "Close Combat Weapon", nameJa: "近接武器",
        type: "Melee", range: "Melee", A: 3, skill: "4+", S: 5, AP: 0, D: 1,
        abilities: [],
      },
    ],
    abilities: [
      {
        name: "Deadly Demise 1", nameJa: "致命的な死（1）",
        desc: "このモデルが破壊された場合、D6を振る。1の場合3インチ以内の各ユニットに1のモータルウーンドを与える。",
      },
    ],
    keywords: ["Vehicle", "Fly", "Vyper"],
    fluff: "軽量浮遊戦闘艇。低コストで高機動の偵察・支援ヴィークル。シュリケンキャノンやエルダーミサイルランチャーへの換装可能。1〜3体のユニット。",
  },

  {
    id: "corsair_voidscarred",
    name: "Corsair Voidscarred",
    nameJa: "コルセア・ヴォイドスカー",
    pts: 85,
    role: "Other",
    categories: ["Infantry", "Grenades", "Anhrathe", "Corsair Voidscarred"],
    stats: { M: '7"', T: 3, Sv: "4+", W: 2, Ld: "6+", OC: 1 },
    weapons: [
      {
        name: "Shuriken Pistol", nameJa: "シュリケン・ピストル",
        type: "Ranged", range: '12"', A: 1, skill: "3+", S: 4, AP: -1, D: 1,
        abilities: ["Assault", "Pistol"],
      },
      {
        name: "Corsair Sword", nameJa: "コルセアソード",
        type: "Melee", range: "Melee", A: 3, skill: "3+", S: 4, AP: -1, D: 1,
        abilities: [],
      },
    ],
    abilities: [
      {
        name: "Void Hearts", nameJa: "虚空の心",
        desc: "このユニットが戦場から後退した場合、D6を振り、その後退がかかった敵ユニットにそれぞれモータルウーンドを等しく与える可能性がある。",
      },
    ],
    keywords: ["Infantry", "Grenades", "Anhrathe", "Corsair Voidscarred"],
    fluff: "宇宙に生きるコルセアの精鋭部隊。様々な武装オプションを持ち、ヴォイドリーヴァーより強靭。ヴォイド・ドリームウォーカーやカーシスト（魔術師）を含む場合も。",
  },

  {
    id: "corsair_skyreavers",
    name: "Corsair Skyreavers",
    nameJa: "コルセア・スカイリーヴァー",
    pts: 75,
    role: "Other",
    categories: ["Infantry", "Grenades", "Fly", "Jump Pack", "Anhrathe"],
    stats: { M: '12"', T: 3, Sv: "4+", W: 2, Ld: "6+", OC: 1 },
    weapons: [
      {
        name: "Shuriken Pistol", nameJa: "シュリケン・ピストル",
        type: "Ranged", range: '12"', A: 1, skill: "3+", S: 4, AP: -1, D: 1,
        abilities: ["Assault", "Pistol"],
      },
      {
        name: "Corsair Sword", nameJa: "コルセアソード",
        type: "Melee", range: "Melee", A: 3, skill: "3+", S: 4, AP: -1, D: 1,
        abilities: [],
      },
    ],
    abilities: [
      {
        name: "Deep Strike", nameJa: "ディープストライク",
        desc: "このユニットは戦略的予備から降下できる（敵から9インチ超）。",
      },
    ],
    keywords: ["Infantry", "Grenades", "Fly", "Jump Pack", "Anhrathe"],
    fluff: "ジャンプパックで空を飛び回るコルセアの奇襲部隊。ウェブウェイから突然降下し、敵の弱点を突いて素早く離脱する。",
  },

  // ════════════════════════════════════════════════════════════════════════════
  // ■ Heavy ─ レイスコンストラクト・支援火器
  // ════════════════════════════════════════════════════════════════════════════

  {
    id: "wraithblades",
    name: "Wraithblades",
    nameJa: "レイスブレイド",
    pts: 90,
    role: "Heavy",
    categories: ["Infantry", "Wraith Construct", "Wraithblades"],
    stats: { M: '6"', T: 6, Sv: "3+", W: 3, Ld: "6+", OC: 1 },
    invuln: "5+",
    weapons: [
      {
        name: "Ghostaxe and Forceshield", nameJa: "ゴーストアックス＋フォースシールド",
        type: "Melee", range: "Melee", A: 3, skill: "3+", S: 7, AP: -2, D: 2,
        abilities: [],
      },
      {
        name: "Ghostsword x2", nameJa: "ゴーストソード×2",
        type: "Melee", range: "Melee", A: 4, skill: "3+", S: 5, AP: -2, D: 1,
        abilities: ["Twin-linked"],
      },
    ],
    abilities: [
      {
        name: "Fearsome Aspect", nameJa: "恐怖の相貌",
        desc: "このユニットの9インチ以内にいる敵ユニットはリーダーシップが-1される。",
      },
      {
        name: "Explodes", nameJa: "爆発",
        desc: "このモデルが破壊された場合D6を振る。1の場合3インチ以内の各ユニットに1のモータルウーンドを与える。",
      },
    ],
    keywords: ["Infantry", "Wraith Construct", "Wraithblades"],
    fluff: "死したアエルダリの魂が宿った戦闘コンストラクト。ゴーストアックス＋フォースシールド（5+インヴルネラブル付）か双ゴーストソードで戦う近接特化の恐怖の戦士。",
  },

  {
    id: "wraithguard",
    name: "Wraithguard",
    nameJa: "レイスガード",
    pts: 110,
    role: "Heavy",
    categories: ["Infantry", "Wraith Construct", "Wraithguard"],
    stats: { M: '6"', T: 6, Sv: "3+", W: 3, Ld: "6+", OC: 1 },
    weapons: [
      {
        name: "D-Scythe", nameJa: "Dサイズ",
        type: "Ranged", range: '8"', A: "D3+3", skill: "4+", S: 10, AP: -4, D: 1,
        abilities: ["Torrent", "Devastating Wounds"],
      },
      {
        name: "Wraithcannon", nameJa: "レイスキャノン",
        type: "Ranged", range: '12"', A: 1, skill: "4+", S: 14, AP: -4, D: "D3+3",
        abilities: ["Devastating Wounds"],
      },
      {
        name: "Close Combat Weapon", nameJa: "近接武器",
        type: "Melee", range: "Melee", A: 2, skill: "4+", S: 6, AP: 0, D: 1,
        abilities: [],
      },
    ],
    abilities: [
      {
        name: "Explodes", nameJa: "爆発",
        desc: "このモデルが破壊された場合D6を振る。1の場合3インチ以内の各ユニットに1のモータルウーンドを与える。",
      },
    ],
    keywords: ["Infantry", "Wraith Construct", "Wraithguard"],
    fluff: "レイスキャノンまたはDサイズを装備した超重武装コンストラクト。レイスキャノンの一撃はタイタン級の装甲すら引き裂き、Dサイズは数体を薙ぎ払う。5体1ユニット。",
  },

  {
    id: "wraithlord",
    name: "Wraithlord",
    nameJa: "レイスロード",
    pts: 130,
    role: "Heavy",
    categories: ["Monster", "Wraith Construct", "Wraithlord"],
    stats: { M: '8"', T: 10, Sv: "3+", W: 10, Ld: "6+", OC: 3 },
    weapons: [
      {
        name: "Bright Lance", nameJa: "ブライトランス",
        type: "Ranged", range: '36"', A: 1, skill: "3+", S: 12, AP: -3, D: "D6+2",
        abilities: ["Heavy", "Lance"],
      },
      {
        name: "Flamer", nameJa: "フレイマー",
        type: "Ranged", range: '12"', A: "D6", skill: "N/A", S: 4, AP: 0, D: 1,
        abilities: ["Ignores Cover", "Torrent"],
      },
      {
        name: "Ghostglaive", nameJa: "ゴーストグレイブ",
        type: "Melee", range: "Melee", A: 4, skill: "3+", S: 10, AP: -3, D: 3,
        abilities: [],
      },
    ],
    abilities: [
      {
        name: "Explodes", nameJa: "爆発",
        desc: "このモデルが破壊された場合D6を振る。4+の場合9インチ以内の各ユニットにD3のモータルウーンドを与える。",
      },
      {
        name: "Wraithlord Resilience", nameJa: "レイスロードの回復力",
        desc: "このモデルはターン終了時にD3のウーンドを回復する。",
      },
    ],
    keywords: ["Monster", "Wraith Construct", "Wraithlord"],
    fluff: "古代英雄の魂が宿る巨大なレイスコンストラクト。ブライトランス2門とフレイマー2門、ゴーストグレイブを装備可能。遠近両用の万能重兵器。",
  },

  {
    id: "wraithknight",
    name: "Wraithknight",
    nameJa: "レイスナイト",
    pts: 310,
    role: "Heavy",
    categories: ["Monster", "Titanic", "Fly", "Wraith Construct", "Wraithknight"],
    stats: { M: '12"', T: 12, Sv: "3+", W: 24, Ld: "6+", OC: 5 },
    invuln: "5+",
    weapons: [
      {
        name: "Heavy Wraithcannon x2", nameJa: "ヘヴィ・レイスキャノン×2",
        type: "Ranged", range: '24"', A: 2, skill: "3+", S: 14, AP: -4, D: "D6+4",
        abilities: ["Devastating Wounds"],
      },
      {
        name: "Suncannon", nameJa: "サンキャノン",
        type: "Ranged", range: '36"', A: "2D6", skill: "3+", S: 9, AP: -2, D: 3,
        abilities: ["Blast"],
      },
      {
        name: "Titanic Wraithglaive", nameJa: "タイタニック・レイスグレイブ",
        type: "Melee", range: "Melee", A: 5, skill: "3+", S: 16, AP: -4, D: "D6+6",
        abilities: ["Devastating Wounds"],
      },
    ],
    abilities: [
      {
        name: "Deadly Demise D6", nameJa: "致命的な死（D6）",
        desc: "このモデルが破壊された場合D6を振る。その値の分だけ6インチ以内の各ユニットにモータルウーンドを与える。",
      },
      {
        name: "Agile", nameJa: "機敏",
        desc: "このモデルはFly能力を持ち、移動時に他のモデルをまたぐことができる。",
      },
    ],
    keywords: ["Monster", "Titanic", "Fly", "Wraith Construct", "Wraithknight"],
    fluff: "アエルダリ最大の戦闘コンストラクト。T12・W24のタイタン級存在。ヘヴィレイスキャノン双連装またはサンキャノン＋レイスグレイブで戦場を蹂躙する。",
  },

  {
    id: "war_walkers",
    name: "War Walkers",
    nameJa: "ウォー・ウォーカーズ",
    pts: 85,
    role: "Heavy",
    categories: ["Vehicle", "Walker", "War Walker"],
    stats: { M: '8"', T: 6, Sv: "4+", W: 5, Ld: "6+", OC: 2 },
    weapons: [
      {
        name: "Scatter Laser", nameJa: "スキャッター・レーザー",
        type: "Ranged", range: '36"', A: 6, skill: "4+", S: 5, AP: 0, D: 1,
        abilities: ["Sustained Hits 1"],
      },
      {
        name: "Bright Lance", nameJa: "ブライトランス",
        type: "Ranged", range: '36"', A: 1, skill: "4+", S: 12, AP: -3, D: "D6+2",
        abilities: ["Heavy", "Lance"],
      },
      {
        name: "Close Combat Weapon", nameJa: "近接武器",
        type: "Melee", range: "Melee", A: 3, skill: "4+", S: 6, AP: 0, D: 1,
        abilities: [],
      },
    ],
    abilities: [
      {
        name: "Deadly Demise 1", nameJa: "致命的な死（1）",
        desc: "このモデルが破壊された場合D6を振る。1の場合3インチ以内の各ユニットに1のモータルウーンドを与える。",
      },
      {
        name: "Scout 7\"", nameJa: "スカウト7インチ",
        desc: "バトル開始前に7インチの偵察移動を行える。",
      },
    ],
    keywords: ["Vehicle", "Walker", "War Walker"],
    fluff: "1〜3体で編成される軽量二足歩行ヴィークル。スキャッターレーザーやブライトランスなど様々な武装を2門搭載できる多目的支援兵器。",
  },

  {
    id: "dark_reapers",
    name: "Dark Reapers",
    nameJa: "ダーク・リーパー",
    pts: 120,
    role: "Heavy",
    categories: ["Infantry", "Grenades", "Aspect Warrior", "Dark Reapers"],
    stats: { M: '6"', T: 3, Sv: "3+", W: 2, Ld: "6+", OC: 1 },
    weapons: [
      {
        name: "Reaper Launcher (Starshot)", nameJa: "リーパーランチャー（スターショット）",
        type: "Ranged", range: '48"', A: 1, skill: "3+", S: 10, AP: -2, D: 3,
        abilities: ["Heavy", "Ignores Cover"],
      },
      {
        name: "Reaper Launcher (Starswarm)", nameJa: "リーパーランチャー（スタースワーム）",
        type: "Ranged", range: '48"', A: 2, skill: "3+", S: 4, AP: -2, D: 1,
        abilities: ["Heavy", "Ignores Cover"],
      },
      {
        name: "Close Combat Weapon", nameJa: "近接武器",
        type: "Melee", range: "Melee", A: 2, skill: "3+", S: 3, AP: 0, D: 1,
        abilities: [],
      },
    ],
    abilities: [
      {
        name: "Inescapable Accuracy", nameJa: "不可避の精度",
        desc: "このユニットの射撃攻撃はカバーセーブを無視し、ヒットロールのマイナス修正を無視する。",
      },
    ],
    keywords: ["Infantry", "Grenades", "Aspect Warrior", "Dark Reapers"],
    fluff: "毘霊ムルヘドリン神殿の戦士。超長射程リーパーランチャーを装備し、スターショット（対ヴィークル）とスタースワーム（対歩兵）を状況に応じて使い分ける。",
  },

  {
    id: "d_cannon_platform",
    name: "D-cannon Platform",
    nameJa: "Dキャノン・プラットフォーム",
    pts: 70,
    role: "Heavy",
    categories: ["Infantry", "Support Weapon"],
    stats: { M: '4"', T: 3, Sv: "5+", W: 3, Ld: "6+", OC: 1 },
    weapons: [
      {
        name: "D-cannon", nameJa: "Dキャノン",
        type: "Ranged", range: '24"', A: 1, skill: "4+", S: 10, AP: -4, D: "D6+6",
        abilities: ["Heavy", "Devastating Wounds", "Blast"],
      },
      {
        name: "Close Combat Weapon", nameJa: "近接武器",
        type: "Melee", range: "Melee", A: 2, skill: "5+", S: 3, AP: 0, D: 1,
        abilities: [],
      },
    ],
    abilities: [
      {
        name: "Guardian Crew", nameJa: "ガーディアン操縦",
        desc: "ガーディアン・ディフェンダーズのユニットと一緒に配置可能。ユニット内で扱われる。",
      },
    ],
    keywords: ["Infantry", "Support Weapon", "D-cannon Platform"],
    fluff: "次元破壊を引き起こすDキャノンを搭載した砲兵プラットフォーム。高コストだが命中すれば次元消滅でいかなる装甲も消し去る。",
  },

  {
    id: "shadow_weaver_platform",
    name: "Shadow Weaver Platform",
    nameJa: "シャドウウィーヴァー・プラットフォーム",
    pts: 60,
    role: "Heavy",
    categories: ["Infantry", "Support Weapon"],
    stats: { M: '4"', T: 3, Sv: "5+", W: 3, Ld: "6+", OC: 1 },
    weapons: [
      {
        name: "Shadow Weaver", nameJa: "シャドウ・ウィーバー",
        type: "Ranged", range: '48"', A: "D6", skill: "4+", S: 7, AP: 0, D: 2,
        abilities: ["Heavy", "Indirect Fire", "Blast"],
      },
      {
        name: "Close Combat Weapon", nameJa: "近接武器",
        type: "Melee", range: "Melee", A: 2, skill: "5+", S: 3, AP: 0, D: 1,
        abilities: [],
      },
    ],
    abilities: [
      {
        name: "Monofilament Network", nameJa: "モノフィラメント・ネットワーク",
        desc: "このユニットの攻撃のウーンドロールが6の場合、そのダメージ値が2増加する。",
      },
    ],
    keywords: ["Infantry", "Support Weapon", "Shadow Weaver Platform"],
    fluff: "不可視の単分子フィラメント・ウェブを間接射撃で展開する支援砲兵。視線不要のインダイレクトファイアで遮蔽物の向こうの敵を絡め取る。",
  },

  {
    id: "vibro_cannon_platform",
    name: "Vibro Cannon Platform",
    nameJa: "ヴィブロキャノン・プラットフォーム",
    pts: 55,
    role: "Heavy",
    categories: ["Infantry", "Support Weapon"],
    stats: { M: '4"', T: 3, Sv: "5+", W: 3, Ld: "6+", OC: 1 },
    weapons: [
      {
        name: "Vibro Cannon", nameJa: "ヴィブロ・キャノン",
        type: "Ranged", range: '48"', A: 2, skill: "4+", S: 8, AP: -2, D: 2,
        abilities: ["Heavy"],
      },
      {
        name: "Close Combat Weapon", nameJa: "近接武器",
        type: "Melee", range: "Melee", A: 2, skill: "5+", S: 3, AP: 0, D: 1,
        abilities: [],
      },
    ],
    abilities: [
      {
        name: "Resonance Disruption", nameJa: "共鳴波破壊",
        desc: "同一ターンに複数のヴィブロ・キャノンが同一ユニットを射撃した場合、2門目以降の攻撃のセーブを1つまでリロールできない。",
      },
    ],
    keywords: ["Infantry", "Support Weapon", "Vibro Cannon Platform"],
    fluff: "振動波を発生させて装甲を共振破壊するエネルギー兵器。複数门で同一目標を狙うほど効果が増す。",
  },

  // ════════════════════════════════════════════════════════════════════════════
  // ■ Heavy ─ 航空機・飛行ヴィークル
  // ════════════════════════════════════════════════════════════════════════════

  {
    id: "fire_prism",
    name: "Fire Prism",
    nameJa: "ファイア・プリズム",
    pts: 150,
    role: "Heavy",
    categories: ["Vehicle", "Fly", "Fire Prism"],
    stats: { M: '14"', T: 9, Sv: "3+", W: 11, Ld: "6+", OC: 2 },
    invuln: "5+",
    weapons: [
      {
        name: "Prism Cannon (Dispersed)", nameJa: "プリズムキャノン（散射）",
        type: "Ranged", range: '60"', A: "2D6", skill: "3+", S: 7, AP: -1, D: 2,
        abilities: ["Blast", "Heavy"],
      },
      {
        name: "Prism Cannon (Focused)", nameJa: "プリズムキャノン（集束）",
        type: "Ranged", range: '60"', A: 1, skill: "3+", S: 12, AP: -4, D: "D6+4",
        abilities: ["Heavy", "Devastating Wounds"],
      },
      {
        name: "Twin Shuriken Catapult", nameJa: "ツイン・シュリケン・カタパルト",
        type: "Ranged", range: '18"', A: 4, skill: "3+", S: 4, AP: -1, D: 1,
        abilities: ["Assault", "Twin-linked"],
      },
    ],
    abilities: [
      {
        name: "Linked Fire", nameJa: "連結射撃",
        desc: "6インチ以内に友軍ファイアープリズムがいる場合、このモデルのプリズムキャノンは攻撃回数とSとAPが+1される。",
      },
      {
        name: "Deadly Demise D3", nameJa: "致命的な死（D3）",
        desc: "このモデルが破壊された場合D6を振る。4+の場合6インチ以内の各ユニットにD3のモータルウーンドを与える。",
      },
    ],
    keywords: ["Vehicle", "Fly", "Fire Prism"],
    fluff: "プリズム結晶で太陽光を増幅し、散弾または集束ビームに切り替えられる多目的主力戦車。アエルダリ機甲部隊の要。",
  },

  {
    id: "night_spinner",
    name: "Night Spinner",
    nameJa: "ナイトスピナー",
    pts: 120,
    role: "Heavy",
    categories: ["Vehicle", "Fly", "Night Spinner"],
    stats: { M: '14"', T: 9, Sv: "3+", W: 11, Ld: "6+", OC: 2 },
    invuln: "5+",
    weapons: [
      {
        name: "Doomweaver (Dispersed)", nameJa: "ドゥームウィーバー（散射）",
        type: "Ranged", range: '48"', A: "D6+3", skill: "3+", S: 7, AP: -2, D: 2,
        abilities: ["Heavy", "Indirect Fire", "Blast"],
      },
      {
        name: "Doomweaver (Focused)", nameJa: "ドゥームウィーバー（集束）",
        type: "Ranged", range: '48"', A: "D3+3", skill: "3+", S: 10, AP: -4, D: 2,
        abilities: ["Heavy", "Indirect Fire"],
      },
      {
        name: "Twin Shuriken Catapult", nameJa: "ツイン・シュリケン・カタパルト",
        type: "Ranged", range: '18"', A: 4, skill: "3+", S: 4, AP: -1, D: 1,
        abilities: ["Assault", "Twin-linked"],
      },
    ],
    abilities: [
      {
        name: "Monofilament Shroud", nameJa: "モノフィラメント・シュラウド",
        desc: "このユニットの攻撃のウーンドロールが6の場合、そのダメージ値が2増加する。",
      },
      {
        name: "Deadly Demise D3", nameJa: "致命的な死（D3）",
        desc: "このモデルが破壊された場合D6を振る。4+の場合6インチ以内の各ユニットにD3のモータルウーンドを与える。",
      },
    ],
    keywords: ["Vehicle", "Fly", "Night Spinner"],
    fluff: "間接射撃専門の単分子フィラメント砲台を搭載した砲撃支援戦車。ドゥームウィーバーで遮蔽物の向こうの敵を薙ぎ払う。",
  },

  {
    id: "falcon",
    name: "Falcon",
    nameJa: "ファルコン",
    pts: 145,
    role: "Heavy",
    categories: ["Vehicle", "Fly", "Transport", "Falcon"],
    stats: { M: '14"', T: 9, Sv: "3+", W: 12, Ld: "6+", OC: 3 },
    invuln: "5+",
    weapons: [
      {
        name: "Pulse Laser", nameJa: "パルスレーザー",
        type: "Ranged", range: '36"', A: 2, skill: "3+", S: 12, AP: -3, D: "D6+2",
        abilities: ["Heavy"],
      },
      {
        name: "Shuriken Cannon", nameJa: "シュリケン・キャノン",
        type: "Ranged", range: '24"', A: 3, skill: "3+", S: 6, AP: -1, D: 1,
        abilities: [],
      },
      {
        name: "Twin Shuriken Catapult", nameJa: "ツイン・シュリケン・カタパルト",
        type: "Ranged", range: '18"', A: 4, skill: "3+", S: 4, AP: -1, D: 1,
        abilities: ["Assault", "Twin-linked"],
      },
    ],
    abilities: [
      {
        name: "Transport Capacity", nameJa: "輸送能力",
        desc: "最大6体の歩兵モデルを輸送できる。",
      },
      {
        name: "Deadly Demise D3", nameJa: "致命的な死（D3）",
        desc: "このモデルが破壊された場合D6を振る。4+の場合6インチ以内の各ユニットにD3のモータルウーンドを与える。",
      },
    ],
    keywords: ["Vehicle", "Fly", "Transport", "Falcon"],
    fluff: "パルスレーザーとシュリケンキャノンを持つ強力な戦闘AFV兼輸送機。6体の歩兵を運びながら戦闘も担える攻防一体の多目的ホバータンク。",
  },

  {
    id: "hemlock_wraithfighter",
    name: "Hemlock Wraithfighter",
    nameJa: "ヘムロック・レイスファイター",
    pts: 165,
    role: "Heavy",
    categories: ["Vehicle", "Fly", "Aircraft", "Psyker", "Hemlock Wraithfighter"],
    stats: { M: '20"+', T: 8, Sv: "3+", W: 9, Ld: "6+", OC: 0 },
    invuln: "5+",
    weapons: [
      {
        name: "Heavy D-Scythe x2", nameJa: "ヘヴィDサイズ×2",
        type: "Ranged", range: '16"', A: "D3+3", skill: "3+", S: 10, AP: -4, D: 1,
        abilities: ["Torrent", "Devastating Wounds", "Twin-linked"],
      },
    ],
    abilities: [
      {
        name: "Hard to Hit", nameJa: "当てにくい",
        desc: "このモデルへの射撃攻撃のヒットロールに-1の修正を加える。",
      },
      {
        name: "Fearful Doom (Psychic)", nameJa: "恐怖の破滅（サイキック）",
        desc: "このモデルが戦場にいる間、12インチ以内の全ての敵ユニットはリーダーシップが-1される。",
      },
    ],
    keywords: ["Vehicle", "Fly", "Aircraft", "Psyker", "Hemlock Wraithfighter"],
    fluff: "死の魂が宿った航空レイスコンストラクト。前方の敵をDサイズで薙ぎ払い、サイキックオーラで周囲の敵の士気を削る恐怖の戦闘機。",
  },

  {
    id: "crimson_hunter",
    name: "Crimson Hunter",
    nameJa: "クリムゾン・ハンター",
    pts: 150,
    role: "Heavy",
    categories: ["Vehicle", "Fly", "Aircraft", "Crimson Hunter"],
    stats: { M: '20"+', T: 8, Sv: "3+", W: 9, Ld: "6+", OC: 0 },
    invuln: "5+",
    weapons: [
      {
        name: "Bright Lance x2", nameJa: "ブライトランス×2",
        type: "Ranged", range: '36"', A: 2, skill: "2+", S: 12, AP: -3, D: "D6+2",
        abilities: ["Heavy", "Lance", "Twin-linked"],
      },
      {
        name: "Pulse Laser", nameJa: "パルスレーザー",
        type: "Ranged", range: '36"', A: 2, skill: "2+", S: 12, AP: -3, D: "D6+2",
        abilities: ["Heavy"],
      },
    ],
    abilities: [
      {
        name: "Hard to Hit", nameJa: "当てにくい",
        desc: "このモデルへの射撃攻撃のヒットロールに-1の修正を加える。",
      },
      {
        name: "Precognitive Dodging", nameJa: "予知的回避",
        desc: "このモデルが射撃対象になった際、4+でその射撃を無効化できる（1回/フェイズ）。",
      },
    ],
    keywords: ["Vehicle", "Fly", "Aircraft", "Crimson Hunter"],
    fluff: "アサルト武装の航空戦闘機。超高精度（2+）のブライトランス双連装で敵航空機と重装甲を優先的に狩る対機甲・対航空特化のエア・スーペリオリティファイター。",
  },

  // ════════════════════════════════════════════════════════════════════════════
  // ■ Transport
  // ════════════════════════════════════════════════════════════════════════════

  {
    id: "wave_serpent",
    name: "Wave Serpent",
    nameJa: "ウェイヴ・サーペント",
    pts: 120,
    role: "Transport",
    categories: ["Vehicle", "Transport", "Fly", "Wave Serpent"],
    stats: { M: '14"', T: 9, Sv: "3+", W: 13, Ld: "6+", OC: 2 },
    invuln: "5+",
    weapons: [
      {
        name: "Wave Serpent Shield", nameJa: "ウェーブサーペント・シールド",
        type: "Ranged", range: '30"', A: "D3+3", skill: "3+", S: 7, AP: -1, D: 2,
        abilities: ["Blast"],
      },
      {
        name: "Shuriken Cannon", nameJa: "シュリケン・キャノン",
        type: "Ranged", range: '24"', A: 3, skill: "3+", S: 6, AP: -1, D: 1,
        abilities: [],
      },
      {
        name: "Twin Shuriken Catapult", nameJa: "ツイン・シュリケン・カタパルト",
        type: "Ranged", range: '18"', A: 4, skill: "3+", S: 4, AP: -1, D: 1,
        abilities: ["Assault", "Twin-linked"],
      },
    ],
    abilities: [
      {
        name: "Energy Field", nameJa: "エネルギーフィールド",
        desc: "このモデルが12インチ以上移動している場合、射撃のセーブロールを4+のインヴルネラブルセーブとして扱える。",
      },
      {
        name: "Transport Capacity", nameJa: "輸送能力",
        desc: "最大12体のASURYANI歩兵またはウォーロック・コンクレイブを輸送できる（FLY持ちも可）。",
      },
    ],
    keywords: ["Vehicle", "Transport", "Fly", "Wave Serpent"],
    fluff: "アエルダリ最強の輸送艦。エネルギーフィールドが移動中は射撃への実質4+インヴルネラブルとなり、12体を安全に前線まで届ける。",
  },

  // ════════════════════════════════════════════════════════════════════════════
  // ■ HQ ─ 新フェニックス・ロード（Codex 2025）
  // ════════════════════════════════════════════════════════════════════════════

  {
    id: "kharseth",
    name: "Kharseth",
    nameJa: "カーセス",
    pts: 130,
    role: "HQ",
    categories: ["Character", "Infantry", "Epic Hero", "Grenades", "Aspect Warrior", "Phoenix Lord", "Kharseth"],
    stats: { M: '7"', T: 3, Sv: "2+", W: 5, Ld: "6+", OC: 1 },
    invuln: "4+",
    weapons: [
      {
        name: "Scorpion's Claw", nameJa: "スコーピオンの鉤爪（射撃）",
        type: "Ranged", range: '18"', A: 3, skill: "2+", S: 8, AP: -3, D: 2,
        abilities: ["Assault"],
      },
      {
        name: "Scorpion's Claw", nameJa: "スコーピオンの鉤爪（近接）",
        type: "Melee", range: "Melee", A: 5, skill: "2+", S: 7, AP: -3, D: 2,
        abilities: ["Sustained Hits 1"],
      },
    ],
    abilities: [
      {
        name: "Apex Predator", nameJa: "頂点の捕食者",
        desc: "このモデルがユニットをリードしている間、そのユニットのInfiltrators、Scouts 7\"、Stealth能力に加えて、近接攻撃のウーンドロールをリロールできる。",
      },
      {
        name: "Venomous Strike", nameJa: "毒の一撃",
        desc: "このモデルの近接攻撃でウーンドロールが6の場合、対象はセーブロールができない（モータルウーンドとして処理）。",
      },
    ],
    keywords: ["Infantry", "Character", "Epic Hero", "Grenades", "Aspect Warrior", "Phoenix Lord", "Kharseth"],
    fluff: "ストライキング・スコーピオンズの新たなフェニックス・ロード。カーシスの後継者として蘇り、毒の鉤爪で敵の心臓を貫く影の捕食者。",
  },

  {
    id: "lhykhis",
    name: "Lhykhis",
    nameJa: "ライキス",
    pts: 125,
    role: "HQ",
    categories: ["Character", "Infantry", "Epic Hero", "Grenades", "Aspect Warrior", "Phoenix Lord", "Lhykhis"],
    stats: { M: '8"', T: 3, Sv: "2+", W: 5, Ld: "6+", OC: 1 },
    invuln: "4+",
    weapons: [
      {
        name: "Mourning Stars", nameJa: "モーニングスター",
        type: "Ranged", range: '18"', A: 4, skill: "2+", S: 5, AP: -1, D: 1,
        abilities: ["Assault", "Lethal Hits"],
      },
      {
        name: "Blades of Midnight", nameJa: "真夜中の刃",
        type: "Melee", range: "Melee", A: 6, skill: "2+", S: 5, AP: -2, D: 1,
        abilities: ["Anti-Infantry 3+", "Sustained Hits 1"],
      },
    ],
    abilities: [
      {
        name: "Shrieking Doom", nameJa: "絶叫する終焉",
        desc: "このモデルがユニットをリードしている間、そのユニットはFights First能力を持ち、突撃後のオーバーウォッチを相手は行えない。",
      },
      {
        name: "Death Unveiled", nameJa: "死の露見",
        desc: "このモデルが近接攻撃でモデルを破壊した場合、そのユニットはバトルショックテストを受けなければならない。",
      },
    ],
    keywords: ["Infantry", "Character", "Epic Hero", "Grenades", "Aspect Warrior", "Phoenix Lord", "Lhykhis"],
    fluff: "ハウリング・バンシーズの新たなフェニックス・ロード。ジェイン・ザーの精神を受け継ぎながらも独自の死の美学を持つ恐怖の化身。",
  },

  // ════════════════════════════════════════════════════════════════════════════
  // ■ HQ ─ ハーレクイン・キャラクター
  // ════════════════════════════════════════════════════════════════════════════

  {
    id: "troupe_master",
    name: "Troupe Master",
    nameJa: "トゥループ・マスター",
    pts: 80,
    role: "HQ",
    categories: ["Character", "Infantry", "Harlequins", "Troupe Master"],
    stats: { M: '8"', T: 3, Sv: "5+", W: 4, Ld: "6+", OC: 1 },
    invuln: "4+",
    weapons: [
      {
        name: "Shuriken Pistol", nameJa: "シュリケン・ピストル",
        type: "Ranged", range: '12"', A: 1, skill: "2+", S: 4, AP: -1, D: 1,
        abilities: ["Assault", "Pistol"],
      },
      {
        name: "Harlequin's Blade", nameJa: "ハーレクインの刃",
        type: "Melee", range: "Melee", A: 5, skill: "2+", S: 4, AP: -2, D: 1,
        abilities: ["Sustained Hits 1"],
      },
    ],
    abilities: [
      {
        name: "Choreographer of War", nameJa: "戦の振付師",
        desc: "このモデルがユニットをリードしている間、そのユニットのヒットロールとウーンドロールをリロールできる（それぞれ1回ずつ/フェイズ）。",
      },
      {
        name: "Saedath Stratagem", nameJa: "サエダス戦略",
        desc: "このモデルが戦場にいる間、友軍ハーレクインユニットがストラタジェムの対象になった場合、そのCPコストを1CPまで軽減できる。",
      },
    ],
    keywords: ["Infantry", "Character", "Harlequins", "Troupe Master"],
    fluff: "ハーレクイン戦団の指揮官にして演者。戦いを壮大な演劇として演出し、団員たちの卓越した技を最大限に引き出す。",
  },

  {
    id: "shadowseer",
    name: "Shadowseer",
    nameJa: "シャドウシーア",
    pts: 85,
    role: "HQ",
    categories: ["Character", "Infantry", "Psyker", "Harlequins", "Shadowseer"],
    stats: { M: '8"', T: 3, Sv: "5+", W: 4, Ld: "5+", OC: 1 },
    invuln: "4+",
    weapons: [
      {
        name: "Shuriken Pistol", nameJa: "シュリケン・ピストル",
        type: "Ranged", range: '12"', A: 1, skill: "2+", S: 4, AP: -1, D: 1,
        abilities: ["Assault", "Pistol"],
      },
      {
        name: "Miststave", nameJa: "ミストスタッフ",
        type: "Melee", range: "Melee", A: 4, skill: "2+", S: 6, AP: -2, D: 2,
        abilities: ["Psychic"],
      },
    ],
    abilities: [
      {
        name: "Veil of Tears (Psychic)", nameJa: "涙のヴェール（サイキック）",
        desc: "このモデルがユニットをリードしている間、そのユニットへの18インチ超の射撃攻撃のヒットロールに-1。",
      },
      {
        name: "Shards of Light (Psychic)", nameJa: "光の破片（サイキック）",
        desc: "コマンドフェイズに18インチ以内の敵ユニット1体を選択。そのユニットのヒットロールに-1の修正を加える（次のコマンドフェイズまで）。",
      },
    ],
    keywords: ["Infantry", "Character", "Psyker", "Harlequins", "Shadowseer"],
    fluff: "幻術と予知能力を操るハーレクインのサイキック。幻影のヴェールで仲間を隠し、光の破片で敵の視界を奪う。",
  },

  {
    id: "death_jester",
    name: "Death Jester",
    nameJa: "デス・ジェスター",
    pts: 80,
    role: "HQ",
    categories: ["Character", "Infantry", "Harlequins", "Death Jester"],
    stats: { M: '8"', T: 3, Sv: "4+", W: 4, Ld: "6+", OC: 1 },
    invuln: "4+",
    weapons: [
      {
        name: "Shrieker Cannon", nameJa: "シュリーカー・キャノン",
        type: "Ranged", range: '18"', A: 3, skill: "2+", S: 6, AP: -2, D: 2,
        abilities: ["Assault"],
      },
      {
        name: "Shrieker Cannon (Melee)", nameJa: "シュリーカー・キャノン（近接）",
        type: "Melee", range: "Melee", A: 3, skill: "2+", S: 5, AP: -1, D: 1,
        abilities: [],
      },
    ],
    abilities: [
      {
        name: "Death is Not Enough", nameJa: "死では不十分",
        desc: "射撃後、命中したユニット（モンスター・ヴィークル除く）1体はバトルショックテストを受ける。モデルが破壊されていれば修正-1。",
      },
      {
        name: "Cruel Amusement", nameJa: "残酷な楽しみ",
        desc: "射撃フェイズにこのモデルが選択された際、シュリーカー・キャノンにDevastating Wounds・Lethal Hitsのいずれかを付与できる（フェイズ終了まで）。",
      },
    ],
    keywords: ["Infantry", "Character", "Harlequins", "Death Jester"],
    fluff: "冷酷な狙撃手にして死の道化師。シュリーカー・キャノンで標的の精神を蝕み、死を演じながら敵を絶望へと追い込む。",
  },

  {
    id: "solitaire",
    name: "Solitaire",
    nameJa: "ソリティア",
    pts: 95,
    role: "HQ",
    categories: ["Character", "Infantry", "Harlequins", "Solitaire"],
    stats: { M: '8"', T: 3, Sv: "4+", W: 4, Ld: "5+", OC: 1 },
    invuln: "3+",
    weapons: [
      {
        name: "Caress of Spite", nameJa: "悪意の愛撫",
        type: "Melee", range: "Melee", A: 6, skill: "2+", S: 4, AP: -2, D: 1,
        abilities: ["Anti-Infantry 3+", "Devastating Wounds"],
      },
      {
        name: "Harlequin's Kiss", nameJa: "ハーレクインのキス",
        type: "Melee", range: "Melee", A: 4, skill: "2+", S: 6, AP: -3, D: 2,
        abilities: ["Devastating Wounds"],
      },
    ],
    abilities: [
      {
        name: "Flip Belt", nameJa: "フリップ・ベルト",
        desc: "このモデルが移動する際、垂直距離を無視して移動できる（地形の高低差を飛び越せる）。",
      },
      {
        name: "Blitz", nameJa: "電撃突破",
        desc: "このモデルは突撃距離を2D6+4インチとして扱う。また突撃後の近接戦闘でFights First能力を持つ。",
      },
    ],
    keywords: ["Infantry", "Character", "Harlequins", "Solitaire"],
    fluff: "セアゴルス（ケインの道化師）の化身。3+インヴルネラブルを持つ最速の近接戦士。ケインとスラーネッシュの狭間に生きる孤独な存在。",
  },

  // ════════════════════════════════════════════════════════════════════════════
  // ■ HQ ─ ヤナーリ・キャラクター
  // ════════════════════════════════════════════════════════════════════════════

  {
    id: "yvraine",
    name: "Yvraine",
    nameJa: "イヴライネ",
    pts: 95,
    role: "HQ",
    categories: ["Character", "Infantry", "Epic Hero", "Psyker", "Aeldari", "Yvraine"],
    stats: { M: '7"', T: 3, Sv: "5+", W: 5, Ld: "5+", OC: 1 },
    invuln: "4+",
    weapons: [
      {
        name: "Kha-vir the Sword of Sorrows", nameJa: "カ・ヴィール・悲しみの剣",
        type: "Melee", range: "Melee", A: 5, skill: "2+", S: 5, AP: -3, D: 2,
        abilities: ["Psychic", "Devastating Wounds"],
      },
      {
        name: "Gyrinx Familiar (Psychic)", nameJa: "ギリンクス（サイキック）",
        type: "Ranged", range: '18"', A: "D3", skill: "2+", S: 5, AP: -2, D: 2,
        abilities: ["Psychic"],
      },
    ],
    abilities: [
      {
        name: "Word of the Phoenix (Psychic)", nameJa: "フェニックスの言葉（サイキック）",
        desc: "コマンドフェイズに、18インチ以内の友軍アエルダリユニット（ヤナーリ）のモデルを1体復活させることができる。",
      },
      {
        name: "Gyre of Souls (Aura)", nameJa: "魂の渦（オーラ）",
        desc: "このモデルが戦場にいる間、6インチ以内の友軍ヤナーリユニットの近接攻撃のウーンドロールが6の場合、1のモータルウーンドを追加で与える。",
      },
    ],
    keywords: ["Infantry", "Character", "Epic Hero", "Psyker", "Yvraine"],
    fluff: "ヤナールの言葉、死の神エルダルの啓示を受けた者。かつてはコモリアのウィッチ、ハーレクイン、そしてルーンプリーストを経た異色の経歴を持つヤナーリの精神的指導者。",
  },

  {
    id: "the_visarch",
    name: "The Visarch",
    nameJa: "ヴィスアーク",
    pts: 85,
    role: "HQ",
    categories: ["Character", "Infantry", "Epic Hero", "Aeldari", "The Visarch"],
    stats: { M: '7"', T: 3, Sv: "3+", W: 5, Ld: "6+", OC: 1 },
    invuln: "4+",
    weapons: [
      {
        name: "Asu-var the Sword of Silent Screams", nameJa: "アス・ヴァール・沈黙の叫びの剣",
        type: "Melee", range: "Melee", A: 6, skill: "2+", S: 6, AP: -3, D: 2,
        abilities: ["Anti-Infantry 3+"],
      },
    ],
    abilities: [
      {
        name: "Chosen of Ynnead", nameJa: "ヤナールの選ばれし者",
        desc: "このモデルがユニットをリードしている間、そのユニットがエンゲージメント内の敵ユニットのモデルを1体破壊するたびに、このユニットは1ウーンドを回復できる。",
      },
      {
        name: "Lethal Reflexes", nameJa: "致死的な反射神経",
        desc: "このモデルはFights First能力を持つ。また近接攻撃ヒットロールが6の場合、追加の攻撃が1回発生する。",
      },
    ],
    keywords: ["Infantry", "Character", "Epic Hero", "The Visarch"],
    fluff: "イヴレインの護衛にして剣盾。かつてドラッカリの刃の達人。沈黙の叫びの剣ですべての敵を薙ぎ払うヤナーリの剣豪。",
  },

  {
    id: "the_yncarne",
    name: "The Yncarne",
    nameJa: "インカーネ",
    pts: 210,
    role: "HQ",
    categories: ["Character", "Monster", "Epic Hero", "Psyker", "Daemon", "Aeldari", "The Yncarne"],
    stats: { M: '10"', T: 8, Sv: "4+", W: 10, Ld: "5+", OC: 3 },
    invuln: "4+",
    weapons: [
      {
        name: "Vilith-zhar the Sword of Souls", nameJa: "ヴィリス・ザール・魂の剣",
        type: "Melee", range: "Melee", A: 6, skill: "2+", S: 8, AP: -3, D: 3,
        abilities: ["Psychic", "Devastating Wounds"],
      },
    ],
    abilities: [
      {
        name: "Avatar of Ynnead (Psychic)", nameJa: "ヤナールのアヴァター（サイキック）",
        desc: "このモデルが戦場にいる間、友軍アエルダリユニットが破壊された際、このモデルは12インチ以内に転移できる（1ターン1回）。",
      },
      {
        name: "Soulburst", nameJa: "ソウルバースト",
        desc: "友軍ヤナーリユニットが破壊された際、このモデルはD3のウーンドを回復する。",
      },
    ],
    keywords: ["Monster", "Character", "Epic Hero", "Psyker", "Daemon", "The Yncarne"],
    fluff: "ヤナールの化身。仲間の死から力を吸収し戦場に現れる死と再生のアヴァター。敵に倒されるたびに仲間の消滅から生まれ変わる不死の存在。",
  },

  {
    id: "ynnari_archon",
    name: "Ynnari Archon",
    nameJa: "インナーリ・アーコン",
    pts: 75,
    role: "HQ",
    categories: ["Character", "Infantry", "Aeldari", "Ynnari Archon"],
    stats: { M: '7"', T: 3, Sv: "3+", W: 4, Ld: "6+", OC: 1 },
    invuln: "4+",
    weapons: [
      {
        name: "Agoniser", nameJa: "アゴナイザー",
        type: "Melee", range: "Melee", A: 4, skill: "2+", S: 4, AP: -2, D: 1,
        abilities: ["Anti-Monster 4+", "Anti-Vehicle 4+"],
      },
      {
        name: "Venom Blade", nameJa: "ヴェノムブレード",
        type: "Melee", range: "Melee", A: 5, skill: "2+", S: 3, AP: -1, D: 1,
        abilities: ["Lethal Hits"],
      },
    ],
    abilities: [
      {
        name: "Power from Pain (Ynnari)", nameJa: "苦痛からの力（ヤナーリ）",
        desc: "このモデルがユニットをリードしている間、そのユニットのモデルが破壊されるたびに、近接攻撃のヒットロールに+1の修正を加える（ターン終了まで、最大+2）。",
      },
    ],
    keywords: ["Infantry", "Character", "Ynnari Archon"],
    fluff: "コモリア出身でヤナーリに加わった暗黒エルダールのアーコン。冷酷な指揮官として苦痛を糧に戦う。",
  },

  {
    id: "ynnari_succubus",
    name: "Ynnari Succubus",
    nameJa: "インナーリ・サキュバス",
    pts: 75,
    role: "HQ",
    categories: ["Character", "Infantry", "Aeldari", "Ynnari Succubus"],
    stats: { M: '7"', T: 3, Sv: "5+", W: 4, Ld: "6+", OC: 1 },
    invuln: "4+",
    weapons: [
      {
        name: "Archite Glaive", nameJa: "アーカイト・グレイブ",
        type: "Melee", range: "Melee", A: 5, skill: "2+", S: 5, AP: -2, D: 2,
        abilities: ["Sustained Hits 1"],
      },
      {
        name: "Razorflails", nameJa: "レイザーフレイル",
        type: "Melee", range: "Melee", A: 6, skill: "2+", S: 4, AP: -1, D: 1,
        abilities: ["Devastating Wounds"],
      },
    ],
    abilities: [
      {
        name: "Combat Drugs (Ynnari)", nameJa: "戦闘薬（ヤナーリ）",
        desc: "このモデルはFights First能力を持ち、突撃ロールに+1の修正を加える。",
      },
    ],
    keywords: ["Infantry", "Character", "Ynnari Succubus"],
    fluff: "ウィッチ戦士として鍛え抜かれたコモリアのダンサー。戦いを芸術として捉え、アーカイト・グレイブの舞いで敵を翻弄する。",
  },

  // ════════════════════════════════════════════════════════════════════════════
  // ■ Battleline ─ ヤナーリ
  // ════════════════════════════════════════════════════════════════════════════

  {
    id: "ynnari_kabalite_warriors",
    name: "Ynnari Kabalite Warriors",
    nameJa: "インナーリ・カバライト・ウォリアー",
    pts: 65,
    role: "Battleline",
    categories: ["Infantry", "Battleline", "Aeldari", "Ynnari Kabalite Warriors"],
    stats: { M: '7"', T: 3, Sv: "4+", W: 1, Ld: "6+", OC: 2 },
    weapons: [
      {
        name: "Splinter Rifle", nameJa: "スプリンター・ライフル",
        type: "Ranged", range: '24"', A: 2, skill: "3+", S: 2, AP: 0, D: 1,
        abilities: ["Assault", "Lethal Hits"],
      },
      {
        name: "Close Combat Weapon", nameJa: "近接武器",
        type: "Melee", range: "Melee", A: 2, skill: "4+", S: 3, AP: 0, D: 1,
        abilities: [],
      },
    ],
    abilities: [
      {
        name: "Power from Pain (Ynnari)", nameJa: "苦痛からの力（ヤナーリ）",
        desc: "このユニットのモデルが破壊されるたびに、射撃攻撃のヒットロールに+1の修正を加える（ターン終了まで、最大+2）。",
      },
    ],
    keywords: ["Infantry", "Battleline", "Ynnari Kabalite Warriors"],
    fluff: "ヤナーリに加わったコモリアのカバライト戦士。スプリンターライフルのLEthal Hits能力で軽歩兵を効率よく制圧する。",
  },

  {
    id: "ynnari_wyches",
    name: "Ynnari Wyches",
    nameJa: "インナーリ・ウィッチ",
    pts: 65,
    role: "Battleline",
    categories: ["Infantry", "Battleline", "Aeldari", "Ynnari Wyches"],
    stats: { M: '7"', T: 3, Sv: "5+", W: 1, Ld: "6+", OC: 2 },
    invuln: "6+",
    weapons: [
      {
        name: "Hekatarii Blade", nameJa: "ヘカタリィ・ブレード",
        type: "Melee", range: "Melee", A: 3, skill: "3+", S: 3, AP: -1, D: 1,
        abilities: ["Sustained Hits 1"],
      },
    ],
    abilities: [
      {
        name: "Acrobatic", nameJa: "アクロバット",
        desc: "このユニットはFall Backした後でも射撃とチャージ宣言ができる。",
      },
      {
        name: "Combat Drugs (Ynnari)", nameJa: "戦闘薬（ヤナーリ）",
        desc: "このユニットの突撃ロールに+1の修正を加える。",
      },
    ],
    keywords: ["Infantry", "Battleline", "Ynnari Wyches"],
    fluff: "ヤナーリに帰依したウィッチ戦士。アリーナで磨いた格闘術と戦闘薬の恩恵で、驚異的な速さで敵に食らいつく近接特化部隊。",
  },

  // ════════════════════════════════════════════════════════════════════════════
  // ■ Other ─ ハーレクイン・ユニット
  // ════════════════════════════════════════════════════════════════════════════

  {
    id: "troupe",
    name: "Troupe",
    nameJa: "トゥループ",
    pts: 80,
    role: "Other",
    categories: ["Infantry", "Harlequins", "Troupe"],
    stats: { M: '8"', T: 3, Sv: "5+", W: 1, Ld: "6+", OC: 1 },
    invuln: "5+",
    weapons: [
      {
        name: "Shuriken Pistol", nameJa: "シュリケン・ピストル",
        type: "Ranged", range: '12"', A: 1, skill: "3+", S: 4, AP: -1, D: 1,
        abilities: ["Assault", "Pistol"],
      },
      {
        name: "Harlequin's Blade", nameJa: "ハーレクインの刃",
        type: "Melee", range: "Melee", A: 3, skill: "3+", S: 4, AP: -2, D: 1,
        abilities: ["Sustained Hits 1"],
      },
    ],
    abilities: [
      {
        name: "Prismatic Blur", nameJa: "プリズマティック・ブラー",
        desc: "このユニットが通常移動またはアドバンスを行う場合、そのターン終了まで射撃のヒットロールに-1の修正を加える。",
      },
      {
        name: "Flip Belt", nameJa: "フリップ・ベルト",
        desc: "このユニットが移動する際、垂直距離を無視して移動できる。",
      },
    ],
    keywords: ["Infantry", "Harlequins", "Troupe"],
    fluff: "ハーレクイン戦団の基本戦闘単位。5〜12体で構成され、ファスト・ムーブとプリズマティック・ブラーで接近しながら回避し続け、近接戦で爆発的な攻撃力を発揮する。",
  },

  {
    id: "skyweavers",
    name: "Skyweavers",
    nameJa: "スカイウィーバー",
    pts: 90,
    role: "Other",
    categories: ["Mounted", "Fly", "Harlequins", "Skyweavers"],
    stats: { M: '14"', T: 4, Sv: "4+", W: 2, Ld: "6+", OC: 2 },
    invuln: "4+",
    weapons: [
      {
        name: "Haywire Cannon", nameJa: "ヘイワイアー・キャノン",
        type: "Ranged", range: '24"', A: 2, skill: "3+", S: 4, AP: -1, D: 2,
        abilities: ["Anti-Vehicle 4+", "Devastating Wounds"],
      },
      {
        name: "Star Bolas", nameJa: "スターボラス",
        type: "Ranged", range: '12"', A: 2, skill: "3+", S: 5, AP: -1, D: 2,
        abilities: ["Assault"],
      },
      {
        name: "Zephyrglaive", nameJa: "ゼフィル・グレイブ",
        type: "Melee", range: "Melee", A: 3, skill: "3+", S: 5, AP: -2, D: 2,
        abilities: [],
      },
    ],
    abilities: [
      {
        name: "Prismatic Blur", nameJa: "プリズマティック・ブラー",
        desc: "このユニットが移動した場合、そのターン終了まで射撃のヒットロールに-1の修正を加える。",
      },
    ],
    keywords: ["Mounted", "Fly", "Harlequins", "Skyweavers"],
    fluff: "スカイウィーヴのジェットバイク部隊。4+インヴルネラブルとプリズマティック・ブラーで高い生存性を誇り、ヘイワイアー・キャノンで装甲車を瞬時に無力化する。",
  },

  {
    id: "starfangs",
    name: "Starfangs",
    nameJa: "スターファングズ",
    pts: 100,
    role: "Other",
    categories: ["Infantry", "Fly", "Jump Pack", "Harlequins", "Starfangs"],
    stats: { M: '12"', T: 3, Sv: "4+", W: 2, Ld: "6+", OC: 1 },
    invuln: "4+",
    weapons: [
      {
        name: "Harlequin's Kiss", nameJa: "ハーレクインのキス",
        type: "Melee", range: "Melee", A: 4, skill: "3+", S: 5, AP: -3, D: 2,
        abilities: ["Devastating Wounds"],
      },
      {
        name: "Shuriken Pistol", nameJa: "シュリケン・ピストル",
        type: "Ranged", range: '12"', A: 1, skill: "3+", S: 4, AP: -1, D: 1,
        abilities: ["Assault", "Pistol"],
      },
    ],
    abilities: [
      {
        name: "Deep Strike", nameJa: "ディープストライク",
        desc: "このユニットは戦略的予備から降下できる（敵から9インチ超）。",
      },
      {
        name: "Skyborne Assault", nameJa: "空中強襲",
        desc: "このユニットがディープストライクで配置されたターン中、突撃ロールに+2の修正を加える。",
      },
    ],
    keywords: ["Infantry", "Fly", "Jump Pack", "Harlequins", "Starfangs"],
    fluff: "ジャンプパックで空を舞うハーレクインの突撃精鋭。天から急降下しハーレクインのキスで重装甲に致命傷を与え、再び闇に消える。Codex 2025新ユニット。",
  },

  {
    id: "ynnari_incubi",
    name: "Ynnari Incubi",
    nameJa: "インナーリ・インキュバス",
    pts: 75,
    role: "Other",
    categories: ["Infantry", "Aeldari", "Ynnari Incubi"],
    stats: { M: '7"', T: 3, Sv: "3+", W: 1, Ld: "6+", OC: 1 },
    weapons: [
      {
        name: "Klaive", nameJa: "クレイブ",
        type: "Melee", range: "Melee", A: 3, skill: "3+", S: 5, AP: -2, D: 1,
        abilities: ["Sustained Hits 1"],
      },
    ],
    abilities: [
      {
        name: "Lethal Precision", nameJa: "致命的な精度",
        desc: "このユニットの近接攻撃でウーンドロールが6の場合、ダメージ値が1増加する。",
      },
      {
        name: "Bloodied Blade", nameJa: "血染めの刃",
        desc: "このユニットが近接戦闘で敵モデルを破壊した場合、このユニットは1ウーンドを回復する。",
      },
    ],
    keywords: ["Infantry", "Ynnari Incubi"],
    fluff: "ヤナーリに加わったコモリアのインキュバイ（死の聖職者）。3+セーブと高い戦闘能力を持ち、剣の修道士として敵の精鋭を刈り取る。",
  },

  {
    id: "ynnari_reavers",
    name: "Ynnari Reavers",
    nameJa: "インナーリ・リーヴァー",
    pts: 70,
    role: "Other",
    categories: ["Mounted", "Fly", "Aeldari", "Ynnari Reavers"],
    stats: { M: '14"', T: 4, Sv: "4+", W: 2, Ld: "6+", OC: 2 },
    weapons: [
      {
        name: "Splinter Rifle", nameJa: "スプリンター・ライフル",
        type: "Ranged", range: '24"', A: 2, skill: "3+", S: 2, AP: 0, D: 1,
        abilities: ["Assault", "Lethal Hits"],
      },
      {
        name: "Bladevanes", nameJa: "ブレードヴェーン",
        type: "Melee", range: "Melee", A: 2, skill: "3+", S: 4, AP: -1, D: 1,
        abilities: [],
      },
    ],
    abilities: [
      {
        name: "Bladevanes Attack", nameJa: "ブレードヴェーン攻撃",
        desc: "このユニットが移動フェイズに敵ユニットの上を通過した際、そのユニットに2のモータルウーンドを与える。",
      },
    ],
    keywords: ["Mounted", "Fly", "Ynnari Reavers"],
    fluff: "ヤナーリに属するコモリアのジェットバイク戦士。高速で敵陣を駆け抜けながらブレードヴェーンで歩兵を蹂躙する。",
  },

  // ════════════════════════════════════════════════════════════════════════════
  // ■ Other ─ ヤナーリ追加
  // ════════════════════════════════════════════════════════════════════════════

  {
    id: "wraithknight_ghostglaive",
    name: "Wraithknight with Ghostglaive",
    nameJa: "レイスナイト（ゴーストグレイブ装備）",
    pts: 290,
    role: "Heavy",
    categories: ["Monster", "Titanic", "Fly", "Wraith Construct", "Wraithknight"],
    stats: { M: '12"', T: 12, Sv: "3+", W: 24, Ld: "6+", OC: 5 },
    invuln: "5+",
    weapons: [
      {
        name: "Titanic Wraithglaive", nameJa: "タイタニック・レイスグレイブ",
        type: "Melee", range: "Melee", A: 5, skill: "3+", S: 16, AP: -4, D: "D6+6",
        abilities: ["Devastating Wounds"],
      },
      {
        name: "Rift Cannon", nameJa: "リフトキャノン",
        type: "Ranged", range: '18"', A: "D3+3", skill: "3+", S: 12, AP: -4, D: 3,
        abilities: ["Blast", "Devastating Wounds"],
      },
      {
        name: "Shuriken Cannon x2", nameJa: "シュリケン・キャノン×2",
        type: "Ranged", range: '24"', A: 6, skill: "3+", S: 6, AP: -1, D: 1,
        abilities: ["Twin-linked"],
      },
    ],
    abilities: [
      {
        name: "Deadly Demise D6", nameJa: "致命的な死（D6）",
        desc: "このモデルが破壊された場合D6を振る。その値の分だけ6インチ以内の各ユニットにモータルウーンドを与える。",
      },
      {
        name: "Agile", nameJa: "機敏",
        desc: "このモデルはFly能力を持ち、移動時に他のモデルをまたぐことができる。",
      },
    ],
    keywords: ["Monster", "Titanic", "Fly", "Wraith Construct", "Wraithknight"],
    fluff: "タイタニック・レイスグレイブを装備した近接特化型のレイスナイト。リフトキャノンとグレイブの組み合わせで重装甲・歩兵どちらにも対応する格闘戦特化タイタン。",
  },

  // ════════════════════════════════════════════════════════════════════════════
  // ■ Transport ─ ハーレクイン・ヤナーリ輸送機
  // ════════════════════════════════════════════════════════════════════════════

  {
    id: "starweaver",
    name: "Starweaver",
    nameJa: "スターウィーヴァー",
    pts: 80,
    role: "Transport",
    categories: ["Vehicle", "Transport", "Fly", "Harlequins", "Starweaver"],
    stats: { M: '14"', T: 7, Sv: "4+", W: 8, Ld: "6+", OC: 2 },
    invuln: "4+",
    weapons: [
      {
        name: "Prismatic Cannon (Dispersed)", nameJa: "プリズマティック・キャノン（散射）",
        type: "Ranged", range: '24"', A: "2D6", skill: "3+", S: 5, AP: -1, D: 1,
        abilities: ["Blast"],
      },
      {
        name: "Prismatic Cannon (Focused)", nameJa: "プリズマティック・キャノン（集束）",
        type: "Ranged", range: '24"', A: 1, skill: "3+", S: 10, AP: -4, D: "D3+2",
        abilities: ["Devastating Wounds"],
      },
    ],
    abilities: [
      {
        name: "Transport Capacity", nameJa: "輸送能力",
        desc: "最大6体のハーレクイン歩兵モデルを輸送できる。",
      },
      {
        name: "Prismatic Blur", nameJa: "プリズマティック・ブラー",
        desc: "このモデルが移動した場合、そのターン終了まで射撃のヒットロールに-1の修正を加える。",
      },
    ],
    keywords: ["Vehicle", "Transport", "Fly", "Harlequins", "Starweaver"],
    fluff: "ハーレクインの高速輸送艇。4+インヴルネラブルとプリズマティック・ブラーで高い生存性を持ちながらプリズマティック・キャノンでの攻撃も担う。",
  },

  {
    id: "ynnari_raider",
    name: "Ynnari Raider",
    nameJa: "インナーリ・レイダー",
    pts: 80,
    role: "Transport",
    categories: ["Vehicle", "Transport", "Fly", "Aeldari", "Ynnari Raider"],
    stats: { M: '14"', T: 7, Sv: "4+", W: 8, Ld: "6+", OC: 2 },
    weapons: [
      {
        name: "Dark Lance", nameJa: "ダーク・ランス",
        type: "Ranged", range: '36"', A: 1, skill: "3+", S: 12, AP: -3, D: "D6+2",
        abilities: ["Heavy"],
      },
      {
        name: "Splinter Racks (Ranged)", nameJa: "スプリンター・ラック",
        type: "Ranged", range: '24"', A: 4, skill: "3+", S: 2, AP: 0, D: 1,
        abilities: ["Lethal Hits"],
      },
    ],
    abilities: [
      {
        name: "Transport Capacity", nameJa: "輸送能力",
        desc: "最大10体のヤナーリ歩兵モデルを輸送できる。",
      },
      {
        name: "Power from Pain (Ynnari)", nameJa: "苦痛からの力（ヤナーリ）",
        desc: "このユニットが搭乗しているユニットのモデルが破壊されるたびに、射撃攻撃のヒットロールに+1（最大+2）。",
      },
    ],
    keywords: ["Vehicle", "Transport", "Fly", "Ynnari Raider"],
    fluff: "コモリア様式の高速輸送艦。ヤナーリ版はダーク・ランスでの対装甲能力を持ちながら10体を輸送できる。",
  },

  {
    id: "ynnari_venom",
    name: "Ynnari Venom",
    nameJa: "インナーリ・ヴェノム",
    pts: 65,
    role: "Transport",
    categories: ["Vehicle", "Transport", "Fly", "Aeldari", "Ynnari Venom"],
    stats: { M: '14"', T: 6, Sv: "4+", W: 6, Ld: "6+", OC: 2 },
    weapons: [
      {
        name: "Twin Splinter Rifle", nameJa: "ツイン・スプリンター・ライフル",
        type: "Ranged", range: '24"', A: 4, skill: "3+", S: 2, AP: 0, D: 1,
        abilities: ["Assault", "Lethal Hits", "Twin-linked"],
      },
      {
        name: "Splinter Cannon", nameJa: "スプリンター・キャノン",
        type: "Ranged", range: '36"', A: 4, skill: "3+", S: 3, AP: -1, D: 1,
        abilities: ["Lethal Hits", "Sustained Hits 1"],
      },
    ],
    abilities: [
      {
        name: "Transport Capacity", nameJa: "輸送能力",
        desc: "最大5体のヤナーリ歩兵モデルを輸送できる。",
      },
    ],
    keywords: ["Vehicle", "Transport", "Fly", "Ynnari Venom"],
    fluff: "コモリアの毒艇。小型で高速・軽武装の輸送艇。スプリンターキャノンのLethal Hitsで軽歩兵を効率よく除去する。",
  },

  {
    id: "voidweaver",
    name: "Voidweaver",
    nameJa: "ヴォイドウィーバー",
    pts: 90,
    role: "Heavy",
    categories: ["Vehicle", "Fly", "Harlequins", "Voidweaver"],
    stats: { M: '14"', T: 7, Sv: "4+", W: 8, Ld: "6+", OC: 2 },
    invuln: "4+",
    weapons: [
      {
        name: "Prismatic Cannon (Dispersed)", nameJa: "プリズマティック・キャノン（散射）",
        type: "Ranged", range: '24"', A: "2D6", skill: "3+", S: 5, AP: -1, D: 1,
        abilities: ["Blast"],
      },
      {
        name: "Prismatic Cannon (Focused)", nameJa: "プリズマティック・キャノン（集束）",
        type: "Ranged", range: '24"', A: 1, skill: "3+", S: 10, AP: -4, D: "D3+2",
        abilities: ["Devastating Wounds"],
      },
      {
        name: "Haywire Cannon", nameJa: "ヘイワイアー・キャノン",
        type: "Ranged", range: '24"', A: 2, skill: "3+", S: 4, AP: -1, D: 2,
        abilities: ["Anti-Vehicle 4+", "Devastating Wounds"],
      },
    ],
    abilities: [
      {
        name: "Prismatic Blur", nameJa: "プリズマティック・ブラー",
        desc: "このモデルが移動した場合、そのターン終了まで射撃のヒットロールに-1の修正を加える。",
      },
      {
        name: "Deadly Demise 1", nameJa: "致命的な死（1）",
        desc: "このモデルが破壊された場合D6を振る。1の場合3インチ以内の各ユニットに1のモータルウーンドを与える。",
      },
    ],
    keywords: ["Vehicle", "Fly", "Harlequins", "Voidweaver"],
    fluff: "ハーレクインの軽量戦闘艇。スターウィーヴァーの戦闘特化版。プリズマティック・キャノンとヘイワイアー・キャノンを組み合わせ汎用戦闘力を発揮する。",
  },
];
