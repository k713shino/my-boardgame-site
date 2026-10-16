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
  { id: "requirements", label: "動作環境" },
  { id: "install", label: "インストール" },
  { id: "usage", label: "使い方" },
  { id: "friends", label: "フレンドの登録" },
  { id: "settings", label: "写真の保存先を変えている場合" },
  { id: "data", label: "データの保存先と削除" },
  { id: "notes", label: "注意" },
  { id: "uninstall", label: "アップデート・アンインストール" },
  { id: "contact", label: "お問い合わせ" },
];

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-6 space-y-3">
      <h2 className="border-l-4 border-cyan-500 pl-3 text-lg font-black">{title}</h2>
      <div className="surface-card space-y-3 rounded-2xl p-5 text-sm leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-cyan-500/10 px-4 py-3 text-xs leading-relaxed">{children}</div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-slate-500/15 px-1 text-xs">{children}</code>;
}

export default function VRCMemoryAlbumManualPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-12">
      <div className="space-y-3">
        <Link
          href="/vrchat"
          className="text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-cyan-600 hover:underline dark:text-cyan-400"
        >
          ← VRChat
        </Link>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">VRC Memory Album</h1>
        <p className="text-sm text-muted leading-relaxed">
          VRChat で撮った写真を「いつ・どのワールドで・誰といた時か」で自動整理し、X（旧Twitter）用の投稿文をワンクリックで作る
          Windows 向けアプリです。
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {BOOTH_URL ? (
            <a
              href={BOOTH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-cyan-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-cyan-500"
            >
              BOOTH でダウンロード
            </a>
          ) : (
            <span className="rounded-full bg-slate-500/15 px-4 py-2 text-xs font-bold text-muted">
              配布準備中
            </span>
          )}
          <span className="text-xs text-muted">v{VERSION}</span>
        </div>
      </div>

      <figure className="space-y-2">
        <Image
          src="/images/vrchat/vrc-memory-album-screenshot.png"
          alt="VRC Memory Album の画面。左にワールドと一緒にいた人の一覧、中央に日付とワールドごとの写真、右に選んだ写真の詳細と X 投稿文。"
          width={1440}
          height={860}
          className="w-full rounded-2xl border border-slate-300/60 dark:border-slate-700/60"
          priority
        />
        <figcaption className="text-center text-[0.65rem] text-muted">
          画面イメージ（サンプルデータ）
        </figcaption>
      </figure>

      <nav className="surface-card rounded-2xl p-5" aria-label="目次">
        <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-widest text-muted">
          目次
        </p>
        <ol className="grid list-decimal gap-1 pl-5 text-sm sm:grid-cols-2">
          {TOC.map(({ id, label }) => (
            <li key={id}>
              <a href={`#${id}`} className="hover:text-cyan-600 hover:underline dark:hover:text-cyan-400">
                {label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <Section id="about" title="どんなアプリか">
        <ul className="list-disc space-y-1 pl-5">
          <li>VRChat のログを読み取り、写真を撮った時のワールドと一緒にいた人を自動で記録します。</li>
          <li>写真を日付・ワールドごとにまとめて表示し、ワールドや人で絞り込めます。</li>
          <li>ワールド名・一緒にいた人・ハッシュタグ入りの X 投稿文をワンクリックでコピーできます。</li>
          <li>VRChat のファイルは読むだけで、外部への通信も行いません。データはすべてお使いの PC 内に保存されます。</li>
        </ul>
      </Section>

      <Section id="requirements" title="動作環境">
        <ul className="list-disc space-y-1 pl-5">
          <li>Windows 10 / 11（64bit）</li>
        </ul>
      </Section>

      <Section id="install" title="インストール">
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            <Code>VRC Memory Album_{VERSION}_x64-setup.exe</Code> を実行します。
          </li>
          <li>
            初回は「Windows によって PC が保護されました」と表示されることがあります。「詳細情報」→「実行」を押してください。
          </li>
          <li>管理者権限は不要です。</li>
        </ol>
        <Note>
          「PC が保護されました」と表示されるのは、個人制作のためコード署名証明書を取得していないことが理由です。
        </Note>
      </Section>

      <Section id="usage" title="使い方">
        <h3 className="font-bold">1. 起動する</h3>
        <p>
          起動すると VRChat のログと写真フォルダを自動で読み込みます。アプリを開いている間は
          <strong> 1 分ごと</strong>に新しい写真を自動で取り込みます。
        </p>

        <h3 className="font-bold">2. 投稿文をコピーする</h3>
        <ol className="list-decimal space-y-1 pl-5">
          <li>写真をクリックします。</li>
          <li>右側の「撮影時にいた人」から、投稿に載せる人を選びます。</li>
          <li>「投稿文をコピー」を押すと、X にそのまま貼り付けられます。</li>
        </ol>
        <p>投稿文はこのような形になります（文字数も表示されます）。</p>
        <pre className="overflow-x-auto rounded-xl bg-slate-900 px-4 py-3 text-xs leading-relaxed text-slate-100">
{`📍 World: 幻想カフェ
👥 With: ボブ
https://vrchat.com/home/world/wrld_xxxx
#VRChat #VRC_幻想カフェ #VRC写真部`}
        </pre>
        <p className="text-xs text-muted">
          「ワールドURLを含める」のチェックで URL の有無を切り替えられます。
        </p>

        <h3 className="font-bold">3. 絞り込む・探す</h3>
        <ul className="list-disc space-y-1 pl-5">
          <li>左のワールド名や人の名前をクリックすると、その写真だけに絞り込めます。</li>
          <li>上の検索欄で、ワールド名・一緒にいた人・メモを検索できます。</li>
        </ul>

        <h3 className="font-bold">4. お気に入り・メモ</h3>
        <ul className="list-disc space-y-1 pl-5">
          <li>★ でお気に入りに追加できます。</li>
          <li>メモ欄に入力した内容は、検索にも使えます。</li>
        </ul>
      </Section>

      <Section id="friends" title="フレンドの登録">
        <p>
          VRChat のログにはフレンドかどうかの情報が無いため、「一緒にいた人」の <strong>♡</strong>{" "}
          を押してフレンドとして登録します。
        </p>
        <p>登録すると「フレンドと一緒の写真」で絞り込めるようになります。</p>
      </Section>

      <Section id="settings" title="写真の保存先を変えている場合">
        <p>
          右上の歯車（設定）から「スクリーンショット保存フォルダ」を指定してください。
        </p>
      </Section>

      <Section id="data" title="データの保存先と削除">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            写真の整理データは、アプリをインストールしたフォルダの中の <Code>data</Code>{" "}
            フォルダに保存されます（設定 → データ管理 で別のフォルダに移動できます）。
          </li>
          <li>
            設定 → データ管理 から、お気に入り・メモの削除や、すべてのデータの削除ができます。VRChat
            の写真やログが消えることはありません。
          </li>
          <li>
            「一緒にいた人」の一覧でゴミ箱を押すと、その人の記録を削除できます。「今後も記録しない」を選ぶと、以後も記録されません。
          </li>
        </ul>
      </Section>

      <Section id="notes" title="注意">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            「誰といたか」は VRChat のログから読み取ります。VRChat は古いログを自動で削除するため、アプリを入れる前の古い写真はワールドや同席者が分からない場合があります（写真自体は表示されます）。
            <strong>普段からアプリを起動しておくと記録が残り続けます。</strong>
          </li>
          <li>
            <strong>投稿に名前を載せるのは、写っている本人が了承している人だけにしましょう。</strong>
          </li>
          <li>
            このアプリは VRChat のファイルを読むだけで、VRChat 本体の改変や外部への通信は行いません。
          </li>
        </ul>
      </Section>

      <Section id="uninstall" title="アップデート・アンインストール">
        <p>
          <strong>アップデート：</strong>新しいバージョンのインストーラーを実行してください。<Code>data</Code>{" "}
          フォルダは消えずに残ります。
        </p>
        <p>
          <strong>アンインストール：</strong>Windows の「設定 → アプリ」から削除できます。
        </p>
        <Note>
          データも消したい場合は、先にアプリの 設定 → データ管理 →「すべてのデータを削除」を実行するか、アンインストール後にインストールしたフォルダの{" "}
          <Code>data</Code> フォルダを削除してください。
        </Note>
      </Section>

      <Section id="contact" title="お問い合わせ">
        <p>BOOTH のメッセージ機能からお願いします。</p>
      </Section>
    </div>
  );
}
