"use client";

import { useState } from "react";

type Player = { name: string; score?: number; win?: boolean };

export default function NewPlayPage() {
  const [date, setDate] = useState<string>("");
  const [gameId, setGameId] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [players, setPlayers] = useState<Player[]>([{ name: "" }]);
  const [notes, setNotes] = useState<string>("");
  const [tags, setTags] = useState<string>(""); // カンマ区切り
  const [image, setImage] = useState<string>(""); // 画像パス or URL
  const [hp, setHp] = useState<string>(""); // ハニーポット

  const [status, setStatus] = useState<"idle"|"sending"|"ok"|"error">("idle");
  const [message, setMessage] = useState<string>("");

  const addPlayer = () => setPlayers(prev => [...prev, { name: "" }]);
  const updatePlayer = (idx: number, patch: Partial<Player>) =>
    setPlayers(prev => prev.map((p,i) => i===idx ? {...p, ...patch} : p));
  const removePlayer = (idx: number) =>
    setPlayers(prev => prev.filter((_,i) => i!==idx));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setMessage("");

    try {
      const res = await fetch("/api/submit-play", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          date, gameId, location,
          players: players.filter(p => p.name.trim().length),
          notes,
          tags: tags.split(",").map(t => t.trim()).filter(Boolean),
          image: image.trim() || undefined,
          _hp: hp, // honeypot
        }),
      });
      const json = await res.json();
      if (json.ok) {
        setStatus("ok");
        setMessage("送信しました！");
        // フォーム初期化
        setDate(""); setGameId(""); setLocation(""); setPlayers([{ name:"" }]); setNotes(""); setTags(""); setImage("");
      } else {
        setStatus("error");
        setMessage("送信に失敗しました: " + (json.error ?? "unknown"));
      }
    } catch (err: unknown) {
      setStatus("error");
      setMessage("通信エラー: " + String(err));
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">プレイ記録を追加</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ハニーポット（CSSで隠す or aria-hidden） */}
        <div className="hidden">
          <label htmlFor="honeypot">もしこの欄に入力したらスパム扱い</label>
          <input id="honeypot" value={hp} onChange={(e)=>setHp(e.target.value)} />
        </div>

        <div>
          <label htmlFor="play-date" className="block text-sm font-medium">日付</label>
          <input id="play-date" required type="date" className="w-full border rounded px-3 py-2"
                 value={date} onChange={(e)=>setDate(e.target.value)} />
        </div>

        <div>
          <label htmlFor="play-game" className="block text-sm font-medium">ゲームID（例: dominion）</label>
          <input id="play-game" required className="w-full border rounded px-3 py-2"
                 value={gameId} onChange={(e)=>setGameId(e.target.value)} />
        </div>

        <div>
          <label htmlFor="play-location" className="block text-sm font-medium">場所</label>
          <input id="play-location" className="w-full border rounded px-3 py-2"
                 value={location} onChange={(e)=>setLocation(e.target.value)} />
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">プレイヤー</div>
          {players.map((p, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <label htmlFor={`player-${i}-name`} className="sr-only">プレイヤー名 {i + 1}</label>
              <input id={`player-${i}-name`} placeholder="名前" className="col-span-5 border rounded px-2 py-1"
                     value={p.name} onChange={(e)=>updatePlayer(i,{name:e.target.value})} />
              <label htmlFor={`player-${i}-score`} className="sr-only">スコア {i + 1}</label>
              <input id={`player-${i}-score`} placeholder="スコア" type="number" className="col-span-3 border rounded px-2 py-1"
                     value={p.score ?? ""} onChange={(e)=>updatePlayer(i,{score: e.target.value ? Number(e.target.value) : undefined})} />
              <label className="col-span-2 flex items-center gap-1 text-sm">
                <input type="checkbox" checked={p.win ?? false}
                       onChange={(e)=>updatePlayer(i,{win: e.target.checked})} />
                勝利
              </label>
              <button type="button" onClick={()=>removePlayer(i)} className="col-span-2 text-sm underline">削除</button>
            </div>
          ))}
          <button type="button" onClick={addPlayer} className="text-sm underline">+ 追加</button>
        </div>

        <div>
          <label htmlFor="play-notes" className="block text-sm font-medium">メモ</label>
          <textarea id="play-notes" className="w-full border rounded px-3 py-2 h-24"
                    value={notes} onChange={(e)=>setNotes(e.target.value)} />
        </div>

        <div>
          <label htmlFor="play-tags" className="block text-sm font-medium">タグ（カンマ区切り）</label>
          <input id="play-tags" className="w-full border rounded px-3 py-2"
                 value={tags} onChange={(e)=>setTags(e.target.value)} />
        </div>

        <div>
          <label htmlFor="play-image" className="block text-sm font-medium">画像パス（例: /images/plays/sample.jpg）</label>
          <input
            id="play-image"
            className="w-full border rounded px-3 py-2"
            placeholder="/images/plays/..."
            value={image}
            onChange={(e)=>setImage(e.target.value)}
          />
        </div>

        <button disabled={status==="sending"} className="px-4 py-2 rounded bg-black text-white">
          {status==="sending" ? "送信中..." : "送信"}
        </button>

        {message && <p className="text-sm">{message}</p>}
      </form>
    </div>
  );
}
