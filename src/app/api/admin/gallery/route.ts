import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, saveUploadedImage, deletePublicFile, readJsonFile, writeJsonFile } from "@/lib/admin-files";

const STORIES_DIR = path.join(process.cwd(), "public", "stories");
const CAPTIONS_PATH = path.join(STORIES_DIR, "captions.json");

interface CaptionEntry {
  title?: string;
  story?: string;
}

export async function POST(request: NextRequest) {
  const unauthorized = requireAuth(request);
  if (unauthorized) return unauthorized;

  const form = await request.formData();
  const file = form.get("image");
  const title = String(form.get("title") ?? "").trim();
  const story = String(form.get("story") ?? "").trim();

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ ok: false, error: "An image file is required" }, { status: 400 });
  }

  let urlPath: string;
  try {
    urlPath = await saveUploadedImage(file, "stories");
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 400 });
  }

  const filename = path.basename(urlPath);
  const captions = readJsonFile<Record<string, CaptionEntry>>(CAPTIONS_PATH, {});
  captions[filename] = { title: title || undefined, story: story || undefined };
  writeJsonFile(CAPTIONS_PATH, captions);

  return NextResponse.json({ ok: true, img: urlPath });
}

export async function DELETE(request: NextRequest) {
  const unauthorized = requireAuth(request);
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(request.url);
  const img = searchParams.get("img"); // e.g. "/stories/abc123.webp"
  if (!img || !img.startsWith("/stories/")) {
    return NextResponse.json({ ok: false, error: "Missing or invalid img" }, { status: 400 });
  }

  deletePublicFile(img);

  const filename = path.basename(img);
  const captions = readJsonFile<Record<string, CaptionEntry>>(CAPTIONS_PATH, {});
  if (filename in captions) {
    delete captions[filename];
    writeJsonFile(CAPTIONS_PATH, captions);
  }

  return NextResponse.json({ ok: true });
}
