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
    when: "どのフェイズでも。味方ユニットや兵が、以下のロールのいずれか1つを行った直後：全力移動ロール／突撃ロール／ダメージ量判定ロール／危機ロール／ヒットロール／セーブロール／ウーンズロール／いずれかの武器で行う攻撃回数を決めるためのロール。",
    effect: "そのロールをリロールする。2個以上のダイスを同時にロールしている場合、それらのダイスのうち1個を選んでリロールする（ただし突撃ロールの場合は、すべてのダイスをリロールすること）。",
  },
  {
    id: "heroic-duel",
    name: "Heroic Challenge",
    nameJa: "英雄的挑戦",
    cp: 1,
    phases: ["fight"],
    when: "白兵フェイズ中、味方キャラクター・ユニットが白兵を宣言した直後。",
    effect: "その自軍のユニット内のキャラクターの兵1体を選択する。そのフェイズの終了時まで、その兵が装備している白兵武器は〔精密攻撃〕アビリティを持つ。",
  },
  {
    id: "insane-bravery",
    name: "Insane Bravery",
    nameJa: "狂気の奮戦",
    cp: 1,
    phases: ["battleshock"],
    when: "自軍の指揮フェイズの戦闘ショックステップ中、味方ユニットが戦闘ショックロールを行う直前。",
    effect: "その戦闘ショックロールは自動的に成功する。制限：自軍はこの策略をバトル中1回限り使用できる。",
  },
  {
    id: "grenade",
    name: "Grenade",
    nameJa: "爆発物使用",
    cp: 1,
    phases: ["shooting"],
    when: "自軍側射撃フェイズ中。このターン中に全力移動を行っておらず射撃を宣言可能な、非接敵状態の味方爆発物／グレネード・ユニット1個。",
    effect: "その自軍のユニット内の爆発物／グレネードの兵を1体選択する。選択した兵の8mv以内に一部でも入っており、視認可能で非接敵状態の敵ユニットを1個選択する。その後D6を6個ロールし、4+が出るたびに選択した敵ユニットは1ポイントの致命的ダメージを受ける。",
  },
  {
    id: "overwatch",
    name: "Overwatch",
    nameJa: "警戒射撃",
    cp: 1,
    phases: ["movement"],
    when: "相手の移動フェイズ終了時。",
    effect: "非接敵状態の味方ユニット（巨大兵器・ユニットを除く）1個を選択する。そのユニットは即応射撃で射撃を行う。即応射撃：対象の24mv以内の視認可能な敵ユニット1個のみに射撃でき、ヒットロールは修正前の出目6でのみ成功する（リロール不可）。射撃後はそのフェイズ終了時までアクションの開始を宣言できない。",
  },
  {
    id: "tank-shock",
    name: "Tank Shock",
    nameJa: "激突",
    cp: 1,
    phases: ["charge"],
    when: "自軍の突撃フェイズ中、味方モンスター／ビークル・ユニットが突撃移動を終了した直後。",
    effect: "1.自軍ユニットと接敵状態の敵ユニット1個を選択する。2.選択した敵ユニットと接敵状態の味方兵を1体選択する。3.その味方の兵の【耐】と同じ数のD6をロールする：ロール結果が1の場合は自軍ユニットが1ポイントの、5+の場合は選択した敵ユニットが1ポイントの致命的ダメージを受ける（この効果で同じユニットが受ける致命的ダメージは最大6ポイントまで）。",
  },
  {
    id: "rapid-ingress",
    name: "Rapid Ingress",
    nameJa: "即応投入",
    cp: 1,
    phases: ["movement"],
    when: "相手の移動フェイズ終了時。",
    effect: "戦略的予備兵力に配置されている味方ユニット1個（航空機を除く）を選択する。そのユニットは突入移動を行う。制限：第1バトルラウンド中は使用できない。",
  },
  {
    id: "smokescreen",
    name: "Smokescreen",
    nameJa: "煙幕",
    cp: 1,
    phases: ["shooting"],
    when: "相手の射撃フェイズ開始時。",
    effect: "味方の煙幕・ユニット1個を選択する。そのフェイズ終了時まで、その煙幕・ユニット（またはそのユニット内の兵1体以上）によって攻撃側の兵が完全視認を妨げられている状態のユニットを対象にした攻撃が行なわれた場合、攻撃対象はその攻撃に対して遮蔽物ボーナスを得る。",
  },
  {
    id: "heroic-intervention",
    name: "Heroic Intervention",
    nameJa: "英雄的介入",
    cp: 1,
    phases: ["charge"],
    when: "相手の突撃フェイズ開始時。1個以上の敵ユニットの12mv以内に一部でも入っている、味方の非接敵状態のユニット1個（ビークルはキャラクター／ウォーカーのみ選択可）。",
    effect: "そのユニットは突撃を解決する。突撃ロールを行う前に、以下のモードから1つを選択する：「前進防衛」…このフェイズ中に突撃移動を行っており最大距離内にいる敵ユニットのみ選択可。「攻勢突進（+1CP）」…突撃ロール結果が6を超えた場合6にする。対象ユニットの6mv以内で最大距離内にいるならどの敵ユニットも選択可。",
  },
  {
    id: "counter-offensive",
    name: "Counter-offensive",
    nameJa: "反攻戦術",
    cp: 2,
    phases: ["fight"],
    when: "相手の白兵フェイズの白兵ステップ中、いずれかの敵ユニットが攻撃を解決した直後。",
    effect: "白兵を宣言可能な味方ユニット1個を選択する。そのフェイズ終了時まで、その自軍のユニットは〔先手〕アビリティを持つ。自軍は次にそのユニットで白兵を宣言しなければならない。",
  },
];
