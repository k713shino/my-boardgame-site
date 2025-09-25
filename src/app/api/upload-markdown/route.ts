import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const COLLECTION_DIRS = {
  posts: "posts",
  games: "games",
} as const;

type CollectionKey = keyof typeof COLLECTION_DIRS;

const ALLOWED_EXTENSIONS = new Set([".md", ".mdx"]);

export const runtime = "nodejs";

type RequestOutcome = "created" | "updated";

type ErrorResponse = {
  ok: false;
  error: string;
};

type SuccessResponse = {
  ok: true;
  collection: CollectionKey;
  entryId: string;
  filename: string;
  outcome: RequestOutcome;
};

function pickFirstString(values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed) return trimmed;
    }
  }
  return null;
}

function sanitizeBaseName(raw: string): string {
  const normalized = raw.normalize("NFKC").replace(/[\u0000-\u001f\u007f]+/g, "");
  const noSeparators = normalized.replace(/[\/]/g, "-");
  const noIllegalChars = noSeparators.replace(/[:*?"<>|]/g, "-");
  const collapsedWhitespace = noIllegalChars.replace(/\s+/g, "-");
  const collapsedHyphen = collapsedWhitespace.replace(/-+/g, "-");
  const trimmed = collapsedHyphen.replace(/^-+|-+$/g, "");

  if (!trimmed || trimmed === "." || trimmed === "..") {
    return "";
  }

  return trimmed.toLowerCase();
}

function toBoolean(value: FormDataEntryValue | null): boolean {
  if (value === null) return false;
  if (typeof value !== "string") return false;

  const normalized = value.trim().toLowerCase();
  if (!normalized) return false;

  return normalized === "true" || normalized === "1" || normalized === "yes" || normalized === "on";
}

async function ensureDirExists(dirPath: string) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const expectedToken = process.env.CONTENT_UPLOAD_TOKEN;
    const providedTokenEntry = formData.get("token");
    const providedToken = typeof providedTokenEntry === "string" ? providedTokenEntry.trim() : "";

    if (expectedToken && providedToken !== expectedToken) {
      return NextResponse.json<ErrorResponse>({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const collectionEntry = formData.get("collection");
    if (typeof collectionEntry !== "string") {
      return NextResponse.json<ErrorResponse>({ ok: false, error: "collection is required" }, { status: 400 });
    }

    const collectionKey = collectionEntry.trim() as CollectionKey;
    if (!(collectionKey in COLLECTION_DIRS)) {
      return NextResponse.json<ErrorResponse>({ ok: false, error: "Unknown collection" }, { status: 400 });
    }

    const fileEntry = formData.get("file");
    if (!(fileEntry instanceof File)) {
      return NextResponse.json<ErrorResponse>({ ok: false, error: "Markdown file is required" }, { status: 400 });
    }

    if (fileEntry.size === 0) {
      return NextResponse.json<ErrorResponse>({ ok: false, error: "File is empty" }, { status: 400 });
    }

    if (fileEntry.size > 512 * 1024) {
      return NextResponse.json<ErrorResponse>({ ok: false, error: "File is too large (512KB max)" }, { status: 413 });
    }

    const arrayBuffer = await fileEntry.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const text = buffer.toString("utf-8");

    let parsedFrontMatter: ReturnType<typeof matter> | null = null;
    try {
      parsedFrontMatter = matter(text);
    } catch (error) {
      console.warn("Failed to parse front matter", error);
    }

    const data = parsedFrontMatter?.data ?? {};

    const entryIdOverride = formData.get("entryId");
    const entryIdCandidate = pickFirstString([
      entryIdOverride,
      collectionKey === "posts" ? data.slug : data.id,
      collectionKey === "posts" ? data.id : data.slug,
      data.title,
      path.parse(fileEntry.name ?? "").name,
    ]);

    if (!entryIdCandidate) {
      return NextResponse.json<ErrorResponse>({ ok: false, error: "Could not determine entry identifier" }, { status: 400 });
    }

    const safeBaseName = sanitizeBaseName(entryIdCandidate);
    if (!safeBaseName) {
      return NextResponse.json<ErrorResponse>({ ok: false, error: "Entry identifier contains invalid characters" }, { status: 400 });
    }

    const originalExt = path.extname(fileEntry.name ?? "").toLowerCase();
    const extension = ALLOWED_EXTENSIONS.has(originalExt) ? originalExt : ".md";

    const filename = `${safeBaseName}${extension}`;

    const targetDir = path.join(process.cwd(), "src", "content", COLLECTION_DIRS[collectionKey]);
    await ensureDirExists(targetDir);

    const targetPath = path.join(targetDir, filename);

    const overwriteAllowed = toBoolean(formData.get("overwrite"));
    const alreadyExists = await fileExists(targetPath);

    if (alreadyExists && !overwriteAllowed) {
      return NextResponse.json<ErrorResponse>(
        { ok: false, error: "File already exists. Pass overwrite=true to replace it." },
        { status: 409 },
      );
    }

    await fs.writeFile(targetPath, buffer);

    const outcome: RequestOutcome = alreadyExists ? "updated" : "created";

    return NextResponse.json<SuccessResponse>({
      ok: true,
      collection: collectionKey,
      entryId: safeBaseName,
      filename,
      outcome,
    });
  } catch (error) {
    console.error("Markdown upload failed", error);
    return NextResponse.json<ErrorResponse>({ ok: false, error: "Unexpected server error" }, { status: 500 });
  }
}
