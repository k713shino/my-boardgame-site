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
  body?: string;
};

export type Post = {
  slug: string;
  title: string;
  date: string;
  tags?: string[];
  excerpt?: string;
  body?: string;
};

const root = process.cwd();
const CONTENT = path.join(root, "src", "content");

function readMdx(dir: string) {
  const full = path.join(CONTENT, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((filename) => {
      const filePath = path.join(full, filename);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      return { data, content, filename };
    });
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
    return { ...data, id, body: content } as Play;
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
    const date = (data.date as string) ?? "1970-01-01";
    return { slug, title, date, tags: data.tags as string[] | undefined, body: content } as Post;
  }).sort((a, b) => b.date.localeCompare(a.date));
}
export function getPostBySlug(slug: string): Post | null {
  return getAllPosts().find((p) => p.slug === slug) ?? null;
}
