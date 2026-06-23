"use server"

import { AuthError } from "next-auth"
import { redirect } from "next/navigation"

import { auth, signIn, signOut } from "@/auth"
import {
  createBookingInCookies,
  createDesignInCookies,
  createSlotInCookies,
  deleteDesignInCookies,
  deleteSlotInCookies,
  flashMessage,
  registerUserToCookies,
  updateDesignInCookies,
  updateSlotInCookies,
} from "@/lib/server-store"

async function requireAdmin(errorMessage: string) {
  const session = await auth()

  if (!session?.user?.email || session.user.role !== "admin") {
    await flashMessage(errorMessage, "error")
    redirect("/dashboard")
  }
}

export async function registerAction(formData: FormData) {
  const name = String(formData.get("name") ?? "")
  const email = String(formData.get("email") ?? "")
  const password = String(formData.get("password") ?? "")
  const role = String(formData.get("role") ?? "")
  const result = await registerUserToCookies({ name, email, password, role })

  if (!result.ok) {
    await flashMessage(result.error, "error")
    redirect("/register")
  }

  await signIn("credentials", {
    email,
    password,
    role,
    redirectTo: "/dashboard",
  })
}

export async function loginAction(formData: FormData) {
  try {
    await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      role: String(formData.get("role") ?? ""),
      redirectTo: "/dashboard",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      await flashMessage("Invalid email or password.", "error")
      redirect("/login")
    }

    throw error
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" })
}

export async function bookingAction(formData: FormData) {
  const session = await auth()

  if (!session?.user?.email || session.user.role !== "user") {
    await flashMessage("Only users can book designs and slots.", "error")
    redirect("/dashboard")
  }

  const designId = String(formData.get("designId") ?? "")
  const slotId = String(formData.get("slotId") ?? "")
  const result = await createBookingInCookies({ userEmail: session.user.email, designId, slotId })

  await flashMessage(result.ok ? "Booking confirmed." : result.error, result.ok ? "success" : "error")
  redirect("/dashboard")
}

export async function createDesignAction(formData: FormData) {
  await requireAdmin("Only admins can create designs.")

  const result = await createDesignInCookies({
    name: String(formData.get("name") ?? ""),
    style: String(formData.get("style") ?? ""),
    duration: String(formData.get("duration") ?? ""),
    price: String(formData.get("price") ?? ""),
    image: String(formData.get("image") ?? ""),
  })

  await flashMessage(result.ok ? "Design created." : result.error, result.ok ? "success" : "error")
  redirect("/dashboard")
}

export async function createSlotAction(formData: FormData) {
  await requireAdmin("Only admins can create slots.")

  const result = await createSlotInCookies({
    date: String(formData.get("date") ?? ""),
    time: String(formData.get("time") ?? ""),
    artist: String(formData.get("artist") ?? ""),
    status: String(formData.get("status") ?? ""),
  })

  await flashMessage(result.ok ? "Slot created." : result.error, result.ok ? "success" : "error")
  redirect("/dashboard")
}

export async function updateDesignAction(formData: FormData) {
  await requireAdmin("Only admins can update designs.")

  const result = await updateDesignInCookies({
    id: String(formData.get("id") ?? ""),
    name: String(formData.get("name") ?? ""),
    style: String(formData.get("style") ?? ""),
    duration: String(formData.get("duration") ?? ""),
    price: String(formData.get("price") ?? ""),
    image: String(formData.get("image") ?? ""),
  })

  await flashMessage(result.ok ? "Design updated." : result.error, result.ok ? "success" : "error")
  redirect("/dashboard")
}

export async function deleteDesignAction(formData: FormData) {
  await requireAdmin("Only admins can delete designs.")

  const result = await deleteDesignInCookies(String(formData.get("id") ?? ""))

  await flashMessage(result.ok ? "Design deleted." : result.error, result.ok ? "success" : "error")
  redirect("/dashboard")
}

export async function updateSlotAction(formData: FormData) {
  await requireAdmin("Only admins can update slots.")

  const result = await updateSlotInCookies({
    id: String(formData.get("id") ?? ""),
    date: String(formData.get("date") ?? ""),
    time: String(formData.get("time") ?? ""),
    artist: String(formData.get("artist") ?? ""),
    status: String(formData.get("status") ?? ""),
  })

  await flashMessage(result.ok ? "Slot updated." : result.error, result.ok ? "success" : "error")
  redirect("/dashboard")
}

export async function deleteSlotAction(formData: FormData) {
  await requireAdmin("Only admins can delete slots.")

  const result = await deleteSlotInCookies(String(formData.get("id") ?? ""))

  await flashMessage(result.ok ? "Slot deleted." : result.error, result.ok ? "success" : "error")
  redirect("/dashboard")
}
