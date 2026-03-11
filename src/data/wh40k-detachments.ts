/**
 * WH40K 10th edition detachments by faction.
 * Key = faction id (matches DB Faction.id).
 * Value = array of detachment names (English).
 */
export const DETACHMENTS: Record<string, { name: string; nameJa: string }[]> = {
  aeldari_craftworlds: [
    { name: "Warhost",          nameJa: "ウォーホスト" },
    { name: "Aspect Host",      nameJa: "アスペクト・ホスト" },
    { name: "Devoted of Ynnead", nameJa: "イナードの献身者" },
  ],
  space_marines: [
    { name: "Gladius Task Force",     nameJa: "グラディウス任務部隊" },
    { name: "Ironstorm Spearhead",    nameJa: "アイアンストーム突撃隊" },
    { name: "Anvil Siege Force",      nameJa: "アンビル包囲軍" },
    { name: "Firestorm Assault Force", nameJa: "ファイアストーム強襲軍" },
    { name: "1st Company Task Force", nameJa: "第1中隊任務部隊" },
    { name: "Vanguard Spearhead",     nameJa: "ヴァンガード突撃隊" },
  ],
  blood_angels: [
    { name: "Sons of Sanguinius", nameJa: "サングィニウスの息子たち" },
  ],
  dark_angels: [
    { name: "Unforgiven Task Force", nameJa: "許されし者任務部隊" },
  ],
  space_wolves: [
    { name: "Champions of Russ", nameJa: "ラスの勇者たち" },
  ],
  black_templars: [
    { name: "Righteous Crusaders", nameJa: "正義の十字軍" },
  ],
  ultramarines: [
    { name: "Spearhead Assault", nameJa: "突撃隊強襲" },
  ],
  grey_knights: [
    { name: "Teleport Strike Force", nameJa: "テレポート打撃部隊" },
  ],
  chaos_space_marines: [
    { name: "Slaves to Darkness",  nameJa: "暗黒の奴隷" },
    { name: "Council of Traitors", nameJa: "反逆者の議会" },
  ],
  death_guard: [
    { name: "Plague Company",      nameJa: "疫病の中隊" },
    { name: "Inexorable March",    nameJa: "容赦なき行進" },
  ],
  thousand_sons: [
    { name: "Cult of Magic",       nameJa: "魔術のカルト" },
    { name: "Arcane Runes",        nameJa: "神秘のルーン" },
  ],
  world_eaters: [
    { name: "Berserker Warband",   nameJa: "バーサーカーの戦団" },
  ],
  chaos_daemons: [
    { name: "Chaos Undivided",     nameJa: "渾沌 (不分割)" },
    { name: "Warlord of Chaos",    nameJa: "混沌の将" },
  ],
  tyranids: [
    { name: "Invasion Fleet",      nameJa: "侵略艦隊" },
    { name: "Crusher Stampede",    nameJa: "蹂躙の暴走" },
    { name: "Assimilation Swarm",  nameJa: "同化の群れ" },
    { name: "Vanguard Onslaught",  nameJa: "先鋒の猛攻" },
    { name: "Unending Swarm",      nameJa: "終わりなき群れ" },
  ],
  necrons: [
    { name: "Awakened Dynasty",    nameJa: "覚醒の王朝" },
    { name: "Hypercrypt Legion",   nameJa: "ハイパークリプト軍団" },
    { name: "Canoptek Court",      nameJa: "カノプテク宮廷" },
    { name: "Starved Frenzy",      nameJa: "飢えの狂乱" },
    { name: "Undying Legions",     nameJa: "不滅の軍団" },
  ],
  orks: [
    { name: "Waaagh! Tribe",       nameJa: "ウォー! 部族" },
    { name: "Green Tide",          nameJa: "グリーン・タイド" },
    { name: "Bully Boyz",          nameJa: "ブリー・ボーイズ" },
    { name: "Dread Mob",           nameJa: "ドレッド・モブ" },
  ],
  t_au_empire: [
    { name: "Kauyon",              nameJa: "カウヨン" },
    { name: "Mont'ka",             nameJa: "モンカ" },
  ],
  drukhari: [
    { name: "Realspace Raiders",   nameJa: "リアルスペース・レイダーズ" },
    { name: "Court of the Archon", nameJa: "アーコンの宮廷" },
  ],
  genestealer_cults: [
    { name: "Cult Ambush",         nameJa: "カルトの奇襲" },
  ],
  adeptus_mechanicus: [
    { name: "Cohort Cybernetica",  nameJa: "コホート・サイバーネティカ" },
    { name: "Skitarii Hunter Cohort", nameJa: "スキタリイ狩猟コホート" },
  ],
  astra_militarum: [
    { name: "Combined Regiment",   nameJa: "統合連隊" },
    { name: "Hammer of the Emperor", nameJa: "皇帝の鉄槌" },
  ],
  adepta_sororitas: [
    { name: "Hallowed Martyrs",    nameJa: "神聖なる殉教者" },
    { name: "Penitent Host",       nameJa: "懺悔の宿主" },
  ],
  adeptus_custodes: [
    { name: "Shield Host",         nameJa: "シールド・ホスト" },
    { name: "Talons of the Emperor", nameJa: "皇帝の爪" },
  ],
  leagues_of_votann: [
    { name: "Oathband",            nameJa: "誓いの絆" },
  ],
  imperial_knights: [
    { name: "Noble Lance",         nameJa: "気高き槍騎兵" },
  ],
  chaos_knights: [
    { name: "Traitoris Lance",     nameJa: "裏切り者の槍騎兵" },
  ],
};
