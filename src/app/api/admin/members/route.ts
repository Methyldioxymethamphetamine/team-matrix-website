import path from "path";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, saveUploadedImage, deletePublicFile, readJsonFile, writeJsonFile } from "@/lib/admin-files";
import type { Member, Department } from "@/data/members";

const DATA_PATH = path.join(process.cwd(), "src", "data", "members.json");

const DEPARTMENTS: Department[] = ["Leadership", "Mechanical", "Electronics", "Algorithms", "Management"];

export async function POST(request: NextRequest) {
  const unauthorized = requireAuth(request);
  if (unauthorized) return unauthorized;

  const form = await request.formData();
  const file = form.get("avatar");
  const name = String(form.get("name") ?? "").trim();
  const title = String(form.get("title") ?? "").trim();
  const handle = String(form.get("handle") ?? "").trim() || "placeholder";
  const status = String(form.get("status") ?? "").trim() || "Active";
  const department = String(form.get("department") ?? "") as Department;
  const lead = String(form.get("lead") ?? "") === "true";

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ ok: false, error: "A photo is required" }, { status: 400 });
  }
  if (!name || !title) {
    return NextResponse.json({ ok: false, error: "Name and title are required" }, { status: 400 });
  }
  if (!DEPARTMENTS.includes(department)) {
    return NextResponse.json({ ok: false, error: "Invalid department" }, { status: 400 });
  }

  let avatarUrl: string;
  try {
    avatarUrl = await saveUploadedImage(file, "members");
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 400 });
  }

  const members = readJsonFile<Member[]>(DATA_PATH, []);
  const entry: Member = {
    id: crypto.randomBytes(6).toString("hex"),
    name,
    title,
    handle,
    status,
    avatarUrl,
    department,
    ...(lead ? { lead: true } : {}),
  };
  members.push(entry);
  writeJsonFile(DATA_PATH, members);

  return NextResponse.json({ ok: true, member: entry });
}

export async function DELETE(request: NextRequest) {
  const unauthorized = requireAuth(request);
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
  }

  const members = readJsonFile<Member[]>(DATA_PATH, []);
  const target = members.find((m) => m.id === id);
  if (!target) {
    return NextResponse.json({ ok: false, error: "Member not found" }, { status: 404 });
  }

  deletePublicFile(target.avatarUrl);
  writeJsonFile(DATA_PATH, members.filter((m) => m.id !== id));

  return NextResponse.json({ ok: true });
}
