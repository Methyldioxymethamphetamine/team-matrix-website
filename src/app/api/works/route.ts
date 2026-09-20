import fs from "fs";
import path from "path";
import type { WorkItem } from "@/data/works";

// Supported image extensions the admin can drop in /public/stories/
const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

export const dynamic = "force-dynamic"; // always re-read the directory on each request

interface CaptionEntry {
  title?: string;
  story?: string;
}

function readCaptions(storiesDir: string): Record<string, CaptionEntry> {
  try {
    const raw = fs.readFileSync(path.join(storiesDir, "captions.json"), "utf-8");
    return JSON.parse(raw) as Record<string, CaptionEntry>;
  } catch {
    return {};
  }
}

export async function GET() {
  const storiesDir = path.join(process.cwd(), "public", "stories");

  let files: string[] = [];
  try {
    files = fs
      .readdirSync(storiesDir)
      .filter((f) => IMAGE_EXTS.has(path.extname(f).toLowerCase()))
      .sort(); // stable alphabetical order
  } catch {
    // Directory doesn't exist or can't be read — return empty list
    return Response.json([]);
  }

  if (files.length === 0) {
    return Response.json([]);
  }

  const captions = readCaptions(storiesDir);

  const items: WorkItem[] = files.map((filename, idx) => {
    const entry = captions[filename];

    // Derive a human-readable title from the filename when there's no caption entry
    const base = path.basename(filename, path.extname(filename));
    const derivedTitle = base
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    return {
      id: String(idx + 1),
      img: `/stories/${filename}`,
      url: "#",
      title: entry?.title || derivedTitle,
      story: entry?.story,
    };
  });

  return Response.json(items);
}
