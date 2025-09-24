import { NextResponse } from "next/server";
import { isCloudinaryReady, uploadBufferToCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isCloudinaryReady()) {
    return NextResponse.json(
      { ok: false, error: "Cloudinary is not configured on the server." },
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json(
      { ok: false, error: "No file provided in the request." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const folderEntry = formData.get("folder");
  const folder = typeof folderEntry === "string" && folderEntry.trim() ? folderEntry.trim() : undefined;

  const publicIdEntry = formData.get("publicId");
  const publicId = typeof publicIdEntry === "string" && publicIdEntry.trim() ? publicIdEntry.trim() : undefined;

  const tagsEntry = formData.get("tags");
  const tags = typeof tagsEntry === "string"
    ? tagsEntry
        .split(/[,\n]/)
        .map((tag) => tag.trim())
        .filter(Boolean)
    : undefined;

  try {
    const uploadResult = await uploadBufferToCloudinary(buffer, { folder, publicId, tags });

    return NextResponse.json({
      ok: true,
      publicId: uploadResult.publicId,
      url: uploadResult.url,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
    });
  } catch (error) {
    console.error("Cloudinary upload failed", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error during Cloudinary upload.",
      },
      { status: 500 }
    );
  }
}
