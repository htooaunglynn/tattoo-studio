import { describe, expect, it } from "vitest"

import {
  authenticateUserInState,
  createBookingInState,
  createDesignInState,
  createSlotInState,
  deleteDesignInState,
  deleteSlotInState,
  emptyState,
  registerUserInState,
  updateDesignInState,
  updateSlotInState,
} from "@/lib/store"

describe("demo store integration", () => {
  it("registers, authenticates with role, creates admin inventory, and books a slot", async () => {
    const registered = await registerUserInState(emptyState, {
      name: "Test Client",
      email: "client@example.com",
      password: "password123",
      role: "user",
    })

    expect(registered.ok).toBe(true)
    if (!registered.ok) return

    const user = authenticateUserInState(registered.state, "client@example.com", "password123", "user")
    expect(user?.email).toBe("client@example.com")
    expect(user?.role).toBe("user")
    expect(authenticateUserInState(registered.state, "client@example.com", "password123", "admin")).toBeNull()

    const designed = createDesignInState(registered.state, {
      name: "Black Rose",
      style: "Fine line botanical",
      duration: "90 min",
      price: "$180",
      image: "/designs/black-rose.svg",
    })

    expect(designed.ok).toBe(true)
    if (!designed.ok) return

    const slotted = createSlotInState(designed.state, {
      date: "2026-07-01",
      time: "11:00 AM",
      artist: "Mara",
      status: "available",
    })

    expect(slotted.ok).toBe(true)
    if (!slotted.ok) return

    const booked = createBookingInState(slotted.state, {
      userEmail: user!.email,
      designId: designed.design.id,
      slotId: slotted.slot.id,
    })

    expect(booked.ok).toBe(true)
    if (!booked.ok) return

    const duplicate = createBookingInState(booked.state, {
      userEmail: user!.email,
      designId: designed.design.id,
      slotId: slotted.slot.id,
    })

    expect(duplicate.ok).toBe(false)
    expect(updateDesignInState(booked.state, { id: designed.design.id, name: "Red Rose", style: "Fine line", duration: "1 hr", price: "$200" }).ok).toBe(false)
    expect(deleteDesignInState(booked.state, designed.design.id).ok).toBe(false)
    expect(updateSlotInState(booked.state, { id: slotted.slot.id, date: "2026-07-02", time: "12:00 PM", artist: "Mara", status: "available" }).ok).toBe(false)
    expect(deleteSlotInState(booked.state, slotted.slot.id).ok).toBe(false)
  })

  it("updates and deletes unbooked admin inventory", () => {
    const designed = createDesignInState(emptyState, {
      name: "Dagger Moth",
      style: "Neo traditional",
      duration: "2 hr",
      price: "$260",
      image: "/designs/dagger-moth.svg",
    })

    expect(designed.ok).toBe(true)
    if (!designed.ok) return

    const updatedDesign = updateDesignInState(designed.state, {
      id: designed.design.id,
      name: "Dagger Moth Updated",
      style: "Neo traditional",
      duration: "2.5 hr",
      price: "$300",
    })

    expect(updatedDesign.ok).toBe(true)
    if (!updatedDesign.ok) return
    expect(updatedDesign.design.name).toBe("Dagger Moth Updated")

    const deletedDesign = deleteDesignInState(updatedDesign.state, designed.design.id)
    expect(deletedDesign.ok).toBe(true)
    if (!deletedDesign.ok) return
    expect(deletedDesign.state.designs).toHaveLength(0)

    const slotted = createSlotInState(emptyState, {
      date: "2026-07-03",
      time: "1:30 PM",
      artist: "June",
      status: "available",
    })

    expect(slotted.ok).toBe(true)
    if (!slotted.ok) return

    const updatedSlot = updateSlotInState(slotted.state, {
      id: slotted.slot.id,
      date: "2026-07-04",
      time: "4:00 PM",
      artist: "Val",
      status: "waitlist",
    })

    expect(updatedSlot.ok).toBe(true)
    if (!updatedSlot.ok) return
    expect(updatedSlot.slot.status).toBe("waitlist")

    const deletedSlot = deleteSlotInState(updatedSlot.state, slotted.slot.id)
    expect(deletedSlot.ok).toBe(true)
    if (!deletedSlot.ok) return
    expect(deletedSlot.state.slots).toHaveLength(0)
  })

  it("rejects invalid roles and invalid admin inventory", async () => {
    const registered = await registerUserInState(emptyState, {
      name: "Role Test",
      email: "role@example.com",
      password: "password123",
      role: "artist",
    })

    expect(registered.ok).toBe(false)
    expect(createDesignInState(emptyState, { name: "", style: "Fine line", duration: "1 hr", price: "$100", image: "/designs/black-rose.svg" }).ok).toBe(false)
    expect(createSlotInState(emptyState, { date: "2026-07-01", time: "11:00 AM", artist: "Mara", status: "closed" }).ok).toBe(false)
    expect(createSlotInState(emptyState, { date: "2000-01-01", time: "11:00 AM", artist: "Mara", status: "available" }).ok).toBe(false)
  })
})
