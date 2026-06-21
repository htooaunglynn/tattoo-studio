import { describe, expect, it } from "vitest"

import { authenticateUserInState, createBookingInState, emptyState, registerUserInState } from "@/lib/store"
import { generateSlots } from "@/lib/tattoo-data"

describe("demo store integration", () => {
  it("registers, authenticates, and books a slot", async () => {
    const registered = await registerUserInState(emptyState, {
      name: "Test Client",
      email: "client@example.com",
      password: "password123",
    })

    expect(registered.ok).toBe(true)
    if (!registered.ok) return

    const user = authenticateUserInState(registered.state, "client@example.com", "password123")
    expect(user?.email).toBe("client@example.com")

    const slot = generateSlots().find((candidate) => candidate.status === "available")
    expect(slot).toBeDefined()

    const booked = createBookingInState(registered.state, {
      userEmail: user!.email,
      designId: "black-rose",
      slotId: slot!.id,
    })

    expect(booked.ok).toBe(true)
    if (!booked.ok) return

    const duplicate = createBookingInState(booked.state, {
      userEmail: user!.email,
      designId: "dagger-moth",
      slotId: slot!.id,
    })

    expect(duplicate.ok).toBe(false)
  })
})
