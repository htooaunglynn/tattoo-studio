import { pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto"

const ITERATIONS = 120000
const KEY_LENGTH = 32
const DIGEST = "sha256"

export function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  const hash = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString("hex")

  return `${salt}:${hash}`
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(":")

  if (!salt || !hash) {
    return false
  }

  const candidate = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST)
  const original = Buffer.from(hash, "hex")

  return original.length === candidate.length && timingSafeEqual(original, candidate)
}
