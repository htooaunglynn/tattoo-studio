import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { AuthForm } from "@/components/auth-form"
import { consumeFlashMessage } from "@/lib/server-store"

export default async function RegisterPage() {
  const session = await auth()

  if (session?.user) {
    redirect("/dashboard")
  }

  const message = await consumeFlashMessage()

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(232,86,56,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(36,184,166,0.18),transparent_32%)] px-4 py-10">
      <AuthForm mode="register" message={message} />
    </main>
  )
}
