/**
 * Generate ADMIN_PASSWORD_HASH for .env
 * Usage: node scripts/hash-admin-password.mjs "your-secure-password"
 */
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

const password = process.argv[2];
if (!password || password.length < 12) {
  console.error("Usage: node scripts/hash-admin-password.mjs \"password-at-least-12-chars\"");
  process.exit(1);
}

const salt = randomBytes(16);
const derived = await scryptAsync(password, salt, 64);
const hash = `scrypt:${salt.toString("hex")}:${derived.toString("hex")}`;
console.log("\nAdd to your .env file:\n");
console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
console.log("\nRemove ADMIN_PASSWORD if it was set in plain text.\n");
