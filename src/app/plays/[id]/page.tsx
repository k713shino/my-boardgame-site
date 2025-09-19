import { notFound } from "next/navigation";
import Image from "next/image";
import { getPlayById } from "@/lib/content";
import { fetchRemotePlays, type RemotePlay } from "@/lib/remote";

function toDateString(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value);
}

async function getRemotePlay(id: string): Promise<RemotePlay | null> {
  try {
    const data = await fetchRemotePlays({ page: 1, size: 500 });
    return data.items.find((p) => String(p.id) === id) ?? null;
  } catch (err) {
    console.warn("Failed to fetch remote play", err);
    return null;
  }
}

export default async function PlayDetail({ params }: { params: { id: string } }) {
  const playId = decodeURIComponent(params.id);
  const localPlay = getPlayById(playId);
  const remotePlay = localPlay ? null : await getRemotePlay(playId);
  const play = localPlay ?? remotePlay;
  if (!play) return notFound();

  const date = toDateString(play.date);
  const gameId = play.gameId;
  const location = play.location ?? "-";
  const tags = (play.tags ?? []).join(", ") || "-";
  const players = play.players ?? [];
  const rawNotes = "body" in play && typeof play.body === "string" ? play.body : play.notes;
  const notes = typeof rawNotes === "string" ? rawNotes : "";
  const image = "image" in play ? (play.image as string | undefined) : undefined;

  return (
    <article className="prose max-w-none">
      <h1>
        {date} / {gameId}
      </h1>
      {image ? (
        <div className="my-6">
          <Image
            src={image}
            alt={`${gameId} session photo`}
            width={960}
            height={540}
            className="h-auto w-full rounded-xl border border-slate-200 shadow-sm"
            priority
          />
        </div>
      ) : null}
      <ul>
        <li>場所: {location}</li>
        <li>タグ: {tags}</li>
      </ul>
      {players.length ? (
        <div>
          <h2>プレイヤー</h2>
          <ul>
            {players.map((p, i) => (
              <li key={i}>
                {p.name} {p.win ? "🏆" : ""} {p.score ?? ""}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {notes ? (
        <>
          <hr />
          <div>{notes}</div>
        </>
      ) : null}
    </article>
  );
}
