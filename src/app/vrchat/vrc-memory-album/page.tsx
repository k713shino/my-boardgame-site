import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "VRC Memory Album 説明書 | VRChat",
  description:
    "VRChat で撮った写真を「いつ・どのワールドで・誰といた時か」で自動整理し、X 用の投稿文をワンクリックで作る Windows アプリ「VRC Memory Album」の使い方。",
};

// BOOTH で公開したら URL を入れてください（空のあいだは「配布準備中」表示）
const BOOTH_URL = "";
const VERSION = "0.1.0";

const TOC = [
  { id: "about", label: "どんなアプリか" },
  { id: "install", label: "動作環境・インストール" },
  { id: "log-setting", label: "ログの出力を「完全」に" },
  { id: "usage", label: "使い方" },
  { id: "friends", label: "フレンドの登録" },
  { id: "data", label: "データの保存先と削除" },
  { id: "notes", label: "注意" },
  { id: "uninstall", label: "アップデート・アンインストール" },
  { id: "contact", label: "お問い合わせ" },
];

const FEATURES = [
  {
    icon: "🗂️",
    title: "写真を自動で整理",
    body: "VRChat のログから、撮影時のワールドと一緒にいた人を記録。日付・ワールドごとに並びます。",
  },
  {
    icon: "📝",
    title: "投稿文をワンクリック",
    body: "ワールド名・一緒にいた人・ハッシュタグ入りの X 投稿文をそのままコピー。",
  },
  {
    icon: "🔍",
    title: "絞り込み・検索",
    body: "ワールドや人で絞り込み。ワールド名・人・メモをキーワード検索できます。",
  },
  {
    icon: "🔒",
    title: "完全ローカル",
    body: "VRChat のファイルは読むだけ。外部への通信はせず、データはすべて PC 内に保存します。",
  },
];

function Section({
  id,
  no,
  title,
  children,
}: {
  id: string;
  no: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-6 space-y-3">
      <h2 className="flex items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/15 text-xs font-black tabular-nums text-cyan-600 dark:text-cyan-400">
          {String(no).padStart(2, "0")}
        </span>
        <span className="text-lg font-black tracking-tight">{title}</span>
      </h2>
      {children}
    </section>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`surface-card space-y-3 rounded-2xl p-5 text-sm leading-relaxed sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

function Steps({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-600 text-[0.65rem] font-bold text-white">
            {i + 1}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Note({ children, tone = "info" }: { children: React.ReactNode; tone?: "info" | "warn" }) {
  const toneClass =
    tone === "warn"
      ? "border-amber-400/60 bg-amber-400/10"
      : "border-cyan-500/50 bg-cyan-500/10";
  return (
    <div className={`rounded-r-xl border-l-4 px-4 py-3 text-xs leading-relaxed ${toneClass}`}>
      {children}
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-md bg-slate-500/15 px-1.5 py-0.5 font-mono text-[0.8em]">{children}</code>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-bold text-cyan-700 dark:text-cyan-300">{children}</h3>;
}

export default function VRCMemoryAlbumManualPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-12">
      {/* ヒーロー */}
      <header className="space-y-6">
        <Link
          href="/vrchat"
          className="inline-block text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-cyan-600 hover:underline dark:text-cyan-400"
        >
          ← VRChat
        </Link>
        <div className="grid items-center gap-6 lg:grid-cols-[1fr_1.35fr]">
          <div className="space-y-4">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-muted">
              Windows App · v{VERSION}
            </p>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">VRC Memory Album</h1>
            <p className="text-sm leading-relaxed text-muted">
              VRChat で撮った写真を「いつ・どのワールドで・誰といた時か」で自動整理し、X（旧Twitter）用の投稿文をワンクリックで作るアプリです。
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {BOOTH_URL ? (
                <a
                  href={BOOTH_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-cyan-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-cyan-500"
                >
                  BOOTH でダウンロード
                </a>
              ) : (
                <span className="rounded-full bg-slate-500/15 px-5 py-2.5 text-xs font-bold text-muted">
                  配布準備中
                </span>
              )}
              <span className="rounded-full border border-slate-300/70 px-3 py-1.5 text-[0.65rem] font-semibold text-muted dark:border-slate-600/70">
                Windows 10 / 11
              </span>
              <span className="rounded-full border border-slate-300/70 px-3 py-1.5 text-[0.65rem] font-semibold text-muted dark:border-slate-600/70">
                完全ローカル動作
              </span>
            </div>
          </div>
          <figure className="space-y-2">
            <Image
              src="/images/vrchat/vrc-memory-album-screenshot.png"
              alt="VRC Memory Album の画面。左にワールドと一緒にいた人の一覧、中央に日付とワールドごとの写真、右に選んだ写真の詳細と X 投稿文。"
              width={1440}
              height={860}
              className="w-full rounded-2xl shadow-2xl shadow-slate-900/20 ring-1 ring-slate-900/10 dark:ring-white/10"
              priority
            />
            <figcaption className="text-right text-[0.6rem] text-muted">
              画面イメージ（サンプルデータ）
            </figcaption>
          </figure>
        </div>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[13rem_1fr] lg:gap-10">
        {/* 目次 */}
        <nav aria-label="目次" className="lg:sticky lg:top-6 lg:self-start">
          <p className="mb-3 text-[0.65rem] font-bold uppercase tracking-widest text-muted">目次</p>
          <ol className="flex flex-wrap gap-2 lg:flex-col lg:gap-0.5">
            {TOC.map(({ id, label }, i) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="flex items-center gap-2 rounded-full border border-slate-300/60 px-3 py-1.5 text-xs transition hover:border-cyan-500 hover:text-cyan-600 lg:rounded-lg lg:border-transparent lg:px-2 lg:hover:bg-cyan-500/10 dark:border-slate-600/60 dark:hover:text-cyan-400"
                >
                  <span className="text-[0.6rem] font-bold tabular-nums text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* 本文 */}
        <div className="min-w-0 space-y-10">
          <Section id="about" no={1} title="どんなアプリか">
            <div className="grid gap-3 sm:grid-cols-2">
              {FEATURES.map(({ icon, title, body }) => (
                <div key={title} className="surface-card space-y-1.5 rounded-2xl p-5">
                  <p className="flex items-center gap-2 text-sm font-bold">
                    <span className="text-lg">{icon}</span>
                    {title}
                  </p>
                  <p className="text-xs leading-relaxed text-muted">{body}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="install" no={2} title="動作環境・インストール">
            <Card>
              <dl className="flex flex-wrap gap-x-6 gap-y-1 border-b border-slate-300/50 pb-3 text-xs dark:border-slate-600/50">
                <div className="flex gap-2">
                  <dt className="font-semibold text-muted">OS</dt>
                  <dd className="font-bold">Windows 10 / 11（64bit）</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-semibold text-muted">管理者権限</dt>
                  <dd className="font-bold">不要</dd>
                </div>
              </dl>
              <Steps
                items={[
                  <>
                    <Code>VRC Memory Album_{VERSION}_x64-setup.exe</Code> を実行します。
                  </>,
                  <>
                    初回は「Windows によって PC が保護されました」と表示されることがあります。
                    <strong>「詳細情報」→「実行」</strong>を押してください。
                  </>,
                  <>画面の案内に従って進めれば完了です。</>,
                ]}
              />
              <Note>
                「PC が保護されました」と表示されるのは、個人制作のためコード署名証明書を取得していないことが理由です。
              </Note>
            </Card>
          </Section>

          <Section id="log-setting" no={3} title="事前準備：ログの出力を「完全」にする">
            <Note tone="warn">
              <strong>
                VRChat の「ログの出力」が「完全」になっていないと、アルバムの機能は正しく動きません。
              </strong>
              ワールドや一緒にいた人はログから読み取っているため、使い始める前に必ず設定してください。
            </Note>
            <Card>
              <div className="grid items-center gap-5 sm:grid-cols-[1fr_15rem]">
                <Steps
                  items={[
                    <>VRChat でメニューを開き、下の歯車アイコンから<strong>「設定」</strong>を開きます。</>,
                    <>下までスクロールして<strong>「デバッグ」</strong>の項目を表示します。</>,
                    <>
                      <strong>「ログの出力」</strong>を左右の矢印で<strong>「完全」</strong>にします。
                    </>,
                  ]}
                />
                <figure className="space-y-1.5">
                  <Image
                    src="/images/vrchat/vrc-log-output-setting.jpg"
                    alt="VRChat の設定画面。デバッグ項目の「ログの出力」が「完全」になっている部分を赤枠で囲んでいる。"
                    width={728}
                    height={776}
                    className="w-full rounded-xl ring-1 ring-slate-900/10 dark:ring-white/10"
                  />
                  <figcaption className="text-center text-[0.6rem] text-muted">
                    設定 → デバッグ →「ログの出力：完全」
                  </figcaption>
                </figure>
              </div>
            </Card>
          </Section>

          <Section id="usage" no={4} title="使い方">
            <Card className="space-y-5">
              <div className="space-y-2">
                <SubHeading>起動する</SubHeading>
                <p>
                  起動すると VRChat のログと写真フォルダを自動で読み込みます。アプリを開いている間は
                  <strong> 1 分ごと</strong>に新しい写真を自動で取り込みます。
                </p>
                <p className="text-xs text-muted">
                  写真の保存先を変えている場合は、右上の歯車（設定）から「スクリーンショット保存フォルダ」を指定してください。
                </p>
              </div>

              <div className="space-y-3">
                <SubHeading>投稿文をコピーする</SubHeading>
                <Steps
                  items={[
                    <>写真をクリックします。</>,
                    <>右側の「撮影時にいた人」から、投稿に載せる人を選びます。</>,
                    <>「投稿文をコピー」を押すと、X にそのまま貼り付けられます。</>,
                  ]}
                />
                <div className="overflow-hidden rounded-xl ring-1 ring-slate-900/10 dark:ring-white/10">
                  <p className="bg-slate-800 px-4 py-1.5 text-[0.6rem] font-semibold tracking-widest text-slate-400">
                    投稿文の例
                  </p>
                  <pre className="overflow-x-auto bg-slate-900 px-4 py-3 font-mono text-xs leading-relaxed text-slate-100">
{`📍 World: 幻想カフェ
👥 With: ボブ
https://vrchat.com/home/world/wrld_xxxx
#VRChat #VRC_幻想カフェ #VRC写真部`}
                  </pre>
                </div>
                <p className="text-xs text-muted">
                  「ワールドURLを含める」で URL の有無を切り替えられます。X の文字数（280）に対するカウントも表示されます。
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <SubHeading>絞り込む・探す</SubHeading>
                  <Bullets
                    items={[
                      "左のワールド名や人の名前をクリックすると、その写真だけに絞り込めます。",
                      "上の検索欄で、ワールド名・一緒にいた人・メモを検索できます。",
                    ]}
                  />
                </div>
                <div className="space-y-2">
                  <SubHeading>お気に入り・メモ</SubHeading>
                  <Bullets
                    items={["★ でお気に入りに追加できます。", "メモ欄に入力した内容は、検索にも使えます。"]}
                  />
                </div>
              </div>
            </Card>
          </Section>

          <Section id="friends" no={5} title="フレンドの登録">
            <Card>
              <p>
                VRChat のログにはフレンドかどうかの情報が無いため、「一緒にいた人」の <strong>♡</strong>{" "}
                を押してフレンドとして登録します。登録すると「フレンドと一緒の写真」で絞り込めるようになります。
              </p>
            </Card>
          </Section>

          <Section id="data" no={6} title="データの保存先と削除">
            <Card>
              <Bullets
                items={[
                  <>
                    写真の整理データは、アプリをインストールしたフォルダの中の <Code>data</Code>{" "}
                    フォルダに保存されます。<strong>設定 → データ管理</strong> で別のフォルダに移動できます。
                  </>,
                  <>
                    設定 → データ管理 から、お気に入り・メモの削除や、すべてのデータの削除ができます。
                  </>,
                  <>
                    「一緒にいた人」の一覧でゴミ箱を押すと、その人の記録を削除できます。「今後も記録しない」を選ぶと、以後も記録されません。
                  </>,
                ]}
              />
              <Note>データを削除しても、VRChat の写真やログが消えることはありません。</Note>
            </Card>
          </Section>

          <Section id="notes" no={7} title="注意">
            <div className="space-y-3">
              <Note tone="warn">
                <strong>投稿に名前を載せるのは、写っている本人が了承している人だけにしましょう。</strong>
              </Note>
              <Card>
                <Bullets
                  items={[
                    <>
                      「誰といたか」は VRChat のログから読み取ります。VRChat は古いログを自動で削除するため、アプリを入れる前の古い写真はワールドや同席者が分からない場合があります（写真自体は表示されます）。
                      <strong>普段からアプリを起動しておくと記録が残り続けます。</strong>
                    </>,
                    <>
                      VRChat の「ログの出力」が「完全」になっていない間に撮った写真は、ワールドや同席者を記録できません（
                      <a href="#log-setting" className="text-cyan-600 underline-offset-2 hover:underline dark:text-cyan-400">
                        設定方法
                      </a>
                      ）。
                    </>,
                    "このアプリは VRChat のファイルを読むだけで、VRChat 本体の改変や外部への通信は行いません。",
                  ]}
                />
              </Card>
            </div>
          </Section>

          <Section id="uninstall" no={8} title="アップデート・アンインストール">
            <div className="grid gap-3 sm:grid-cols-2">
              <Card>
                <SubHeading>アップデート</SubHeading>
                <p>
                  新しいバージョンのインストーラーを実行してください。<Code>data</Code> フォルダは消えずに残ります。
                </p>
              </Card>
              <Card>
                <SubHeading>アンインストール</SubHeading>
                <p>Windows の「設定 → アプリ」から削除できます。</p>
              </Card>
            </div>
            <Note>
              データも消したい場合は、先にアプリの 設定 → データ管理 →「すべてのデータを削除」を実行するか、アンインストール後にインストールしたフォルダの{" "}
              <Code>data</Code> フォルダを削除してください。
            </Note>
          </Section>

          <Section id="contact" no={9} title="お問い合わせ">
            <Card>
              <p>BOOTH のメッセージ機能からお願いします。</p>
            </Card>
          </Section>
        </div>
      </div>
    </div>
  );
}
