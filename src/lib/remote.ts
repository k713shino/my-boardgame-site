const DEFAULT_TIME_ZONE = "Asia/Tokyo";

function formatDateInTimeZone(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value ?? "1970";
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";

  return `${year}-${month}-${day}`;
}

export type RemotePlay = {
  id: string;
  date: string;
  gameId: string;
  location?: string;
  players?: { name: string; score?: number; win?: boolean }[];
  notes?: string;
  tags?: string[];
  image?: string;
};

type RawRemotePlay = {
  id?: unknown;
  date?: unknown;
  gameId?: unknown;
  location?: unknown;
  players?: unknown;
  notes?: unknown;
  tags?: unknown;
  image?: unknown;
};

function formatLocalDate(date: Date): string {
  return formatDateInTimeZone(date, DEFAULT_TIME_ZONE);
}

function normalizeDate(value: unknown): string {
  if (value === undefined || value === null) return "";
  if (typeof value === "number") {
    // Google Sheets serial number (days since 1899-12-30)
    const epoch = Date.UTC(1899, 11, 30);
    const millis = epoch + value * 24 * 60 * 60 * 1000;
    return formatLocalDate(new Date(millis));
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
    const normalized = trimmed.replace(/[\/]/g, "-");
    const parsed = new Date(normalized);
    if (!Number.isNaN(parsed.getTime())) {
      return formatLocalDate(parsed);
    }
    return trimmed;
  }
  if (value instanceof Date) {
    return formatLocalDate(value);
  }
  return String(value);
}

function normalizeTags(value: unknown): string[] {
  if (value === undefined || value === null) return [];

  const cleaned = new Set<string>();

  const addString = (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return;

    if ((trimmed.startsWith("[") && trimmed.endsWith("]")) || (trimmed.startsWith("{") && trimmed.endsWith("}"))) {
      try {
        const parsed = JSON.parse(trimmed);
        addValue(parsed);
        return;
      } catch {
        // fall through to manual parsing
      }
    }

    const fragments = trimmed
      .split(/[,、;；|\/／\n\r]+/)
      .flatMap((segment) => segment.split(/\s+#/))
      .map((segment) => segment.trim())
      .filter(Boolean);

    if (fragments.length) {
      fragments.forEach((segment) => {
        const valueWithoutMarkers = segment
          .replace(/^[#＃"'`\[\](){}]+/, "")
          .replace(/["'`\[\](){}]+$/, "")
          .trim();
        if (valueWithoutMarkers) cleaned.add(valueWithoutMarkers);
      });
      return;
    }

    const single = trimmed
      .replace(/^[#＃"'`\[\](){}]+/, "")
      .replace(/["'`\[\](){}]+$/, "")
      .trim();
    if (single) cleaned.add(single);
  };

  const addValue = (input: unknown) => {
    if (input === undefined || input === null) return;
    if (Array.isArray(input)) {
      input.forEach(addValue);
      return;
    }
    if (input instanceof Set) {
      (input as Set<unknown>).forEach(addValue);
      return;
    }
    if (typeof input === "string") {
      addString(input);
      return;
    }
    if (typeof input === "object") {
      Object.values(input as Record<string, unknown>).forEach(addValue);
      return;
    }
    const coerced = String(input).trim();
    if (coerced) cleaned.add(coerced);
  };

  addValue(value);

  return Array.from(cleaned);
}

function extractTags(record: Record<string, unknown>): string[] {
  const direct = normalizeTags(record.tags);
  if (direct.length) return direct;

  const fallbackKeys = [
    "tag",
    "タグ",
    "tagString",
    "tagsString",
    "tag_list",
    "tagList",
    "labels",
    "label",
  ];

  for (const key of fallbackKeys) {
    if (key in record) {
      const parsed = normalizeTags(record[key]);
      if (parsed.length) return parsed;
    }
  }

  const sequentialKeys = Object.keys(record).filter((key) => /^tag\d+$/i.test(key) || /^tag_\d+$/i.test(key));
  if (sequentialKeys.length) {
    const combined = sequentialKeys
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .flatMap((key) => normalizeTags(record[key]));
    const unique = Array.from(new Set(combined));
    if (unique.length) return unique;
  }

  return [];
}

function normalizePlayers(value: unknown): RemotePlay["players"] {
  if (!Array.isArray(value)) return undefined;
  const normalized: { name: string; score?: number; win?: boolean }[] = [];

  value.forEach((entry) => {
    if (entry && typeof entry === "object") {
      const record = entry as Record<string, unknown>;
      const nameRaw = record.name ?? record.player;
      const name = typeof nameRaw === "string" ? nameRaw.trim() : String(nameRaw ?? "").trim();
      if (!name) return;

      const player: { name: string; score?: number; win?: boolean } = { name };

      const scoreValue = record.score;
      if (typeof scoreValue === "number") {
        player.score = scoreValue;
      } else if (typeof scoreValue === "string" && scoreValue.trim()) {
        const parsed = Number(scoreValue);
        if (!Number.isNaN(parsed)) player.score = parsed;
      }

      const winRaw = record.win ?? record.isWinner;
      if (typeof winRaw === "boolean") {
        player.win = winRaw;
      } else if (typeof winRaw === "string") {
        if (winRaw === "true" || winRaw === "1") player.win = true;
        else if (winRaw === "false" || winRaw === "0") player.win = false;
      }

      normalized.push(player);
      return;
    }

    if (typeof entry === "string") {
      const name = entry.trim();
      if (name) normalized.push({ name });
    }
  });

  return normalized.length ? normalized : undefined;
}

function normalizeRemotePlay(raw: RawRemotePlay): RemotePlay | null {
  const record = raw as Record<string, unknown>;
  const id = record.id ?? "";
  const game = record.gameId ?? record.game ?? "";
  const idStr = typeof id === "string" ? id : String(id);
  const gameId = typeof game === "string" ? game : String(game ?? "");
  if (!idStr || !gameId) return null;

  return {
    id: idStr,
    gameId,
    date: normalizeDate(record.date),
    location: typeof record.location === "string" ? record.location : undefined,
    players: normalizePlayers(record.players),
    notes: typeof record.notes === "string" ? record.notes : undefined,
    tags: (() => {
      const tags = extractTags(record);
      return tags.length ? tags : undefined;
    })(),
    image: typeof record.image === "string" && record.image.trim() ? record.image.trim() : undefined,
  };
}

type RemotePlaysResponse = {
  ok: true;
  page: number;
  size: number;
  total: number;
  items: RemotePlay[];
};

export async function fetchRemotePlays(opts?: { page?: number; size?: number }): Promise<RemotePlaysResponse> {
  const endpoint = process.env.GAS_ENDPOINT; // 例: https://script.google.com/macros/s/XXXX/exec
  if (!endpoint) throw new Error("GAS_ENDPOINT not set");


  const url = new URL(endpoint);
  url.searchParams.set("page", String(opts?.page ?? 1));
  url.searchParams.set("size", String(opts?.size ?? 100));
  if (process.env.SECRET_TOKEN) url.searchParams.set("token", process.env.SECRET_TOKEN);


  // ISR: 600秒（10分）で再取得。更新頻度に合わせて調整
  const res = await fetch(url.toString(), {
    next: { revalidate: 600 },
    // もしくは cache: 'force-cache' でビルド時キャッシュ固定
    // cache: 'force-cache',
  });
  if (!res.ok) throw new Error(`GAS GET failed: ${res.status}`);
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || "unknown error");

  const rawItems = Array.isArray(json.items) ? (json.items as RawRemotePlay[]) : [];
  const items = rawItems
    .map(normalizeRemotePlay)
    .filter((p): p is RemotePlay => Boolean(p));

  return {
    ok: true,
    page: Number(json.page ?? opts?.page ?? 1),
    size: Number(json.size ?? opts?.size ?? items.length),
    total: Number(json.total ?? items.length),
    items,
  };
}
