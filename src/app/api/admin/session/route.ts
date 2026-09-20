import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";

// The admin page is a client component and can't read the httpOnly session
// cookie itself (that's the point of httpOnly) — it asks the server instead.
export async function GET(request: NextRequest) {
  return NextResponse.json({ authenticated: isAuthenticated(request) });
}
