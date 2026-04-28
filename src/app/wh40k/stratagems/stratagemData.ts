export type Phase =
  | "any"
  | "command"
  | "movement"
  | "shooting"
  | "charge"
  | "fight"
  | "battleshock";

export type Stratagem = {
  id: string;
  name: string;
  nameJa: string;
  cp: number;
  phases: Phase[];
  when: string;
  effect: string;
};

export const PHASE_LABELS: Record<Phase, string> = {
  any: "任意",
  command: "指揮",
  movement: "移動",
  shooting: "射撃",
  charge: "突撃",
  fight: "白兵戦",
  battleshock: "戦闘ショック",
};

export const PHASE_COLORS: Record<Phase, string> = {
  any: "border-indigo-400/60 text-indigo-500 bg-indigo-500/10 dark:border-indigo-500/40",
  command: "border-violet-400/60 text-violet-500 bg-violet-500/10 dark:border-violet-500/40",
  movement: "border-blue-400/60 text-blue-500 bg-blue-500/10 dark:border-blue-500/40",
  shooting: "border-orange-400/60 text-orange-500 bg-orange-500/10 dark:border-orange-500/40",
  charge: "border-yellow-400/60 text-yellow-600 bg-yellow-500/10 dark:border-yellow-500/40",
  fight: "border-rose-400/60 text-rose-500 bg-rose-500/10 dark:border-rose-500/40",
  battleshock: "border-slate-400/60 text-slate-500 bg-slate-500/10 dark:border-slate-500/40",
};

export const FILTER_PHASES: Phase[] = [
  "command",
  "battleshock",
  "movement",
  "shooting",
  "charge",
  "fight",
];

export const STRATAGEMS: Stratagem[] = [
  {
    id: "command-reroll",
    name: "Command Re-roll",
    nameJa: "リロール命令",
    cp: 1,
    phases: ["any"],
    when: "任意のフェイズ中、自軍の兵・ユニット・攻撃のためにヒットロール、ウーンズロール、セーヴィング、各種ロールを1回行なった直後",
    effect: "そのロール、テスト、セーヴィングをリロールする。",
  },
  {
    id: "counter-offensive",
    name: "Counter-offensive",
    nameJa: "反攻戦術",
    cp: 2,
    phases: ["fight"],
    when: "白兵戦フェイズ中、敵ユニットが白兵戦を行なった直後",
    effect: "1個以上の敵ユニットの接敵範囲内にいる、このフェイズ中まだ白兵戦を行なっていない自軍ユニット1個を選ぶ。そのユニットで次に白兵戦を行なう。",
  },
  {
    id: "heroic-duel",
    name: "Heroic Duel",
    nameJa: "壮大なる決闘",
    cp: 1,
    phases: ["fight"],
    when: "白兵戦フェイズ中、1個以上の合流ユニットの接敵範囲内にいる自軍キャラクター・ユニットが白兵戦を宣言したとき",
    effect: "自軍ユニット内のキャラクターの兵1体を選ぶ。そのフェイズ終了時まで、その兵が行なうすべての白兵戦攻撃は〔精密攻撃〕アビリティを得る。",
  },
  {
    id: "insane-bravery",
    name: "Insane Bravery",
    nameJa: "狂気の奮戦",
    cp: 1,
    phases: ["battleshock"],
    when: "自軍側指揮フェイズの戦闘ショックステップ中、自軍ユニットが戦闘ショックテストに失敗した直後",
    effect: "そのユニットはそのテストに成功したものとして扱われ、戦闘ショック状態にならない。",
  },
  {
    id: "grenade",
    name: "Grenade",
    nameJa: "グレネード投擲",
    cp: 1,
    phases: ["shooting"],
    when: "自軍側射撃フェイズ開始時",
    effect: "敵の接敵範囲外にいる自軍グレネード・ユニット1個を選ぶ。そのユニットの8mv以内にいる視認可能な敵ユニット1個を選択し、D6を6個ロール。4+が出るたびにその敵ユニットは1ポイントの致命的ダメージを受ける。",
  },
  {
    id: "overwatch",
    name: "Overwatch",
    nameJa: "警戒射撃",
    cp: 1,
    phases: ["movement", "charge"],
    when: "相手の移動または突撃フェイズ中、敵ユニットが配置された直後、または通常移動・全力移動・退却・突撃移動を開始もしくは完了したタイミング",
    effect: "その敵ユニットの24mv以内にいる自軍ユニット1個で射撃を行なう。命中ロールは修正前の出目6でのみ成功する。（各ターン1回のみ）",
  },
  {
    id: "tank-shock",
    name: "Tank Shock",
    nameJa: "激突",
    cp: 1,
    phases: ["charge"],
    when: "自軍側突撃フェイズ中",
    effect: "自軍ビークル・ユニット1個が突撃移動を完了した直後、接敵範囲内の敵ユニット1個と白兵戦武器1個を選択。その武器の【攻撃力】個のD6をロールし（攻撃力が相手の耐久力を上回る場合は+2個）、5+が出るたびに1ポイントの致命的ダメージ（最大6）。",
  },
  {
    id: "rapid-ingress",
    name: "Rapid Ingress",
    nameJa: "即応投入",
    cp: 1,
    phases: ["movement"],
    when: "相手の移動フェイズ終了時",
    effect: "予備戦力にいる自軍ユニット1個を、あたかも自軍移動フェイズの増援ステップ中であるかのように戦場に配置する。（通常到着不可のバトルラウンドには使用不可）",
  },
  {
    id: "go-to-ground",
    name: "Go to Ground",
    nameJa: "伏せろ！",
    cp: 1,
    phases: ["shooting"],
    when: "相手の射撃フェイズ中、敵ユニットが攻撃対象を選択した直後",
    effect: "攻撃対象に選択された自軍インファントリー・ユニット1個を選ぶ。そのフェイズ終了時まで、そのユニット内のすべての兵は〔スペシャルセーヴ値〕6+と遮蔽物ボーナスを得る。",
  },
  {
    id: "smokescreen",
    name: "Smokescreen",
    nameJa: "煙幕",
    cp: 1,
    phases: ["shooting"],
    when: "相手の射撃フェイズ中、敵ユニットが攻撃対象を選択した直後",
    effect: "攻撃対象に選択された自軍煙幕・ユニット1個を選ぶ。そのフェイズ終了時まで、そのユニット内のすべての兵は遮蔽物ボーナスと『隠密能力』アビリティを得る。",
  },
  {
    id: "heroic-intervention",
    name: "Heroic Intervention",
    nameJa: "英雄的介入",
    cp: 2,
    phases: ["charge"],
    when: "相手の突撃フェイズ中、敵ユニットが突撃移動を完了した直後",
    effect: "その敵ユニットの6mv以内にいる自軍ユニット1個（ウォーカー以外のビークル不可）を選ぶ。自軍突撃フェイズ中であるかのように、その敵ユニットのみを対象に突撃を解決する。突撃成功しても突撃ボーナスは得られない。",
  },
];
