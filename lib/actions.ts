"use server"

import { AuthError } from "next-auth"
import { redirect } from "next/navigation"

import { signIn, signOut } from "@/auth"
import { createBookingInCookies, flashMessage, registerUserToCookies } from "@/lib/server-store"

export async function registerAction(formData: FormData) {
  const name = String(formData.get("name") ?? "")
  const email = String(formData.get("email") ?? "")
  const password = String(formData.get("password") ?? "")
  const result = await registerUserToCookies({ name, email, password })

  if (!result.ok) {
    await flashMessage(result.error)
    redirect("/register")
  }

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/dashboard",
  })
}

export async function loginAction(formData: FormData) {
  try {
    await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirectTo: "/dashboard",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      await flashMessage("Invalid email or password.")
      redirect("/login")
    }

    throw error
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" })
}

export async function bookingAction(formData: FormData) {
  const userEmail = String(formData.get("userEmail") ?? "")
  const designId = String(formData.get("designId") ?? "")
  const slotId = String(formData.get("slotId") ?? "")
  const result = await createBookingInCookies({ userEmail, designId, slotId })

  await flashMessage(result.ok ? "Booking confirmed." : result.error)
  redirect("/dashboard")
}
