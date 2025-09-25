import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Game = {
  id: string;
  title: string;
  designer?: string;
  publisher?: string;
  minPlayers?: number;
  maxPlayers?: number;
  playTime?: number;
  weight?: number;
  tags?: string[];
  bggId?: number;
  image?: string;
  body?: string; // MDX本文（必要なら）
};

export type Play = {
  id: string;
  date: string;
  gameId: string;
  location?: string;
  players?: { name: string; score?: number; win?: boolean }[];
  notes?: string;
  tags?: string[];
  image?: string;
  body?: string;
};

export type Post = {
  slug: string;
  title: string;
  date: string;
  category?: string;
  tags?: string[];
  excerpt?: string;
  body?: string;
};

function normalizeDate(value: unknown): string {
  if (!value) return "1970-01-01";
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value);
}

const root = process.cwd();

function resolveContentOverride(): string | null {
  const override = process.env.CONTENT_BASE_DIR;
  if (!override) return null;
  const normalized = override.trim();
  if (!normalized) return null;
  return path.isAbsolute(normalized) ? normalized : path.join(root, normalized);
}

const defaultContentRoot = path.join(root, "src", "content");
const overrideContentRoot = resolveContentOverride();

export const CONTENT_WRITE_ROOT = overrideContentRoot ?? defaultContentRoot;
export const CONTENT_READ_ROOTS = overrideContentRoot
  ? [CONTENT_WRITE_ROOT, defaultContentRoot]
  : [defaultContentRoot];

function readMdx(dir: string) {
  const aggregate = new Map<string, { data: matter.GrayMatterFile<string>["data"]; content: string; filename: string }>();

  CONTENT_READ_ROOTS.forEach((rootPath) => {
    const full = path.join(rootPath, dir);
    if (!fs.existsSync(full)) return;

    fs.readdirSync(full)
      .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
      .forEach((filename) => {
        if (aggregate.has(filename)) return;
        const filePath = path.join(full, filename);
        const raw = fs.readFileSync(filePath, "utf-8");
        const { data, content } = matter(raw);
        aggregate.set(filename, { data, content, filename });
      });
  });

  return Array.from(aggregate.values());
}

// Games
export function getAllGames(): Game[] {
  return readMdx("games").map(({ data, content, filename }) => {
    const id = (data.id as string) ?? path.basename(filename, path.extname(filename));
    return { ...data, id, body: content } as Game;
  });
}
export function getGameById(id: string): Game | null {
  return getAllGames().find((g) => g.id === id) ?? null;
}

// Plays
export function getAllPlays(): Play[] {
  return readMdx("plays").map(({ data, content, filename }) => {
    const id = (data.id as string) ?? path.basename(filename, path.extname(filename));
    return {
      ...data,
      id,
      date: normalizeDate(data.date),
      image: data.image as string | undefined,
      body: content,
    } as Play;
  }).sort((a, b) => b.date.localeCompare(a.date));
}
export function getPlayById(id: string): Play | null {
  return getAllPlays().find((p) => p.id === id) ?? null;
}

// Posts
export function getAllPosts(): Post[] {
  return readMdx("posts").map(({ data, content, filename }) => {
    const slug = (data.slug as string) ?? path.basename(filename, path.extname(filename));
    const title = (data.title as string) ?? slug;
    const date = normalizeDate(data.date);
    return {
      slug, title, date,
      category: data.category as string | undefined,
      tags: data.tags as string[] | undefined,
      excerpt: data.excerpt as string | undefined,
      body: content,
    } as Post;
  }).sort((a, b) => b.date.localeCompare(a.date));
}

export function getAllCategories(): string[] {
  const set = new Set(getAllPosts().map(p => p.category).filter(Boolean) as string[]);
  return [...set].sort((a,b) => a.localeCompare(b, "ja"));
}

export function getAllTags(): string[] {
  const set = new Set<string>();
  getAllPosts().forEach(p => (p.tags ?? []).forEach(t => set.add(t)));
  return [...set].sort((a,b) => a.localeCompare(b, "ja"));
}
export function getPostBySlug(slug: string): Post | null {
  return getAllPosts().find((p) => p.slug === slug) ?? null;
}
