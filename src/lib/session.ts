import { createHmac, timingSafeEqual } from "crypto";

const SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SECRET) {
  console.error("[SECURITY] SUPABASE_SERVICE_ROLE_KEY is not set! Session signing is insecure.");
}
const COOKIE_NAME = "master_session";

interface SessionPayload {
  id: string;
  username: string;
  ts: number;
}

export function signSession(payload: SessionPayload): string {
  if (!SECRET) throw new Error("Session signing unavailable: SUPABASE_SERVICE_ROLE_KEY not set");
  const data = JSON.stringify(payload);
  const encoded = Buffer.from(data).toString("base64url");
  const sig = createHmac("sha256", SECRET).update(encoded).digest("base64url");
  return `${encoded}.${sig}`;
}

export function verifySession(token: string): SessionPayload | null {
  if (!SECRET) return null;
  try {
    const [encoded, sig] = token.split(".");
    if (!encoded || !sig) return null;

    const expected = createHmac("sha256", SECRET).update(encoded).digest("base64url");

    const sigBuf = Buffer.from(sig);
    const expBuf = Buffer.from(expected);
    if (sigBuf.length !== expBuf.length) return null;
    if (!timingSafeEqual(sigBuf, expBuf)) return null;

    const data = JSON.parse(Buffer.from(encoded, "base64url").toString());
    if (!data.id || !data.username || !data.ts) return null;

    // Session expires after 24h
    if (Date.now() - data.ts > 24 * 60 * 60 * 1000) return null;

    return data;
  } catch {
    return null;
  }
}

export { COOKIE_NAME };
