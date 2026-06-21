import { randomUUID } from "node:crypto"

import { hashPassword, verifyPassword } from "@/lib/password"
import { type Booking, findBookableSlot, flashDesigns } from "@/lib/tattoo-data"

export type DemoUser = {
  id: string
  name: string
  email: string
  passwordHash: string
  createdAt: string
}

export type DemoState = {
  users: DemoUser[]
  bookings: Booking[]
}

export const emptyState: DemoState = {
  users: [],
  bookings: [],
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export async function registerUserInState(
  state: DemoState,
  input: { name: string; email: string; password: string },
) {
  const email = normalizeEmail(input.email)
  const name = input.name.trim()

  if (!name || !email || input.password.length < 8) {
    return { ok: false as const, error: "Name, email, and an 8 character password are required." }
  }

  if (state.users.some((user) => user.email === email)) {
    return { ok: false as const, error: "An account with this email already exists." }
  }

  const user: DemoUser = {
    id: randomUUID(),
    name,
    email,
    passwordHash: hashPassword(input.password),
    createdAt: new Date().toISOString(),
  }

  return {
    ok: true as const,
    state: {
      ...state,
      users: [...state.users, user],
    },
    user,
  }
}

export function authenticateUserInState(state: DemoState, emailInput: string, password: string) {
  const email = normalizeEmail(emailInput)
  const user = state.users.find((candidate) => candidate.email === email)

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return null
  }

  return user
}

export function createBookingInState(
  state: DemoState,
  input: { userEmail: string; designId: string; slotId: string },
) {
  const design = flashDesigns.find((candidate) => candidate.id === input.designId)

  if (!design) {
    return { ok: false as const, error: "Choose a tattoo flash design." }
  }

  const slot = findBookableSlot(input.slotId, state.bookings)

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
      ...state,
      bookings: [...state.bookings, booking],
    },
    booking,
  }
}
