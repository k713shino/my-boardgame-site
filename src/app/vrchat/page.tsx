import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "VRChat",
  description:
    "VRChat での活動まとめ。自己紹介・よく行くワールド・参加イベント・フレンド募集・自作ツール。",
};

// TODO: 以下の定数を自分の内容に書き換えてください（表示はこの定数だけで決まります）

const PROFILE = {
  name: "k713shino",
  // VRChat のユーザーページ URL（不要なら空文字）
  vrchatUrl: "",
  // X（Twitter）の URL（不要なら空文字）
  xUrl: "",
  bio: "VRChat でワールド巡りや写真撮影を楽しんでいます。ボードゲームも好きです。",
  facts: [
    { label: "活動時間", value: "平日夜・週末" },
    { label: "使用環境", value: "PC（デスクトップ / VR）" },
    { label: "好きなこと", value: "写真撮影・ワールド巡り" },
  ],
};

const TOOLS = [
  {
    href: "/vrchat/vrc-memory-album",
    label: "VRC Memory Album",
    labelJa: "思い出アルバム",
    desc: "VRChat で撮った写真を「いつ・どのワールドで・誰といた時か」で自動整理し、X 用の投稿文をワンクリックで作る Windows アプリ。",
    icon: "📸",
    status: "準備中",
  },
];

const WORLDS = [
  {
    name: "ワールド名",
    author: "制作者名",
    comment: "お気に入りの理由をひとこと。",
    url: "",
  },
];

const EVENTS = [
  {
    name: "イベント名",
    schedule: "毎週 ○曜日 21:00〜",
    comment: "どんなイベントかをひとこと。",
    url: "",
  },
];

const FRIEND = {
  body: "一緒にワールド巡りや写真撮影をしてくれるフレンドを募集しています。気軽に声をかけてください。",
  welcome: ["写真を撮るのが好きな方", "ワールド巡りが好きな方", "ボードゲームが好きな方"],
  howTo: "VRChat 内で声をかけるか、X の DM でご連絡ください。",
};

const NEWS = [
  {
    date: "2026-10-16",
    title: "VRChat ページを公開しました",
    body: "自己紹介・よく行くワールド・イベント・自作ツールの紹介ページを公開しました。",
  },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[0.65rem] font-bold uppercase tracking-widest text-muted">
      {children}
    </h2>
  );
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs font-semibold text-cyan-600 underline-offset-2 hover:underline dark:text-cyan-400"
    >
      {children}
    </a>
  );
}

export default function VRChatHubPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-12">
      <div className="space-y-3">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-cyan-600 dark:text-cyan-400">
          VRChat
        </span>
        <h1 className="text-3xl font-black uppercase tracking-tight sm:text-4xl">
          VRChat Hub
        </h1>
        <p className="text-sm text-muted leading-relaxed">
          VRChat での活動と、自作ツールをまとめたページです。
        </p>
      </div>

      <section className="space-y-3">
        <SectionTitle>Profile</SectionTitle>
        <div className="surface-card space-y-4 rounded-2xl p-5">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-lg font-black">{PROFILE.name}</p>
            {PROFILE.vrchatUrl && <ExternalLink href={PROFILE.vrchatUrl}>VRChat</ExternalLink>}
            {PROFILE.xUrl && <ExternalLink href={PROFILE.xUrl}>X</ExternalLink>}
          </div>
          <p className="text-sm text-muted leading-relaxed">{PROFILE.bio}</p>
          <dl className="grid gap-2 sm:grid-cols-3">
            {PROFILE.facts.map(({ label, value }) => (
              <div key={label} className="rounded-xl bg-cyan-500/10 px-3 py-2">
                <dt className="text-[0.6rem] font-semibold text-muted">{label}</dt>
                <dd className="text-xs font-bold">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="space-y-3">
        <SectionTitle>Tools</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          {TOOLS.map(({ href, label, labelJa, desc, icon, status }) => (
            <Link
              key={href}
              href={href}
              className="group surface-card flex flex-col gap-2 rounded-2xl border border-transparent p-5 transition hover:-translate-y-0.5 hover:border-slate-300/60 dark:hover:border-slate-600/60"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{icon}</span>
                <span className="text-sm font-bold text-(--fg-body)">{label}</span>
                {status && (
                  <span className="ml-auto rounded-full bg-cyan-500/15 px-2 py-0.5 text-[0.6rem] font-semibold text-cyan-600 dark:text-cyan-400">
                    {status}
                  </span>
                )}
              </div>
              <p className="text-[0.65rem] font-medium text-muted">{labelJa}</p>
              <p className="text-xs text-muted leading-relaxed">{desc}</p>
              <p className="text-[0.65rem] font-semibold text-cyan-600 dark:text-cyan-400">
                説明書を読む →
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <SectionTitle>Favorite Worlds</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          {WORLDS.map((w) => (
            <div key={w.name} className="surface-card space-y-1 rounded-2xl px-5 py-4">
              <p className="text-sm font-bold">{w.name}</p>
              <p className="text-[0.65rem] text-muted">by {w.author}</p>
              <p className="text-xs text-muted leading-relaxed">{w.comment}</p>
              {w.url && <ExternalLink href={w.url}>ワールドを見る</ExternalLink>}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <SectionTitle>Events</SectionTitle>
        <div className="space-y-2">
          {EVENTS.map((e) => (
            <div key={e.name} className="surface-card space-y-1 rounded-2xl px-5 py-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-bold">{e.name}</p>
                <span className="text-[0.62rem] font-semibold text-cyan-600 dark:text-cyan-400">
                  {e.schedule}
                </span>
              </div>
              <p className="text-xs text-muted leading-relaxed">{e.comment}</p>
              {e.url && <ExternalLink href={e.url}>詳細</ExternalLink>}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <SectionTitle>Friend Wanted</SectionTitle>
        <div className="surface-card space-y-3 rounded-2xl p-5">
          <p className="text-sm leading-relaxed">{FRIEND.body}</p>
          <ul className="list-disc space-y-1 pl-5 text-xs text-muted">
            {FRIEND.welcome.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
          <p className="text-xs text-muted leading-relaxed">{FRIEND.howTo}</p>
        </div>
      </section>

      <section className="space-y-3">
        <SectionTitle>News</SectionTitle>
        <div className="space-y-2">
          {NEWS.map((item, i) => (
            <div key={i} className="surface-card rounded-2xl px-5 py-4 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <time className="text-[0.62rem] font-semibold tabular-nums text-cyan-600 dark:text-cyan-400">
                  {item.date}
                </time>
                <p className="text-xs font-bold">{item.title}</p>
              </div>
              <p className="text-[0.68rem] text-muted leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
