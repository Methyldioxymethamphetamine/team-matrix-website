import fs from "fs";
import path from "path";
import type { WorkItem } from "@/data/works";

// Supported image extensions the admin can drop in /public/stories/
const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

export const dynamic = "force-dynamic"; // always re-read the directory on each request

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

  const items: WorkItem[] = files.map((filename, idx) => {
    // Derive a human-readable title from the filename
    const base = path.basename(filename, path.extname(filename));
    const title = base
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    return {
      id: String(idx + 1),
      img: `/stories/${filename}`,
      url: "#",
      title,
    };
  });

  return Response.json(items);
}
