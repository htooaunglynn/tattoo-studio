import { describe, expect, it } from "vitest"

import { hashPassword, verifyPassword } from "@/lib/password"

describe("password helpers", () => {
  it("hashes and verifies passwords", () => {
    const hash = hashPassword("studio-pass", "fixed-salt")

    expect(hash).not.toContain("studio-pass")
    expect(verifyPassword("studio-pass", hash)).toBe(true)
    expect(verifyPassword("wrong-pass", hash)).toBe(false)
  })
})
