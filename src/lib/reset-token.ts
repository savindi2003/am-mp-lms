import crypto from "crypto";

export function generateResetToken() {
  // URL-safe token
  const token = crypto.randomBytes(32).toString("base64url");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  return { token, tokenHash };
}
