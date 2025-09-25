"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";

type CollectionOption = "posts" | "games";

type SubmitStatus = "idle" | "sending" | "success" | "error";

type UploadResult = {
  collection: CollectionOption;
  entryId: string;
  filename: string;
  outcome: "created" | "updated";
};

const collectionOptions: Array<{ value: CollectionOption; label: string }> = [
  { value: "posts", label: "Blog (posts)" },
  { value: "games", label: "Games" },
];

export default function MarkdownUploadPage() {
  const [collection, setCollection] = useState<CollectionOption>("posts");
  const [entryId, setEntryId] = useState("");
  const [token, setToken] = useState("");
  const [overwrite, setOverwrite] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<UploadResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    setFile(selected);
  };

  const clearFormFields = () => {
    setEntryId("");
    setOverwrite(false);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      setStatus("error");
      setMessage("Markdownファイルを選択してください。");
      return;
    }

    setStatus("sending");
    setMessage("");
    setResult(null);

    const formData = new FormData();
    formData.append("collection", collection);
    formData.append("file", file);
    if (entryId.trim()) formData.append("entryId", entryId.trim());
    if (token.trim()) formData.append("token", token.trim());
    if (overwrite) formData.append("overwrite", "true");

    try {
      const response = await fetch("/api/upload-markdown", {
        method: "POST",
        body: formData,
      });

      const json = await response.json().catch(() => null);

      if (!response.ok || !json || !json.ok) {
        const errorMessage =
          (json && typeof json.error === "string" && json.error) ||
          "アップロードに失敗しました (status " + response.status + ")";
        setStatus("error");
        setMessage(errorMessage);
        return;
      }

      setStatus("success");
      setMessage(
        json.outcome === "updated"
          ? "既存のファイルを更新しました。"
          : "新規ファイルを作成しました。"
      );
      setResult({
        collection: json.collection as CollectionOption,
        entryId: json.entryId as string,
        filename: json.filename as string,
        outcome: json.outcome as UploadResult["outcome"],
      });
      clearFormFields();
    } catch (error) {
      console.error("Markdown upload failed", error);
      setStatus("error");
      setMessage("通信エラーが発生しました。");
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Markdownアップロード</h1>
        <p className="text-sm text-gray-600">
          Front Matter付きのMarkdown/MDXをアップロードしてBlogまたはGamesコレクションを更新します。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="collection" className="block text-sm font-medium text-gray-700">
            送信先コレクション
          </label>
          <select
            id="collection"
            className="mt-1 w-full rounded border px-3 py-2"
            value={collection}
            onChange={(event) => setCollection(event.target.value as CollectionOption)}
          >
            {collectionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="entryId" className="block text-sm font-medium text-gray-700">
            エントリーIDの上書き (slug/id) — 未入力の場合はFront Matterから推測します
          </label>
          <input
            id="entryId"
            className="mt-1 w-full rounded border px-3 py-2"
            value={entryId}
            onChange={(event) => setEntryId(event.target.value)}
            placeholder="例: dominion"
          />
        </div>

        <div>
          <label htmlFor="markdown-file" className="block text-sm font-medium text-gray-700">
            Markdownファイル (.md / .mdx)
          </label>
          <input
            id="markdown-file"
            required
            type="file"
            accept=".md,.mdx,text/markdown"
            className="mt-1 w-full"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </div>

        <div>
          <label htmlFor="token" className="block text-sm font-medium text-gray-700">
            認証トークン (APIにCONTENT_UPLOAD_TOKENが設定されている場合)
          </label>
          <input
            id="token"
            className="mt-1 w-full rounded border px-3 py-2"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="任意"
            autoComplete="off"
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={overwrite}
            onChange={(event) => setOverwrite(event.target.checked)}
          />
          既存ファイルがある場合は上書きする
        </label>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-300"
          >
            {status === "sending" ? "送信中..." : "アップロード"}
          </button>
          {file ? (
            <span className="text-sm text-gray-600">選択中: {file.name}</span>
          ) : (
            <span className="text-sm text-gray-500">ファイル未選択</span>
          )}
        </div>
      </form>

      {message ? (
        <div
          className={
            status === "success"
              ? "rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
              : status === "error"
              ? "rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              : "text-sm text-gray-600"
          }
        >
          {message}
        </div>
      ) : null}

      {result ? (
        <dl className="grid gap-2 rounded border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
          <div className="flex justify-between">
            <dt className="font-medium">コレクション</dt>
            <dd>{result.collection}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium">エントリーID</dt>
            <dd>{result.entryId}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium">ファイル名</dt>
            <dd>{result.filename}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium">結果</dt>
            <dd>{result.outcome === "created" ? "新規作成" : "更新"}</dd>
          </div>
        </dl>
      ) : null}

      <section className="space-y-2 text-sm text-gray-600">
        <h2 className="text-base font-semibold text-gray-800">Front Matterの推奨</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Blog投稿は <code>slug</code> または <code>title</code> を含めてください。</li>
          <li>ゲームは <code>id</code> または <code>title</code> を含めてください。</li>
          <li>既存ファイルを更新する場合はチェックボックスで上書きを許可します。</li>
        </ul>
      </section>
    </div>
  );
}
