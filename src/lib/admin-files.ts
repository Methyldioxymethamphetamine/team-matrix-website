import fs from "fs";
import path from "path";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "./admin-auth";

// Server-only helpers shared by the admin CRUD route handlers. Never import
// this from a "use client" file.

export function requireAuth(request: NextRequest): NextResponse | null {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }
  return null;
}

const ALLOWED_IMAGE_EXTS: Record<string, string> = {
  "image/webp": ".webp",
  "image/png": ".png",
  "image/jpeg": ".jpg",
};

// Writes an uploaded image into /public/<subdir>/ under a random filename
// (sidesteps collisions/path traversal from a user-supplied name entirely)
// and returns the public URL path to store alongside the record.
export async function saveUploadedImage(file: File, subdir: string): Promise<string> {
  const ext = ALLOWED_IMAGE_EXTS[file.type];
  if (!ext) {
    throw new Error("Unsupported image type — use WEBP, PNG, or JPEG");
  }
  const destDir = path.join(process.cwd(), "public", subdir);
  fs.mkdirSync(destDir, { recursive: true });

  const filename = `${crypto.randomBytes(10).toString("hex")}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(destDir, filename), buffer);

  return `/${subdir}/${filename}`;
}

// Best-effort delete of a previously uploaded file given its public URL path
// (e.g. "/members/abc123.webp") — never throws, a missing file is a no-op.
// The resolved path is verified to stay inside /public so a "/../.." in
// urlPath (however it got there) can't be used to unlink anything else on disk.
export function deletePublicFile(urlPath: string) {
  try {
    const publicDir = path.join(process.cwd(), "public");
    const rel = urlPath.replace(/^\/+/, "");
    const resolved = path.join(publicDir, rel);
    if (!resolved.startsWith(publicDir + path.sep)) return;
    fs.unlinkSync(resolved);
  } catch {
    // already gone — fine
  }
}

export function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

export function writeJsonFile(filePath: string, data: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
}
