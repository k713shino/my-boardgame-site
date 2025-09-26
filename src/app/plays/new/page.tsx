"use client";

import Image from "next/image";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";

type Player = { name: string; score?: number; win?: boolean };
type SubmitStatus = "idle" | "sending" | "ok" | "error";
type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function NewPlayPage() {
  const [date, setDate] = useState<string>("");
  const [gameId, setGameId] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [players, setPlayers] = useState<Player[]>([{ name: "" }]);
  const [notes, setNotes] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [hp, setHp] = useState<string>("");

  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [message, setMessage] = useState<string>("");
  const [imageUploadStatus, setImageUploadStatus] = useState<UploadStatus>("idle");
  const [imageUploadMessage, setImageUploadMessage] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const addPlayer = () => setPlayers((prev) => [...prev, { name: "" }]);
  const updatePlayer = (idx: number, patch: Partial<Player>) =>
    setPlayers((prev) => prev.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
  const removePlayer = (idx: number) =>
    setPlayers((prev) => prev.filter((_, i) => i !== idx));

  const resetForm = () => {
    setDate("");
    setGameId("");
    setLocation("");
    setPlayers([{ name: "" }]);
    setNotes("");
    setTags("");
    setImage("");
    setImageUploadStatus("idle");
    setImageUploadMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const clearImage = () => {
    setImage("");
    setImageUploadStatus("idle");
    setImageUploadMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  async function uploadImageFile(file: File) {
    setImageUploadStatus("uploading");
    setImageUploadMessage(`${file.name} をアップロード中...`);

    const formData = new FormData();
    formData.append("file", file);
    if (tags.trim()) formData.append("tags", tags);

    try {
      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error ?? `Upload failed with status ${res.status}`);
      }
      setImage(json.url as string);
      setImageUploadStatus("success");
      setImageUploadMessage("Cloudinaryにアップロードしました。");
    } catch (error) {
      console.error("Image upload failed", error);
      setImageUploadStatus("error");
      setImageUploadMessage(
        `アップロードに失敗しました: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  const handleImageFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await uploadImageFile(file);
  };

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    try {
      const res = await fetch("/api/submit-play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          gameId,
          location,
          players: players.filter((p) => p.name.trim().length),
          notes,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          image: image.trim() || undefined,
          _hp: hp,
        }),
      });
      const json = await res.json();
      if (json.ok) {
        setStatus("ok");
        setMessage("送信できました！");
        resetForm();
      } else {
        setStatus("error");
        setMessage("送信に失敗しました: " + (json.error ?? "unknown"));
      }
    } catch (error) {
      setStatus("error");
      setMessage("通信エラー: " + String(error));
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3 text-center sm:text-left">
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-500 sm:tracking-[0.35em]">Session Entry</span>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--fg-body)]">プレイ記録の追加</h1>
        <p className="text-sm text-muted sm:text-base">プレイ内容を記録してコミュニティと共有しましょう。</p>
      </div>
      <form onSubmit={handleSubmit} className="surface-card mx-auto max-w-2xl space-y-6 rounded-2xl px-5 py-5 sm:px-6 sm:py-6">
        <div className="hidden">
          <label htmlFor="honeypot">このフィールドに入力しないでください</label>
          <input id="honeypot" value={hp} onChange={(event) => setHp(event.target.value)} />
        </div>

        <div>
          <label htmlFor="play-date" className="block text-sm font-medium">
            日付
          </label>
          <input
            id="play-date"
            required
            type="date"
            className="mt-1 w-full rounded-xl border border-slate-300/60 bg-white/80 px-3 py-2 text-sm shadow-sm focus:border-teal-400 focus:outline-none focus:ring-0 dark:border-slate-600/60 dark:bg-slate-900/70 dark:text-slate-100"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="play-game" className="block text-sm font-medium">
            ゲームID（例: dominion）
          </label>
          <input
            id="play-game"
            required
            className="mt-1 w-full rounded-xl border border-slate-300/60 bg-white/80 px-3 py-2 text-sm shadow-sm focus:border-teal-400 focus:outline-none focus:ring-0 dark:border-slate-600/60 dark:bg-slate-900/70 dark:text-slate-100"
            value={gameId}
            onChange={(event) => setGameId(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="play-location" className="block text-sm font-medium">
            場所
          </label>
          <input
            id="play-location"
            className="mt-1 w-full rounded-xl border border-slate-300/60 bg-white/80 px-3 py-2 text-sm shadow-sm focus:border-teal-400 focus:outline-none focus:ring-0 dark:border-slate-600/60 dark:bg-slate-900/70 dark:text-slate-100"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">プレイヤー</div>
          {players.map((player, index) => (
            <div key={index} className="flex flex-col gap-2 rounded-xl border border-slate-200/60 bg-white/80 p-3 shadow-sm sm:grid sm:grid-cols-12 sm:items-center sm:gap-3 dark:border-slate-700/60 dark:bg-slate-900/60">
              <label htmlFor={`player-${index}-name`} className="sr-only">
                プレイヤー名 {index + 1}
              </label>
              <input
                id={`player-${index}-name`}
                placeholder="名前"
                className="w-full rounded-xl border border-slate-300/60 bg-white/80 px-3 py-2 text-sm shadow-sm focus:border-teal-400 focus:outline-none focus:ring-0 dark:border-slate-600/60 dark:bg-slate-900/70 dark:text-slate-100 sm:col-span-5"
                value={player.name}
                onChange={(event) => updatePlayer(index, { name: event.target.value })}
              />
              <label htmlFor={`player-${index}-score`} className="sr-only">
                スコア {index + 1}
              </label>
              <input
                id={`player-${index}-score`}
                placeholder="スコア"
                type="number"
                className="w-full rounded-xl border border-slate-300/60 bg-white/80 px-3 py-2 text-sm shadow-sm focus:border-teal-400 focus:outline-none focus:ring-0 dark:border-slate-600/60 dark:bg-slate-900/70 dark:text-slate-100 sm:col-span-3"
                value={player.score ?? ""}
                onChange={(event) =>
                  updatePlayer(index, {
                    score: event.target.value ? Number(event.target.value) : undefined,
                  })
                }
              />
              <label className="flex items-center gap-1 text-sm sm:col-span-2">
                <input
                  type="checkbox"
                  checked={player.win ?? false}
                  onChange={(event) => updatePlayer(index, { win: event.target.checked })}
                />
                勝利
              </label>
              <button
                type="button"
                onClick={() => removePlayer(index)}
                className="text-sm font-semibold text-rose-500 underline underline-offset-4 transition hover:text-rose-400 sm:col-span-2"
              >
                削除
              </button>
            </div>
          ))}
          <button type="button" onClick={addPlayer} className="text-sm font-semibold text-teal-500 underline underline-offset-4 transition hover:text-teal-400">
            + 追加
          </button>
        </div>

        <div>
          <label htmlFor="play-notes" className="block text-sm font-medium">
            メモ
          </label>
          <textarea
            id="play-notes"
            className="mt-1 h-32 w-full rounded-xl border border-slate-300/60 bg-white/80 px-3 py-3 text-sm shadow-sm focus:border-teal-400 focus:outline-none focus:ring-0 dark:border-slate-600/60 dark:bg-slate-900/70 dark:text-slate-100"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="play-tags" className="block text-sm font-medium">
            タグ（カンマ区切り）
          </label>
          <input
            id="play-tags"
            className="mt-1 w-full rounded-xl border border-slate-300/60 bg-white/80 px-3 py-2 text-sm shadow-sm focus:border-teal-400 focus:outline-none focus:ring-0 dark:border-slate-600/60 dark:bg-slate-900/70 dark:text-slate-100"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div>
            <label htmlFor="play-image-file" className="block text-sm font-medium">
              画像ファイルをCloudinaryへアップロード
            </label>
            <input
              id="play-image-file"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="mt-1 w-full rounded-xl border border-slate-300/60 bg-white/80 px-3 py-2 text-sm shadow-sm focus:border-teal-400 focus:outline-none focus:ring-0 dark:border-slate-600/60 dark:bg-slate-900/70 dark:text-slate-100"
              onChange={handleImageFileChange}
            />
            {imageUploadMessage ? (
              <p
                className={`text-sm ${
                  imageUploadStatus === "error"
                    ? "text-red-600"
                    : imageUploadStatus === "success"
                    ? "text-green-600"
                    : "text-slate-600"
                }`}
              >
                {imageUploadMessage}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="play-image" className="block text-sm font-medium">
              画像URL（例: https://res.cloudinary.com/...）
            </label>
            <div className="flex gap-2">
              <input
                id="play-image"
                className="flex-1 rounded-xl border border-slate-300/60 bg-white/80 px-3 py-2 text-sm shadow-sm focus:border-teal-400 focus:outline-none focus:ring-0 dark:border-slate-600/60 dark:bg-slate-900/70 dark:text-slate-100"
                placeholder="https://res.cloudinary.com/..."
                value={image}
                onChange={(event) => setImage(event.target.value)}
              />
              {image ? (
                <button
                  type="button"
                  onClick={clearImage}
                  className="whitespace-nowrap rounded-full border border-slate-300/60 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-teal-400 hover:text-teal-500 dark:border-slate-600/60 dark:text-slate-200"
                >
                  クリア
                </button>
              ) : null}
            </div>
            <p className="text-xs text-slate-500">
              アップロード後は自動でURLが入力されます。手動入力も可能です。
            </p>
          </div>

          {image ? (
            <div className="mt-2">
              <Image
                src={image}
                alt={`${gameId || "play"} session`}
                width={640}
                height={360}
                className="h-auto w-full max-h-64 rounded border object-cover"
                sizes="(max-width: 768px) 100vw, 640px"
              />
            </div>
          ) : null}
        </div>

        <button
          disabled={status === "sending" || imageUploadStatus === "uploading"}
          className="inline-flex items-center justify-center rounded-full bg-teal-500 px-5 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5 hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? "送信中..." : "送信"}
        </button>

        {message && <p className="text-sm">{message}</p>}
      </form>
    </div>
  );
}
