/**
 * WH40K 10th Edition Enhancements per faction/detachment.
 * Key: factionId → detachmentName → Enhancement[]
 * pts: points cost (added to unit total)
 * nameJa: optional Japanese name
 * Source: Munitorum Field Manual v4.0 (EN + JA)
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
    "Armoured Warhost": [
      { name: "Guiding Presence",         nameJa: "戦場の導き手",          pts: 25 },
      { name: "Guileful Strategist",      nameJa: "狡猾なる策略家",        pts: 15 },
      { name: "Harmonisation Matrix",     nameJa: "統御マトリックス",      pts: 30 },
      { name: "Spirit Stone of Raelyth",  nameJa: "ラエリスの魂魄石",      pts: 20 },
    ],
    "Aspect Host": [
      { name: "Aspect of Murder",         nameJa: "殺戮の相",              pts: 25 },
      { name: "Mantle of Wisdom",         nameJa: "智慧のマント",          pts: 30 },
      { name: "Shimmerstone",             nameJa: "煌めき石",              pts: 15 },
      { name: "Strategic Savant",         nameJa: "戦略学者",              pts: 15 },
    ],
    "Corsair Coterie": [
      { name: "Archraider",               nameJa: "卓越せし略奪者",        pts: 35 },
      { name: "Infamy",                   nameJa: "悪名",                  pts: 25 },
      { name: "Voidstone",                nameJa: "虚空石",                pts: 15 },
      { name: "Webway Pathstone",         nameJa: "網辻の道標石",          pts: 25 },
    ],
    "Devoted of Ynnead": [
      { name: "Borrowed Vigour",          nameJa: "活力奪取",              pts: 10 },
      { name: "Gaze of Ynnead",           nameJa: "インニアードの睥睨",    pts: 15 },
      { name: "Morbid Might",             nameJa: "おぞましき活力",        pts: 15 },
      { name: "Storm of Whispers",        nameJa: "囁きの嵐",              pts: 10 },
    ],
    "Eldritch Raiders": [
      { name: "Adrenal Infusions",        nameJa: "戦闘刺激剤",            pts: 20 },
      { name: "Alacritous Assault",       nameJa: "機敏なる強襲",          pts: 20 },
      { name: "Exotic Munitions",         nameJa: "風変わりな弾薬",        pts: 15 },
      { name: "Pirate Prince",            nameJa: "海賊王子",              pts: 15 },
    ],
    "Ghosts of the Webway": [
      { name: "Cegorach's Coil",          nameJa: "セゴラックの縄",        pts: 25 },
      { name: "Mask of Secrets",          nameJa: "秘密の仮面",            pts: 15 },
      { name: "Mistweave",                nameJa: "霧織り",                pts: 15 },
      { name: "Murder's Jest",            nameJa: "殺戮の戯れ",            pts: 20 },
    ],
    "Guardian Battlehost": [
      { name: "Breath of Vaul",           nameJa: "ヴァールの息吹",        pts: 10 },
      { name: "Craftworld's Champion",    nameJa: "方舟の代理戦士",        pts: 25 },
      { name: "Ethereal Pathway",         nameJa: "霊の道筋",              pts: 30 },
      { name: "Protector of the Paths",   nameJa: "道の守護者",            pts: 20 },
    ],
    "Seer Council": [
      { name: "Lucid Eye",                nameJa: "明晰なる瞳",            pts: 30 },
      { name: "Runes of Warding",         nameJa: "魔除けのルーン",        pts: 25 },
      { name: "Stone of Eldritch Fury",   nameJa: "怪怒の宝玉",            pts: 15 },
      { name: "Torc of Morai-Heg",        nameJa: "モライ＝ヘグの金輪",    pts: 20 },
    ],
    "Serpent's Brood": [
      { name: "Fanged Leer",              nameJa: "牙の睨み",              pts: 10 },
      { name: "Key of Ghosts",            nameJa: "幽幻の鍵",              pts: 20 },
      { name: "Shedskin Raiment",         nameJa: "抜け殻の装束",          pts: 25 },
      { name: "Weavers' Wail",            nameJa: "織り手の慟哭",          pts: 20 },
    ],
    "Spirit Conclave": [
      { name: "Higher Duty",              nameJa: "崇高なる責務",          pts: 25 },
      { name: "Light of Clarity",         nameJa: "明晰の光",              pts: 30 },
      { name: "Rune of Mists",            nameJa: "霧のルーン",            pts: 10 },
      { name: "Stave of Kurnous",         nameJa: "クルノスの杖",          pts: 15 },
    ],
    "Warhost": [
      { name: "Gift of Foresight",        nameJa: "先見の恩寵",            pts: 15 },
      { name: "Phoenix Gem",              nameJa: "不死鳥石",              pts: 35 },
      { name: "Psychic Destroyer",        nameJa: "異能の破壊者",          pts: 30 },
      { name: "Timeless Strategist",      nameJa: "不朽の戦略家",          pts: 15 },
    ],
    "Windrider Host": [
      { name: "Echoes of Ulthanesh",      nameJa: "ウルサネッシュの残響",  pts: 20 },
      { name: "Firstdrawn Blade",         nameJa: "抜き討ちの刃",          pts: 10 },
      { name: "Mirage Field",             nameJa: "ミラージュフィールド",  pts: 25 },
      { name: "Seersight Strike",         nameJa: "予見者の一撃",          pts: 15 },
    ],
  },

  // ─── Drukhari ─────────────────────────────────────────────────────────────
  drukhari: {
    "Realspace Raiders": [
      { name: "Crucible of Malediction",  nameJa: "呪いの坩堝",            pts: 20 },
      { name: "Dark Vitality",            nameJa: "禍々しき生命力",        pts: 25 },
      { name: "Eye of Spite",             nameJa: "悪意の双眸",            pts: 15 },
      { name: "Labyrinthine Cunning",     nameJa: "深遠なる狡猾さ",        pts: 25 },
    ],
    "Skysplinter Assault": [
      { name: "Nightmare Shroud",         nameJa: "悪夢の帷",              pts: 20 },
      { name: "Phantasmal Smoke",         nameJa: "幻惑の霞",              pts: 15 },
      { name: "Sadistic Fulcrum",         nameJa: "嗜虐の破片",            pts: 15 },
      { name: "Spiteful Raider",          nameJa: "凶悪なる略奪者",        pts: 10 },
    ],
    "Spectacle of Spite": [
      { name: "Chronoshard",              nameJa: "クロノシャード",        pts: 15 },
      { name: "Morghenna's Curse",        nameJa: "モルグヘンナの呪い",    pts: 20 },
      { name: "Periapt of Torments",      nameJa: "苦悶の呪符",            pts: 25 },
      { name: "Pharmacophex",             nameJa: "薬剤集合反応装置",      pts: 15 },
    ],
    "Covenite Coterie": [
      { name: "Master Artisan",           nameJa: "巨匠",                  pts: 20 },
      { name: "Master Nemesine",          nameJa: "マスター・ネメシン",    pts: 5  },
      { name: "Master Regenesist",        nameJa: "再生の達人",            pts: 25 },
      { name: "Master Repugnomancer",     nameJa: "卓越した不浄術師",      pts: 15 },
    ],
    "Kabalite Cartel": [
      { name: "Informant Network",        nameJa: "諜報網",                pts: 30 },
      { name: "Leechbite Plate",          nameJa: "吸血牙の装甲服",        pts: 5  },
      { name: "Towering Arrogance",       nameJa: "宙天に届く傲慢",        pts: 20 },
      { name: "Webway Awl",               nameJa: "網辻通し",              pts: 25 },
    ],
    "Reaper's Wager": [
      { name: "Archraider",               nameJa: "卓越せし略奪者",        pts: 15 },
      { name: "Conductor of Torment",     nameJa: "嗜虐の王",              pts: 20 },
      { name: "Reaper's Cowl",            nameJa: "死神の隠身装束",        pts: 25 },
      { name: "Webway Walker",            nameJa: "〈網辻〉を歩む者",      pts: 15 },
    ],
  },

  // ─── Necrons ──────────────────────────────────────────────────────────────
  necrons: {
    "Awakened Dynasty": [
      { name: "Enaegic Dermal Bond",      nameJa: "活性子外皮結合",        pts: 30 },
      { name: "Nether-realm Casket",      nameJa: "冥界の棺",              pts: 20 },
      { name: "Phasal Subjugator",        nameJa: "位相服属器",            pts: 35 },
      { name: "Veil of Darkness",         nameJa: "暗闇のヴェール",        pts: 20 },
    ],
    "Annihilation Legion": [
      { name: "Eldritch Nightmare",       nameJa: "妖々しき悪夢",          pts: 15 },
      { name: "Eternal Madness",          nameJa: "終わりなき狂気",        pts: 25 },
      { name: "Ingrained Superiority",    nameJa: "刻まれた優位",          pts: 10 },
      { name: "Soulless Reaper",          nameJa: "魂無き収穫者",          pts: 20 },
    ],
    "Canoptek Court": [
      { name: "Autodivinator",            nameJa: "自動占術機",            pts: 15 },
      { name: "Dimensional Sanctum",      nameJa: "超次元の部屋",          pts: 20 },
      { name: "Hyperphasic Fulcrum",      nameJa: "超多相支点軸",          pts: 15 },
      { name: "Metalodermal Tesla Weave", nameJa: "メタロダーマル・テスラ布", pts: 10 },
    ],
    "Obeisance Phalanx": [
      { name: "Eternal Conqueror",        nameJa: "永遠の征服者",          pts: 25 },
      { name: "Honourable Combatant",     nameJa: "誇り高き闘士",          pts: 10 },
      { name: "Unflinching Will",         nameJa: "果敢なる意志",          pts: 20 },
      { name: "Warrior Noble",            nameJa: "貴人戦士",              pts: 15 },
    ],
    "Hypercrypt Legion": [
      { name: "Arisen Tyrant",            nameJa: "蘇りし暴君",            pts: 25 },
      { name: "Dimensional Overseer",     nameJa: "次元監督者",            pts: 25 },
      { name: "Hyperspatial Transfer Node", nameJa: "超空間転移ノード",    pts: 15 },
      { name: "Osteoclave Fulcrum",       nameJa: "骨の三角鍵",            pts: 20 },
    ],
    "Starshatter Arsenal": [
      { name: "Chrono-impedance Fields",  nameJa: "時間流抑制フィールド",  pts: 25 },
      { name: "Demanding Leader",         nameJa: "厳格なる指揮官",        pts: 10 },
      { name: "Dread Majesty",            nameJa: "大いなる威厳",          pts: 30 },
      { name: "Miniaturised Nebuloscope", nameJa: "小型透視装置",          pts: 15 },
    ],
    "Cryptek Conclave": [
      { name: "Atomic Disintegrators",    nameJa: "原子分解装置",          pts: 10 },
      { name: "Gauntlet of Compression",  nameJa: "圧縮ガントレット",      pts: 20 },
      { name: "Gravitic Bolas",           nameJa: "重力ボーラ",            pts: 15 },
      { name: "Quantum Abacus",           nameJa: "量子計算器",            pts: 15 },
    ],
    "Cursed Legion": [
      { name: "Cursed Circlet",           nameJa: "呪われし頭冠",          pts: 25 },
      { name: "Destroyer Ankh",           nameJa: "破壊者の護符",          pts: 20 },
      { name: "Mark of the Nekrosor",     nameJa: "ネクロソールの印",      pts: 20 },
      { name: "Murdermind",               nameJa: "殺意",                  pts: 15 },
    ],
    "Pantheon of Woe": [
      { name: "Animus Damper",            nameJa: "アニムス減衰機",        pts: 35 },
      { name: "Quantum Goad",             nameJa: "量子ゴード",            pts: 45 },
      { name: "Relativistic Tether",      nameJa: "相対性テザー",          pts: 40 },
      { name: "Singularity Matrix",       nameJa: "特異点マトリクス",      pts: 55 },
    ],
  },

  // ─── Tyranids ─────────────────────────────────────────────────────────────
  tyranids: {
    "Invasion Fleet": [
      { name: "Adaptive Biology",         nameJa: "生理的適応／適応生体",  pts: 25 },
      { name: "Alien Cunning",            nameJa: "異質なる狡猾さ",        pts: 30 },
      { name: "Perfectly Adapted",        nameJa: "完全なる適応",          pts: 15 },
      { name: "Synaptic Linchpin",        nameJa: "シナプスの要",          pts: 20 },
    ],
    "Crusher Stampede": [
      { name: "Enraged Reserves",         nameJa: "湧きあふれる激情",      pts: 20 },
      { name: "Monstrous Nemesis",        nameJa: "宿敵たる怪物",          pts: 25 },
      { name: "Null Nodules",             nameJa: "虚無の塊",              pts: 10 },
      { name: "Ominous Presence",         nameJa: "不吉なる存在感",        pts: 15 },
    ],
    "Unending Swarm": [
      { name: "Adrenalised Onslaught",    nameJa: "アドレナリン猛攻",      pts: 15 },
      { name: "Naturalised Camouflage",   nameJa: "環境順応擬態",          pts: 30 },
      { name: "Piercing Talons",          nameJa: "貫きの鉤爪",            pts: 25 },
      { name: "Relentless Hunger",        nameJa: "無慈悲なる飢え",        pts: 20 },
    ],
    "Assimilation Swarm": [
      { name: "Biophagic Flow",           nameJa: "生体侵食細菌流",        pts: 10 },
      { name: "Instinctive Defence",      nameJa: "防衛本能",              pts: 15 },
      { name: "Parasitic Biomorphology",  nameJa: "寄生型変異形態",        pts: 25 },
      { name: "Regenerating Monstrosity", nameJa: "不死身の怪物",          pts: 20 },
    ],
    "Vanguard Onslaught": [
      { name: "Chameleonic",              nameJa: "体色変化",              pts: 15 },
      { name: "Hunting Grounds",          nameJa: "大いなる狩り場",        pts: 20 },
      { name: "Neuronode",               nameJa: "神経網結節点",           pts: 20 },
      { name: "Stalker",                  nameJa: "ストーカー",            pts: 10 },
    ],
    "Synaptic Nexus": [
      { name: "Power of the Hive Mind",   nameJa: "群巣意識体の力",        pts: 10 },
      { name: "Psychostatic Disruption",  nameJa: "精神破砕",              pts: 30 },
      { name: "Synaptic Control",         nameJa: "シナプスの支配",        pts: 20 },
      { name: "The Dirgeheart of Kharis", nameJa: "カーリスの哀しき心臓",  pts: 15 },
    ],
    "Subterranean Assault": [
      { name: "Synaptic Strategy",        nameJa: "シナプス戦略",          pts: 15 },
      { name: "Tremor Senses",            nameJa: "振動感知",              pts: 20 },
      { name: "Trygon Prime",             nameJa: "トライゴン・プライム",  pts: 20 },
      { name: "Vanguard Intellect",       nameJa: "先遣個体の狡知",        pts: 15 },
    ],
    "Warrior Bioform Onslaught": [
      { name: "Elevated Might",           nameJa: "筋力増強",              pts: 30 },
      { name: "Ocular Adaptation",        nameJa: "高知覚適応",            pts: 20 },
      { name: "Sensory Assimilation",     nameJa: "感覚共有",              pts: 20 },
      { name: "Synaptic Tyrant",          nameJa: "シナプスの暴君",        pts: 10 },
    ],
  },

  // ─── Space Marines ────────────────────────────────────────────────────────
  space_marines: {
    "Gladius Task Force": [
      { name: "Adept of the Codex",       nameJa: "聖典の習熟者",          pts: 20 },
      { name: "Artificer Armour",         nameJa: "アーティファイサー・アーマー", pts: 10 },
      { name: "Fire Discipline",          nameJa: "規律ある射撃",          pts: 25 },
      { name: "The Honour Vehement",      nameJa: "烈士の誉れ",            pts: 15 },
    ],
    "1st Company Task Force": [
      { name: "Fear Made Manifest",       nameJa: "顕現せし恐怖",          pts: 30 },
      { name: "Iron Resolve",             nameJa: "鉄の意志",              pts: 15 },
      { name: "Rites of War",             nameJa: "戦闘典礼",              pts: 10 },
      { name: "The Imperium's Sword",     nameJa: "帝国の剣",              pts: 25 },
    ],
    "Anvil Siege Force": [
      { name: "Architect of War",         nameJa: "戦場の築城技師",        pts: 25 },
      { name: "Fleet Commander",          nameJa: "艦隊司令",              pts: 15 },
      { name: "Indomitable Fury",         nameJa: "揺るがざる憤怒",        pts: 20 },
      { name: "Stoic Defender",           nameJa: "堅忍たる守り手",        pts: 15 },
    ],
    "Bastion Task Force": [
      { name: "Blades of Valour",         nameJa: "武勇の剣",              pts: 15 },
      { name: "Bombast Omnivox",          nameJa: "轟音全周ヴォクス装置",  pts: 15 },
      { name: "Eye of the Primarch",      nameJa: "総主長の目",            pts: 10 },
      { name: "Hero of the Chapter",      nameJa: "戦団の英雄",            pts: 20 },
    ],
    "Firestorm Assault Force": [
      { name: "Adamantine Mantle",        nameJa: "アダマンチウムの外套",  pts: 20 },
      { name: "Champion of Humanity",     nameJa: "人類の筆頭戦士",        pts: 10 },
      { name: "Forged in Battle",         nameJa: "戦闘による鍛練",        pts: 15 },
      { name: "War-tempered Artifice",    nameJa: "戦に鍛えられし逸品",    pts: 25 },
    ],
    "Ironstorm Spearhead": [
      { name: "Adept of the Omnissiah",   nameJa: "万機神の信奉者",        pts: 35 },
      { name: "Master of Machine War",    nameJa: "機械戦闘の熟練者",      pts: 20 },
      { name: "Target Augury Web",        nameJa: "照準占術網",            pts: 30 },
      { name: "The Flesh is Weak",        nameJa: "肉体は脆弱なり",        pts: 10 },
    ],
    "Stormlance Task Force": [
      { name: "Feinting Withdrawal",      nameJa: "偽装退却",              pts: 10 },
      { name: "Fury of the Storm",        nameJa: "荒れ狂う嵐",            pts: 25 },
      { name: "Hunter's Instincts",       nameJa: "狩人の本能",            pts: 25 },
      { name: "Portents of Wisdom",       nameJa: "叡智の兆し",            pts: 15 },
    ],
    "Vanguard Spearhead": [
      { name: "Execute and Redeploy",     nameJa: "遂行し、再編せよ",      pts: 20 },
      { name: "Ghostweave Cloak",         nameJa: "幽霊織りの外套",        pts: 15 },
      { name: "Shadow War Veteran",       nameJa: "影の戦争の古参兵",      pts: 30 },
      { name: "The Blade Driven Deep",    nameJa: "突き立てられた刃",      pts: 25 },
    ],
  },

  // ─── Dark Angels ──────────────────────────────────────────────────────────
  dark_angels: {
    "Unforgiven Task Force": [
      { name: "Pennant of Remembrance",       nameJa: "追悼の三角旗",      pts: 10 },
      { name: "Shroud of Heroes",             nameJa: "英雄の屍衣",        pts: 25 },
      { name: "Stubborn Tenacity",            nameJa: "断固たる粘り強さ",  pts: 15 },
      { name: "Weapons of the First Legion",  nameJa: "第一軍団の武器",    pts: 15 },
    ],
    "Inner Circle Task Force": [
      { name: "Champion of the Deathwing",    nameJa: "死翼の筆頭戦士",    pts: 15 },
      { name: "Deathwing Assault",            nameJa: "死翼の襲来",        pts: 30 },
      { name: "Eye of the Unseen",            nameJa: "不可視の眼",        pts: 10 },
      { name: "Singular Will",               nameJa: "断固たる意志",       pts: 20 },
    ],
  },

  // ─── Space Wolves ─────────────────────────────────────────────────────────
  space_wolves: {
    "Champions of Russ": [
      { name: "Collar of Fell Fangs",     nameJa: "牙紋の首飾り",          pts: 15 },
      { name: "Fate of the Enemy",        nameJa: "敵の運命",              pts: 15 },
      { name: "Stormstrike Master",       nameJa: "大踏みの闘士",          pts: 20 },
      { name: "Wisdom of the Wolf",       nameJa: "狼の叡智",              pts: 30 },
    ],
  },

  // ─── Chaos Space Marines ──────────────────────────────────────────────────
  chaos_space_marines: {
    "Veterans of the Long War": [
      { name: "Eager for Vengeance",      nameJa: "復讐への闘志",          pts: 20 },
      { name: "Eye of Abaddon",           nameJa: "アバドンの眼",          pts: 15 },
      { name: "Mark of Legend",           nameJa: "伝説の紋章",            pts: 10 },
      { name: "Warmaster's Gift",         nameJa: "大元帥の恩寵",          pts: 15 },
    ],
    "Deceptors": [
      { name: "Cursed Fang",              nameJa: "呪われし牙",            pts: 10 },
      { name: "Falsehood",                nameJa: "嘘と偽り",              pts: 10 },
      { name: "Shroud of Obfuscation",    nameJa: "撹乱の被覆",            pts: 15 },
      { name: "Soul Link",                nameJa: "魂の連結",              pts: 5  },
    ],
    "Renegade Raiders": [
      { name: "Despot's Claim",           nameJa: "専制者の支配",          pts: 15 },
      { name: "Dread Reaver",             nameJa: "恐るべき略奪者",        pts: 15 },
      { name: "Mark of the Hound",        nameJa: "\"猟犬\"の紋章",        pts: 25 },
      { name: "Tyrant's Lash",            nameJa: "暴君の鞭",              pts: 20 },
    ],
    "Dread Talons": [
      { name: "Eater of Dread",           nameJa: "恐怖を貪る者",          pts: 15 },
      { name: "Night's Shroud",           nameJa: "闇夜の帷",              pts: 20 },
      { name: "Warp-fuelled Thrusters",   nameJa: "〈歪み〉のスラスター",  pts: 20 },
      { name: "Willbreaker",              nameJa: "意志を砕くもの",        pts: 10 },
    ],
    "Fellhammer Siege-host": [
      { name: "Bastion Plate",            nameJa: "鉄壁の鎧",              pts: 10 },
      { name: "Iron Artifice",            nameJa: "鋼鉄の術策",            pts: 10 },
      { name: "Ironbound Enmity",         nameJa: "揺るがざる憎悪",        pts: 15 },
      { name: "Warp Tracer",              nameJa: "〈歪み〉の曳光弾",      pts: 20 },
    ],
    "Pactbound Zealots": [
      { name: "Eye of Tzeentch",          nameJa: "ティーンチの眼",        pts: 15 },
      { name: "Intoxicating Elixir",      nameJa: "陶酔の霊薬",            pts: 15 },
      { name: "Orbs of Unlife",           nameJa: "死の珠玉",              pts: 15 },
      { name: "Talisman of Burning Blood",nameJa: "燃え盛る血の首飾り",    pts: 15 },
    ],
    "Chaos Cult": [
      { name: "Amulet of Tainted Vigour", nameJa: "穢れし気炎のアミュレット", pts: 20 },
      { name: "Cultist's Brand",          nameJa: "狂信徒の烙印",          pts: 20 },
      { name: "Incendiary Goad",          nameJa: "扇動の突き棒",          pts: 15 },
      { name: "Warped Foresight",         nameJa: "歪みたる予見",          pts: 10 },
    ],
    "Soulforged Warpack": [
      { name: "Forge's Blessing",         nameJa: "炉の祝福",              pts: 20 },
      { name: "Invigorated Mechatendrils",nameJa: "貪欲なる機械触手",      pts: 15 },
      { name: "Tempting Addendum",        nameJa: "魅力的な添物",          pts: 25 },
      { name: "Soul Harvester",           nameJa: "魂の収穫者",            pts: 15 },
    ],
    "Cabal of Chaos": [
      { name: "Eye of Z'desh",            nameJa: "ズデシュの眼",          pts: 25 },
      { name: "Infernal Avatar",          nameJa: "地獄の化身",            pts: 20 },
      { name: "Mind Blade",               nameJa: "精神の刃",              pts: 25 },
      { name: "Touched by the Warp",      nameJa: "歪みに触れられし者",    pts: 10 },
    ],
    "Creations of Bile": [
      { name: "Helm of All-seeing",       nameJa: "全知の兜",              pts: 25 },
      { name: "Living Carapace",          nameJa: "生ける装甲",            pts: 15 },
      { name: "Prime Test Subject",       nameJa: "成功実験体",            pts: 35 },
      { name: "Surgical Precision",       nameJa: "寸分違わぬ攻撃",        pts: 10 },
    ],
    "Nightmare Hunt": [
      { name: "Greyveil Hex",             nameJa: "灰とばりの呪い",        pts: 25 },
      { name: "Sorrowscent Vulture",      nameJa: "悲哀嗅ぎのハゲタカ",   pts: 35 },
      { name: "Terrorglut Parasite",      nameJa: "恐怖喰らいの寄生体",    pts: 20 },
      { name: "Warp-fuelled Thrusters",   nameJa: "〈歪み〉のスラスター",  pts: 20 },
    ],
    "Huron's Marauders": [
      { name: "Dread Repute",             nameJa: "恐るべき悪名",          pts: 25 },
      { name: "Lust for Bloodshed",       nameJa: "流血への渇望",          pts: 30 },
      { name: "Marauder Chief",           nameJa: "略奪隊長",              pts: 20 },
      { name: "Voice of the Tyrant",      nameJa: "暴君の声",              pts: 25 },
    ],
    "Renegade Warband": [
      { name: "Empyric Symbiote",         nameJa: "異界共生体",            pts: 15 },
      { name: "Eyes of the Hunter",       nameJa: "狩人の目",              pts: 15 },
      { name: "Fratricidal Trophies",     nameJa: "同胞の首級",            pts: 5  },
      { name: "Weaponised Hatred",        nameJa: "憎悪を武器と成せ",      pts: 35 },
    ],
  },

  // ─── Grey Knights ─────────────────────────────────────────────────────────
  grey_knights: {
    "Brotherhood Strike": [
      { name: "Banishing Wave",           nameJa: "退魔の波動",            pts: 20 },
      { name: "Blinding Aura",            nameJa: "まばゆきオーラ",        pts: 10 },
      { name: "Purity of Purpose",        nameJa: "純然たる決意",          pts: 15 },
      { name: "Tome of Forbidden Ways",   nameJa: "禁じられし道の書",      pts: 25 },
    ],
    "Hallowed Conclave": [
      { name: "Eye of the Augurium",      nameJa: "予兆の目",              pts: 25 },
      { name: "Inescapable Judgement",    nameJa: "免れ得ぬ裁き",          pts: 20 },
      { name: "Nemesis Rounds",           nameJa: "ネメシス弾",            pts: 10 },
      { name: "Sanctic Reaper",           nameJa: "神聖なる死神",          pts: 15 },
    ],
    "Banishers": [
      { name: "Pyresoul",                 nameJa: "魂の猛火",              pts: 20 },
      { name: "Sigil of the Hunt",        nameJa: "狩りの印章",            pts: 10 },
      { name: "The Ephemeral Tome",       nameJa: "刹那の大冊",            pts: 15 },
      { name: "The Sixty-sixth Seal",     nameJa: "第六十六の封印",        pts: 25 },
    ],
    "Sanctic Spearhead": [
      { name: "Driven by Duty",           pts: 10 },
      { name: "Quickening Foci",          pts: 15 },
      { name: "Sigil of Exigence",        pts: 30 },
      { name: "Spiritus Machina",         pts: 25 },
    ],
    "Augurium Task Force": [
      { name: "A Foot in the Future",     nameJa: "未来への足取り",        pts: 15 },
      { name: "Doomseer's Amulet",        nameJa: "終末予言者のアミュレット", pts: 25 },
      { name: "Grimoire of Conjunctions", nameJa: "星合のグリモワール",    pts: 10 },
      { name: "Shield of Prophecy",       nameJa: "預言の盾",              pts: 20 },
    ],
    "Warpbane Task Force": [
      { name: "Mandulian Reliquary",      pts: 20 },
      { name: "Paragon of Sanctity",      pts: 10 },
      { name: "Phial of the Abyss",       pts: 25 },
      { name: "Radiant Champion",         pts: 15 },
    ],
  },

  // ─── Adepta Sororitas ─────────────────────────────────────────────────────
  adepta_sororitas: {
    "Hallowed Martyrs": [
      { name: "Chaplet of Sacrifice",     pts: 25 },
      { name: "Mantle of Ophelia",        pts: 20 },
      { name: "Saintly Example",          pts: 10 },
      { name: "Through Suffering, Strength", pts: 25 },
    ],
    "Penitent Host": [
      { name: "Catechism of Divine Penitence", pts: 20 },
      { name: "Psalm of Righteous Judgement",  pts: 30 },
      { name: "Refrain of Enduring Faith",     pts: 25 },
      { name: "Verse of Holy Piety",           pts: 15 },
    ],
    "Bringers of Flame": [
      { name: "Fire and Fury",            pts: 30 },
      { name: "Iron Surplice of Saint Istalela", pts: 10 },
      { name: "Manual of Saint Griselda", pts: 20 },
      { name: "Righteous Rage",           pts: 15 },
    ],
    "Army of Faith": [
      { name: "Blade of Saint Ellynor",   pts: 15 },
      { name: "Divine Aspect",            pts: 5  },
      { name: "Litanies of Faith",        pts: 10 },
      { name: "Triptych of the Macharian Crusade", pts: 20 },
    ],
    "Champions of Faith": [
      { name: "Eyes of the Oracle",       pts: 10 },
      { name: "Mark of Devotion",         pts: 30 },
      { name: "Sanctified Amulet",        pts: 25 },
      { name: "Triptych of Judgement",    pts: 15 },
    ],
  },

  // ─── Adeptus Custodes ─────────────────────────────────────────────────────
  adeptus_custodes: {
    "Talons of the Emperor": [
      { name: "Aegis Projector",          pts: 20 },
      { name: "Champion of the Imperium", pts: 25 },
      { name: "Gift of Terran Artifice",  pts: 15 },
      { name: "Radiant Mantle",           pts: 30 },
    ],
    "Shield Host": [
      { name: "Auric Mantle",             pts: 15 },
      { name: "Castellan's Mark",         pts: 20 },
      { name: "From the Hall of Armouries", pts: 25 },
      { name: "Panoptispex",              pts: 5  },
    ],
    "Null Maiden Vigil": [
      { name: "Enhanced Voidsheen Cloak", pts: 10 },
      { name: "Huntress' Eye",            pts: 15 },
      { name: "Oblivion Knight",          pts: 25 },
      { name: "Raptor Blade",             pts: 5  },
    ],
    "Auric Champions": [
      { name: "Blade Imperator",          pts: 25 },
      { name: "Inspirational Exemplar",   pts: 10 },
      { name: "Martial Philosopher",      pts: 30 },
      { name: "Veiled Blade",             pts: 25 },
    ],
    "Solar Spearhead": [
      { name: "Adamantine Talisman",      pts: 25 },
      { name: "Augury Uplink",            pts: 35 },
      { name: "Honoured Fallen",          pts: 15 },
      { name: "Veteran of the Kataphraktoi", pts: 10 },
    ],
    "Lions of the Emperor": [
      { name: "Admonimortis",             pts: 10 },
      { name: "Fierce Conqueror",         pts: 15 },
      { name: "Praesidius",               pts: 25 },
      { name: "Superior Creation",        pts: 25 },
    ],
  },

  // ─── Adeptus Mechanicus ───────────────────────────────────────────────────
  adeptus_mechanicus: {
    "Rad-Zone Corps": [
      { name: "Autoclavic Denunciation",  pts: 15 },
      { name: "Malphonic Susurrus",       pts: 20 },
      { name: "Peerless Eradicator",      pts: 20 },
      { name: "Radial Suffusion",         pts: 25 },
    ],
    "Skitarii Hunter Cohort": [
      { name: "Battle-sphere Uplink",     pts: 30 },
      { name: "Cantic Thrallnet",         pts: 25 },
      { name: "Clandestine Infiltrator",  pts: 20 },
      { name: "Veiled Hunter",            pts: 10 },
    ],
    "Data-Psalm Conclave": [
      { name: "Data-blessed Autosermon",  pts: 20 },
      { name: "Mantle of the Gnosticarch", pts: 15 },
      { name: "Mechanicus Locum",         pts: 10 },
      { name: "Temporcopia",              pts: 25 },
    ],
    "Explorator Maniple": [
      { name: "Artisan",                  pts: 15 },
      { name: "Genetor",                  pts: 25 },
      { name: "Logis",                    pts: 20 },
      { name: "Magos",                    pts: 15 },
    ],
    "Cohort Cybernetica": [
      { name: "Arch-negator",             pts: 10 },
      { name: "Emotionless Clarity",      pts: 15 },
      { name: "Lord of Machines",         pts: 20 },
      { name: "Necromechanic",            pts: 25 },
    ],
    "Haloscreed Battle Clade": [
      { name: "Cognitive Reinforcement",  pts: 35 },
      { name: "Inloaded Lethality",       pts: 15 },
      { name: "Sanctified Ordnance",      pts: 10 },
      { name: "Transoracular Dyad Wafers", pts: 15 },
    ],
  },

  // ─── Astra Militarum ─────────────────────────────────────────────────────
  astra_militarum: {
    "Combined Arms": [
      { name: "Death Mask of Ollanius",   pts: 10 },
      { name: "Drill Commander",          pts: 20 },
      { name: "Grand Strategist",         pts: 15 },
      { name: "Reactive Command",         pts: 15 },
    ],
    "Siege Regiment": [
      { name: "Eager Advance",            pts: 20 },
      { name: "Flash Grenades",           pts: 20 },
      { name: "Legacy Sidearm",           pts: 10 },
      { name: "Stalwart's Honours",       pts: 15 },
    ],
    "Mechanised Assault": [
      { name: "Bold Leadership",          pts: 25 },
      { name: "Sacred Unguents",          pts: 10 },
      { name: "Smoke Grenades",           pts: 10 },
      { name: "Vanguard Honours",         pts: 15 },
    ],
    "Hammer of the Emperor": [
      { name: "Calm Under Fire",          pts: 15 },
      { name: "Indomitable Steed",        pts: 15 },
      { name: "Regimental Banner",        pts: 20 },
      { name: "Veteran Crew",             pts: 20 },
    ],
    "Recon Element": [
      { name: "Guerrilla Honours",        pts: 25 },
      { name: "Scare Gas Grenades",       pts: 5  },
      { name: "Survival Gear",            pts: 5  },
      { name: "Tripwires",                pts: 20 },
    ],
    "Bridgehead Strike": [
      { name: "Advance Augury",           pts: 15 },
      { name: "Bombast-class Vox-array",  pts: 35 },
      { name: "Priority-drop Beacon",     pts: 30 },
      { name: "Shroud Projector",         pts: 15 },
    ],
    "Grizzled Company": [
      { name: "Abhuman Detail",           pts: 20 },
      { name: "Aquilan Eye",              pts: 20 },
      { name: "Laud Hailer",              pts: 10 },
      { name: "Spec Ops Veteran",         pts: 15 },
    ],
  },

  // ─── T'au Empire ──────────────────────────────────────────────────────────
  t_au_empire: {
    "Kauyon": [
      { name: "Exemplar of the Kauyon",           pts: 20 },
      { name: "Precision of the Patient Hunter",  pts: 15 },
      { name: "Solid-image Projection Unit",      pts: 30 },
      { name: "Through Unity, Devastation",       pts: 40 },
    ],
    "Mont'ka": [
      { name: "Coordinated Exploitation",         pts: 40 },
      { name: "Exemplar of the Mont'ka",          pts: 10 },
      { name: "Strategic Conqueror",              pts: 15 },
      { name: "Strike Swiftly",                   pts: 25 },
    ],
    "Retaliation Cadre": [
      { name: "Internal Grenade Racks",           pts: 20 },
      { name: "Prototype Weapon System",          pts: 15 },
      { name: "Puretide Engram Neurochip",        pts: 25 },
      { name: "Starflare Ignition System",        pts: 20 },
    ],
    "Kroot Hunting Pack": [
      { name: "Borthrod Gland",                   pts: 15 },
      { name: "Kroothawk Flock",                  pts: 10 },
      { name: "Nomadic Hunter",                   pts: 20 },
      { name: "Root-carved Weapons",              pts: 10 },
    ],
    "Auxiliary Cadre": [
      { name: "Admired Leader",                   pts: 20 },
      { name: "Fanatical Convert",                pts: 10 },
      { name: "Student of Kauyon",                pts: 15 },
      { name: "Transponder Lock Module",          pts: 25 },
    ],
    "Experimental Prototype Cadre": [
      { name: "Fusion Blades",                    pts: 25 },
      { name: "Plasma Accelerator Rifle",         pts: 10 },
      { name: "Supernova Launcher",               pts: 15 },
      { name: "Thermoneutronic Projector",        pts: 20 },
    ],
  },

  // ─── Genestealer Cults ────────────────────────────────────────────────────
  genestealer_cults: {
    "Host of Ascension": [
      { name: "A Chink in Their Armour",  pts: 20 },
      { name: "Assassination Edict",      pts: 15 },
      { name: "Our Time Is Nigh",         pts: 20 },
      { name: "Prowling Agitant",         pts: 15 },
    ],
    "Xenocreed Congregation": [
      { name: "Deeds That Speak to the Masses", pts: 25 },
      { name: "Denunciator of Tyrants",   pts: 25 },
      { name: "Gene-sire's Reliquant",    pts: 5  },
      { name: "Incendiary Inspiration",   pts: 15 },
    ],
    "Biosanctic Broodsurge": [
      { name: "Alien Majesty",            pts: 15 },
      { name: "Biomorph Adaptation",      pts: 25 },
      { name: "Mutagenic Regeneration",   pts: 10 },
      { name: "Predatory Instincts",      pts: 20 },
    ],
    "Outlander Claw": [
      { name: "Assault Commando",         pts: 15 },
      { name: "Cartographic Data-leech",  pts: 10 },
      { name: "Serpentine Tactics",       pts: 10 },
      { name: "Starfall Shells",          pts: 10 },
    ],
    "Brood Brother Auxilia": [
      { name: "Adaptive Reprisal",        pts: 15 },
      { name: "Firepoint Commander",      pts: 10 },
      { name: "Martial Espionage",        pts: 25 },
      { name: "The Hero Returned",        pts: 20 },
    ],
    "Final Day": [
      { name: "Enraptured Damnation",     pts: 10 },
      { name: "Inhuman Integration",      pts: 20 },
      { name: "Synaptic Auger",           pts: 15 },
      { name: "Vanguard Tyrant",          pts: 25 },
    ],
  },

  // ─── Leagues of Votann ────────────────────────────────────────────────────
  leagues_of_votann: {
    "Needgaârd Oathband": [
      { name: "Ancestral Crest",          pts: 15 },
      { name: "Dead Reckoning",           pts: 10 },
      { name: "Iron Ambassador",          pts: 5  },
      { name: "Oathbound Speculator",     pts: 30 },
    ],
    "Persecution Prospect": [
      { name: "Eye for Weakness",         pts: 25 },
      { name: "Nomad Strategist",         pts: 20 },
      { name: "Surgical Saboteur",        pts: 10 },
      { name: "Writ of Acquisition",      pts: 10 },
    ],
    "Dêlve Assault Shift": [
      { name: "Dêlvwerke Navigator",      pts: 25 },
      { name: "Multiwave System Jammer",  pts: 10 },
      { name: "Piledriver",               pts: 15 },
      { name: "Quake Supervisor",         pts: 20 },
    ],
    "Brandfast Oathband": [
      { name: "Precursive Judgement",     pts: 15 },
      { name: "Signature Restoration",    pts: 5  },
      { name: "Tactical Alchemy",         pts: 10 },
      { name: "Trivärg Cyber Implant",    pts: 40 },
    ],
    "Hearthfyre Arsenal": [
      { name: "Calculated Tenacity",      pts: 15 },
      { name: "Fârstrydr Node",           pts: 20 },
      { name: "Graviton Vault",           pts: 5  },
      { name: "Mantle of Elders",         pts: 10 },
    ],
    "Hearthband": [
      { name: "Bastion Shield",           pts: 25 },
      { name: "High Kâhl",                pts: 30 },
      { name: "Ironskein",                pts: 10 },
      { name: "Quake Multigenerator",     pts: 15 },
    ],
    "Mercenary Oathband": [
      { name: "Asset Manipulator",        pts: 25 },
      { name: "Etacarn SB9 Targeting Implant", pts: 15 },
      { name: "Mercenary Prospector",     pts: 20 },
      { name: "Metaphysical Brokerage",   pts: 20 },
    ],
  },

  // ─── Death Guard ──────────────────────────────────────────────────────────
  death_guard: {
    "Virulent Vectorium": [
      { name: "Arch Contaminator",        pts: 25 },
      { name: "Daemon Weapon of Nurgle",  pts: 10 },
      { name: "Furnace of Plagues",       pts: 25 },
      { name: "Revolting Regeneration",   pts: 20 },
    ],
    "Mortarion's Hammer": [
      { name: "Bilemaw Blight",           nameJa: "バイルモウの悪疫",      pts: 10 },
      { name: "Eye of Affliction",        nameJa: "苦悶の眼",              pts: 20 },
      { name: "Shriekworm Familiar",      nameJa: "叫び蟲の使い魔",        pts: 15 },
      { name: "Tendrilous Emissions",     nameJa: "湧き出る触手",          pts: 30 },
    ],
    "Champions of Contagion": [
      { name: "Cornucophagus",            nameJa: "豊饒の鞴",              pts: 35 },
      { name: "Final Ingredient",         nameJa: "決め手の成分",          pts: 20 },
      { name: "Needle of Nurgle",         nameJa: "ナーグル神の針",        pts: 25 },
      { name: "Visions of Virulence",     nameJa: "腐敗の幻視",            pts: 15 },
    ],
    "Tallyband Summoners": [
      { name: "Beckoning Blight",         pts: 20 },
      { name: "Entropic Knell",           pts: 15 },
      { name: "Fell Harvester",           pts: 10 },
      { name: "Tome of Bounteous Blessings", pts: 20 },
    ],
    "Shamblerot Vectorium": [
      { name: "Lord of the Walking Pox",  pts: 15 },
      { name: "Sorrowsyphon",             pts: 10 },
      { name: "Talisman of Burgeoning",   pts: 25 },
      { name: "Witherbone Pipes",         pts: 25 },
    ],
    "Death Lord's Chosen": [
      { name: "Face of Death",            nameJa: "死の面容",              pts: 10 },
      { name: "Helm of the Fly King",     nameJa: "蠅王の兜",              pts: 20 },
      { name: "Vile Vigour",              nameJa: "不浄なる活力",          pts: 15 },
      { name: "Warprot Talisman",         nameJa: "歪み腐れの護符",        pts: 30 },
    ],
    "Flyblown Host": [
      { name: "Droning Chorus",           nameJa: "鬱々たる合唱",          pts: 15 },
      { name: "Insectile Murmuration",    nameJa: "毒蟲の騒乱",            pts: 20 },
      { name: "Plagueveil",               nameJa: "悪疫の帷",              pts: 25 },
      { name: "Rejuvenating Swarm",       nameJa: "再生の大群",            pts: 10 },
    ],
  },

  // ─── Thousand Sons ────────────────────────────────────────────────────────
  thousand_sons: {
    "Grand Coven": [
      { name: "Eldritch Vortex of E'taph", pts: 35 },
      { name: "Incandaeum",               pts: 15 },
      { name: "Lord of Forbidden Lore",   pts: 20 },
      { name: "Umbralefic Crystal",       pts: 20 },
    ],
    "Changehost of Deceit": [
      { name: "Diabolic Savant",          pts: 20 },
      { name: "Duplicitous Malediction",  pts: 15 },
      { name: "Nethershriek Mind-eater",  pts: 10 },
      { name: "Tome of True Names",       pts: 20 },
    ],
    "Warpmeld Pact": [
      { name: "Bray Lord",                pts: 15 },
      { name: "Diamond of Distortion",    pts: 20 },
      { name: "Flowing Flesh",            pts: 10 },
      { name: "Warpmeld Dagger",          pts: 10 },
    ],
    "Rubricae Phalanx": [
      { name: "Arcane Thralls",           pts: 5  },
      { name: "Lord of the Rubricae",     pts: 15 },
      { name: "Risen Rubricae",           pts: 30 },
      { name: "The Stave Abominus",       pts: 20 },
    ],
    "Warpforged Cabal": [
      { name: "Biomechanical Mutation",   pts: 15 },
      { name: "The Perplexing Cloak",     pts: 20 },
      { name: "Warp Syphon",             pts: 5  },
      { name: "Warp-cursed Runemaster",   pts: 10 },
    ],
    "Hexwarp Thrallband": [
      { name: "Arcane Might",             pts: 20 },
      { name: "Empowered Manifestation",  pts: 20 },
      { name: "Empyric Onslaught",        pts: 25 },
      { name: "Noctilith Mantle",         pts: 15 },
    ],
  },

  // ─── World Eaters ─────────────────────────────────────────────────────────
  world_eaters: {
    "Berzerker Warband": [
      { name: "Battle-lust",              nameJa: "闘争への渇望",          pts: 10 },
      { name: "Berzerker Glaive",         nameJa: "狂戦士の薙刀",          pts: 35 },
      { name: "Favoured of Khorne",       nameJa: "コーンの寵愛",          pts: 15 },
      { name: "Helm of Brazen Ire",       nameJa: "燃えたつ憤怒の兜",      pts: 30 },
    ],
    "Cult of Blood": [
      { name: "Brazen Form",              nameJa: "真鍮の肉体",            pts: 25 },
      { name: "Butcher Lord",             pts: 10 },
      { name: "Chosen of the Blood God",  pts: 15 },
      { name: "Strategic Slaughter",      pts: 20 },
    ],
    "Khorne Daemonkin": [
      { name: "Blade of Endless Bloodshed", pts: 30 },
      { name: "Blood-forged Armour",      pts: 20 },
      { name: "Disciple of Khorne",       pts: 15 },
      { name: "Icon of War",              pts: 25 },
    ],
    "Possessed Slaughterband": [
      { name: "Frenzied Focus",           pts: 20 },
      { name: "Killing Clarity",          pts: 15 },
      { name: "Malicious Vigour",         pts: 30 },
      { name: "Violent Demise",           pts: 10 },
    ],
    "Goretrack Onslaught": [
      { name: "Aggressive Deployment",    pts: 20 },
      { name: "Infernal Infusion",        pts: 25 },
      { name: "Murderous Onslaught",      pts: 5  },
      { name: "Unleash Hell",             pts: 10 },
    ],
    "Vessels of Wrath": [
      { name: "Archslaughterer",          pts: 25 },
      { name: "Avenger's Crown",          pts: 15 },
      { name: "Gateways to Glory",        pts: 10 },
      { name: "Vox-diabolus",             pts: 20 },
    ],
  },

  // ─── Emperor's Children ───────────────────────────────────────────────────
  emperor_s_children: {
    "Mercurial Host": [
      { name: "Intoxicating Musk",        pts: 20 },
      { name: "Loathsome Dexterity",      pts: 10 },
      { name: "Steeped in Suffering",     pts: 20 },
      { name: "Tactical Perfection",      pts: 15 },
    ],
    "Peerless Bladesmen": [
      { name: "Blinding Speed",           pts: 25 },
      { name: "Distortion",               pts: 25 },
      { name: "Faultless Opportunist",    pts: 15 },
      { name: "Rise to the Challenge",    pts: 30 },
    ],
    "Rapid Evisceration": [
      { name: "Accomplished Tactician",   pts: 35 },
      { name: "Heretek Adept",            pts: 35 },
      { name: "Spearhead Striker",        pts: 20 },
      { name: "Sublime Prescience",       pts: 25 },
    ],
    "Carnival of Excess": [
      { name: "Dark Blessings",           pts: 10 },
      { name: "Empyric Suffusion",        pts: 15 },
      { name: "Possessed Blade",          pts: 25 },
      { name: "Warp Walker",              pts: 30 },
    ],
    "Coterie of the Conceited": [
      { name: "Pledge of Dark Glory",     pts: 25 },
      { name: "Pledge of Eternal Servitude", pts: 25 },
      { name: "Pledge of Mortal Pain",    pts: 15 },
      { name: "Pledge of Unholy Fortune", pts: 30 },
    ],
    "Slaanesh's Chosen": [
      { name: "Eager to Prove",           pts: 15 },
      { name: "Proud and Vainglorious",   pts: 20 },
      { name: "Repulsed by Weakness",     pts: 25 },
      { name: "Slayer of Champions",      pts: 15 },
    ],
    "Court of the Phoenician": [
      { name: "Exalted Patron",           pts: 15 },
      { name: "Soulstain Made Manifest",  pts: 15 },
      { name: "Spiritsliver",             pts: 20 },
      { name: "Tears of the Phoenix",     pts: 25 },
    ],
  },

  // ─── Chaos Daemons ────────────────────────────────────────────────────────
  chaos_daemons: {
    "Daemonic Incursion": [
      { name: "A'rgath, the King of Blades", nameJa: "\"刃を統べしもの\"ア＝ルガス", pts: 20 },
      { name: "Soulstealer",              nameJa: "魂盗み",                pts: 15 },
      { name: "The Endless Gift",         nameJa: "終わりなき恵み",        pts: 30 },
      { name: "The Everstave",            nameJa: "久遠の杖",              pts: 25 },
    ],
    "Shadow Legion": [
      { name: "Fade to Darkness",         pts: 30 },
      { name: "Leaping Shadows",          pts: 25 },
      { name: "Malice Made Manifest",     pts: 25 },
      { name: "Mantle of Gloom",          pts: 20 },
    ],
    "Blood Legion": [
      { name: "Brazenmaw",                nameJa: "真鍮の大口",            pts: 15 },
      { name: "Fury's Cage",              nameJa: "激怒の檻",              pts: 20 },
      { name: "Gateway Unto Damnation",   nameJa: "破滅の大門",            pts: 10 },
      { name: "Slaughterthirst",          nameJa: "殺戮の渇望",            pts: 25 },
    ],
    "Legion of Excess": [
      { name: "Avatar of Perfection",     nameJa: "完成の化身",            pts: 15 },
      { name: "Dreaming Crown",           nameJa: "夢の宝冠",              pts: 30 },
      { name: "False Majesty",            nameJa: "虚栄の威厳",            pts: 30 },
      { name: "Soul Glutton",             nameJa: "魂の暴食者",            pts: 10 },
    ],
    "Plague Legion": [
      { name: "Cankerblight",             nameJa: "荒廃病魔の主",          pts: 15 },
      { name: "Droning Shroud",           nameJa: "羽虫の覆い",            pts: 35 },
      { name: "Font of Spores",           nameJa: "胞子溜まり",            pts: 20 },
      { name: "Maggot Maws",              nameJa: "蛆の大口",              pts: 15 },
    ],
    "Scintillating Legion": [
      { name: "Improbable Shield",        pts: 30 },
      { name: "Inescapable Eye",          pts: 10 },
      { name: "Infernal Puppeteer",       pts: 25 },
      { name: "Neverblade",               pts: 20 },
    ],
  },

  // ─── Chaos Knights ────────────────────────────────────────────────────────
  chaos_knights: {
    "Traitoris Lance": [
      { name: "Malevolent Heraldry",      pts: 30 },
      { name: "Nightmare's Master",       pts: 20 },
      { name: "Tyrant's Shadow",          pts: 25 },
      { name: "Veil of Medrengard",       pts: 35 },
    ],
    "Infernal Lance": [
      { name: "Bestial Aspect",           nameJa: "猟奇なる相貌",          pts: 20 },
      { name: "Blasphemous Engine",       nameJa: "冒涜のエンジン",        pts: 35 },
      { name: "Fleshmetal Fusion",        nameJa: "融け合うフレッシュメタル", pts: 35 },
      { name: "Knight Diabolus",          nameJa: "悪魔の騎士",            pts: 25 },
    ],
    "Lords of Dread": [
      { name: "Blade of Celerity",        nameJa: "刃の潮流",              pts: 35 },
      { name: "Blessing of the Dark Master", nameJa: "暗闇の君主の祝福",  pts: 20 },
      { name: "Mirror of Fates",          nameJa: "宿命の鏡",              pts: 30 },
      { name: "Putrid Carapace",          nameJa: "腐敗した外殻",          pts: 30 },
    ],
    "Houndpack Lance": [
      { name: "Final Howl",               nameJa: "究竟な咆哮",            pts: 20 },
      { name: "Loping Predator",          nameJa: "駆け回る捕食者",        pts: 10 },
      { name: "Panoply of the Cursed Knight", nameJa: "呪いの騎士の装具", pts: 15 },
      { name: "Preyslayer's Mantle",      nameJa: "機動兵器プレイスレイヤー", pts: 15 },
    ],
    "Iconoclast Fiefdom": [
      { name: "Diabolical Resilience",    nameJa: "怪異なる耐久力",        pts: 35 },
      { name: "Pave the Way",             nameJa: "進路開拓",              pts: 15 },
      { name: "Profane Altar",            nameJa: "邪悪なる狂信",          pts: 20 },
      { name: "Tyrant's Banner",          nameJa: "暴君の軍旗",            pts: 5  },
    ],
  },

  // ─── Imperial Knights ─────────────────────────────────────────────────────
  imperial_knights: {
    "Valourstrike Lance": [
      { name: "Bearer of the Evanescent Ion", pts: 15 },
      { name: "Bearer of the Iron Chalice",   pts: 20 },
      { name: "Bearer of the Judicant's Helm", pts: 25 },
      { name: "Bearer of the Lancer's Sigil", pts: 25 },
    ],
    "Gate Warden Lance": [
      { name: "Acquisitor-at-Arms",       nameJa: "併合官",                pts: 15 },
      { name: "Augury Halo",              nameJa: "卜占の光輪",            pts: 20 },
      { name: "Purgation's Hand",         nameJa: "浄化の手",              pts: 20 },
      { name: "Vengeful Tread",           nameJa: "復讐の足取り",          pts: 15 },
    ],
    "Questoris Companions": [
      { name: "Crushing Condemnation",    nameJa: "猛烈なる弾劾",          pts: 10 },
      { name: "Herald of Triumph",        nameJa: "勝利の先触れ",          pts: 15 },
      { name: "Pennant of Silvered Fury", pts: 15 },
      { name: "Wyrmslayer Divination",    pts: 10 },
    ],
    "Spearhead-At-Arms": [
      { name: "Fables of Nightmare",      pts: 10 },
      { name: "Martial Tuition",          pts: 15 },
      { name: "Mentor's Pride",           pts: 20 },
      { name: "Tales of Heroism",         pts: 10 },
    ],
    "Questor Forgepact": [
      { name: "Knight of the Opus Machina", nameJa: "機械紋の騎士",        pts: 20 },
      { name: "Magos Questoris",          nameJa: "クエストリス大賢人",    pts: 35 },
      { name: "Omnissian Champion",       nameJa: "万機神の闘士",          pts: 30 },
      { name: "Vocifer Magnificat",       nameJa: "崇高なる叫唱",          pts: 15 },
    ],
  },

  // ─── SM Chapter Variants (shared Gladius Task Force data) ─────────────────
  ultramarines: {
    "Gladius Task Force": [
      { name: "Adept of the Codex",       nameJa: "聖典の習熟者",          pts: 20 },
      { name: "Artificer Armour",         nameJa: "アーティファイサー・アーマー", pts: 10 },
      { name: "Fire Discipline",          nameJa: "規律ある射撃",          pts: 25 },
      { name: "The Honour Vehement",      nameJa: "烈士の誉れ",            pts: 15 },
    ],
  },
  iron_hands: {
    "Gladius Task Force": [
      { name: "Adept of the Codex",       nameJa: "聖典の習熟者",          pts: 20 },
      { name: "Artificer Armour",         nameJa: "アーティファイサー・アーマー", pts: 10 },
      { name: "Fire Discipline",          nameJa: "規律ある射撃",          pts: 25 },
      { name: "The Honour Vehement",      nameJa: "烈士の誉れ",            pts: 15 },
    ],
  },
  imperial_fists: {
    "Gladius Task Force": [
      { name: "Adept of the Codex",       nameJa: "聖典の習熟者",          pts: 20 },
      { name: "Artificer Armour",         nameJa: "アーティファイサー・アーマー", pts: 10 },
      { name: "Fire Discipline",          nameJa: "規律ある射撃",          pts: 25 },
      { name: "The Honour Vehement",      nameJa: "烈士の誉れ",            pts: 15 },
    ],
  },
  salamanders: {
    "Gladius Task Force": [
      { name: "Adept of the Codex",       nameJa: "聖典の習熟者",          pts: 20 },
      { name: "Artificer Armour",         nameJa: "アーティファイサー・アーマー", pts: 10 },
      { name: "Fire Discipline",          nameJa: "規律ある射撃",          pts: 25 },
      { name: "The Honour Vehement",      nameJa: "烈士の誉れ",            pts: 15 },
    ],
  },
  raven_guard: {
    "Gladius Task Force": [
      { name: "Adept of the Codex",       nameJa: "聖典の習熟者",          pts: 20 },
      { name: "Artificer Armour",         nameJa: "アーティファイサー・アーマー", pts: 10 },
      { name: "Fire Discipline",          nameJa: "規律ある射撃",          pts: 25 },
      { name: "The Honour Vehement",      nameJa: "烈士の誉れ",            pts: 15 },
    ],
  },
  white_scars: {
    "Gladius Task Force": [
      { name: "Adept of the Codex",       nameJa: "聖典の習熟者",          pts: 20 },
      { name: "Artificer Armour",         nameJa: "アーティファイサー・アーマー", pts: 10 },
      { name: "Fire Discipline",          nameJa: "規律ある射撃",          pts: 25 },
      { name: "The Honour Vehement",      nameJa: "烈士の誉れ",            pts: 15 },
    ],
  },

  // ─── Orks ─────────────────────────────────────────────────────────────────
  orks: {
    "War Horde": [
      { name: "Follow Me Ladz",           nameJa: "野郎ども、ついてこい！", pts: 25 },
      { name: "Headwoppa's Killchoppa",   nameJa: "ヘッドワッパの殺りチョッパ", pts: 20 },
      { name: "Kunnin' But Brutal",       nameJa: "賢くて強ええ",          pts: 15 },
      { name: "Supa-Cybork Body",         nameJa: "スーパ・サイボオルク・ボディ", pts: 15 },
    ],
    "Da Big Hunt": [
      { name: "Glory Hog",                nameJa: "栄誉貪り",              pts: 30 },
      { name: "Proper Killy",             nameJa: "本物の殺し",            pts: 15 },
      { name: "Skrag Every Stash!",       nameJa: "ひとつ残らず荒しちまえ！", pts: 25 },
      { name: "Surly as a Squiggoth",     nameJa: "スクイゴスみてえに無愛想", pts: 20 },
    ],
    "Kult of Speed": [
      { name: "Fasta Than Yooz",          nameJa: "てめえより速ええぜ",    pts: 35 },
      { name: "Speed Makes Right",        nameJa: "速い奴が正しい",        pts: 25 },
      { name: "Squig-hide Tyres",         nameJa: "スクイッグ革タイヤ",    pts: 15 },
      { name: "Wazblasta",                nameJa: "爆走親分",              pts: 10 },
    ],
    "Dread Mob": [
      { name: "Gitfinder Googlez",        nameJa: "野郎探しのゴーグル",    pts: 10 },
      { name: "Press It Fasta!",          nameJa: "メッタうち",            pts: 35 },
      { name: "Smoky Gubbinz",            nameJa: "モクモク装置",          pts: 15 },
      { name: "Supa-glowy Fing",          nameJa: "超ピカピカするブツ",    pts: 20 },
    ],
    "Green Tide": [
      { name: "Bloodthirsty Belligerence",nameJa: "血に飢えた狂暴さ",      pts: 15 },
      { name: "Brutal But Kunnin'",       nameJa: "強くて賢けぇ",          pts: 25 },
      { name: "Ferocious Show Off",       nameJa: "残虐の誇示",            pts: 10 },
      { name: "Raucous Warcaller",        nameJa: "騒々しいいくさ叫び",    pts: 20 },
    ],
    "Bully Boyz": [
      { name: "Big Gob",                  nameJa: "でっけぇ口",            pts: 20 },
      { name: "Da Biggest Boss",          nameJa: "親分の親分",            pts: 15 },
      { name: "'Eadstompa",               nameJa: "アタマ砕き",            pts: 10 },
      { name: "Tellyporta",               nameJa: "テリーポータ",          pts: 25 },
    ],
    "Taktikal Brigade": [
      { name: "Gob Boomer",               nameJa: "どデカい拡声器",        pts: 10 },
      { name: "Mek Kaptin",               nameJa: "技術屋の大将",          pts: 45 },
      { name: "Mork's Kunnin'",           nameJa: "モルクの狡知",          pts: 15 },
      { name: "Skwad Leader",             nameJa: "徒党の大将",            pts: 15 },
    ],
    "More Dakka!": [
      { name: "Da Gobshot Thunderbuss",   nameJa: "ゴブショットのラッパ銃", pts: 15 },
      { name: "Dead Shiny Shootas",       nameJa: "死ぬほどピカピカシュータ", pts: 35 },
      { name: "Targetin' Squigs",         nameJa: "ターゲッティング・スクイッグ", pts: 15 },
      { name: "Zog Off and Eat Dakka!",   nameJa: "おとなしくダッカを喰らいやがれ！", pts: 10 },
    ],
    "Freebooter Krew": [
      { name: "Bionik Workshop",          nameJa: "サイボオルク義肢の作業場", pts: 15 },
      { name: "Da Kaptin",                nameJa: "海賊船長",              pts: 10 },
      { name: "Git-spotter Squig",        nameJa: "マヌケ発見器スクイッグ", pts: 20 },
      { name: "Razgit's Magik Map",       nameJa: "ラズギットの魔法の地図", pts: 25 },
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
