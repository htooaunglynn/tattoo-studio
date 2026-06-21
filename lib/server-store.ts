import { cookies } from "next/headers"

import { decodeCookieValue, encodeCookieValue } from "@/lib/cookie-codec"
import {
  authenticateUserInState,
  createBookingInState,
  emptyState,
  registerUserInState,
  type DemoState,
} from "@/lib/store"

const STATE_COOKIE = "tattoo_studio_state"
const MESSAGE_COOKIE = "tattoo_studio_message"
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
}

export async function readDemoState() {
  const cookieStore = await cookies()
  return decodeCookieValue<DemoState>(cookieStore.get(STATE_COOKIE)?.value, emptyState)
}

async function writeDemoState(state: DemoState) {
  const cookieStore = await cookies()
  cookieStore.set(STATE_COOKIE, encodeCookieValue(state), COOKIE_OPTIONS)
}

export async function flashMessage(message: string) {
  const cookieStore = await cookies()
  cookieStore.set(MESSAGE_COOKIE, encodeCookieValue(message), {
    ...COOKIE_OPTIONS,
    maxAge: 60,
  })
}

export async function consumeFlashMessage() {
  const cookieStore = await cookies()
  return decodeCookieValue<string | null>(cookieStore.get(MESSAGE_COOKIE)?.value, null)
}

export async function registerUserToCookies(input: { name: string; email: string; password: string }) {
  const state = await readDemoState()
  const result = await registerUserInState(state, input)

  if (result.ok) {
    await writeDemoState(result.state)
  }

  return result
}

export async function authenticateUserFromCookies(email: string, password: string) {
  const state = await readDemoState()
  return authenticateUserInState(state, email, password)
}

export async function createBookingInCookies(input: { userEmail: string; designId: string; slotId: string }) {
  const state = await readDemoState()
  const result = createBookingInState(state, input)

  if (result.ok) {
    await writeDemoState(result.state)
  }

  return result
}
