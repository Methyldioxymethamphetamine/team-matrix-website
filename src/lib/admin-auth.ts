import crypto from "crypto";
import type { NextRequest } from "next/server";

// ── Server-only. Never import this file from a "use client" component or
// page — only from Route Handlers (route.ts), which Next.js never bundles
// into client-side JavaScript. That's what keeps this password out of the
// HTML, the JS bundle, and DevTools' Sources tab.
//
// This is intentionally the ONLY place either secret is written.
const ADMIN_PASSWORD = "TeamMatrix#Nashik2026!";
const SESSION_SECRET = "b7e2f4a1c9d6485fae3d0c7b1a9e5f62d4c8b3a7e1f906c2ad5b8e4f7139c0d2";

export const ADMIN_SESSION_COOKIE = "tm_admin_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function sign(payload: string): string {
  return crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
}

export function checkPassword(candidate: string): boolean {
  const a = Buffer.from(candidate);
  const b = Buffer.from(ADMIN_PASSWORD);
  // Equal-length buffers required for timingSafeEqual — pad instead of
  // short-circuiting on length, so a wrong-length guess isn't a timing tell.
  if (a.length !== b.length) {
    crypto.timingSafeEqual(Buffer.alloc(b.length), Buffer.alloc(b.length));
    return false;
  }
  return crypto.timingSafeEqual(a, b);
}

// Session token = "<expiry>.<hmac>" — opaque to the client, carries no
// password material, and can't be forged or extended without the secret.
export function createSessionToken(): string {
  const expiry = Date.now() + SESSION_TTL_MS;
  return `${expiry}.${sign(String(expiry))}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [expiryStr, mac] = token.split(".");
  if (!expiryStr || !mac) return false;
  const expiry = Number(expiryStr);
  if (!Number.isFinite(expiry) || Date.now() > expiry) return false;
  const expected = sign(expiryStr);
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function isAuthenticated(request: NextRequest): boolean {
  return verifySessionToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
}
