/**
 * WH40K 10th Edition Enhancements per faction/detachment.
 * Key: factionId → detachmentName → Enhancement[]
 * pts: points cost (added to unit total)
 * nameJa: optional Japanese name
 */

export type Enhancement = {
  name: string;
  nameJa?: string;
  pts: number;
};

export type EnhancementMap = Record<string, Record<string, Enhancement[]>>;

export const ENHANCEMENTS: EnhancementMap = {
  // ─── Aeldari Craftworlds ───────────────────────────────────────────────────
  aeldari_craftworlds: {
    Warhost: [
      { name: "Phoenix Gem",         nameJa: "フェニックス・ジェム",      pts: 35 },
      { name: "Wailing Doom",        nameJa: "嘆きの破滅",                pts: 30 },
      { name: "Gift of Foresight",   nameJa: "予見の賜物",                pts: 15 },
      { name: "Faolchú's Wing",      nameJa: "ファオルフーの翼",           pts: 10 },
      { name: "Shard of Anaris",     nameJa: "アナリスの欠片",             pts: 20 },
      { name: "Rift Shard",          nameJa: "リフト・シャード",           pts: 15 },
    ],
    "Aspect Host": [
      { name: "Phoenix Gem",         nameJa: "フェニックス・ジェム",      pts: 35 },
      { name: "Wailing Doom",        nameJa: "嘆きの破滅",                pts: 30 },
      { name: "Gift of Foresight",   nameJa: "予見の賜物",                pts: 15 },
      { name: "Faolchú's Wing",      nameJa: "ファオルフーの翼",           pts: 10 },
      { name: "Shard of Anaris",     nameJa: "アナリスの欠片",             pts: 20 },
      { name: "Rift Shard",          nameJa: "リフト・シャード",           pts: 15 },
    ],
    "Armoured Warhost": [
      { name: "Phoenix Gem",         nameJa: "フェニックス・ジェム",      pts: 35 },
      { name: "Wailing Doom",        nameJa: "嘆きの破滅",                pts: 30 },
      { name: "Gift of Foresight",   nameJa: "予見の賜物",                pts: 15 },
      { name: "Faolchú's Wing",      nameJa: "ファオルフーの翼",           pts: 10 },
      { name: "Shard of Anaris",     nameJa: "アナリスの欠片",             pts: 20 },
      { name: "Rift Shard",          nameJa: "リフト・シャード",           pts: 15 },
    ],
    "Corsair Coterie": [
      { name: "Phoenix Gem",         nameJa: "フェニックス・ジェム",      pts: 35 },
      { name: "Wailing Doom",        nameJa: "嘆きの破滅",                pts: 30 },
      { name: "Gift of Foresight",   nameJa: "予見の賜物",                pts: 15 },
      { name: "Faolchú's Wing",      nameJa: "ファオルフーの翼",           pts: 10 },
      { name: "Shard of Anaris",     nameJa: "アナリスの欠片",             pts: 20 },
      { name: "Rift Shard",          nameJa: "リフト・シャード",           pts: 15 },
    ],
    "Guardian Battlehost": [
      { name: "Phoenix Gem",         nameJa: "フェニックス・ジェム",      pts: 35 },
      { name: "Wailing Doom",        nameJa: "嘆きの破滅",                pts: 30 },
      { name: "Gift of Foresight",   nameJa: "予見の賜物",                pts: 15 },
      { name: "Faolchú's Wing",      nameJa: "ファオルフーの翼",           pts: 10 },
      { name: "Shard of Anaris",     nameJa: "アナリスの欠片",             pts: 20 },
      { name: "Rift Shard",          nameJa: "リフト・シャード",           pts: 15 },
    ],
    "Seer Council": [
      { name: "Phoenix Gem",         nameJa: "フェニックス・ジェム",      pts: 35 },
      { name: "Wailing Doom",        nameJa: "嘆きの破滅",                pts: 30 },
      { name: "Gift of Foresight",   nameJa: "予見の賜物",                pts: 15 },
      { name: "Faolchú's Wing",      nameJa: "ファオルフーの翼",           pts: 10 },
      { name: "Shard of Anaris",     nameJa: "アナリスの欠片",             pts: 20 },
      { name: "Rift Shard",          nameJa: "リフト・シャード",           pts: 15 },
    ],
    "Spirit Conclave": [
      { name: "Phoenix Gem",         nameJa: "フェニックス・ジェム",      pts: 35 },
      { name: "Wailing Doom",        nameJa: "嘆きの破滅",                pts: 30 },
      { name: "Gift of Foresight",   nameJa: "予見の賜物",                pts: 15 },
      { name: "Faolchú's Wing",      nameJa: "ファオルフーの翼",           pts: 10 },
      { name: "Shard of Anaris",     nameJa: "アナリスの欠片",             pts: 20 },
      { name: "Rift Shard",          nameJa: "リフト・シャード",           pts: 15 },
    ],
    "Windrider Host": [
      { name: "Phoenix Gem",         nameJa: "フェニックス・ジェム",      pts: 35 },
      { name: "Wailing Doom",        nameJa: "嘆きの破滅",                pts: 30 },
      { name: "Gift of Foresight",   nameJa: "予見の賜物",                pts: 15 },
      { name: "Faolchú's Wing",      nameJa: "ファオルフーの翼",           pts: 10 },
      { name: "Shard of Anaris",     nameJa: "アナリスの欠片",             pts: 20 },
      { name: "Rift Shard",          nameJa: "リフト・シャード",           pts: 15 },
    ],
  },

  // ─── Space Marines (汎用) ──────────────────────────────────────────────────
  // 各チャプターは detachment 名が同じことが多いので space_marines をベースに
  space_marines: {
    "Gladius Task Force": [
      { name: "Adept of the Codex",     nameJa: "コデックスの達人",          pts: 20 },
      { name: "Artificer Armour",        nameJa: "アーティフィサー・アーマー", pts: 25 },
      { name: "Rites of War",            nameJa: "戦争の儀式",                pts: 15 },
      { name: "The Honour Vehement",     nameJa: "激烈なる誉れ",              pts: 30 },
      { name: "Warlord's Seal",          nameJa: "ウォーロードの紋章",        pts: 10 },
      { name: "Bolter Discipline",       nameJa: "ボルター規律",              pts: 20 },
    ],
  },

  // ─── Chaos Space Marines ──────────────────────────────────────────────────
  chaos_space_marines: {
    "Veterans of the Long War": [
      { name: "Trophies of Slaughter",   nameJa: "虐殺の戦利品",             pts: 15 },
      { name: "Cursed Idol",             nameJa: "呪われた偶像",              pts: 20 },
      { name: "Malicious Volleys",       nameJa: "悪意の斉射",               pts: 25 },
      { name: "Blade of Hexagrammic Wards", nameJa: "六方陣の護符の刃",      pts: 30 },
      { name: "Arch-Diabolist",          nameJa: "大悪魔術師",               pts: 20 },
      { name: "Favour of the Ruinous Powers", nameJa: "破滅の力の恩寵",     pts: 10 },
    ],
  },

  // ─── Necrons ──────────────────────────────────────────────────────────────
  necrons: {
    "Awakened Dynasty": [
      { name: "Voltaic Staff",           nameJa: "ヴォルタイック・スタッフ", pts: 15 },
      { name: "Hypermaterial Ablator",   nameJa: "ハイパーマテリアル・アブレーター", pts: 20 },
      { name: "Dimensional Sanctum",     nameJa: "次元の聖域",               pts: 25 },
      { name: "Osteoderm Plating",       nameJa: "骨皮甲板",                 pts: 30 },
      { name: "Veil of Darkness",        nameJa: "暗闇のヴェール",           pts: 20 },
      { name: "Sempiternal Weave",       nameJa: "永遠の織物",               pts: 10 },
    ],
  },

  // ─── Tyranids ─────────────────────────────────────────────────────────────
  tyranids: {
    "Invasion Fleet": [
      { name: "Voracious Appetite",      nameJa: "貪欲な食欲",               pts: 15 },
      { name: "Synaptic Imperatives",    nameJa: "シナプスの命令",           pts: 20 },
      { name: "Heightened Senses",       nameJa: "研ぎ澄まされた感覚",       pts: 25 },
      { name: "Adaptive Biology",        nameJa: "適応生物学",               pts: 30 },
      { name: "Perfectly Adapted",       nameJa: "完璧な適応",               pts: 20 },
      { name: "Spawning Surge",          nameJa: "孵化の波",                 pts: 10 },
    ],
  },

  // ─── Orks ─────────────────────────────────────────────────────────────────
  orks: {
    "War Horde": [
      { name: "Beasthide Mantle",        nameJa: "獣皮マント",               pts: 10 },
      { name: "Killa Klaw",              nameJa: "キラ・クロウ",              pts: 25 },
      { name: "Brutal but Kunnin",       nameJa: "乱暴だが狡猾",             pts: 20 },
      { name: "Kunnin but Brutal",       nameJa: "狡猾だが乱暴",             pts: 20 },
      { name: "Da Biggest Boss",         nameJa: "ダ・ビッゲスト・ボス",      pts: 30 },
      { name: "Warboss in Mega Armour",  nameJa: "メガアーマーのウォーボス", pts: 15 },
    ],
  },
};

/**
 * 指定されたファクション・デタッチメントのエンハンスメントリストを返す。
 * デタッチメント未指定 or 未登録の場合は空配列。
 */
export function getEnhancements(factionId: string, detachmentName: string): Enhancement[] {
  return ENHANCEMENTS[factionId]?.[detachmentName] ?? [];
}
