/**
 * Generate ADMIN_TOTP_SECRET for authenticator apps (Google Authenticator, etc.)
 * Usage: node scripts/generate-totp-secret.mjs
 */
import { generateSecret, generateURI } from "otplib";

const secret = generateSecret();
const username = process.env.ADMIN_USERNAME || "admin";
const issuer = "DeliveryContainer";

console.log("\nAdd to your .env file:\n");
console.log(`ADMIN_TOTP_SECRET="${secret}"`);
console.log("\nScan this URI in your authenticator app:\n");
console.log(
  generateURI({
    issuer,
    label: username,
    secret,
  })
);
console.log("");
