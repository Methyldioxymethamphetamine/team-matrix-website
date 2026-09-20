import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic"; // always re-read the file on each request

const DATA_PATH = path.join(process.cwd(), "src", "data", "sponsors.json");

export interface SponsorEntry {
  id: string;
  src: string;
  alt: string;
}

export async function GET() {
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    const sponsors = JSON.parse(raw) as SponsorEntry[];
    return Response.json(sponsors);
  } catch {
    return Response.json([]);
  }
}
