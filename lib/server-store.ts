import { cookies } from "next/headers"

import { decodeCookieValue, encodeCookieValue } from "@/lib/cookie-codec"
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
  type DemoState,
} from "@/lib/store"

const STATE_COOKIE = "tattoo_studio_state"
const MESSAGE_COOKIE = "tattoo_studio_message"
export type FlashMessage = {
  message: string
  variant: "success" | "error"
}
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
}

export async function readDemoState() {
  const cookieStore = await cookies()
  const state = decodeCookieValue<DemoState>(cookieStore.get(STATE_COOKIE)?.value, emptyState)

  return {
    users: state.users ?? [],
    designs: state.designs ?? [],
    slots: state.slots ?? [],
    bookings: state.bookings ?? [],
  }
}

async function writeDemoState(state: DemoState) {
  const cookieStore = await cookies()
  cookieStore.set(STATE_COOKIE, encodeCookieValue(state), COOKIE_OPTIONS)
}

export async function flashMessage(message: string, variant: FlashMessage["variant"] = "success") {
  const cookieStore = await cookies()
  cookieStore.set(MESSAGE_COOKIE, encodeCookieValue({ message, variant }), {
    ...COOKIE_OPTIONS,
    maxAge: 60,
  })
}

export async function consumeFlashMessage() {
  const cookieStore = await cookies()
  const value = decodeCookieValue<FlashMessage | string | null>(cookieStore.get(MESSAGE_COOKIE)?.value, null)

  if (typeof value === "string") {
    return { message: value, variant: "error" as const }
  }

  return value
}

export async function registerUserToCookies(input: { name: string; email: string; password: string; role: string }) {
  const state = await readDemoState()
  const result = await registerUserInState(state, input)

  if (result.ok) {
    await writeDemoState(result.state)
  }

  return result
}

export async function authenticateUserFromCookies(email: string, password: string, role: string) {
  const state = await readDemoState()
  return authenticateUserInState(state, email, password, role)
}

export async function createBookingInCookies(input: { userEmail: string; designId: string; slotId: string }) {
  const state = await readDemoState()
  const result = createBookingInState(state, input)

  if (result.ok) {
    await writeDemoState(result.state)
  }

  return result
}

export async function createDesignInCookies(input: { name: string; style: string; duration: string; price: string; image: string }) {
  const state = await readDemoState()
  const result = createDesignInState(state, input)

  if (result.ok) {
    await writeDemoState(result.state)
  }

  return result
}

export async function createSlotInCookies(input: { date: string; time: string; artist: string; status: string }) {
  const state = await readDemoState()
  const result = createSlotInState(state, input)

  if (result.ok) {
    await writeDemoState(result.state)
  }

  return result
}

export async function updateDesignInCookies(input: { id: string; name: string; style: string; duration: string; price: string; image?: string }) {
  const state = await readDemoState()
  const result = updateDesignInState(state, input)

  if (result.ok) {
    await writeDemoState(result.state)
  }

  return result
}

export async function deleteDesignInCookies(id: string) {
  const state = await readDemoState()
  const result = deleteDesignInState(state, id)

  if (result.ok) {
    await writeDemoState(result.state)
  }

  return result
}

export async function updateSlotInCookies(input: { id: string; date: string; time: string; artist: string; status: string }) {
  const state = await readDemoState()
  const result = updateSlotInState(state, input)

  if (result.ok) {
    await writeDemoState(result.state)
  }

  return result
}

export async function deleteSlotInCookies(id: string) {
  const state = await readDemoState()
  const result = deleteSlotInState(state, id)

  if (result.ok) {
    await writeDemoState(result.state)
  }

  return result
}
