"use server"

import { randomUUID } from "node:crypto"
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"

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

const MAX_DESIGN_IMAGE_BYTES = 5 * 1024 * 1024
const MAX_COOKIE_IMAGE_BYTES = 128 * 1024
const ALLOWED_DESIGN_IMAGE_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/svg+xml", "svg"],
  ["image/webp", "webp"],
])

async function saveDesignImage(value: FormDataEntryValue | null) {
  if (!(value instanceof File) || value.size === 0) {
    return { ok: false as const, error: "Upload a design image." }
  }

  const extension = ALLOWED_DESIGN_IMAGE_TYPES.get(value.type)

  if (!extension) {
    return { ok: false as const, error: "Design image must be a PNG, JPG, SVG, or WebP file." }
  }

  if (value.size > MAX_DESIGN_IMAGE_BYTES) {
    return { ok: false as const, error: "Design image must be 5 MB or smaller." }
  }

  const bytes = Buffer.from(await value.arrayBuffer())

  if (process.env.VERCEL) {
    if (value.size > MAX_COOKIE_IMAGE_BYTES) {
      return { ok: false as const, error: "On Vercel, demo image uploads must be 128 KB or smaller." }
    }

    return { ok: true as const, image: `data:${value.type};base64,${bytes.toString("base64")}` }
  }

  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads")
    const fileName = `${randomUUID()}.${extension}`

    await mkdir(uploadDir, { recursive: true })
    await writeFile(path.join(uploadDir, fileName), bytes)

    return { ok: true as const, image: `/uploads/${fileName}` }
  } catch {
    return { ok: false as const, error: "Could not save the uploaded image." }
  }
}

async function optionalSaveDesignImage(value: FormDataEntryValue | null) {
  if (!(value instanceof File) || value.size === 0) {
    return { ok: true as const, image: undefined }
  }

  return saveDesignImage(value)
}

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

  const image = await saveDesignImage(formData.get("image"))

  if (!image.ok) {
    await flashMessage(image.error, "error")
    redirect("/dashboard")
  }

  const result = await createDesignInCookies({
    name: String(formData.get("name") ?? ""),
    style: String(formData.get("style") ?? ""),
    duration: String(formData.get("duration") ?? ""),
    price: String(formData.get("price") ?? ""),
    image: image.image,
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

  const image = await optionalSaveDesignImage(formData.get("image"))

  if (!image.ok) {
    await flashMessage(image.error, "error")
    redirect("/dashboard")
  }

  const result = await updateDesignInCookies({
    id: String(formData.get("id") ?? ""),
    name: String(formData.get("name") ?? ""),
    style: String(formData.get("style") ?? ""),
    duration: String(formData.get("duration") ?? ""),
    price: String(formData.get("price") ?? ""),
    image: image.image,
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
