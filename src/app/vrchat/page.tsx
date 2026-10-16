import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "VRChat",
  description:
    "k713shino（シノ）の VRChat プロフィール。自己紹介・プレイ環境・フレンド申請・自作ツール。",
};

const PROFILE = {
  name: "k713shino",
  nameJa: "シノ",
  avatar: "/images/vrchat/avatar.jpg",
  gender: "♂",
  env: "PCVR / Desktop",
  languages: "日本語",
  micRate: 77,
  bio: [
    "シノと呼んでください！VRC初心者交流所172回生！",
    "マイブーム：ボードゲーム / Warhammer 40K / 執筆活動",
  ],
};

const ACCOUNTS = [
  { service: "VRChat", id: "k713shino", url: "" },
  { service: "X", id: "@k713shino", url: "https://x.com/k713shino" },
  { service: "Discord", id: "k713shino", url: "" },
];

const MIC_SCHEDULE = [
  { when: "平日 10:00〜16:00", how: "デスクトップ（マイクなし無言です）" },
  { when: "夜間 & 休日", how: "VR・マイクあり（基本は夜に喋ります！）" },
];

const PLAY_ENV = [
  { label: "HMD", value: "Pico 4 Ultra（PCVR）Motion Tracker ×3" },
  { label: "PC", value: "Ryzen 9 5900X / RTX 5070 / RAM 32GB" },
];

const TRUST_HISTORY = [
  { date: "2026/05/12", rank: "Visitor" },
  { date: "2026/05/14", rank: "New User" },
  { date: "2026/05/17", rank: "User" },
  { date: "2026/05/26", rank: "Known User" },
  { date: "2026/07/10", rank: "Trusted User" },
];

const STATUSES = [
  { color: "bg-sky-400", label: "Join Me", text: "よろしくよろしく" },
  { color: "bg-green-400", label: "Active", text: "よべばこたえるだれでもOK" },
  { color: "bg-orange-400", label: "Ask Me", text: "きいてみて" },
  { color: "bg-red-500", label: "Busy", text: "いないか、作業中" },
];

const FRIEND_POLICY = "だれでもOK / Twitter相互は申請OK";

const BOUNDARIES = [
  { label: "触る", mark: "◎" },
  { label: "近距離", mark: "◎" },
  { label: "お砂糖", mark: "-" },
  { label: "武器", mark: "◎" },
  { label: "暴言/暴力", mark: "△" },
  { label: "下ネタ", mark: "◎" },
];

const PHOTOS = [
  { src: "/images/vrchat/photo-1.jpg", alt: "VRChat で撮った写真 1" },
  { src: "/images/vrchat/photo-2.jpg", alt: "VRChat で撮った写真 2" },
  { src: "/images/vrchat/photo-3.jpg", alt: "VRChat で撮った写真 3" },
];

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

// 追加すると「Favorite Worlds」セクションが表示されます
// 例: { name: "ワールド名", author: "制作者名", comment: "ひとこと", url: "https://vrchat.com/home/world/wrld_..." }
const WORLDS: { name: string; author: string; comment: string; url: string }[] = [];

// 追加すると「Events」セクションが表示されます
// 例: { name: "イベント名", schedule: "毎週 ○曜日 21:00〜", comment: "ひとこと", url: "" }
const EVENTS: { name: string; schedule: string; comment: string; url: string }[] = [];

const NEWS = [
  {
    date: "2026-10-16",
    title: "VRChat ページを公開しました",
    body: "プロフィールと自作ツール「VRC Memory Album」の説明書を公開しました。",
  },
];

function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <h2 className="flex items-baseline gap-2">
      <span className="text-sm font-black">{children}</span>
      {sub && (
        <span className="text-[0.6rem] font-semibold uppercase tracking-widest text-muted">
          {sub}
        </span>
      )}
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
          VRChat でのプロフィールと、自作ツールをまとめたページです。
        </p>
      </div>

      {/* プロフィール */}
      <section className="surface-card space-y-5 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row">
          <Image
            src={PROFILE.avatar}
            alt={`${PROFILE.name} のアバター`}
            width={340}
            height={340}
            className="aspect-square w-40 shrink-0 self-center rounded-3xl object-cover sm:w-44 sm:self-start"
            priority
          />
          <div className="min-w-0 flex-1 space-y-3">
            <p className="text-2xl font-black">
              {PROFILE.name}
              <span className="ml-1 text-base font-bold text-muted">（{PROFILE.nameJa}）</span>
            </p>
            <dl className="grid grid-cols-3 gap-2 text-xs">
              {[
                { label: "性別", value: PROFILE.gender },
                { label: "環境", value: PROFILE.env },
                { label: "言語", value: PROFILE.languages },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl bg-cyan-500/10 px-3 py-2">
                  <dt className="text-[0.6rem] font-semibold text-muted">{label}</dt>
                  <dd className="font-bold">{value}</dd>
                </div>
              ))}
            </dl>
            <ul className="space-y-1 text-xs">
              {ACCOUNTS.map(({ service, id, url }) => (
                <li key={service} className="flex items-center gap-2">
                  <span className="w-16 shrink-0 text-[0.65rem] font-semibold text-muted">
                    {service}
                  </span>
                  {url ? <ExternalLink href={url}>{id}</ExternalLink> : <span className="font-semibold">{id}</span>}
                </li>
              ))}
            </ul>
            <div className="space-y-1">
              <div className="flex justify-between text-[0.65rem] font-semibold text-muted">
                <span>マイクON率</span>
                <span className="tabular-nums">{PROFILE.micRate}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-500/15">
                <div
                  className="h-full rounded-full bg-linear-to-r from-sky-400 to-violet-400"
                  style={{ width: `${PROFILE.micRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-1 text-sm leading-relaxed">
          {PROFILE.bio.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <SectionTitle sub="mic / in">マイク・イン事情</SectionTitle>
        <div className="surface-card divide-y divide-slate-300/40 rounded-2xl px-5 dark:divide-slate-600/40">
          {MIC_SCHEDULE.map(({ when, how }) => (
            <div key={when} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-4">
              <span className="shrink-0 text-xs font-bold text-cyan-600 sm:w-36 dark:text-cyan-400">
                {when}
              </span>
              <span className="text-xs leading-relaxed">{how}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <SectionTitle sub="status">ステータス</SectionTitle>
        <ul className="grid gap-2 sm:grid-cols-2">
          {STATUSES.map(({ color, label, text }) => (
            <li key={label} className="surface-card flex items-center gap-3 rounded-2xl px-4 py-3">
              <span className={`h-4 w-4 shrink-0 rounded-full ${color}`} aria-hidden />
              <span className="w-14 shrink-0 text-[0.6rem] font-semibold text-muted">{label}</span>
              <span className="text-xs font-semibold">{text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <SectionTitle sub="friend request policy">フレンド申請</SectionTitle>
        <div className="surface-card rounded-2xl px-5 py-4 text-sm font-semibold">
          {FRIEND_POLICY}
        </div>
      </section>

      <section className="space-y-3">
        <SectionTitle sub="my boundaries">OKなこと・NGなこと</SectionTitle>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {BOUNDARIES.map(({ label, mark }) => (
            <div key={label} className="surface-card flex items-center justify-between rounded-2xl px-4 py-3">
              <span className="text-xs font-semibold">{label}</span>
              <span className="text-base font-black text-cyan-600 dark:text-cyan-400">{mark}</span>
            </div>
          ))}
        </div>
        <p className="text-[0.65rem] text-muted">◎ OK ／ △ ほどほどに ／ - 対象外</p>
      </section>

      <section className="space-y-3">
        <SectionTitle sub="play environment">プレイ環境</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          <dl className="surface-card space-y-2 rounded-2xl px-5 py-4">
            {PLAY_ENV.map(({ label, value }) => (
              <div key={label}>
                <dt className="text-[0.6rem] font-semibold text-muted">{label}</dt>
                <dd className="text-xs font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="surface-card rounded-2xl px-5 py-4">
            <p className="mb-2 text-[0.6rem] font-semibold text-muted">Trust Rank History</p>
            <ol className="space-y-1">
              {TRUST_HISTORY.map(({ date, rank }) => (
                <li key={rank} className="flex gap-3 text-xs">
                  <time className="tabular-nums text-muted">{date}</time>
                  <span className="font-semibold">{rank}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <SectionTitle sub="photos">写真</SectionTitle>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {PHOTOS.map(({ src, alt }) => (
            <Image
              key={src}
              src={src}
              alt={alt}
              width={238}
              height={238}
              className="aspect-square w-full rounded-2xl object-cover"
            />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <SectionTitle sub="tools">自作ツール</SectionTitle>
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

      {WORLDS.length > 0 && (
        <section className="space-y-3">
          <SectionTitle sub="favorite worlds">よく行くワールド</SectionTitle>
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
      )}

      {EVENTS.length > 0 && (
        <section className="space-y-3">
          <SectionTitle sub="events">イベント</SectionTitle>
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
      )}

      <section className="space-y-3">
        <SectionTitle sub="news">お知らせ</SectionTitle>
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
