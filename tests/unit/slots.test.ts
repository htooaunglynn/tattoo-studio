import { describe, expect, it } from "vitest"

import { findBookableSlot, generateSlots, mergeSlotBookings } from "@/lib/tattoo-data"

describe("slot helpers", () => {
  it("generates slots for the next two weeks", () => {
    const slots = generateSlots(new Date("2026-06-21T12:00:00.000Z"))

    expect(slots).toHaveLength(42)
    expect(slots[0]).toMatchObject({ date: "2026-06-21", time: "11:00 AM" })
    expect(new Set(slots.map((slot) => slot.status))).toEqual(new Set(["available", "booked", "waitlist"]))
  })

  it("marks locally booked slots as booked", () => {
    const slots = generateSlots(new Date("2026-06-21T12:00:00.000Z"))
    const available = slots.find((slot) => slot.status === "available")
    expect(available).toBeDefined()

    const merged = mergeSlotBookings(slots, [
      { id: "booking-1", userEmail: "client@example.com", designId: "black-rose", slotId: available!.id, createdAt: "now" },
    ])

    expect(merged.find((slot) => slot.id === available!.id)?.status).toBe("booked")
    expect(findBookableSlot(available!.id, slots, [{ id: "booking-1", userEmail: "client@example.com", designId: "black-rose", slotId: available!.id, createdAt: "now" }])).toBeNull()
  })
})
