import fs from "fs";
import path from "path";
import type { Member } from "@/data/members";

export const dynamic = "force-dynamic"; // always re-read the file on each request

const DATA_PATH = path.join(process.cwd(), "src", "data", "members.json");

export async function GET() {
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    const members = JSON.parse(raw) as Member[];
    return Response.json(members);
  } catch {
    return Response.json([]);
  }
}
