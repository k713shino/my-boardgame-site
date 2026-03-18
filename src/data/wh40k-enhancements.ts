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
    ],
    "Vanguard Spearhead": [
      { name: "Execute and Redeploy",     nameJa: "遂行し、再編せよ",      pts: 20 },
      { name: "Ghostweave Cloak",         nameJa: "幽霊織りの外套",        pts: 15 },
      { name: "Shadow War Veteran",       nameJa: "影の戦争の古参兵",      pts: 30 },
      { name: "The Blade Driven Deep",    nameJa: "突き立てられた刃",      pts: 25 },
    ],
    "Blade of Ultramar": [
      { name: "Armour of Antoninus",      nameJa: "アントニヌスの装甲",    pts: 10 },
      { name: "Oath of Macragge",         nameJa: "マクラーグの誓い",      pts: 15 },
      { name: "Student of the Codex",     nameJa: "聖典の探究者",          pts: 20 },
      { name: "Veteran of Behemoth",      nameJa: "ベヒモス戦役の古参兵",  pts: 25 },
    ],
    "Emperor's Shield": [
      { name: "Champion of the Feast",    nameJa: "剣闘の礼の優勝者",      pts: 25 },
      { name: "Disciple of Rhetoricus",   nameJa: "レトリクスの教え",      pts: 10 },
      { name: "Indomitable Champion",     nameJa: "不屈の豪傑",            pts: 20 },
      { name: "Malodraxian Standard",     nameJa: "マロドラクスの戦旗",    pts: 20 },
    ],
    "Librarius Conclave": [
      { name: "Celerity",                 nameJa: "迅速",                  pts: 30 },
      { name: "Fusillade",                nameJa: "斉射",                  pts: 35 },
      { name: "Obfuscation",              nameJa: "精神撹乱",              pts: 20 },
      { name: "Prescience",               nameJa: "予見",                  pts: 25 },
    ],
    "Orbital Assault Force": [
      { name: "Dedicated Gunship",        nameJa: "専従ガンシップ",        pts: 15 },
      { name: "Laurels of Thunder",       nameJa: "天雷の月桂冠",          pts: 15 },
      { name: "Orbital Uplink Reliquary", nameJa: "軌道アップリンク聖遺物", pts: 25 },
      { name: "Veteran of the Vanguard",  nameJa: "尖撃古参同胞",          pts: 20 },
    ],
    "Reclamation Force": [
      { name: "Avenging Avatar",          nameJa: "復讐の化身",            pts: 10 },
      { name: "Liberatum",                nameJa: "リヴェラトゥム",        pts: 25 },
      { name: "Scroll of Proclamation",   nameJa: "宣言の巻物",            pts: 15 },
      { name: "Seals of Reconquest",      nameJa: "再征服の印章",          pts: 20 },
    ],
    "Shadowmark Talon": [
      { name: "Blackwing Shroud",         nameJa: "黒羽の帷",              pts: 25 },
      { name: "Coronal Susurrant",        nameJa: "ささやきの冠",          pts: 30 },
      { name: "Hunter's Instincts",       nameJa: "狩人の本能",            pts: 25 },
      { name: "Umbral Raptor",            nameJa: "影なる捕食者",          pts: 15 },
    ],
    "Spearpoint Task Force": [
      { name: "Chogorian Huntmaster",     nameJa: "チョゴリスの狩猟司",    pts: 25 },
      { name: "Hunter's Eye",             nameJa: "狩人の眼",              pts: 20 },
      { name: "Spearpoint Paragon",       nameJa: "歴戦の一番槍",          pts: 25 },
      { name: "Stormseers' Wisdom",       nameJa: "嵐見師の叡智",          pts: 15 },
    ],
    "Forgefather's Seekers": [
      { name: "Immolator",                nameJa: "焼却者",                pts: 10 },
    ],
  },

  // ─── Dark Angels ──────────────────────────────────────────────────────────
  dark_angels: {
    "Unforgiven Task Force": [
      { name: "Pennant of Remembrance",       nameJa: "追悼の三角旗",      pts: 10 },
      { name: "Shroud of Heroes",             nameJa: "英雄の屍衣",        pts: 25 },
      { name: "Stubborn Tenacity",            nameJa: "断固たる粘り強さ",  pts: 15 },
      { name: "Weapons of the First Legion",  nameJa: "第一兵団の武器",    pts: 15 },
    ],
    "Inner Circle Task Force": [
      { name: "Champion of the Deathwing",    nameJa: "死翼の筆頭戦士",    pts: 15 },
      { name: "Deathwing Assault",            nameJa: "死翼の襲来",        pts: 30 },
      { name: "Eye of the Unseen",            nameJa: "不可視の眼",        pts: 10 },
      { name: "Singular Will",               nameJa: "断固たる意志",       pts: 20 },
    ],
    "Company of Hunters": [
      { name: "Master of Manoeuvre",          nameJa: "機動の達人",        pts: 15 },
      { name: "Master-crafted Weapon",        nameJa: "マスタークラフト・ウェポン", pts: 10 },
      { name: "Mounted Strategist",           nameJa: "騎上の戦略家",      pts: 30 },
      { name: "Recon Hunter",                 nameJa: "斥候にして狩人",    pts: 20 },
    ],
    "Lion's Blade Task Force": [
      { name: "Calibanite Armaments",         nameJa: "キャリバンの武具庫", pts: 15 },
      { name: "Fulgus Magna",                 nameJa: "大いなる光輝",      pts: 20 },
      { name: "Lord of the Hunt",             nameJa: "狩人の長",          pts: 15 },
      { name: "Stalwart Champion",            nameJa: "不屈の筆頭戦士",    pts: 25 },
    ],
    "Wrath of the Rock": [
      { name: "Ancient Weapons",              nameJa: "いにしえの武器",    pts: 25 },
      { name: "Deathwing Assault",            nameJa: "死翼の襲来",        pts: 15 },
      { name: "Lord of the Ravenwing",        nameJa: "鴉翼の将",          pts: 10 },
      { name: "Tempered in Battle",           nameJa: "戦いで鍛えられしもの", pts: 10 },
    ],
  },

  // ─── Space Wolves ─────────────────────────────────────────────────────────
  space_wolves: {
    "Champions of Fenris": [
      { name: "Fangrune Pendant",         nameJa: "牙紋の首飾り",          pts: 15 },
      { name: "Foes\' Fate",           nameJa: "敵の運命",              pts: 15 },
      { name: "Longstrider",              nameJa: "大踏みの闘士",          pts: 20 },
      { name: "Wolves\' Wisdom",        nameJa: "狼の叡智",              pts: 30 },
    ],
    "Saga of the Beastslayer": [
      { name: "Elder's Guidance",         nameJa: "長老の導き",            pts: 20 },
      { name: "Helm of the Beastslayer",  nameJa: "獣殺しの兜",            pts: 15 },
      { name: "Hunter's Guile",           nameJa: "狩人の狡知",            pts: 20 },
      { name: "Wolf-touched",             nameJa: "狼に触れられし者",      pts: 15 },
    ],
    "Saga of the Bold": [
      { name: "Braggart's Steel",         nameJa: "大口叩きの鋼鉄",        pts: 20 },
      { name: "Hordeslayer",              nameJa: "大群の屠り手",          pts: 15 },
      { name: "Skjald",                   nameJa: "吟誦詩人",              pts: 15 },
      { name: "Thunderwolf's Fortitude",  nameJa: "サンダーウルフの頑強さ", pts: 25 },
    ],
    "Saga of the Great Wolf": [
      { name: "Chariots of the Storm",    nameJa: "嵐の古代戦車",          pts: 25 },
      { name: "Grimnar's Mark",           nameJa: "グリムナーの印",        pts: 20 },
      { name: "Howlmaw",                  nameJa: "吠え口",                pts: 15 },
      { name: "Skjald's Foretelling",     nameJa: "語り部の予言",          pts: 25 },
    ],
    "Saga of the Hunter": [
      { name: "Fenrisian Grit",           nameJa: "フェンリスの気迫",      pts: 15 },
      { name: "Feral Rage",               nameJa: "野生の怒り",            pts: 10 },
      { name: "Swift Hunter",             nameJa: "俊敏なる狩人",          pts: 20 },
      { name: "Wolf Master",              nameJa: "狼の長",                pts: 5  },
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
      { name: "Dread Reputation",         nameJa: "恐るべき悪名",          pts: 25 },
      { name: "Eager for Bloodshed",      nameJa: "流血への渇望",          pts: 30 },
      { name: "Raid Leader",              nameJa: "略奪隊長",              pts: 20 },
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
      { name: "Driven by Duty",           nameJa: "責務への専心",          pts: 10 },
      { name: "Quickening Foci",          nameJa: "迅速の焦点",            pts: 15 },
      { name: "Sigil of Exigence",        nameJa: "危急の印章",            pts: 30 },
      { name: "Spiritus Machina",         nameJa: "精霊装置",              pts: 25 },
    ],
    "Augurium Task Force": [
      { name: "A Foot in the Future",     nameJa: "未来への足取り",        pts: 15 },
      { name: "Doomseer's Amulet",        nameJa: "終末予言者のアミュレット", pts: 25 },
      { name: "Grimoire of Conjunctions", nameJa: "星合のグリモワール",    pts: 10 },
      { name: "Shield of Prophecy",       nameJa: "預言の盾",              pts: 20 },
    ],
    "Warpbane Task Force": [
      { name: "Mandulian Reliquary",      nameJa: "マンドゥリウスの聖骨堂", pts: 20 },
      { name: "Paragon of Sanctity",      nameJa: "聖域の化身",            pts: 10 },
      { name: "Phial of the Abyss",       nameJa: "深淵の小瓶",            pts: 25 },
      { name: "Radiant Champion",         nameJa: "光輝の勇者",            pts: 15 },
    ],
  },

  // ─── Adepta Sororitas ─────────────────────────────────────────────────────
  adepta_sororitas: {
    "Hallowed Martyrs": [
      { name: "Chaplet of Sacrifice",     nameJa: "犠牲の数珠",            pts: 25 },
      { name: "Mantle of Ophelia",        nameJa: "オフィーリアのマント",  pts: 20 },
      { name: "Saintly Example",          nameJa: "神聖なる模範",          pts: 10 },
      { name: "Through Suffering, Strength", nameJa: "受難を力とせよ",     pts: 25 },
    ],
    "Penitent Host": [
      { name: "Catechism of Divine Penitence", nameJa: "神聖なる贖罪の問答", pts: 20 },
      { name: "Psalm of Righteous Judgement",  nameJa: "聖なる敬虔の詩篇",  pts: 30 },
      { name: "Refrain of Enduring Faith",     nameJa: "堅固たる信仰の旋律", pts: 25 },
      { name: "Verse of Holy Piety",           nameJa: "神聖なる敬虔の詩節", pts: 15 },
    ],
    "Bringers of Flame": [
      { name: "Fire and Fury",            nameJa: "炎と憤怒",              pts: 30 },
      { name: "Iron Surplice of Saint Istalela", nameJa: "聖イスタエラのサープリス", pts: 10 },
      { name: "Manual of Saint Griselda", nameJa: "聖グリセルダの手引",    pts: 20 },
      { name: "Righteous Rage",           nameJa: "正義の怒り",            pts: 15 },
    ],
    "Army of Faith": [
      { name: "Blade of Saint Ellynor",   nameJa: "聖エリノールの刃",      pts: 15 },
      { name: "Divine Aspect",            nameJa: "神聖なる側面",          pts: 5  },
      { name: "Litanies of Faith",        nameJa: "信仰説話集",            pts: 10 },
      { name: "Triptych of the Macharian Crusade", nameJa: "マカリア征戦の三連祭壇画", pts: 20 },
    ],
    "Champions of Faith": [
      { name: "Eyes of the Oracle",       nameJa: "託宣者の眼",            pts: 10 },
      { name: "Mark of Devotion",         nameJa: "献身の聖痕",            pts: 30 },
      { name: "Sanctified Amulet",        nameJa: "聖別されしアミュレット", pts: 25 },
      { name: "Triptych of Judgement",    nameJa: "裁きの三連祭壇画",      pts: 15 },
    ],
  },

  // ─── Adeptus Custodes ─────────────────────────────────────────────────────
  adeptus_custodes: {
    "Talons of the Emperor": [
      { name: "Aegis Projector",          nameJa: "イージス・プロジェクター", pts: 20 },
      { name: "Champion of the Imperium", nameJa: "〈帝国〉の筆頭戦士",    pts: 25 },
      { name: "Gift of Terran Artifice",  nameJa: "地球の業物",            pts: 15 },
      { name: "Radiant Mantle",           nameJa: "燦然たる衣鉢",          pts: 30 },
    ],
    "Shield Host": [
      { name: "Auric Mantle",             nameJa: "黄金の衣鉢",            pts: 15 },
      { name: "Castellan's Mark",         nameJa: "城代の印",              pts: 20 },
      { name: "From the Hall of Armouries", nameJa: "武器庫に収められし逸品", pts: 25 },
      { name: "Panoptispex",              nameJa: "全視装置",              pts: 5  },
    ],
    "Null Maiden Vigil": [
      { name: "Enhanced Voidsheen Cloak", nameJa: "強化型虚光外套",        pts: 10 },
      { name: "Huntress' Eye",            nameJa: "狩人の目",              pts: 15 },
      { name: "Oblivion Knight",          nameJa: "滅却の騎士",            pts: 25 },
      { name: "Raptor Blade",             nameJa: "猛禽の剣",              pts: 5  },
    ],
    "Auric Champions": [
      { name: "Blade Imperator",          nameJa: "皇帝の鋭刃",            pts: 25 },
      { name: "Inspirational Exemplar",   nameJa: "威信高き規範者",        pts: 10 },
      { name: "Martial Philosopher",      nameJa: "戦場の哲学者",          pts: 30 },
      { name: "Veiled Blade",             nameJa: "秘隠の刃",              pts: 25 },
    ],
    "Solar Spearhead": [
      { name: "Adamantine Talisman",      nameJa: "アダマンチウムの護符",  pts: 25 },
      { name: "Augury Uplink",            nameJa: "占術データ送信",        pts: 35 },
      { name: "Honoured Fallen",          nameJa: "名誉の戦死",            pts: 15 },
      { name: "Veteran of the Kataphraktoi", nameJa: "カタフラクトイ団の古参兵", pts: 10 },
    ],
    "Lions of the Emperor": [
      { name: "Admonimortis",             nameJa: "アドモニモーティス",    pts: 10 },
      { name: "Fierce Conqueror",         nameJa: "烈々たる覇者",          pts: 15 },
      { name: "Praesidius",               nameJa: "プラエシディウス",      pts: 25 },
      { name: "Superior Creation",        nameJa: "比類なき被造物",        pts: 25 },
    ],
  },

  // ─── Adeptus Mechanicus ───────────────────────────────────────────────────
  adeptus_mechanicus: {
    "Rad-zone Corps": [
      { name: "Autoclavic Denunciation",  nameJa: "滅菌の糾弾",            pts: 15 },
      { name: "Malphonic Susurrus",       nameJa: "悪音の囁き",            pts: 20 },
      { name: "Peerless Eradicator",      nameJa: "比類なき殲滅者",        pts: 20 },
      { name: "Radial Suffusion",         nameJa: "放射能充満",            pts: 25 },
    ],
    "Skitarii Hunter Cohort": [
      { name: "Battle-sphere Uplink",     nameJa: "バトルスフィア・アップリンク", pts: 30 },
      { name: "Cantic Thrallnet",         nameJa: "キャンティック・スロールネット", pts: 25 },
      { name: "Clandestine Infiltrator",  nameJa: "秘密裏の浸透",          pts: 20 },
      { name: "Veiled Hunter",            nameJa: "覆われし狩人",          pts: 10 },
    ],
    "Data-psalm Conclave": [
      { name: "Data-blessed Autosermon",  nameJa: "データ祝福自動説教",    pts: 20 },
      { name: "Mantle of the Gnosticarch", nameJa: "神秘識長の外衣",       pts: 15 },
      { name: "Mechanicus Locum",         nameJa: "技術局の代理人",        pts: 10 },
      { name: "Temporcopia",              nameJa: "テンポルコピア",        pts: 25 },
    ],
    "Explorator Maniple": [
      { name: "Artisan",                  nameJa: "職工",                  pts: 15 },
      { name: "Genetor",                  nameJa: "遺伝学者",              pts: 25 },
      { name: "Logis",                    nameJa: "論理学者",              pts: 20 },
      { name: "Magos",                    nameJa: "賢人",                  pts: 15 },
    ],
    "Cohort Cybernetica": [
      { name: "Arch-negator",             nameJa: "筆頭阻止者",            pts: 10 },
      { name: "Emotionless Clarity",      nameJa: "感情なき明瞭さ",        pts: 15 },
      { name: "Lord of Machines",         nameJa: "機械の主",              pts: 20 },
      { name: "Necromechanic",            nameJa: "死体再生機械工",        pts: 25 },
    ],
    "Haloscreed Battle Clade": [
      { name: "Cognitive Reinforcement",  nameJa: "認知科学的増援",        pts: 35 },
      { name: "Inloaded Lethality",       nameJa: "致命的破壊力、入力完了", pts: 15 },
      { name: "Sanctified Ordnance",      nameJa: "聖別されし砲弾",        pts: 10 },
      { name: "Transoracular Dyad Wafers", nameJa: "汎預見ダイアドチップ", pts: 15 },
    ],
  },

  // ─── Astra Militarum ─────────────────────────────────────────────────────
  astra_militarum: {
    "Combined Arms": [
      { name: "Death Mask of Ollanius",   nameJa: "オラニウスの死面",      pts: 10 },
      { name: "Drill Commander",          nameJa: "教導将校",              pts: 20 },
      { name: "Grand Strategist",         nameJa: "偉大なる戦略家",        pts: 15 },
      { name: "Reactive Command",         nameJa: "即応指揮官",            pts: 15 },
    ],
    "Siege Regiment": [
      { name: "Eager Advance",            nameJa: "猛烈な前進",            pts: 20 },
      { name: "Flash Grenades",           nameJa: "閃光手榴弾",            pts: 20 },
      { name: "Legacy Sidearm",           nameJa: "遺産の副武装",          pts: 10 },
      { name: "Stalwart's Honours",       nameJa: "防衛者の名誉",          pts: 15 },
    ],
    "Mechanised Assault": [
      { name: "Bold Leadership",          nameJa: "恐れ知らずの統率力",    pts: 25 },
      { name: "Sacred Unguents",          nameJa: "聖なる膏薬",            pts: 10 },
      { name: "Smoke Grenades",           nameJa: "煙幕手榴弾",            pts: 10 },
      { name: "Vanguard Honours",         nameJa: "栄誉前衛連隊",          pts: 15 },
    ],
    "Hammer of the Emperor": [
      { name: "Calm Under Fire",          nameJa: "冷静な車両司令官",      pts: 15 },
      { name: "Indomitable Steed",        nameJa: "不屈の乗機",            pts: 15 },
      { name: "Regimental Banner",        nameJa: "連隊戦旗",              pts: 20 },
      { name: "Veteran Crew",             nameJa: "古参乗組員連隊",        pts: 20 },
    ],
    "Recon Element": [
      { name: "Guerrilla Honours",        nameJa: "名誉遊撃手",            pts: 25 },
      { name: "Scare Gas Grenades",       nameJa: "恐怖ガス手榴弾",        pts: 5  },
      { name: "Survival Gear",            nameJa: "不整地踏破装備",        pts: 5  },
      { name: "Tripwires",                nameJa: "仕掛け線",              pts: 20 },
    ],
    "Bridgehead Strike": [
      { name: "Advance Augury",           nameJa: "改良型卜占機",          pts: 15 },
      { name: "Bombast-class Vox-array",  nameJa: "ボンバスト級ヴォクスアレイ", pts: 35 },
      { name: "Priority-drop Beacon",     nameJa: "優先降下ビーコン",      pts: 30 },
      { name: "Shroud Projector",         nameJa: "シュラウドプロジェクター", pts: 15 },
    ],
    "Grizzled Company": [
      { name: "Abhuman Detail",           nameJa: "亜人選抜部隊",          pts: 20 },
      { name: "Aquilan Eye",              nameJa: "双頭鷲の目",            pts: 20 },
      { name: "Laud Hailer",              nameJa: "大礼讃拡声器",          pts: 10 },
      { name: "Spec Ops Veteran",         nameJa: "特殊任務の歴戦",        pts: 15 },
    ],
  },

  // ─── T'au Empire ──────────────────────────────────────────────────────────
  t_au_empire: {
    "Kauyon": [
      { name: "Exemplar of the Kauyon",           nameJa: "カゥヨンの達人",          pts: 20 },
      { name: "Precision of the Patient Hunter",  nameJa: "不屈の狩人の緻密さ",      pts: 15 },
      { name: "Solid-image Projection Unit",      nameJa: "半実体映像投射機",        pts: 30 },
      { name: "Through Unity, Devastation",       nameJa: "破壊を導く団結",          pts: 40 },
    ],
    "Mont'ka": [
      { name: "Coordinated Exploitation",         nameJa: "連携活用",                pts: 40 },
      { name: "Exemplar of the Mont'ka",          nameJa: "モント＝カの達人",        pts: 10 },
      { name: "Strategic Conqueror",              nameJa: "戦略的征服者",            pts: 15 },
      { name: "Strike Swiftly",                   nameJa: "迅速なる打撃",            pts: 25 },
    ],
    "Retaliation Cadre": [
      { name: "Internal Grenade Racks",           nameJa: "インファーナルグレネード・ラック", pts: 20 },
      { name: "Prototype Weapon System",          nameJa: "プロトタイプ・ウェポンシステム",  pts: 15 },
      { name: "Puretide Engram Neurochip",        nameJa: "\"清流たる司令\"の記憶神経チップ", pts: 25 },
      { name: "Starflare Ignition System",        nameJa: "スターフレア点火システム",        pts: 20 },
    ],
    "Kroot Hunting Pack": [
      { name: "Borthrod Gland",                   nameJa: "ボースロッドの腺",        pts: 15 },
      { name: "Kroothawk Flock",                  nameJa: "クルートホークの群れ",    pts: 10 },
      { name: "Nomadic Hunter",                   nameJa: "放浪の狩人",              pts: 20 },
      { name: "Root-carved Weapons",              nameJa: "源を彫みし武器",          pts: 10 },
    ],
    "Auxiliary Cadre": [
      { name: "Admired Leader",                   nameJa: "声望高き指揮官",          pts: 20 },
      { name: "Fanatical Convert",                nameJa: "熱狂的なる転向者",        pts: 10 },
      { name: "Student of Kauyon",                nameJa: "カウヨンを修めし者",      pts: 15 },
      { name: "Transponder Lock Module",          nameJa: "応答装置固定モジュール",  pts: 25 },
    ],
    "Experimental Prototype Cadre": [
      { name: "Fusion Blades",                    nameJa: "フュージョンブレイド",    pts: 25 },
      { name: "Plasma Accelerator Rifle",         nameJa: "プラズマアクセラレイター・ライフル", pts: 10 },
      { name: "Supernova Launcher",               nameJa: "スーパーノヴァランチャー", pts: 15 },
      { name: "Thermoneutronic Projector",        nameJa: "サーモニュートロニック・プロジェクター", pts: 20 },
    ],
  },

  // ─── Genestealer Cults ────────────────────────────────────────────────────
  genestealer_cults: {
    "Host of Ascension": [
      { name: "A Chink in Their Armour",  nameJa: "欠けた鎧",              pts: 20 },
      { name: "Assassination Edict",      nameJa: "暗殺命令",              pts: 15 },
      { name: "Our Time Is Nigh",         nameJa: "我らが時は近い",        pts: 20 },
      { name: "Prowling Agitant",         nameJa: "徘徊する撹乱者",        pts: 15 },
    ],
    "Xenocreed Congregation": [
      { name: "Deeds That Speak to the Masses", nameJa: "大衆に訴えかける功業", pts: 25 },
      { name: "Denunciator of Tyrants",   nameJa: "為政者の告発者",        pts: 25 },
      { name: "Gene-sire's Reliquant",    nameJa: "遺伝子祖の聖遺物",      pts: 5  },
      { name: "Incendiary Inspiration",   nameJa: "焚きつける喊声",        pts: 15 },
    ],
    "Biosanctic Broodsurge": [
      { name: "Alien Majesty",            nameJa: "異質なる威厳",          pts: 15 },
      { name: "Biomorph Adaptation",      nameJa: "適応的バイオモーフ",    pts: 25 },
      { name: "Mutagenic Regeneration",   nameJa: "変異による再生力",      pts: 10 },
      { name: "Predatory Instincts",      nameJa: "捕食獣の本能",          pts: 20 },
    ],
    "Outlander Claw": [
      { name: "Assault Commando",         nameJa: "特殊奇襲隊員",          pts: 15 },
      { name: "Cartographic Data-leech",  nameJa: "測量データリーチ",      pts: 10 },
      { name: "Serpentine Tactics",       nameJa: "蜷局巻き戦術",          pts: 10 },
      { name: "Starfall Shells",          nameJa: "スターフォール弾",      pts: 10 },
    ],
    "Brood Brother Auxilia": [
      { name: "Adaptive Reprisal",        nameJa: "宿怨を晴らす反撃",      pts: 15 },
      { name: "Firepoint Commander",      nameJa: "火計の指揮官",          pts: 10 },
      { name: "Martial Espionage",        nameJa: "軍事的諜報活動",        pts: 25 },
      { name: "The Hero Returned",        nameJa: "英雄の帰還",            pts: 20 },
    ],
    "Final Day": [
      { name: "Enraptured Damnation",     nameJa: "破滅の恍惚",            pts: 10 },
      { name: "Inhuman Integration",      nameJa: "人ならざる統合",        pts: 20 },
      { name: "Synaptic Auger",           nameJa: "シナプス掘削体",        pts: 15 },
      { name: "Vanguard Tyrant",          nameJa: "先遣群の暴君",          pts: 25 },
    ],
  },

  // ─── Leagues of Votann ────────────────────────────────────────────────────
  leagues_of_votann: {
    "Needgaârd Oathband": [
      { name: "Ancestral Crest",          nameJa: "父祖の紋章",            pts: 15 },
      { name: "Dead Reckoning",           nameJa: "死の見積もり",          pts: 10 },
      { name: "Iron Ambassador",          nameJa: "交渉砲",                pts: 5  },
      { name: "Oathbound Speculator",     nameJa: "誓約の相場師",          pts: 30 },
    ],
    "Persecution Prospect": [
      { name: "Eye for Weakness",         nameJa: "脆弱を見抜く目",        pts: 25 },
      { name: "Nomad Strategist",         nameJa: "流浪せし戦略家",        pts: 20 },
      { name: "Surgical Saboteur",        nameJa: "精密無比なる妨害",      pts: 10 },
      { name: "Writ of Acquisition",      nameJa: "接収令状",              pts: 10 },
    ],
    "Dêlve Assault Shift": [
      { name: "Dêlvwerke Navigator",      nameJa: "掘削作業の案内人",      pts: 25 },
      { name: "Multiwave System Jammer",  nameJa: "マルチウェーブ・システムジャマー", pts: 10 },
      { name: "Piledriver",               nameJa: "パイルドライバー",      pts: 15 },
      { name: "Quake Supervisor",         nameJa: "巨砲監督官",            pts: 20 },
    ],
    "Brandfast Oathband": [
      { name: "Precursive Judgement",     nameJa: "準備万端たる裁き",      pts: 15 },
      { name: "Signature Restoration",    nameJa: "際立った修復技術",      pts: 5  },
      { name: "Tactical Alchemy",         nameJa: "戦いの錬金術",          pts: 10 },
      { name: "Trivärg Cyber Implant",    nameJa: "トライヴァルグ・サイバーインプラント", pts: 40 },
    ],
    "Hearthfyre Arsenal": [
      { name: "Calculated Tenacity",      nameJa: "計算されし執念",        pts: 15 },
      { name: "Fârstrydr Node",           nameJa: "遠駆けのノード",        pts: 20 },
      { name: "Graviton Vault",           nameJa: "重力子保管庫",          pts: 5  },
      { name: "Mantle of Elders",         nameJa: "長老のマント",          pts: 10 },
    ],
    "Hearthband": [
      { name: "Bastion Shield",           nameJa: "掩蔽シールド",          pts: 25 },
      { name: "High Kâhl",                nameJa: "大いなるカール",        pts: 30 },
      { name: "Ironskein",                nameJa: "鉄の複製鎖",            pts: 10 },
      { name: "Quake Multigenerator",     nameJa: "多元震動発生装置",      pts: 15 },
    ],
    "Mercenary Oathband": [
      { name: "Asset Manipulator",        nameJa: "戦略資源の操り手",      pts: 25 },
      { name: "Etacarn SB9 Targeting Implant", nameJa: "イータカルンSB9照準インプラント", pts: 15 },
      { name: "Mercenary Prospector",     nameJa: "傭兵探鉱者",            pts: 20 },
      { name: "Metaphysical Brokerage",   nameJa: "形而上学的仲介機",      pts: 20 },
    ],
  },

  // ─── Death Guard ──────────────────────────────────────────────────────────
  death_guard: {
    "Virulent Vectorium": [
      { name: "Arch Contaminator",        nameJa: "大汚染者",              pts: 25 },
      { name: "Daemon Weapon of Nurgle",  nameJa: "ナーグルの悪魔の武器",  pts: 10 },
      { name: "Furnace of Plagues",       nameJa: "疫病の炉",              pts: 25 },
      { name: "Revolting Regeneration",   nameJa: "忌まわしき再生力",      pts: 20 },
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
      { name: "Beckoning Blight",         nameJa: "荒廃への誘い",          pts: 20 },
      { name: "Entropic Knell",           nameJa: "崩壊の弔鐘",            pts: 15 },
      { name: "Fell Harvester",           nameJa: "堕落せし収穫者",        pts: 10 },
      { name: "Tome of Bounteous Blessings", nameJa: "豊饒なる祝福の書",  pts: 20 },
    ],
    "Shamblerot Vectorium": [
      { name: "Lord of the Walking Pox",  nameJa: "歩き膿疱の主",          pts: 15 },
      { name: "Sorrowsyphon",             nameJa: "悲嘆の抽出",            pts: 10 },
      { name: "Talisman of Burgeoning",   nameJa: "萌芽の護符",            pts: 25 },
      { name: "Witherbone Pipes",         nameJa: "ウィザーボーンの笛",    pts: 25 },
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
      { name: "Eldritch Vortex of E'taph", nameJa: "エータフのおぞましき渦", pts: 35 },
      { name: "Incandaeum",               nameJa: "火晶の杖",              pts: 15 },
      { name: "Lord of Forbidden Lore",   nameJa: "禁忌の知識の担い手",    pts: 20 },
      { name: "Umbralefic Crystal",       nameJa: "幽闇の水晶",            pts: 20 },
    ],
    "Changehost of Deceit": [
      { name: "Diabolic Savant",          nameJa: "悪魔の探究者",          pts: 20 },
      { name: "Duplicitous Malediction",  nameJa: "二枚舌の悪意",          pts: 15 },
      { name: "Nethershriek Mind-eater",  nameJa: "奈落より叫ぶ精神喰らい", pts: 10 },
      { name: "Tome of True Names",       nameJa: "真名の書",              pts: 20 },
    ],
    "Warpmeld Pact": [
      { name: "Bray Lord",                nameJa: "獣人を統べる者",        pts: 15 },
      { name: "Diamond of Distortion",    nameJa: "湾曲のダイヤモンド",    pts: 20 },
      { name: "Flowing Flesh",            nameJa: "流転する肉体",          pts: 10 },
      { name: "Warpmeld Dagger",          nameJa: "融魔の短剣",            pts: 10 },
    ],
    "Rubricae Phalanx": [
      { name: "Arcane Thralls",           nameJa: "秘術の隷属者",          pts: 5  },
      { name: "Lord of the Rubricae",     nameJa: "魂刻者を統べる者",      pts: 15 },
      { name: "Risen Rubricae",           nameJa: "魂刻者の到来",          pts: 30 },
      { name: "The Stave Abominus",       nameJa: "異形の杖",              pts: 20 },
    ],
    "Warpforged Cabal": [
      { name: "Biomechanical Mutation",   nameJa: "生体機械変異",          pts: 15 },
      { name: "The Perplexing Cloak",     nameJa: "惑乱の外套",            pts: 20 },
      { name: "Warp Syphon",             nameJa: "歪みの吸引器",           pts: 5  },
      { name: "Warp-cursed Runemaster",   nameJa: "呪魔のルーン使い",      pts: 10 },
    ],
    "Hexwarp Thrallband": [
      { name: "Arcane Might",             nameJa: "秘術の魔力",            pts: 20 },
      { name: "Empowered Manifestation",  nameJa: "強化顕現",              pts: 20 },
      { name: "Empyric Onslaught",        nameJa: "超常的猛攻",            pts: 25 },
      { name: "Noctilith Mantle",         nameJa: "闇の外套",              pts: 15 },
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
      { name: "Butcher Lord",             nameJa: "大いなる虐殺者",        pts: 10 },
      { name: "Chosen of the Blood God",  nameJa: "血の神に選ばれし戦士",  pts: 15 },
      { name: "Strategic Slaughter",      nameJa: "権謀を巡らす殺戮者",    pts: 20 },
    ],
    "Khorne Daemonkin": [
      { name: "Blade of Endless Bloodshed", nameJa: "無限流血の刃",        pts: 30 },
      { name: "Blood-forged Armour",      nameJa: "ブラッドフォージド・アーマー", pts: 20 },
      { name: "Disciple of Khorne",       nameJa: "コーン神の使徒",        pts: 15 },
      { name: "Icon of War",              nameJa: "いくさの装身具",        pts: 25 },
    ],
    "Possessed Slaughterband": [
      { name: "Frenzied Focus",           nameJa: "狂気の集中力",          pts: 20 },
      { name: "Killing Clarity",          nameJa: "冴ゆる虐殺",            pts: 15 },
      { name: "Malicious Vigour",         nameJa: "邪悪な強壮",            pts: 30 },
      { name: "Violent Demise",           nameJa: "凄惨な終わり",          pts: 10 },
    ],
    "Goretrack Onslaught": [
      { name: "Aggressive Deployment",    nameJa: "強襲展開術",            pts: 20 },
      { name: "Infernal Infusion",        nameJa: "地獄の注入物",          pts: 25 },
      { name: "Murderous Onslaught",      nameJa: "凶暴な猛攻",            pts: 5  },
      { name: "Unleash Hell",             nameJa: "地獄を味わえ",          pts: 10 },
    ],
    "Vessels of Wrath": [
      { name: "Archslaughterer",          nameJa: "大虐殺者",              pts: 25 },
      { name: "Avenger's Crown",          nameJa: "復讐の冠",              pts: 15 },
      { name: "Gateways to Glory",        nameJa: "栄光への扉",            pts: 10 },
      { name: "Vox-diabolus",             nameJa: "魔声",                  pts: 20 },
    ],
  },

  // ─── Emperor's Children ───────────────────────────────────────────────────
  emperor_s_children: {
    "Mercurial Host": [
      { name: "Intoxicating Musk",        nameJa: "陶酔の香",              pts: 20 },
      { name: "Loathsome Dexterity",      nameJa: "忌まわしき俊敏さ",      pts: 10 },
      { name: "Steeped in Suffering",     nameJa: "苦痛への没入",          pts: 20 },
      { name: "Tactical Perfection",      nameJa: "完成された戦術",        pts: 15 },
    ],
    "Peerless Bladesmen": [
      { name: "Blinding Speed",           nameJa: "神速の剣技",            pts: 25 },
      { name: "Distortion",               nameJa: "捻じ曲げの刃",          pts: 25 },
      { name: "Faultless Opportunist",    nameJa: "抜け目なき完璧主義者",  pts: 15 },
      { name: "Rise to the Challenge",    nameJa: "現れる挑戦者",          pts: 30 },
    ],
    "Rapid Evisceration": [
      { name: "Accomplished Tactician",   nameJa: "熟練の戦術家",          pts: 35 },
      { name: "Heretek Adept",            nameJa: "異端技術の達人",        pts: 35 },
      { name: "Spearhead Striker",        nameJa: "一番槍の一撃",          pts: 20 },
      { name: "Sublime Prescience",       nameJa: "卓越した洞察力",        pts: 25 },
    ],
    "Carnival of Excess": [
      { name: "Dark Blessings",           nameJa: "暗黒の祝福",            pts: 10 },
      { name: "Empyric Suffusion",        nameJa: "溢れる魔性",            pts: 15 },
      { name: "Possessed Blade",          nameJa: "憑依の刃",              pts: 25 },
      { name: "Warp Walker",              nameJa: "歪みを歩む者",          pts: 30 },
    ],
    "Coterie of the Conceited": [
      { name: "Pledge of Dark Glory",     nameJa: "禍々しき栄光の誓い",    pts: 25 },
      { name: "Pledge of Eternal Servitude", nameJa: "永劫の隷属の誓い",  pts: 25 },
      { name: "Pledge of Mortal Pain",    nameJa: "定命の苦痛奉献の誓い",  pts: 15 },
      { name: "Pledge of Unholy Fortune", nameJa: "不浄なる幸運の誓い",    pts: 30 },
    ],
    "Slaanesh's Chosen": [
      { name: "Eager to Prove",           nameJa: "誇示への熱望",          pts: 15 },
      { name: "Proud and Vainglorious",   nameJa: "誇り高き虚栄心",        pts: 20 },
      { name: "Repulsed by Weakness",     nameJa: "弱き者への嫌悪",        pts: 25 },
      { name: "Slayer of Champions",      nameJa: "英雄殺し",              pts: 15 },
    ],
    "Court of the Phoenician": [
      { name: "Exalted Patron",           nameJa: "至高の庇護者",          pts: 15 },
      { name: "Soulstain Made Manifest",  nameJa: "顕現せし穢れ",          pts: 15 },
      { name: "Spiritsliver",             nameJa: "魂削ぎの刃",            pts: 20 },
      { name: "Tears of the Phoenix",     nameJa: "不死鳥の涙",            pts: 25 },
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
      { name: "Fade to Darkness",         nameJa: "闇に消えしもの",        pts: 30 },
      { name: "Leaping Shadows",          nameJa: "跳躍する影",            pts: 25 },
      { name: "Malice Made Manifest",     nameJa: "悪意の顕現",            pts: 25 },
      { name: "Mantle of Gloom",          nameJa: "薄明の外套",            pts: 20 },
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
      { name: "Improbable Shield",        nameJa: "不可思議の盾",          pts: 30 },
      { name: "Inescapable Eye",          nameJa: "逃れ得ぬ瞳",            pts: 10 },
      { name: "Infernal Puppeteer",       nameJa: "地獄の傀儡師",          pts: 25 },
      { name: "Neverblade",               nameJa: "否定の刃",              pts: 20 },
    ],
  },

  // ─── Chaos Knights ────────────────────────────────────────────────────────
  chaos_knights: {
    "Traitoris Lance": [
      { name: "Malevolent Heraldry",      nameJa: "佞悪な紋章",            pts: 30 },
      { name: "Nightmare's Master",       nameJa: "不吉な夢の主",          pts: 20 },
      { name: "Tyrant's Shadow",          nameJa: "暴君の影",              pts: 25 },
      { name: "Veil of Medrengard",       nameJa: "メドレンガルドの帷",    pts: 35 },
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
  agents_of_the_imperium: {
    "Alien Hunters": [
      { name: "Amulet of Auto-chastisement", nameJa: "自動懲罰のアミュレット",     pts: 25 },
      { name: "Beacon Angelis",              nameJa: "天使の篝火",              pts: 30 },
      { name: "Blackweave Shroud",           nameJa: "黒織りの覆い",            pts: 15 },
      { name: "Universal Anathema",          nameJa: "万能の神罰",              pts: 10 },
    ],
    "Daemon Hunters": [
      { name: "Daemon Slayer",              nameJa: "悪魔殺し",               pts: 10 },
      { name: "Formidable Resolve",         nameJa: "揺るがざる決意",          pts:  5 },
      { name: "Gift of the Prescient",      nameJa: "予見の賜物",              pts: 20 },
      { name: "Grimoire of True Names",     nameJa: "真名の大冊",              pts: 10 },
    ],
    "Imperialis Fleet": [
      { name: "Clandestine Operation",      nameJa: "隠密作戦",               pts: 15 },
      { name: "Combat Landers",             nameJa: "戦闘降下手",              pts: 10 },
      { name: "Digital Weapons",            nameJa: "デジタルウェポン",          pts: 10 },
      { name: "Fleetmaster",               nameJa: "艦隊提督",               pts: 20 },
    ],
    "Purgation Force": [
      { name: "Ignis Judicium",            nameJa: "イグニスの神判",            pts: 10 },
      { name: "Liber Heresius",            nameJa: "粛清の書",                pts: 10 },
      { name: "No Escape",                 nameJa: "逃げ場なし",               pts: 25 },
      { name: "Witch Hunter",              nameJa: "妖術師狩り",               pts: 15 },
    ],
    "Veiled Blade Elimination Force": [
      { name: "Decoy Targets",             nameJa: "偽装標的",                pts: 40 },
      { name: "Esoteric Explosives",       nameJa: "特殊爆薬",                pts: 40 },
      { name: "Intraneural Biotech",       nameJa: "内神経系強化処置",           pts: 35 },
      { name: "Micromelta Rounds",         nameJa: "マイクロメルタ弾",           pts: 45 },
    ],
  },
  imperial_knights: {
    "Valourstrike Lance": [
      { name: "Bearer of the Evanescent Ion", nameJa: "儚きイオンの担い手",  pts: 15 },
      { name: "Bearer of the Iron Chalice",   nameJa: "鉄杯の担い手",        pts: 20 },
      { name: "Bearer of the Judicant's Helm", nameJa: "審判の兜の担い手",   pts: 25 },
      { name: "Bearer of the Lancer's Sigil", nameJa: "槍騎士の印章の担い手", pts: 25 },
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
      { name: "Pennant of Silvered Fury", nameJa: "銀の憤怒の三角旗",      pts: 15 },
      { name: "Wyrmslayer Divination",    nameJa: "竜殺しの予見",          pts: 10 },
    ],
    "Spearhead-At-Arms": [
      { name: "Fables of Nightmare",      nameJa: "悪夢の寓話",            pts: 10 },
      { name: "Martial Tuition",          nameJa: "武芸の伝授",            pts: 15 },
      { name: "Mentor's Pride",           nameJa: "伝授者の誇り",          pts: 20 },
      { name: "Tales of Heroism",         nameJa: "英雄物語",              pts: 10 },
    ],
    "Questor Forgepact": [
      { name: "Knight of the Opus Machina", nameJa: "機械紋の騎士",        pts: 20 },
      { name: "Magos Questoris",          nameJa: "クエストリス大賢人",    pts: 35 },
      { name: "Omnissian Champion",       nameJa: "万機神の闘士",          pts: 30 },
      { name: "Vocifer Magnificat",       nameJa: "崇高なる叫唱",          pts: 15 },
    ],
  },

  // ─── Blood Angels ─────────────────────────────────────────────────────────
  blood_angels: {
    "Angelic Inheritors": [
      { name: "Blazing Icon",             nameJa: "光焔の首飾り",          pts: 20 },
      { name: "Ordained Sacrifice",       nameJa: "宿命の犠牲",            pts: 25 },
      { name: "Prescient Flash",          nameJa: "予見のひらめき",        pts: 20 },
      { name: "Troubling Visions",        nameJa: "苦悩の幻視",            pts: 15 },
    ],
    "Liberator Assault Group": [
      { name: "Gift of Foresight",        nameJa: "先見の恩寵",            pts: 15 },
      { name: "Icon of the Angel",        nameJa: "天使の聖印",            pts: 20 },
      { name: "Rage-fuelled Warrior",     nameJa: "怒りに駆られた戦士",    pts: 35 },
      { name: "Speed of the Primarch",    nameJa: "総主長の俊敏さ",        pts: 25 },
    ],
    "Rage-cursed Onslaught": [
      { name: "Angel's Fang",             nameJa: "天使の牙",              pts: 25 },
      { name: "Carmine Reliquary",        nameJa: "紅き聖櫃",              pts: 30 },
      { name: "Master of the Red Thirst", nameJa: "〈紅き餓え〉を修めし者", pts: 25 },
      { name: "Sanguinary Tear",          nameJa: "真紅の涙",              pts: 35 },
    ],
    "The Angelic Host": [
      { name: "Archangel's Shard",        nameJa: "大天使の断片",          pts: 15 },
      { name: "Artisan of War",           nameJa: "戦いの工匠",            pts: 20 },
      { name: "Gleaming Pinions",         nameJa: "輝きの翼",              pts: 25 },
      { name: "Visage of Death",          nameJa: "死の容貌",              pts: 15 },
    ],
    "The Lost Brethren": [
      { name: "Blood Shard",              nameJa: "血の欠片",              pts: 25 },
      { name: "Sanguinius' Grace",        nameJa: "サングィニウスの恩寵",  pts: 20 },
      { name: "To Slay the Warmaster",    nameJa: "大元帥を屠るため",      pts: 15 },
      { name: "Vengeful Onslaught",       nameJa: "復讐の猛攻",            pts: 10 },
    ],
  },

  // ─── Black Templars ───────────────────────────────────────────────────────
  black_templars: {
    "Companions of Vehemence": [
      { name: "Incendiary Animus",        nameJa: "焼き尽くす悪意",        pts: 25 },
      { name: "Merciless Denunciation",   nameJa: "呵責なき糾弾",          pts: 25 },
      { name: "Oathbound Exemplar",       nameJa: "誓約の模範者",          pts: 15 },
      { name: "Zealous Vanguard",         nameJa: "熱狂的なる前衛",        pts: 20 },
    ],
    "Godhammer Assault Force": [
      { name: "Augury Servo-host",        nameJa: "卜占サーボ群",          pts: 15 },
      { name: "Battle-psalm Precentor",   nameJa: "戦闘聖歌の朗詠者",      pts: 10 },
      { name: "Herald of Sacred Slaughter", nameJa: "神聖なる殺戮の先触れ", pts: 15 },
      { name: "Paragon of Fury",          nameJa: "激情の模範者",          pts: 25 },
    ],
    "Vindication Task Force": [
      { name: "Consecrating Aura",        nameJa: "聖別のオーラ",          pts: 25 },
      { name: "Imperialis of the Eternal Crusade", nameJa: "永劫なる征戦の帝国章", pts: 15 },
      { name: "Orb of the Emperor's Aegis", nameJa: "皇帝の護りのオーブ",  pts: 10 },
      { name: "Warden of Honour",         nameJa: "名誉の守り人",          pts: 20 },
    ],
    "Wrathful Procession": [
      { name: "Benediction of Fury",      nameJa: "激情の祝祷",            pts: 10 },
      { name: "Pyrebrand",                nameJa: "永劫の遺焔",            pts: 25 },
      { name: "Sacred Rage",              nameJa: "神聖なる憤怒",          pts: 30 },
      { name: "Taramond's Censer",        nameJa: "タラモンドの香炉",      pts: 15 },
    ],
  },

  // ─── Deathwatch ───────────────────────────────────────────────────────────
  deathwatch: {
    "Black Spear Task Force": [
      { name: "Beacon Angelis",           nameJa: "天使の篝火",            pts: 25 },
      { name: "Osseus Key",               nameJa: "オセウスの鍵",          pts: 15 },
      { name: "The Tome of Ectoclades",   nameJa: "エクトクラデスの書",    pts: 30 },
      { name: "Thief of Secrets",         nameJa: "秘密盗みの剣",          pts: 25 },
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
