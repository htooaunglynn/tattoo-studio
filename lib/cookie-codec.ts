import { createHmac, timingSafeEqual } from "node:crypto"

const VERSION = "v1"

function secret() {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "tattoo-studio-demo-secret"
}

function toBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url")
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8")
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url")
}

export function encodeCookieValue<T>(value: T) {
  const payload = `${VERSION}.${toBase64Url(JSON.stringify(value))}`
  return `${payload}.${sign(payload)}`
}

export function decodeCookieValue<T>(cookieValue: string | undefined, fallback: T): T {
  if (!cookieValue) {
    return fallback
  }

  const parts = cookieValue.split(".")
  if (parts.length !== 3 || parts[0] !== VERSION) {
    return fallback
  }

  const payload = `${parts[0]}.${parts[1]}`
  const expected = Buffer.from(sign(payload), "base64url")
  const actual = Buffer.from(parts[2], "base64url")

  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return fallback
  }

  try {
    return JSON.parse(fromBase64Url(parts[1])) as T
  } catch {
    return fallback
  }
}
