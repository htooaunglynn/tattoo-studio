import { randomUUID } from "node:crypto"

import { hashPassword, verifyPassword } from "@/lib/password"
import {
  type Booking,
  type BookingSlot,
  type FlashDesign,
  type Role,
  type SlotStatus,
  findBookableSlot,
} from "@/lib/tattoo-data"

export type DemoUser = {
  id: string
  name: string
  email: string
  role: Role
  passwordHash: string
  createdAt: string
}

export type DemoState = {
  users: DemoUser[]
  designs: FlashDesign[]
  slots: BookingSlot[]
  bookings: Booking[]
}

export const emptyState: DemoState = {
  users: [],
  designs: [],
  slots: [],
  bookings: [],
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function normalizeRole(role: string): Role | null {
  return role === "admin" || role === "user" ? role : null
}

function normalizeState(state: DemoState): DemoState {
  return {
    users: state.users ?? [],
    designs: state.designs ?? [],
    slots: state.slots ?? [],
    bookings: state.bookings ?? [],
  }
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function normalizeDuration(value: string) {
  const duration = value.trim().replace(/\s*min$/i, "").trim()
  return duration ? `${duration} min` : ""
}

function normalizePrice(value: string) {
  const price = value.trim().replace(/^\$/, "").trim()
  return price ? `$${price}` : ""
}

export async function registerUserInState(
  state: DemoState,
  input: { name: string; email: string; password: string; role: string },
) {
  const currentState = normalizeState(state)
  const email = normalizeEmail(input.email)
  const name = input.name.trim()
  const role = normalizeRole(input.role)

  if (!name || !email || input.password.length < 8 || !role) {
    return { ok: false as const, error: "Name, email, role, and an 8 character password are required." }
  }

  if (currentState.users.some((user) => user.email === email)) {
    return { ok: false as const, error: "An account with this email already exists." }
  }

  const user: DemoUser = {
    id: randomUUID(),
    name,
    email,
    role,
    passwordHash: hashPassword(input.password),
    createdAt: new Date().toISOString(),
  }

  return {
    ok: true as const,
    state: {
      ...currentState,
      users: [...currentState.users, user],
    },
    user,
  }
}

export function authenticateUserInState(state: DemoState, emailInput: string, password: string, roleInput: string) {
  const currentState = normalizeState(state)
  const email = normalizeEmail(emailInput)
  const role = normalizeRole(roleInput)
  const user = currentState.users.find((candidate) => candidate.email === email)

  if (!user || !role || user.role !== role || !verifyPassword(password, user.passwordHash)) {
    return null
  }

  return user
}

export function createDesignInState(
  state: DemoState,
  input: { name: string; style: string; duration: string; price: string; image: string },
) {
  const currentState = normalizeState(state)
  const name = input.name.trim()
  const style = input.style.trim()
  const duration = normalizeDuration(input.duration)
  const price = normalizePrice(input.price)
  const image = input.image.trim()

  if (!name || !style || !duration || !price || !image) {
    return { ok: false as const, error: "Design name, style, duration, price, and image are required." }
  }

  const baseId = slugify(name)
  const id = currentState.designs.some((design) => design.id === baseId) ? `${baseId}-${randomUUID().slice(0, 8)}` : baseId
  const design: FlashDesign = { id, name, style, duration, price, image }

  return {
    ok: true as const,
    state: {
      ...currentState,
      designs: [...currentState.designs, design],
    },
    design,
  }
}

export function updateDesignInState(
  state: DemoState,
  input: { id: string; name: string; style: string; duration: string; price: string; image?: string },
) {
  const currentState = normalizeState(state)
  const id = input.id.trim()
  const existing = currentState.designs.find((design) => design.id === id)

  if (!existing) {
    return { ok: false as const, error: "Design not found." }
  }

  if (currentState.bookings.some((booking) => booking.designId === id)) {
    return { ok: false as const, error: "Booked designs cannot be updated." }
  }

  const name = input.name.trim()
  const style = input.style.trim()
  const duration = normalizeDuration(input.duration)
  const price = normalizePrice(input.price)
  const image = input.image?.trim() || existing.image

  if (!name || !style || !duration || !price || !image) {
    return { ok: false as const, error: "Design name, style, duration, price, and image are required." }
  }

  const design: FlashDesign = { ...existing, name, style, duration, price, image }

  return {
    ok: true as const,
    state: {
      ...currentState,
      designs: currentState.designs.map((candidate) => (candidate.id === id ? design : candidate)),
    },
    design,
  }
}

export function deleteDesignInState(state: DemoState, idInput: string) {
  const currentState = normalizeState(state)
  const id = idInput.trim()

  if (!currentState.designs.some((design) => design.id === id)) {
    return { ok: false as const, error: "Design not found." }
  }

  if (currentState.bookings.some((booking) => booking.designId === id)) {
    return { ok: false as const, error: "Booked designs cannot be deleted." }
  }

  return {
    ok: true as const,
    state: {
      ...currentState,
      designs: currentState.designs.filter((design) => design.id !== id),
    },
  }
}

function normalizeSlotStatus(status: string): SlotStatus | null {
  return status === "available" || status === "booked" || status === "waitlist" ? status : null
}

function todayDateKey() {
  return new Date().toISOString().slice(0, 10)
}

function isPastDate(date: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && date < todayDateKey()
}

export function createSlotInState(
  state: DemoState,
  input: { date: string; time: string; artist: string; status: string },
) {
  const currentState = normalizeState(state)
  const date = input.date.trim()
  const time = input.time.trim()
  const artist = input.artist.trim()
  const status = normalizeSlotStatus(input.status)

  if (!date || !time || !artist || !status) {
    return { ok: false as const, error: "Slot date, time, artist, and status are required." }
  }

  if (isPastDate(date)) {
    return { ok: false as const, error: "Slot date cannot be before today." }
  }

  const baseId = slugify(`${date}-${time}-${artist}`)
  const id = currentState.slots.some((slot) => slot.id === baseId) ? `${baseId}-${randomUUID().slice(0, 8)}` : baseId
  const slot: BookingSlot = { id, date, time, artist, status }

  return {
    ok: true as const,
    state: {
      ...currentState,
      slots: [...currentState.slots, slot],
    },
    slot,
  }
}

export function updateSlotInState(
  state: DemoState,
  input: { id: string; date: string; time: string; artist: string; status: string },
) {
  const currentState = normalizeState(state)
  const id = input.id.trim()
  const existing = currentState.slots.find((slot) => slot.id === id)

  if (!existing) {
    return { ok: false as const, error: "Slot not found." }
  }

  if (currentState.bookings.some((booking) => booking.slotId === id)) {
    return { ok: false as const, error: "Booked slots cannot be updated." }
  }

  const date = input.date.trim()
  const time = input.time.trim()
  const artist = input.artist.trim()
  const status = normalizeSlotStatus(input.status)

  if (!date || !time || !artist || !status) {
    return { ok: false as const, error: "Slot date, time, artist, and status are required." }
  }

  if (isPastDate(date)) {
    return { ok: false as const, error: "Slot date cannot be before today." }
  }

  const slot: BookingSlot = { ...existing, date, time, artist, status }

  return {
    ok: true as const,
    state: {
      ...currentState,
      slots: currentState.slots.map((candidate) => (candidate.id === id ? slot : candidate)),
    },
    slot,
  }
}

export function deleteSlotInState(state: DemoState, idInput: string) {
  const currentState = normalizeState(state)
  const id = idInput.trim()

  if (!currentState.slots.some((slot) => slot.id === id)) {
    return { ok: false as const, error: "Slot not found." }
  }

  if (currentState.bookings.some((booking) => booking.slotId === id)) {
    return { ok: false as const, error: "Booked slots cannot be deleted." }
  }

  return {
    ok: true as const,
    state: {
      ...currentState,
      slots: currentState.slots.filter((slot) => slot.id !== id),
    },
  }
}

export function createBookingInState(
  state: DemoState,
  input: { userEmail: string; designId: string; slotId: string },
) {
  const currentState = normalizeState(state)
  const design = currentState.designs.find((candidate) => candidate.id === input.designId)

  if (!design) {
    return { ok: false as const, error: "Choose a tattoo flash design." }
  }

  const slot = findBookableSlot(input.slotId, currentState.slots, currentState.bookings)

  if (!slot) {
    return { ok: false as const, error: "That slot is already booked. Pick another time." }
  }

  const booking: Booking = {
    id: randomUUID(),
    userEmail: normalizeEmail(input.userEmail),
    designId: design.id,
    slotId: slot.id,
    createdAt: new Date().toISOString(),
  }

  return {
    ok: true as const,
    state: {
      ...currentState,
      bookings: [...currentState.bookings, booking],
    },
    booking,
  }
}
