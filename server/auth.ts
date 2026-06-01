import { createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import type { Request, Response, NextFunction } from "express";
import { verifySync, generateSecret, generateURI } from "otplib";

const scryptAsync = promisify(scrypt);

const SESSION_COOKIE = "admin_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

type LoginAttempt = { count: number; resetAt: number };
const loginAttempts = new Map<string, LoginAttempt>();

export interface AdminConfig {
  username: string;
  passwordHash: string;
  sessionSecret: string;
  totpSecret: string | null;
  secureCookies: boolean;
}

export function getAdminConfig(): AdminConfig | null {
  const sessionSecret = process.env.ADMIN_SESSION_SECRET?.trim();
  const username = process.env.ADMIN_USERNAME?.trim() || "admin";

  let passwordHash = process.env.ADMIN_PASSWORD_HASH?.trim() || "";
  const plainPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!passwordHash && plainPassword) {
    console.warn(
      "[security] ADMIN_PASSWORD is set without ADMIN_PASSWORD_HASH. " +
        "Run: node scripts/hash-admin-password.mjs \"your-password\" and set ADMIN_PASSWORD_HASH instead."
    );
    passwordHash = `__plain__:${plainPassword}`;
  }

  if (!sessionSecret || !passwordHash) {
    return null;
  }

  const totpSecret = process.env.ADMIN_TOTP_SECRET?.trim().replace(/\s/g, "") || null;

  return {
    username,
    passwordHash,
    sessionSecret,
    totpSecret,
    secureCookies: process.env.NODE_ENV === "production",
  };
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `scrypt:${salt.toString("hex")}:${derived.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  if (stored.startsWith("__plain__:")) {
    const plain = stored.slice("__plain__:".length);
    if (plain.length !== password.length) return false;
    return timingSafeEqual(Buffer.from(plain), Buffer.from(password));
  }

  const parts = stored.split(":");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;

  const salt = Buffer.from(parts[1], "hex");
  const expected = Buffer.from(parts[2], "hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;

  if (expected.length !== derived.length) return false;
  return timingSafeEqual(derived, expected);
}

export function verifyTotp(code: string, secret: string): boolean {
  const normalized = code.replace(/\s/g, "");
  if (!/^\d{6}$/.test(normalized)) return false;
  const result = verifySync({
    secret,
    token: normalized,
    epochTolerance: 1,
  });
  return result.valid === true;
}

export function createSessionToken(
  username: string,
  sessionSecret: string,
  ttlMs = SESSION_TTL_MS
): string {
  const payload = JSON.stringify({
    sub: username,
    exp: Date.now() + ttlMs,
  });
  const payloadB64 = Buffer.from(payload).toString("base64url");
  const sig = createHmac("sha256", sessionSecret)
    .update(payloadB64)
    .digest("base64url");
  return `${payloadB64}.${sig}`;
}

export function verifySessionToken(
  token: string,
  sessionSecret: string
): { sub: string } | null {
  const dot = token.indexOf(".");
  if (dot <= 0) return null;

  const payloadB64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  const expected = createHmac("sha256", sessionSecret)
    .update(payloadB64)
    .digest("base64url");

  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expected);
  if (sigBuf.length !== expectedBuf.length) return null;
  if (!timingSafeEqual(sigBuf, expectedBuf)) return null;

  try {
    const data = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf8")
    ) as { sub?: string; exp?: number };
    if (!data.sub || typeof data.exp !== "number") return null;
    if (data.exp < Date.now()) return null;
    return { sub: data.sub };
  } catch {
    return null;
  }
}

function clientKey(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return req.socket.remoteAddress || "unknown";
}

export function checkLoginRateLimit(req: Request): {
  allowed: boolean;
  retryAfterSec?: number;
} {
  const key = clientKey(req);
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxAttempts = 5;

  let entry = loginAttempts.get(key);
  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + windowMs };
    loginAttempts.set(key, entry);
  }

  if (entry.count >= maxAttempts) {
    return {
      allowed: false,
      retryAfterSec: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  return { allowed: true };
}

export function recordFailedLogin(req: Request): void {
  const key = clientKey(req);
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  let entry = loginAttempts.get(key);
  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + windowMs };
  }
  entry.count += 1;
  loginAttempts.set(key, entry);
}

export function clearLoginAttempts(req: Request): void {
  loginAttempts.delete(clientKey(req));
}

export function setSessionCookie(
  res: Response,
  token: string,
  config: AdminConfig
): void {
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: config.secureCookies,
    sameSite: "strict",
    maxAge: SESSION_TTL_MS,
    path: "/",
  });
}

export function clearSessionCookie(res: Response, config: AdminConfig): void {
  res.clearCookie(SESSION_COOKIE, {
    httpOnly: true,
    secure: config.secureCookies,
    sameSite: "strict",
    path: "/",
  });
}

export function getSessionFromRequest(
  req: Request,
  config: AdminConfig
): { sub: string } | null {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token || typeof token !== "string") return null;
  return verifySessionToken(token, config.sessionSecret);
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const config = getAdminConfig();
  if (!config) {
    res.status(503).json({
      error:
        "Painel administrativo não configurado. Defina ADMIN_SESSION_SECRET e ADMIN_PASSWORD_HASH no servidor.",
    });
    return;
  }

  const session = getSessionFromRequest(req, config);
  if (!session) {
    res.status(401).json({ error: "Autenticação necessária." });
    return;
  }

  (req as Request & { adminUser?: string }).adminUser = session.sub;
  next();
}

export { SESSION_COOKIE };
