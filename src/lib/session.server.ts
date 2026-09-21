import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { CompactEncrypt, compactDecrypt } from "jose";
import {
  getCookie,
  getRequest,
  setCookie,
} from "@tanstack/react-start/server";
import { getSql } from "@/lib/db";

const scryptAsync = promisify(scrypt);

export const SESSION_COOKIE = "roadmap_session";
export const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7;

export type SettingsRow = {
  id: string;
  passcode_hash: string | null;
  session_secret: string;
};

export async function ensureSettings(): Promise<SettingsRow> {
  const sql = await getSql();
  const existing = await sql<SettingsRow>`
    select id, passcode_hash, session_secret from site_settings where id = 'default'
  `;
  if (existing[0]) return existing[0];
  const session_secret = randomBytes(32).toString("hex");
  await sql`
    insert into site_settings (id, passcode_hash, session_secret)
    values ('default', null, ${session_secret})
  `;
  return { id: "default", passcode_hash: null, session_secret };
}

function keyFromSecret(secret: string): Uint8Array {
  return createHash("sha256").update(secret).digest();
}

function cookieSecure(): boolean {
  try {
    const req = getRequest();
    if (!req) return false;
    const proto =
      req.headers.get("x-forwarded-proto") ?? new URL(req.url).protocol;
    return proto.includes("https");
  } catch {
    return false;
  }
}

function cookieBase() {
  return {
    path: "/",
    httpOnly: true,
    secure: cookieSecure(),
    sameSite: "lax" as const,
  };
}

export async function hashPasscode(passcode: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = (await scryptAsync(passcode, salt, 32)) as Buffer;
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export async function verifyPasscode(
  passcode: string,
  stored: string,
): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const salt = Buffer.from(parts[1], "hex");
  const expected = Buffer.from(parts[2], "hex");
  if (salt.length === 0 || expected.length === 0) return false;
  const actual = (await scryptAsync(passcode, salt, expected.length)) as Buffer;
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

export async function writeSessionCookie(secret: string): Promise<void> {
  const payload = JSON.stringify({
    v: 1,
    iat: Date.now(),
    exp: Date.now() + SESSION_MAX_AGE_SEC * 1000,
  });
  const token = await new CompactEncrypt(new TextEncoder().encode(payload))
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .encrypt(keyFromSecret(secret));
  setCookie(SESSION_COOKIE, token, {
    ...cookieBase(),
    maxAge: SESSION_MAX_AGE_SEC,
  });
}

export function clearSessionCookie(): void {
  setCookie(SESSION_COOKIE, "", { ...cookieBase(), maxAge: 0 });
}

export async function readUnlocked(secret: string): Promise<boolean> {
  const token = getCookie(SESSION_COOKIE);
  if (!token) return false;
  try {
    const { plaintext } = await compactDecrypt(token, keyFromSecret(secret));
    const payload = JSON.parse(new TextDecoder().decode(plaintext)) as {
      v?: number;
      exp?: number;
    };
    if (payload.v !== 1) return false;
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}

export async function requireUnlocked(): Promise<void> {
  const settings = await ensureSettings();
  if (!(await readUnlocked(settings.session_secret))) {
    throw new Error("LOCKED");
  }
}
