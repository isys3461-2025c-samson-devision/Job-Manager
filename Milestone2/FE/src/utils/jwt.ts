export type DecodedJwtPayload = {
  userId?: string;
  email?: string;
  role?: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
};

function base64UrlDecodeToString(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");

  // atob is available in browsers (Vite/React)
  return atob(padded);
}

export function decodeJwtPayload(token: string | null | undefined): DecodedJwtPayload | null {
  if (typeof token !== "string" || token.trim().length === 0) return null;

  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const json = base64UrlDecodeToString(parts[1]);
    const payload = JSON.parse(json) as DecodedJwtPayload;

    if (payload && typeof payload === "object") return payload;
    return null;
  } catch {
    return null;
  }
}
