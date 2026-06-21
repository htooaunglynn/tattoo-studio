import { describe, expect, it } from "vitest"

import { decodeCookieValue, encodeCookieValue } from "@/lib/cookie-codec"

describe("cookie codec", () => {
  it("round trips signed values", () => {
    const encoded = encodeCookieValue({ ok: true })

    expect(decodeCookieValue(encoded, { ok: false })).toEqual({ ok: true })
  })

  it("rejects tampered values", () => {
    const encoded = encodeCookieValue({ ok: true })
    const tampered = encoded.replace(/.$/, encoded.endsWith("a") ? "b" : "a")

    expect(decodeCookieValue(tampered, { ok: false })).toEqual({ ok: false })
  })
})
